import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    public user: any = null;

    constructor(
        private router: Router,
        private toastr: ToastrService,
        private _http: HttpClient
    ) {}

    async loginByAuth({email, password}) {
        try {
            /* const data: any = await new Promise((resolve, reject) => {
                this._http
                    .post(
                        'url login',
                        {
                            email,
                            password
                        }
                    )
                    .subscribe(
                        (response) => {
                            resolve(response);
                        },
                        (error) => {
                            console.error(error);
                            reject(error);
                        }
                    );
            }); */
            const data = {access_token: "prueba", token_type: "Bearer",expires_at:"14-05-2023", role:"Administrador", name:"test", email:"test"}
            sessionStorage.setItem('user', JSON.stringify(data));
            this.router.navigate(['/']);
            this.toastr.success('Ingreso correcto');
        } catch (error) {
            this.toastr.error("Usuario o contraseña no válida");
        }
    }

    async checkToken(jwt: string) {
        /* try {
            const token: any = await new Promise((resolve, reject) => {
                this._http
                    .post(
                        'url check jwt',
                        {
                            jwt
                        }
                    )
                    .subscribe(
                        (response) => {
                            resolve(response);
                        },
                        (error) => {
                            console.error('Error al verificar el token', error);
                            reject(error);
                        }
                    );
            });
            if (token) {
                return true;
            }else{
              this.toastr.error('Token no válido');
              this.logout();
              return false;
            }
        } catch (error) {
            this.toastr.error(error.message);
            this.logout();
        } */
        return true;
    }

    async getProfile() {

        this.user = sessionStorage.getItem('user');
        if (!this.user) {
            //this.toastr.error('No autorizado');
            this.logout();
        }
    }

    logout() {
        sessionStorage.removeItem('user');
        this.user = null;
        this.router.navigate(['/login']);
    }
}
