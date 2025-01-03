import {AppState} from '@/store/state';
import {UiState} from '@/store/ui/state';
import {Component, HostBinding, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppService} from '@services/app.service';
import {Observable} from 'rxjs';

const BASE_CLASSES = 'main-sidebar elevation-4';
@Component({
    selector: 'app-menu-sidebar',
    templateUrl: './menu-sidebar.component.html',
    styleUrls: ['./menu-sidebar.component.scss']
})
export class MenuSidebarComponent implements OnInit {
    @HostBinding('class') classes: string = BASE_CLASSES;
    public ui: Observable<UiState>;
    public user;
    public menu = MENU;
    public id = 0;
    public size = 140;

    constructor(
        public appService: AppService,
        private store: Store<AppState>,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.ui = this.store.select('ui');
        this.ui.subscribe((state: UiState) => {
            this.classes = `${BASE_CLASSES} ${state.sidebarSkin}`;
            if (state.menuSidebarCollapsed) {
                this.size = 50;
            } else {
                this.size = 140;
            }
        });
        this.user = JSON.parse(this.appService.user);
        this.route.params.subscribe(async (params) => {
            this.id = params['id'];
        });
    }
}

export const MENU = [
    {
        name: 'Inicio',
        iconClasses: 'fas fa-home',
        path: ['/'],
        role: ['Usuario', 'Administrador','Administrativo Empresa']
    },
    {
        name: 'Mis Ingresos',
        iconClasses: 'fas fa-money-bill-wave',
        path: ['/ingresos'],
        role: ['Usuario', 'Administrador','Administrativo Empresa']
        /* children: [
            {
                name: 'Sub Ruta',
                iconClasses: 'fas fa-upload',
                path: ['/']
            }
        ] */
    },
    {
        name: 'Mi Presupuesto',
        iconClasses: 'fas fa-wallet',
        path: ['/presupuesto'],
        role: ['Usuario', 'Administrador','Administrativo Empresa']
        //role: 'Administrativo',
    },
    {
        name: 'Mis Gastos',
        iconClasses: 'fas fa-hand-holding-usd',
        path: ['/gastos'],
        role: ['Usuario', 'Administrador','Administrativo Empresa']
    },

    {
        name: 'Mis Deudas',
        iconClasses: 'fas fa-credit-card',
        path: ['/deudas'],
        role: ['Usuario', 'Administrador','Administrativo Empresa']
        //role: 'Administrativo',
    },
    {
        name: 'Análisis Financiero',
        iconClasses: 'fas fa-chart-line',
        path: ['/analisis'],
        role: ['Usuario', 'Administrador','Administrativo Empresa']
        //role: 'Administrativo',
    },
    {
        name: 'Mis Ahorros',
        iconClasses: 'fas fa-piggy-bank',
        path: ['/ahorros'],
        role: ['Usuario', 'Administrador','Administrativo Empresa']
        //role: 'Administrativo',
    },
    {
        name: 'Mis Bienes',
        iconClasses: 'fas fa-home',
        path: ['/bienes'],
        role: ['Usuario', 'Administrador','Administrativo Empresa']
        //role: 'Administrativo',
    },
    /*
    {
        name: 'Promo cupones',
        iconClasses: 'fa fa-tags',
        path: ['/cupones'],
        role: ['Administrador','Administrativo Empresa']
        //role: 'Administrativo',
    },
    */
    // {
    //     name: 'Simular Crédito',
    //     iconClasses: 'fas fa-money-check',
    //     path: ['/simular'],
    //     role: 'Usuario'
    //     //role: 'Administrativo',
    // },
    {
        name: 'Aprende',
        iconClasses: 'fas fa-graduation-cap',
        path: ['/aprende'],
        role: ['Usuario', 'Administrador','Administrativo Empresa']
        //role: 'Administrativo',
    },
    {
        name: 'Gestión usuarios',
        iconClasses: 'fas fa-user',
        path: ['/usuarios'],
        role: ['Administrador','Administrativo Empresa'],
    },
    {
        name: 'Gestión empresas',
        iconClasses: 'fas fa-building',
        path: ['/empresas'],
        role: ['Administrador'],
    },
    // {
    //     name: 'Gestión colaboradores',
    //     iconClasses: 'fas fa-code-branch',
    //     path: ['/colaboradores'],
    //     role: 'Administrativo Empresa',
    // }
];
