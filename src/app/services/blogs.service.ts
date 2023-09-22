import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';

const url = environment.uri_api;

@Injectable({
    providedIn: 'root'
})
export class BlogsService {
    constructor(private http: HttpClient) {}

    getBlogs(
        page: number = 1,
        perPage: number = 10,
        id: number,
        searchTerm: string | null = null
    ) {
        let urlParams = new HttpParams();

        // Si hay un término de búsqueda, agrega el parámetro 'q' a los parámetros de la URL.
        if (searchTerm) {
            urlParams = urlParams.set('q', searchTerm);
        } else {
            // Si no hay término de búsqueda, agrega los parámetros de paginación.
            urlParams = urlParams
                .set('page', page.toString())
                .set('per_page', perPage.toString());
        }

        return this.http.get(`${url}blogs/${id}`, {params: urlParams});
    }

    getFirstSixBlogs(id: number) {
        return this.http.get(`${url}getFirstSixBlogs/${id}`);
    }

    getCategorias() {
        return this.http.get(`${url}categorias`);
    }
    addCategoria(body: any) {
        return this.http.post(`${url}addBlogs`, body);
    }

    getBlogsId(id: number) {
        return this.http.get(`${url}detalleBlogs/${id}`);
    }
}
