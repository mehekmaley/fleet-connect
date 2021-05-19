import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  _url = 'https://routexfinal.herokuapp.com/get_route'
  data = new Observable<any>()
  place = ""
  constructor(private _http: HttpClient,public firestore: AngularFirestore) {}

  getRoute(param:object){
    // try {
      
    // }
    // catch(err) {
    //   console.log("local data: " + err)
    // }
    
    return this._http.post<any>(this._url, param);
  }

}
