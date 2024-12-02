import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MainComponent} from '@modules/main/main.component';
import {LoginComponent} from '@modules/login/login.component';
import {ProfileComponent} from '@pages/profile/profile.component';
import {RegisterComponent} from '@modules/register/register.component';
import {DashboardComponent} from '@pages/dashboard/dashboard.component';
import {AuthGuard} from '@guards/auth.guard';
import {NonAuthGuard} from '@guards/non-auth.guard';
import {ForgotPasswordComponent} from '@modules/forgot-password/forgot-password.component';
import {RecoverPasswordComponent} from '@modules/recover-password/recover-password.component';
import {MainMenuComponent} from '@pages/main-menu/main-menu.component';
import {SubMenuComponent} from '@pages/main-menu/sub-menu/sub-menu.component';

import {GastosComponent} from '@pages/gastos/gastos.component';
import {IngresosComponent} from '@pages/ingresos/ingresos.component';
import {PresupuestoComponent} from '@pages/presupuesto/presupuesto.component';
import {AhorrosComponent} from '@pages/ahorros/ahorros.component';
import {DeudasComponent} from '@pages/deudas/deudas.component';
import {AnalisisComponent} from '@pages/analisis/analisis.component';
import {GestionUsuariosComponent} from '@pages/gestion-usuarios/gestion-usuarios.component';
import {GestionEmpresaComponent} from '@pages/gestion-empresa/gestion-empresa.component';
import {GestionColaboradorComponent} from '@pages/gestion-colaborador/gestion-colaborador.component';
import {ConfiguracionComponent} from '@pages/configuracion/configuracion.component';
import {AprendeComponent} from '@pages/aprende/aprende.component';
import { AprendeDetalleComponent } from '@pages/aprende-detalle/aprende-detalle.component';
import { PromoCuponesComponent } from '@pages/promo-cupones/promo-cupones.component';
import { PlanesComponent } from '@pages/planes/planes.component';
import { SuscriptoresComponent } from '@pages/suscriptores/suscriptores.component';

import { TestsComponent } from '@modules/tests/tests.component';
import { SubscripcionesComponent } from '@pages/subscripciones/subscripciones.component';
import { BienesComponent } from '@pages/bienes/bienes.component';
import { PaymentSuccessComponent } from '@pages/payment-success/payment-success';

const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'perfil',
                component: ProfileComponent
            },
            {
                path: 'ingresos',
                component: IngresosComponent
            },
            {
                path: 'presupuesto',
                component: PresupuestoComponent
            },
            {
                path: 'gastos',
                component: GastosComponent
            },
            {
                path: 'ahorros',
                component: AhorrosComponent
            },
            {
                path: 'presupuesto',
                component: PresupuestoComponent
            },
            {
                path: 'deudas',
                component: DeudasComponent
            },
            {
                path: 'analisis',
                component: AnalisisComponent
            },
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path: 'usuarios',
                component: GestionUsuariosComponent
            },
            {
                path: 'bienes',
                component: BienesComponent
            },
            {
                path: 'empresas',
                component: GestionEmpresaComponent
            },
            {
                path: 'colaboradores',
                component: GestionColaboradorComponent
            },
            {
                path: 'configuracion',
                component: ConfiguracionComponent
            },
            {
                path: 'aprende',
                component: AprendeComponent
            },
            {
                path: 'blogs/:id',
                component: AprendeDetalleComponent
            },
            {
                path: 'cupones',
                component: PromoCuponesComponent
            },
            {
                path: 'planes',
                component: PlanesComponent
            },
            {
                path: 'subscripciones',
                component: SubscripcionesComponent
            },
            {
                path: 'suscriptores',
                component: SuscriptoresComponent
            },
            {
                path: 'payment-success',
                component: PaymentSuccessComponent
            },
            {
                path: '',
                component: DashboardComponent
            },
        ]
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'recover-password',
        component: RecoverPasswordComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'test',
        component: TestsComponent
    },
    {path: '**', redirectTo: ''}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {})],
    exports: [RouterModule]
})
export class AppRoutingModule {}
