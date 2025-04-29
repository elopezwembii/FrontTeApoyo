import {
    Component,
    OnInit,
    OnDestroy,
    Renderer2,
    HostBinding
} from '@angular/core';
import {UntypedFormGroup, UntypedFormControl, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {AppService} from '@services/app.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    @HostBinding('style') class = 'width: 90%';
    public loginForm: UntypedFormGroup;
    public registerForm: UntypedFormGroup;
    public isAuthLoading = false;
    public isGoogleLoading = false;
    public isFacebookLoading = false;

    constructor(
        private renderer: Renderer2,
        private toastr: ToastrService,
        private appService: AppService
    ) {}

    ngOnInit() {
        this.renderer.addClass(
            document.querySelector('app-root'),
            'login-page'
        );
        this.loginForm = new UntypedFormGroup({
            email: new UntypedFormControl(null, [
                Validators.required,
                Validators.email
            ]),
            password: new UntypedFormControl(null, Validators.required)
        });

        this.registerForm = new UntypedFormGroup({
            nombres: new UntypedFormControl(null, Validators.required),
            apellidos: new UntypedFormControl(null, Validators.required),
            rut: new UntypedFormControl(null, [Validators.required]),
            email: new UntypedFormControl(null, [
                Validators.required,
                Validators.email
            ]),
            password: new UntypedFormControl(null, Validators.required)
        });
    }

    async loginByAuth() {
        if (this.loginForm.valid) {
            this.isAuthLoading = true;
            await this.appService.loginByAuth(this.loginForm.value);
            this.isAuthLoading = false;
        } else {
            this.toastr.error('Debe ingresar usuario y contraseña');
        }
    }
    async registerNewUser() {
        if (this.registerForm.valid) {
            this.isAuthLoading = true;
            const registerResult = await this.appService.register(
                this.registerForm.value
            );
            if (registerResult?.message === 'Usuario creado') {
                await this.appService.loginByAuth(this.registerForm.value);
            }

            this.isAuthLoading = false;
        } else {
            this.toastr.error('Todos los campos son obligatorios');
        }
    }

    rut: string = '';

    formatRut(e: any): string {
        const value = e.target.value;
        if (!value || value.lenght > 9) return '';

        const cleaned = value.replace(/[^0-9kK]/g, '').toUpperCase();

        if (cleaned.length < 2) return cleaned;

        const body = cleaned.slice(0, -1);
        const dv = cleaned.slice(-1);
        this.registerForm.patchValue({rut: `${body}-${dv}`});
        console.log(this.registerForm);
    }

    ngOnDestroy() {
        this.renderer.removeClass(
            document.querySelector('app-root'),
            'login-page'
        );
    }
}
