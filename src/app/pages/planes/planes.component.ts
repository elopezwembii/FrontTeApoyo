import { Component, ViewChild } from '@angular/core';
import { ModalPlanesComponent } from '@components/modal-planes/modal-planes.component';
import { CuponesService } from '@services/cupones/cupones.service';
import { PlanesService } from '@services/planes/planes.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-planes',
  templateUrl: './planes.component.html',
  styleUrls: ['./planes.component.scss']
})
export class PlanesComponent {

  dtOptions: DataTables.Settings = {};
  loading: boolean = false;
  usuarios: any = [];
  planes: any = [];

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
  
  @ViewChild('modalPlanes') modalPlanes: ModalPlanesComponent;

  constructor(
    private planesServices: PlanesService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      language: {
        url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-CL.json'
      }
    };
    this.getPlan();
  }

  getPlan() {
    this.loading = true;
    this.planesServices.getAlls().subscribe(resp => {
      this.loading = false;
      this.planes = resp;
    });    
  }

  openModal(plan: any = null) {
    this.modalPlanes.openModal(plan);
  }

  actualizarPlan(planMod: any[]) {
    this.getPlan();
  }

  actualizarCarga(loading: boolean) {
    this.loading = loading;
  }

  vermercadopago(uid:any){
    let url = "https://www.mercadopago.cl/subscriptions/checkout?preapproval_plan_id=";
    let width = 900;
    let height = 600;
    let left = (window.innerWidth - width) / 2;
    let top = (window.innerHeight - height) / 2;
    window.open(url+uid, '_blank', `width=${width},height=${height},left=${left},top=${top}`);
  }

  sincronizar() {
    this.loading = true;
    this.planesServices.sincronizar().subscribe(resp => {
      this.loading = false;
      this.getPlan();
    });      
  }

  borrar(plan:any) {
    this.loading = true;
    this.planesServices.eliminar(plan.id).subscribe(resp => {
      this.loading = false;
      this.getPlan();
    });     
  }

  promo(model: any) {
    this.loading = true;
    if(model.promo == 0){
      this.planesServices.promoFront(model.id, 1).subscribe(resp => {
        console.log('dos', resp)
        if(resp.body.code == 200){
          this.getPlan();
          this.toastr.info('Plan seleccionado para la web');
        }else{
          this.getPlan();
          this.toastr.error(resp.body.message);
        }
        this.loading = false;
      }); 
    }else{
      this.planesServices.promoFront(model.id, 0).subscribe(resp => {
        console.log('dos', resp)
        if(resp.body.code == 200){
          this.getPlan();
          this.toastr.info('Plan suspendido para la web');
        }else{
          this.getPlan();
          this.toastr.error(resp.body.message);
        }
        this.loading = false;
      }); 
    }
  }

}
