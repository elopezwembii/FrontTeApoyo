import {AppState} from '@/store/state';
import {ToggleSidebarMenu} from '@/store/ui/actions';
import {UiState} from '@/store/ui/state';
import {Component, HostBinding, OnInit, Renderer2} from '@angular/core';
import {Store} from '@ngrx/store';
import { PlanesService } from '@services/planes/planes.service';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {


    usuario = JSON.parse(sessionStorage.getItem('user'));

    @HostBinding('class') class = 'wrapper navbar-light';
    public ui: Observable<UiState>;

    constructor(private renderer: Renderer2, private store: Store<AppState>, private planService: PlanesService) {}

    ngOnInit() {
        this.obtenerPlan();
        this.ui = this.store.select('ui');
        this.renderer.removeClass(
            document.querySelector('app-root'),
            'login-page'
        );
        this.renderer.removeClass(
            document.querySelector('app-root'),
            'register-page'
        );
        this.renderer.addClass(
            document.querySelector('app-root'),
            'layout-fixed'
        );

        this.ui.subscribe(
            ({menuSidebarCollapsed, controlSidebarCollapsed, darkMode}) => {
                if (menuSidebarCollapsed) {
                    this.renderer.removeClass(
                        document.querySelector('app-root'),
                        'sidebar-open'
                    );
                    this.renderer.addClass(
                        document.querySelector('app-root'),
                        'sidebar-collapse'
                    );
                } else {
                    this.renderer.removeClass(
                        document.querySelector('app-root'),
                        'sidebar-collapse'
                    );
                    this.renderer.addClass(
                        document.querySelector('app-root'),
                        'sidebar-open'
                    );
                }

                if (controlSidebarCollapsed) {
                    this.renderer.removeClass(
                        document.querySelector('app-root'),
                        'control-sidebar-slide-open'
                    );
                } else {
                    this.renderer.addClass(
                        document.querySelector('app-root'),
                        'control-sidebar-slide-open'
                    );
                }

                if (darkMode) {
                    this.renderer.addClass(
                        document.querySelector('app-root'),
                        'dark-mode'
                    );
                } else {
                    this.renderer.removeClass(
                        document.querySelector('app-root'),
                        'dark-mode'
                    );
                }
            }
        );
    }

    obtenerPlan(){
        this.planService.miPlan().subscribe({
            next: (resp: any) => {
                console.log(resp);
            }
        })
    }

    onToggleMenuSidebar() {
        this.store.dispatch(new ToggleSidebarMenu());
    }
}
