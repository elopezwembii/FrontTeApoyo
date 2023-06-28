import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';
import {of} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EmpresaService {
    empresas: any = [];
    constructor(private _http: HttpClient) {}

    async getEmpresas() {
        try {
            const data: any = await new Promise((resolve, reject) => {
                this._http
                    .get(environment.uri_api + 'empresa', {
                        headers: {
                            Authorization:
                                'Bearer ' +
                                JSON.parse(sessionStorage.getItem('user'))
                                    .access_token
                        }
                    })
                    .subscribe(
                        (response) => {
                            resolve(response);
                        },
                        (error) => {
                            console.error(error);
                            reject(error);
                        }
                    );
            });
            this.empresas = data;
            return of({empresas: this.empresas});
        } catch (error) {}
    }

    async agregarEmpresa(empresa: any): Promise<boolean> {
      try {
          const res = await new Promise((resolve, reject) => {
              this._http
                  .post(
                      environment.uri_api + 'empresa',
                      {
                          email: empresa.email,
                          password: empresa.password,
                          nombre: empresa.nombre,
                          cantidad_colaboradores: empresa.cantidad_colaboradores
                      },
                      {
                          headers: {
                              Authorization:
                                  'Bearer ' +
                                  JSON.parse(sessionStorage.getItem('user'))
                                      .access_token
                          }
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
          });
          return true;
      } catch (error) {
          return false;
      }
  }
}
