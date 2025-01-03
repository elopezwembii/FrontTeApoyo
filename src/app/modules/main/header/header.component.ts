import {AppState} from '@/store/state';
import {ToggleControlSidebar, ToggleSidebarMenu} from '@/store/ui/actions';
import {UiState} from '@/store/ui/state';
import {Component, HostBinding, OnInit} from '@angular/core';
import {UntypedFormGroup, UntypedFormControl} from '@angular/forms';
import {Store} from '@ngrx/store';
import {AppService} from '@services/app.service';
import { PlanesService } from '@services/planes/planes.service';
import { SuscriptoresService } from '@services/suscriptores/suscriptores.service';
import {Observable} from 'rxjs';

const BASE_CLASSES = 'main-header navbar navbar-expand';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    @HostBinding('class') classes: string = BASE_CLASSES;
    public ui: Observable<UiState>;
    public searchForm: UntypedFormGroup;
    planes: any;
    public meetingUrl: string = '';

    constructor(
        private appService: AppService,
        private store: Store<AppState>,
        private planesService: PlanesService
    ) {}

    ngOnInit() {
        this.getPlan();
        this.ui = this.store.select('ui');
        this.ui.subscribe((state: UiState) => {
            this.classes = `${BASE_CLASSES} ${state.navbarVariant}`;
        });
        this.searchForm = new UntypedFormGroup({
            search: new UntypedFormControl(null)
        });
        if (window.innerWidth <= 768) {         
            this.store.dispatch(new ToggleSidebarMenu());
        }
    }
    
    ngOnDestroy() {
        if (window.innerWidth <= 768) {          
            this.store.dispatch(new ToggleSidebarMenu());
        }
    }

    logout() {
        this.appService.logout();
    }

    getPlan() {
        this.planesService.miPlan().subscribe(resp => {
          this.planes = resp;
          
          if (this.planes.reason === "Premium") {
            this.meetingUrl = 'https://mpago.la/2yXGGwQ';
        } else {
            this.meetingUrl = 'https://mpago.la/2K9ksYT';
        }
        });    
      }

    onToggleMenuSidebar() {
        this.store.dispatch(new ToggleSidebarMenu());
    }

    onToggleControlSidebar() {
        this.store.dispatch(new ToggleControlSidebar());
    }
}
