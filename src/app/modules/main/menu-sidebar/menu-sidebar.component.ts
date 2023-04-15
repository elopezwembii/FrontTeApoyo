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
            }else{
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
        path: ['/']
        //role: 'Administrativo'
    },
    {
        name: 'Mis Ingresos',
        iconClasses: 'fas fa-money-bill-wave',
        path: ['/ingresos']
        /* children: [
            {
                name: 'Sub Ruta',
                iconClasses: 'fas fa-upload',
                path: ['/']
            }
        ] */
    },
    {
        name: 'Mis Gastos',
        iconClasses: 'fas fa-hand-holding-usd',
        path: ['/gastos']
    },
    {
        name: 'Presupuesto',
        iconClasses: 'fas fa-wallet',
        path: ['/presupuesto']
        //role: 'Administrativo',
    },
    {
        name: 'Mis Deudas',
        iconClasses: 'fas fa-credit-card',
        path: ['/deudas']
        //role: 'Administrativo',
    },
    {
        name: 'Mis Ahorros',
        iconClasses: 'fas fa-piggy-bank',
        path: ['/ahorros']
        //role: 'Administrativo',
    },
    {
        name: 'Análisis Financiero',
        iconClasses: 'fas fa-chart-line',
        path: ['/analisis']
        //role: 'Administrativo',
    },
    {
        name: 'Simular Crédito',
        iconClasses: 'fas fa-money-check',
        path: ['/simular']
        //role: 'Administrativo',
    },
    {
        name: 'Aprende',
        iconClasses: 'fas fa-graduation-cap',
        path: ['/aprende']
        //role: 'Administrativo',
    },
];
