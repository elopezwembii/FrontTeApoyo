import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor(private _http: HttpClient, private toastr: ToastrService) {}

    async getResource(url: string) {
        try {
            const data: any = await new Promise((resolve, reject) => {
                this._http.get(url).subscribe(
                    (response) => {
                        resolve(response);
                    },
                    (error) => {
                        console.error(error);
                        reject(error);
                    }
                );
            });
            return data;
        } catch (error) {
            this.toastr.error(error.message);
        }
    }

    async postResource(url: string, data:Array<object>) {
      try {
          const peticion: any = await new Promise((resolve, reject) => {
              this._http.post(url,data).subscribe(
                  (response) => {
                      resolve(response);
                  },
                  (error) => {
                      console.error(error);
                      reject(error);
                  }
              );
          });
          return peticion;
      } catch (error) {
          this.toastr.error(error.message);
      }
  }
}
