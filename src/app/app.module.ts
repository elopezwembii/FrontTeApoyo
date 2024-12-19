import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from '@/app-routing.module';
import {AppComponent} from './app.component';
import {MainComponent} from '@modules/main/main.component';
import {LoginComponent} from '@modules/login/login.component';
import {HeaderComponent} from '@modules/main/header/header.component';
import {FooterComponent} from '@modules/main/footer/footer.component';
import {MenuSidebarComponent} from '@modules/main/menu-sidebar/menu-sidebar.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ProfileComponent} from '@pages/profile/profile.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RegisterComponent} from '@modules/register/register.component';
import {DashboardComponent} from '@pages/dashboard/dashboard.component';
import {ToastrModule} from 'ngx-toastr';
import {MessagesComponent} from '@modules/main/header/messages/messages.component';
import {NotificationsComponent} from '@modules/main/header/notifications/notifications.component';

import {CurrencyPipe, registerLocaleData} from '@angular/common';
import localeEn from '@angular/common/locales/en';
import {UserComponent} from '@modules/main/header/user/user.component';
import {ForgotPasswordComponent} from '@modules/forgot-password/forgot-password.component';
import {RecoverPasswordComponent} from '@modules/recover-password/recover-password.component';
import {LanguageComponent} from '@modules/main/header/language/language.component';
import {MainMenuComponent} from './pages/main-menu/main-menu.component';
import {SubMenuComponent} from './pages/main-menu/sub-menu/sub-menu.component';
import {MenuItemComponent} from './components/menu-item/menu-item.component';
import {ControlSidebarComponent} from './modules/main/control-sidebar/control-sidebar.component';
import {StoreModule} from '@ngrx/store';
import {uiReducer} from './store/ui/reducer';
import {ProfabricComponentsModule} from '@profabric/angular-components';
import {defineCustomElements} from '@profabric/web-components/loader';
import {SidebarSearchComponent} from './components/sidebar-search/sidebar-search.component';
import {NgxLoadingModule, ngxLoadingAnimationTypes} from 'ngx-loading';

import {GastosComponent} from './pages/gastos/gastos.component';
import {NgxEchartsModule} from 'ngx-echarts';
import {IngresosComponent} from './pages/ingresos/ingresos.component';
import {GraficoComponent} from './components/grafico/grafico.component';
import {GraficoGastoComponent} from './components/grafico-gasto/grafico-gasto.component';
import { AhorrosComponent } from './pages/ahorros/ahorros.component';
import localeEs from '@angular/common/locales/es'; // Importa la configuración regional para español
import { PresupuestoComponent } from '@pages/presupuesto/presupuesto.component';
import { GraficoDonaComponent } from '@components/grafico-dona/grafico-dona.component';
import { GraficoBarraComponent } from '@components/grafico-barra/grafico-barra.component';
import { CorsInterceptor } from './cors.interceptor';
import { DeudasComponent } from './pages/deudas/deudas.component';
import { GraficoLineaComponent } from './components/grafico-linea/grafico-linea.component';
import { ModalAhorroComponent } from './components/modal-ahorro/modal-ahorro.component';
import { GraficoDonaMayoresGastosComponent } from './components/grafico-dona-mayores-gastos/grafico-dona-mayores-gastos.component';
import { AnalisisComponent } from './pages/analisis/analisis.component';
import { CrudBienComponent } from './components/crud-bien/crud-bien.component';
import { ModalAnalisisComponent } from './components/modal-analisis/modal-analisis.component';
import { GestionUsuariosComponent } from './pages/gestion-usuarios/gestion-usuarios.component';
import { GestionEmpresaComponent } from './pages/gestion-empresa/gestion-empresa.component';
import { GestionColaboradorComponent } from './pages/gestion-colaborador/gestion-colaborador.component';
import { DataTablesModule } from "angular-datatables";
import { ModalUsuarioComponent } from './components/modal-usuario/modal-usuario.component';
import { ModalEmpresaComponent } from './components/modal-empresa/modal-empresa.component';
import { GastoHormigaComponent } from './components/gasto-hormiga/gasto-hormiga.component';
import { ChatComponent } from './components/chat/chat.component';
import { ConfiguracionComponent } from './pages/configuracion/configuracion.component';
import { CargaMasivaComponent } from './components/carga-masiva/carga-masiva.component';
import { AprendeComponent } from './pages/aprende/aprende.component';
import { AprendeDetalleComponent } from './pages/aprende-detalle/aprende-detalle.component';
import { NgxEditorModule } from "ngx-editor";
import { PromoCuponesComponent } from './pages/promo-cupones/promo-cupones.component';
import { ModalAddcuponComponent } from './components/modal-addcupon/modal-addcupon.component';
import { PlanesComponent } from './pages/planes/planes.component';
import { ModalPlanesComponent } from './components/modal-planes/modal-planes.component';
import { SuscriptoresComponent } from './pages/suscriptores/suscriptores.component';
import { TestsComponent } from './modules/tests/tests.component';
import { ModalUserTestComponent } from './components/modal-user-test/modal-user-test.component';
import { SubscripcionesComponent } from '@pages/subscripciones/subscripciones.component';
import { ModalPresupuestoComponent } from '@components/modal-presupuesto/modal-presupuesto.component';
import { BienesComponent } from '@pages/bienes/bienes.component';
import { PaymentSuccessComponent } from '@pages/payment-success/payment-success';


defineCustomElements();
registerLocaleData(localeEs);

@NgModule({
    declarations: [
        AppComponent,
        MainComponent,
        LoginComponent,
        HeaderComponent,
        FooterComponent,
        MenuSidebarComponent,
        ProfileComponent,
        RegisterComponent,
        DashboardComponent,
        MessagesComponent,
        NotificationsComponent,
        UserComponent,
        ForgotPasswordComponent,
        RecoverPasswordComponent,
        LanguageComponent,
        MainMenuComponent,
        SubMenuComponent,
        MenuItemComponent,
        ControlSidebarComponent,
        SidebarSearchComponent,
        GastosComponent,
        IngresosComponent,
        GraficoComponent,
        PresupuestoComponent,
        GraficoDonaComponent,
        GraficoBarraComponent,
        GraficoGastoComponent,
        PresupuestoComponent,
        BienesComponent,
        GraficoDonaComponent,
        GraficoBarraComponent,
        AhorrosComponent,
        DeudasComponent,
        GraficoLineaComponent,
        ModalAhorroComponent,
        GraficoDonaMayoresGastosComponent,
        AnalisisComponent,
        CrudBienComponent,
        ModalAnalisisComponent,
        GestionUsuariosComponent,
        GestionEmpresaComponent,
        GestionColaboradorComponent,
        ModalUsuarioComponent,
        ModalPresupuestoComponent,
        ModalEmpresaComponent,
        GastoHormigaComponent,
        ChatComponent,
        ConfiguracionComponent,
        CargaMasivaComponent,
        AprendeComponent,
        AprendeDetalleComponent,
        PromoCuponesComponent,
        ModalAddcuponComponent,
        PlanesComponent,
        PaymentSuccessComponent,
        ModalPlanesComponent,
        SubscripcionesComponent,
        SuscriptoresComponent,
        TestsComponent,
        ModalUserTestComponent

    ],
    imports: [
        NgxEditorModule,
        NgxLoadingModule.forRoot({
            animationType: ngxLoadingAnimationTypes.threeBounce,
            backdropBackgroundColour: 'rgba(255, 255, 255, 0.5)',
            primaryColour: '#93278F',
            secondaryColour: '#93278F',
            tertiaryColour: '#93278F'
        }),
        BrowserModule,
        DataTablesModule,
        StoreModule.forRoot({ui: uiReducer}),
        HttpClientModule,
        AppRoutingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot({
            timeOut: 3000,
            positionClass: 'toast-top-right',
            preventDuplicates: true,

        }),
        ProfabricComponentsModule,
        NgxEchartsModule.forRoot({
            echarts: () => import('echarts')
        })
    ],
    providers: [{provide: LOCALE_ID, useValue: 'ES_cl'},{ provide: HTTP_INTERCEPTORS, useClass: CorsInterceptor, multi: true },CurrencyPipe],

    bootstrap: [AppComponent]
})
export class AppModule {}
