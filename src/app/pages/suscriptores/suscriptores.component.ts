import { Component, ViewChild } from '@angular/core';
import { SuscriptoresService } from '@services/suscriptores/suscriptores.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-suscriptores',
  templateUrl: './suscriptores.component.html',
  styleUrls: ['./suscriptores.component.scss']
})
export class SuscriptoresComponent {

  dtOptions: DataTables.Settings = {};
  loading: boolean = false;
  usuarios: any = [];
  suscriptores: any = [];

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

  constructor(
    private suscriptoresService: SuscriptoresService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      language: {
        url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-CL.json'
      }
    };
    this.getSuscriptores();
  }

  getSuscriptores() {
    this.loading = true;
    this.suscriptoresService.getAlls().subscribe(resp => {
      this.loading = false;
      this.suscriptores = resp;
    });    
  }

  actualizarSuscriptores(sucriptorMod: any[]) {
    this.getSuscriptores();
  }

  actualizarCarga(loading: boolean) {
    this.loading = loading;
  }

}
