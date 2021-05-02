import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  _url = 'https://routexfinal.herokuapp.com/get_route'
  constructor(private _http: HttpClient) { }

  getRoute(){
    return this._http.post<any>(this._url, {place: "bangalore"});
  }

}
