import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UploaderService {
    constructor(
        protected http: Http,
    ) { }

    upload(fd: FormData): Observable<any> {
        let headers = new Headers();
        return this.http.post('http://192.168.3.249:4200', fd, {
            headers: headers
        });
    }
}