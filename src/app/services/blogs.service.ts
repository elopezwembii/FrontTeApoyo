import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';

const url = environment.uri_api;

@Injectable({
    providedIn: 'root'
})
export class BlogsService {
    constructor(private http: HttpClient) {}

    getBlogs(page: number = 1, perPage: number = 10) {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('per_page', perPage.toString());
        return this.http.get(`${url}blogs`, {params});
    }
}
