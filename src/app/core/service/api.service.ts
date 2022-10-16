import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor(private http: HttpClient) { }

    get token(): string {
      return localStorage.getItem('x-token') || '';
    }

    get headers() {
      return {
        headers: {
          'x-token': this.token
        }
      }
    }

    get(url: string) {
        return this.http.get(`${environment.apiUrl}/${url}`, this.headers);
    }

    post(url: string, payload?: any) {
        return this.http
            .post(`${environment.apiUrl}/${url}`, payload, this.headers
        );
    }

    put(url: string, payload?: any) {
        return this.http
            .put(`${environment.apiUrl}/${url}`, payload);
    }

    delete(url: string) {
        return this.http
            .delete(`${environment.apiUrl}/${url}`, this.headers);
    }
}
