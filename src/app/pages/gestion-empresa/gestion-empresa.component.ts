import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalEmpresaComponent} from '@components/modal-empresa/modal-empresa.component';
import {EmpresaService} from '@services/empresa.service';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-gestion-empresa',
    templateUrl: './gestion-empresa.component.html',
    styleUrls: ['./gestion-empresa.component.scss']
})
export class GestionEmpresaComponent implements OnInit {
    dtOptions: DataTables.Settings = {};
    loading: boolean = false;
    empresas: any = [];
    @ViewChild('modalEmpresa') modalEmpresa: ModalEmpresaComponent;

    ngOnInit(): void {
        this.dtOptions = {
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-CL.json'
            }
        };
        this.obtenerEmpresas();
    }

    openModal(empresa: any = null) {
        this.modalEmpresa.openModal(empresa);
    }

    constructor(
        private empresaService: EmpresaService,
        private toastr: ToastrService
    ) {}

    async obtenerEmpresas() {
        this.loading = true;
        (await this.empresaService.getEmpresas()).subscribe({
            next: ({empresas}: {empresas: any}) => {
                this.empresas = empresas;
                console.log(empresas);
                this.loading = false;
            },
            error: (error: any) => {}
        });
    }
}
