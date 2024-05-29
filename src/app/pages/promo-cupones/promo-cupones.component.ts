import { Component, ViewChild } from '@angular/core';
import { ModalAddcuponComponent } from '@components/modal-addcupon/modal-addcupon.component';
import { CuponesService } from '@services/cupones/cupones.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-promo-cupones',
  templateUrl: './promo-cupones.component.html',
  styleUrls: ['./promo-cupones.component.scss']
})

export class PromoCuponesComponent {

  dtOptions: DataTables.Settings = {};
  loading: boolean = false;
  usuarios: any = [];
  cupones: any = [];

  empresa = JSON.parse(sessionStorage.getItem('user')).user.id_empresa;
  rol = JSON.parse(sessionStorage.getItem('user')).rol.nombre;
  userSession = JSON.parse(sessionStorage.getItem('user'));

  empresa_desc =
    this.userSession &&
    this.userSession.user &&
    this.userSession.user.empresa &&
    this.userSession.user.empresa.nombre
      ? this.userSession.user.empresa.nombre
      : 'sin empresa';

  limiteColaboracion = 0;
  cantidadColaboradores = 0;
  cupoDisponible = false;
  
  @ViewChild('modalAddcupon') modalAddcupon: ModalAddcuponComponent;

  constructor(
    private cuponesServices: CuponesService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      language: {
        url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-CL.json'
      }
    };
    this.getCupon();
  }

  getCupon() {
    this.loading = true;
    this.cuponesServices.getAlls().subscribe(resp => {
      this.loading = false;
      //this.cupones = resp;
      this.cupones = resp.map(cupon => {
        let fechaVencimiento = new Date(cupon.fecha_fin);
        let fechaActual = new Date();
        // Si la fecha de vencimiento es anterior a la fecha actual, establecer el estado como inactivo
        if (fechaVencimiento < fechaActual) {
          cupon.estado = 0;
        }
        return cupon;
      });

    });    
  }

  openModal(cupon: any = null) {
    this.modalAddcupon.openModal(cupon);
  }

  actualizarCupon(cuponMod: any[]) {
    this.getCupon();
  }

  actualizarCarga(loading: boolean) {
    this.loading = loading;
  }

}
