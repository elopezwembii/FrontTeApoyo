import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '@services/usuario.service';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';
import { CuponesService } from '@services/cupones/cupones.service';
import { PlanesService } from '@services/planes/planes.service';
import { EmpresaService } from '@services/empresa.service';

@Component({
  selector: 'app-modal-planes',
  templateUrl: './modal-planes.component.html',
  styleUrls: ['./modal-planes.component.scss']
})
export class ModalPlanesComponent {

    @Input() usuario: any[];
    @Output() loading: EventEmitter<boolean> = new EventEmitter();
    @Output() planMod: EventEmitter<any[]> = new EventEmitter();
    titulo = 'Agregar plan';
    myModal: any;
    rol = JSON.parse(sessionStorage.getItem('user')).rol.nombre;
    listaEmpresa: any[] = [];
    user: any;
    promo: any = {};
    uid: any = {};
    private fieldMappings = {
      'auto_recurring.repetitions': 'Cantidad de cobros',
      'auto_recurring.frequency': 'Frecuencia',
      'auto_recurring.billing_day': 'Día de facturación',
      'auto_recurring.free_trial.frequency': 'Dias de prueba',
      'auto_recurring.transaction_amount': 'Monto de la transacción',
      'reason': 'Nombre del plan',
      'type': 'Tipo de plan',
      'enterpriseId': 'Empresa asociada',
    };
    
    frequencyAll:any = [
      {id:1, type:"months", proportional:true, name:"Mensual"},
    ];
    frequencyFree:any = [
      {id:7, type:"days", proportional:true, name:"Diaria"},
      {id:1, type:"months", proportional:true, name:"Mensual"},
    ];
    currencyId:any = "CLP";
  
    constructor(
      private fb: FormBuilder,
      private toastr: ToastrService,
      private usuarioService: UsuarioService,
      private planesServices: PlanesService,
      private empresaService: EmpresaService
  ) {}

  ngOnInit(): void {
    this.obtenerEmpresas();
    const modalElement = document.getElementById('modalPlanes');
    if (modalElement) {
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.form.reset();
        this.promo = {};
        this.titulo = 'Agregar plan';
      });
    }
  
    this.myModal = new bootstrap.Modal(modalElement, {});
  }
  

  async obtenerEmpresas() {
    const {
        user: {id_empresa: empresa, id: id_user},
        rol: {nombre: rol, id: id_rol}
    } = JSON.parse(sessionStorage.getItem('user'));

    (await this.empresaService.getEmpresas()).subscribe({
        next: ({empresas}: {empresas: any}) => {
            if (rol === 'Administrador') {
                this.listaEmpresa = empresas;
            } else {
                this.listaEmpresa = empresas.filter(
                    (empresaItem: any) => empresaItem.id === empresa
                );
            }
        },
        error: (error: any) => {
            this.loading.emit(false);
        }
    });
}

form: FormGroup = this.fb.group({
  reason: [, [Validators.required]],
  auto_recurring: this.fb.group({
    frequency: [{ value: 1, disabled: true }, [Validators.required]],
    frequency_type: ['', [Validators.required]],
    repetitions: ['', [Validators.required]],
    billing_day: ['', [Validators.required]],
    free_trial: this.fb.group({
      frequency: ['', [Validators.required]],
      frequency_type: ['', [Validators.required]],
    }),
    transaction_amount: ['', [Validators.required, Validators.minLength(950)]],
  }),
  coupon: '',
  type: ['', []],
  promo: '',
  state_cupon: ['', [Validators.required]],
  percentage:'',
  status: ['active'],
  enterpriseId: [, [Validators.required]]
});


openModal(data: any = null) {
  // Limpia la variable promo
  this.promo = {};
  
  if (data === null) {
    // Reinicia el formulario para crear un nuevo plan
    this.form.reset({
      reason: '',
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months',
        repetitions: '',
        billing_day: '',
        free_trial: {
          frequency: '',
          frequency_type: 'days'
        },
        transaction_amount: ''
      },
      coupon: '',
      promo: 0,
      state_cupon: 0,
      percentage: 1,
      status: 'active',
      enterpriseId: 0
    });
    this.titulo = 'Agregar plan';
  } else {
    // Rellena el formulario con los datos del plan para editar
    this.promo = data;
    this.setFormValues(data);
    this.titulo = 'Editar plan';
  }

  // Muestra el modal
  if (this.myModal) {
    this.myModal.show();
  } else {
    console.error('Modal not initialized');
  }
}


  setFormValues(data: any) {
    this.titulo = 'Agregar plan';
    if (!data) {
        this.form.reset();
        
    } else {
        this.titulo = 'Editar plan';
        this.form.patchValue(data);
        
    }
  }

  submit() {
    const formValue = this.form.value;
    formValue.auto_recurring.frequency = this.form.get('auto_recurring.frequency').value || 1; // Incluir manualmente el valor
    formValue.enterpriseId = Number(formValue.enterpriseId);
    let valor = { ...formValue };
    
    if (this.promo.id) {
      // Pasar el ID como argumento separado y quitarlo del cuerpo del objeto
      this.actualizarPlan(valor, this.promo.id);
    } else {
      this.agregarPlan(valor);
    }
  }

  async agregarPlan(modelo: any) {
    this.loading.emit(true);
    try {
      (await this.planesServices.agregarPlan(modelo)).subscribe(resp => {
        this.myModal.hide();
        this.loading.emit(false);
        if(resp.status == 200){
          if(resp.body.original && resp.body.original.status === 400){
            this.toastr.error(resp.body.original.message);
          } else if (resp.body.status === 'active') {
            this.getPlan();
            this.toastr.success(`Plan agregado correctamente`);
          }else{
            this.getPlan();
            this.toastr.error("Error desconocido");
          }
        }else{
          this.getPlan();
          this.toastr.error(resp.body.original.message);
        }
      })
    } catch (error) {
       this.loading.emit(false);
    }
    this.myModal.hide();
this.form.reset(); // Limpia el formulario después de cerrar
this.promo = {};   // Limpia cualquier referencia previa
  }

  async actualizarPlan(modelo:any, id: number){
    this.loading.emit(true);
    try {
      (await this.planesServices.actualizarPlan(modelo, id)).subscribe(resp => {
        this.myModal.hide();
        this.loading.emit(false);
        if(resp.status == 200){
          if(resp.body.original && resp.body.original.status === 400){
            this.toastr.error(resp.body.original.message);
          } else if (resp.body.status === 'active') {
            this.getPlan();
            this.toastr.success(`Plan agregado correctamente`);
          }else{
            this.getPlan();
            this.toastr.error("Error desconocido");
          }
        }else{
          this.toastr.error(`Error al actualizar el Plan`);
        }
      })
    } catch (error) {
      this.loading.emit(false);
    }
    this.myModal.hide();
this.form.reset(); // Limpia el formulario después de cerrar
this.promo = {};   // Limpia cualquier referencia previa
  }

  async getPlan() {
    (await this.planesServices.getAlls()).subscribe({
      next: ({cup}: {cup: any}) => {
        this.planMod.emit(cup);
        this.loading.emit(false);
      },
      error: (error: any) => {
        this.loading.emit(false);
      }
    });
  }

  getFormErrors(): string[] {
    const errors: string[] = [];
    const recursiveCheck = (form: FormGroup, path: string = '') => {
      Object.keys(form.controls).forEach(key => {
        const control = form.get(key);
        const fullPath = path ? `${path}.${key}` : key;
        if (control instanceof FormGroup) {
          recursiveCheck(control, fullPath);
        } else if (control.errors) {
          const readableField = this.fieldMappings[fullPath] || fullPath; // Traduce el nombre del campo
          Object.keys(control.errors).forEach(errorKey => {
            errors.push(`${readableField}: ${this.getErrorMessage(errorKey, control.errors[errorKey])}`);
          });
        }
      });
    };
    recursiveCheck(this.form);
    return errors;
  }
  

private getErrorMessage(errorKey: string, errorValue: any): string {
    const errorMessages = {
        required: 'Este campo es obligatorio',
        min: `Debe ser al menos ${errorValue.min}`,
        max: `No puede exceder ${errorValue.max}`,
    };
    return errorMessages[errorKey] || 'Error desconocido';
}

  

  onInputChange() {
    const radioValue = this.form.controls.radio.value;
    const repetitions = this.form.controls.repetitions.value;

    if (radioValue === 'enable') {
      this.form.controls.repetitions.enable();
    } else {
      this.form.controls.repetitions.disable();
    }
  }

  onDescuento() {
    const radioValue = this.form.get('checkradio').value;
    if (radioValue === 'enable') {
      this.form.get('coupon').enable();
      this.form.get('percentage').enable();
      this.form.get('state_cupon').setValue(1);
      
      // Agregar validadores cuando se habiliten
      this.form.get('coupon').setValidators([Validators.required]);
      this.form.get('percentage').setValidators([Validators.required, Validators.min(1), Validators.max(100)]);
    } else {
      this.form.get('coupon').disable();
      this.form.get('percentage').disable();
      this.form.get('state_cupon').setValue(0);
      
      // Remover validadores cuando se deshabiliten
      this.form.get('coupon').clearValidators();
      this.form.get('percentage').clearValidators();
    }
  
    // Actualizar validaciones
    this.form.get('coupon').updateValueAndValidity();
    this.form.get('percentage').updateValueAndValidity();
  }
  

}
