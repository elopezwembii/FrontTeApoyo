import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {openCloseAnimation, rotateAnimation} from './menu-item.animations';
import {AppService} from '@services/app.service';

@Component({
    selector: 'app-menu-item',
    templateUrl: './menu-item.component.html',
    styleUrls: ['./menu-item.component.scss'],
    animations: [openCloseAnimation, rotateAnimation]
})
export class MenuItemComponent implements OnInit {
    @Input() menuItem: any = null;
    public isExpandable: boolean = false;
    @HostBinding('class.nav-item') isNavItem: boolean = true;
    @HostBinding('class.menu-open') isMenuExtended: boolean = false;
    public isMainActive: boolean = false;
    public isOneOfChildrenActive: boolean = false;
    public user;

    constructor(private router: Router, public appService: AppService) {}

    ngOnInit(): void {
        this.user = JSON.parse(sessionStorage.getItem('user'));


        console.log('usuario',this.user);
        

        if (
            this.menuItem &&
            this.menuItem.children &&
            this.menuItem.children.length > 0
        ) {
            this.isExpandable = true;
        }
        this.calculateIsActive(this.router.url);
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                this.calculateIsActive(event.url);
            });
    }

    public handleMainMenuAction() {
        if (this.isExpandable) {
            this.toggleMenu();
            return;
        }
        //'/finanzasPersonales' +
        window.location.href =  this.menuItem.path;
        //this.router.navigate(this.menuItem.path);
    }

    public toggleMenu() {
        this.isMenuExtended = !this.isMenuExtended;
    }

    public calculateIsActive(url: string) {
        this.isMainActive = false;
        this.isOneOfChildrenActive = false;
        if (this.isExpandable) {
            this.menuItem.children.forEach((item) => {
                if (item.path[0] === url) {
                    this.isOneOfChildrenActive = true;
                    this.isMenuExtended = true;
                }
            });
        } else if (this.menuItem.path[0] === url) {
            this.isMainActive = true;
        }
        if (!this.isMainActive && !this.isOneOfChildrenActive) {
            this.isMenuExtended = false;
        }
    }

    canShowContent(userRole: string, moduleRoles: string[]): boolean {
        const result = moduleRoles.includes(userRole);
        return result;
      }
      
      
      
}
