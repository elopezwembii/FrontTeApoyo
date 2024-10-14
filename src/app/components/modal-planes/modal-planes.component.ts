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

    this.myModal = new bootstrap.Modal(
      document.getElementById('modalPlanes'),
      {}
    );
  }
  

  async obtenerEmpresas() {
    const {
        user: {id_empresa: empresa, id: id_user},
        rol: {nombre: rol, id: id_rol}
    } = JSON.parse(sessionStorage.getItem('user'));

    (await this.empresaService.getEmpresas()).subscribe({
        next: ({empresas}: {empresas: any}) => {
          console.log(empresas)
            // Si el rol es administrador (rol 3), mostrar todas las empresas
            if (rol === 'Administrador') {
                this.listaEmpresa = empresas;
            } else {
                // Filtrar la lista de empresas por su ID
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
    frequency: ['', [Validators.required]],
    frequency_type: ['', [Validators.required]],
    repetitions: ['', [Validators.required]],
    billing_day: ['', [Validators.required]],
    free_trial: this.fb.group({
      frequency: ['', [Validators.required]],
      frequency_type: ['', [Validators.required]],
    }),
    transaction_amount: ['', [Validators.required]],
  }),
  coupon: '',
  type: ['', [Validators.required]],
  promo: '',
  state_cupon: ['', [Validators.required]],
  percentage:'',
  status: ['active'],
  enterpriseId: [, [Validators.required]]
});


openModal(data: any = null) {
  if (data === null) {
    this.form.reset({
      reason: '',
      auto_recurring: {
        frequency: '',
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
  } else {
    this.promo = data;
    this.setFormValues(data);  // Asumo que setFormValues es un método que asigna los valores de data al formulario
  }

  if (this.myModal) {
    this.myModal.show(); // Mostrar el modal si está inicializado
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

  getFormErrors(){
    let errors: string[] = [];
    if (this.form.get('frequency_type').errors?.required)
        errors.push('Tipo de frecuencia es requerida.');
    if (this.form.get('frequency_free').errors?.required)
        errors.push('Dias gratis es requerido.');
    if (this.form.get('repetitions').errors?.required)
        errors.push('Repeticion de factura es requerida.');
    if (this.form.get('billing_day').errors?.required)
        errors.push('Día de facturacion es requerido.');
    if (this.form.get('transaction_amount').errors?.required)
        errors.push('El precio es requerido.');
    if (this.form.get('reason').errors?.required)
        errors.push('El nombre del plan es requerido.');
    if (this.form.get('radio').errors?.required)
        errors.push('Seleccione duracion de la suscripcion.');
    return errors;    
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
    const radioValue = this.form.controls.checkradio.value;
    const state_cupon = this.form.controls.state_cupon.value;
    if (radioValue === 'enable') {
      this.form.controls.cupon.enable();
      this.form.controls.percentage.enable();
      this.form.get('state_cupon').setValue(1);
    } else {
      this.form.controls.cupon.disable();
      this.form.controls.percentage.disable();
      this.form.get('state_cupon').setValue(0);
    }
  }

}
