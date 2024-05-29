import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '@services/usuario.service';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';
import { CuponesService } from '@services/cupones/cupones.service';

@Component({
  selector: 'app-modal-addcupon',
  templateUrl: './modal-addcupon.component.html',
  styleUrls: ['./modal-addcupon.component.scss']
})
export class ModalAddcuponComponent {
    @Input() usuario: any[];
    @Output() loading: EventEmitter<boolean> = new EventEmitter();
    @Output() cuponMod: EventEmitter<any[]> = new EventEmitter();
    titulo = 'Agregar cupon';
    myModal: any;
    rol = JSON.parse(sessionStorage.getItem('user')).rol.nombre;
    listaEmpresa: any[] = [];
    user: any;
    tiposCupon:any[] = [{name:'individual'}, {name:'colectivo'}];
    promo: any = {};
    
    fecha_inicio: string = new Date((new Date()).setDate(new Date().getDate())).toISOString().split('T')[0];
    fecha_fin: string = new Date((new Date()).setDate(new Date().getDate() + 7)).toISOString().split('T')[0];

    constructor(
      private fb: FormBuilder,
      private toastr: ToastrService,
      private usuarioService: UsuarioService,
      private cuponesServices: CuponesService
  ) {}

  ngOnInit(): void {

    this.myModal = new bootstrap.Modal(
      document.getElementById('modalAddcupon'),
      {}
    );
  }

  form: FormGroup = this.fb.group(
    {
      codigo: [],
      descripcion: [, [Validators.required]],
      descuento: [, [Validators.required]],
      tipo: ['individual', [Validators.required]],
      fecha_inicio: [this.fecha_inicio, [Validators.required]],
      fecha_fin: [this.fecha_fin, [Validators.required]]
    }
  );

  openModal(data: any = null) {
    if (data === null) {
      this.form.reset({
        codigo: '',
        descripcion: '',
        descuento: '',
        tipo: 'individual',
      });
    } else {
      data.fecha_fin = data.fecha_fin.split(' ')[0];
      this.promo = data;
      this.setFormValues(data);
    }
    this.myModal.show();
  }

  setFormValues(data: any) {
    this.titulo = 'Agregar cupón';
    if (!data) {
        this.form.reset();
    } else {
        this.titulo = 'Editar cupón';
        this.form.patchValue(data);
    }
  }

  submit() {
    if (!this.form.valid) return;

    let valor = { ...this.form.value };
    if (this.promo.id) {
      valor.id = this.promo.id;
    }

    if (this.promo.id) {
      this.actualizarCupon(valor);
    } else {
      this.agregarCupon(valor);
    }
  }

  async agregarCupon(modelo: any) {
    this.loading.emit(true);
    try {
      (await this.cuponesServices.agregarPromoCupon(modelo)).subscribe(resp => {
        this.myModal.hide();
        this.loading.emit(false);
        this.getCupon();
        this.toastr.success(`Promo cupón agregado correctamente`);
      })
    } catch (error) {
        this.loading.emit(false);
    }
  }

  async actualizarCupon(modelo:any){
    this.loading.emit(true);
    try {
      (await this.cuponesServices.actualizarPromoCupon(modelo)).subscribe(resp => {
        this.myModal.hide();
        this.loading.emit(false);
        this.getCupon();
        this.toastr.success(`Promo cupón actualizado correctamente`);
      })
    } catch (error) {
        this.loading.emit(false);
    }
  }

  async getCupon() {
    (await this.cuponesServices.getAlls()).subscribe({
      next: ({cup}: {cup: any}) => {
        this.cuponMod.emit(cup);
        this.loading.emit(false);
      },
      error: (error: any) => {
        this.loading.emit(false);
      }
    });
  }

  getFormErrors(){
    let errors: string[] = [];
    if (this.form.get('descripcion').errors?.required)
        errors.push('Descripcion es requerida.');
    if (this.form.get('descuento').errors?.required)
        errors.push('Descuento es requerido.');
    if (this.form.get('tipo').errors?.required)
        errors.push('Tipo es requerido.');
    if (this.form.get('fecha_inicio').errors?.required)
        errors.push('Inicio es requerido.');
    if (this.form.get('fecha_fin').errors?.required)
        errors.push('Vencimiento es requerido.');
    return errors;    
  }

}
