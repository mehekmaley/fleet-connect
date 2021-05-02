import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject, Subscriber } from 'rxjs';
import { AppService } from '../app.service';

declare var H: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  private platform: any;
  items = new Observable<any>()
  data = <any>[]
  route: any
  map: any
  @ViewChild("map")
  public mapElement!: ElementRef;

  constructor(public firestore: AngularFirestore, public _appService: AppService) {
    this.platform = new H.service.Platform({
      "apikey": "d5hfkR1b0FzgRzxBIbvXY8KyDmqJpM7Uw-ykICXBIYA"
    });

  }

  ngOnInit(): void {
    this.loadData(); 
  }

  async loadData() {
    try{
      this.route = await this._appService.getRoute().toPromise()
    }catch(err){
      console.log("local data: " + err)
    }
    console.log(this.route);
    this.dataProcess()
  }
  dataProcess() {
    console.log(this.route.value[0])
    
    var objs = this.route.value[0].polyline.map((x: any[]) => {
      return { 
        lat: x[0], 
        lng: x[1] 
      }; 
    })
    console.log(objs);
    var lineString = new H.geo.LineString()
    objs.forEach((element: any) => {
      lineString.pushPoint(element)
    });

    this.map.addObject(new H.map.Polyline(
      lineString, { style: { lineWidth: 4 }}
    ))
  }

  public ngAfterViewInit() {
    let defaultLayers = this.platform.createDefaultLayers();
    this.map = new H.Map(
        this.mapElement.nativeElement,
        defaultLayers.vector.normal.map,
        {
            zoom: 13,
            // center: { lat: 19.1366768, lng: 72.8160973 }
        }
    );

    var svgMarkup = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z"/><circle cx="12" cy="9" r="2.5"/></svg>'
    var icon = new H.map.Icon(svgMarkup)
    
    this.items = this.firestore.collection('Cordinates').doc('latlong').valueChanges();
    this.items.subscribe(data => {
      // var obj = data
      // this.data.push(obj)
      console.log(data)
      var coords = data
      var marker = new H.map.Marker(coords, {icon: icon})
      this.map.addObject(marker);
      this.map.setCenter(coords);

    })
    var ui = H.ui.UI.createDefault(this.map, defaultLayers);

    // let defaultLayers = this.platform.createDefaultLayers();
    // let map = new H.Map(
    //     this.mapElement.nativeElement,
    //     defaultLayers.vector.normal.map,
    //     {
    //         zoom: 13,
    //         center: { lat: 19.1366768, lng: 72.8160973 }
    //     }
    // );

    // var svgMarkup = '<svg width="24" height="24" ' +
    // 'xmlns="http://www.w3.org/2000/svg">' +
    // '<rect stroke="white" fill="#1b468d" x="1" y="1" width="22" ' +
    // 'height="22" /><text x="12" y="18" font-size="12pt" ' +
    // 'font-family="Arial" font-weight="bold" text-anchor="middle" ' +
    // 'fill="white">H</text></svg>'
    // var icon = new H.map.Icon(svgMarkup),
    // coords = {lat: 19.2449284, lng: 72.8706582},
    // marker = new H.map.Marker(coords, {icon: icon})
    // map.addObject(marker);
    // map.setCenter(coords);
}

}
