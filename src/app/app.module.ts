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
        GraficoDonaComponent,
        GraficoBarraComponent,
        AhorrosComponent,
        DeudasComponent,
        GraficoLineaComponent,
        ModalAhorroComponent,
        GraficoDonaMayoresGastosComponent,
        AnalisisComponent,
        CrudBienComponent

    ],
    imports: [
        NgxLoadingModule.forRoot({
            animationType: ngxLoadingAnimationTypes.threeBounce,
            backdropBackgroundColour: 'rgba(255, 255, 255, 0.5)',
            primaryColour: '#2c939e',
            secondaryColour: '#2c939e',
            tertiaryColour: '#2c939e'
        }),
        BrowserModule,
        StoreModule.forRoot({ui: uiReducer}),
        HttpClientModule,
        AppRoutingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot({
            timeOut: 3000,
            positionClass: 'toast-top-right',
            preventDuplicates: true
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
