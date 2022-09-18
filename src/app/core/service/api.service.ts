import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor(private http: HttpClient) { }

    get(url: string) {
        return this.http.get(`${environment.apiUrl}/${url}`);
    }

    post(url: string, payload?: any) {
        return this.http
            .post(`${environment.apiUrl}/${url}`, payload
        );
    }

    put(url: string, payload?: any) {
        return this.http
            .put(`${environment.apiUrl}/${url}`, payload);
    }

    delete(url: string, payload?: any) {
        return this.http
            .delete(`${environment.apiUrl}/${url}`, payload);
    }
}
