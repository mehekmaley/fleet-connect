import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject, Subscriber } from 'rxjs';
import { AppService } from '../app.service';
import { DomSanitizer } from '@angular/platform-browser';
declare var H: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  private platform: any;
  items = new Observable<any>()
  place = new Observable<any>()
  data = <any>[]
  drowsy = new Observable<any>()
  drowsyImgs = <any>[]
  route: any
  map: any
  count = 0
  marker = undefined
  driverRoute = new H.geo.LineString()
  @ViewChild("map")
  public mapElement!: ElementRef;

  constructor(public firestore: AngularFirestore, public _appService: AppService, private domSanitizer: DomSanitizer) {
    this.platform = new H.service.Platform({
      "apikey": "d5hfkR1b0FzgRzxBIbvXY8KyDmqJpM7Uw-ykICXBIYA"
    });

  }

  ngOnInit(): void {
    
      this.place = this.firestore.collection('Place').doc('Place Name').get()
      this.place.subscribe(data => {
        var place = data.data()["Place name"]
        console.log(place)
        this.loadData(place); 
      })
    
  }

  async loadData(place:any) {
    try{
      
      this.route = await this._appService.getRoute({"place":place}).toPromise()
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
      lineString, { style: { lineWidth: 8}}
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

    var svgMarkup = '<svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 0 50 50" width="50px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z"/><circle cx="12" cy="9" r="2.5"/></svg>'
    // var svgMarkup = '<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12"><defs><style>.cls-1{fill:#2d3e50;}.cls-2{fill:#2e79bd;}</style></defs><title>b</title><path class="cls-1" d="M64.00178,3.36652c-25.74943,0-43.04956,14.75866-43.04956,36.7246,0,29.11223,37.01485,81.60069,37.38345,82.01113a7.60318,7.60318,0,0,0,11.3233.00579c.37394-.41623,37.3888-52.90469,37.3888-82.01692C107.04778,18.12518,89.74853,3.36652,64.00178,3.36652ZM64,74.73868a28.29593,28.29593,0,1,1,28.296-28.296A28.29592,28.29592,0,0,1,64,74.73868Z"/><path class="cls-2" d="M82.84186,58.57151c-.155.24618-.31.4741-.4741.71116a22.39884,22.39884,0,0,1-36.73256.00913c-.17323-.23705-.33733-.48323-.48323-.72935.01825-.12765.0365-.24618.0547-.3647a4.03615,4.03615,0,0,1,2.16079-2.90834c3.76529-1.87811,12.00714-4.6406,12.00714-4.6406v-2.726l-.22793-.17323a7.86155,7.86155,0,0,1-2.99042-5.00525l-.04557-.29175h-.2188a3.02492,3.02492,0,0,1-2.81719-1.88724,3.275,3.275,0,0,1-.41935-1.61368,3.1367,3.1367,0,0,1,.20967-1.12143,1.58361,1.58361,0,0,1,.61083-.9846l.76586-.45585-.18235-.82056c-1.34018-5.86225,3.04512-11.141,9.06235-11.51483a.5194.5194,0,0,1,.11853-.00913c.10027-.00913.20055-.0182.30088-.0182h.9117c.10027,0,.20055.00907.30082.0182a.51916.51916,0,0,1,.11853.00913c6.02641.37383,10.41171,5.65258,9.07147,11.51483l-.19148.82056.76586.45585a1.54549,1.54549,0,0,1,.61083.9846,3.14584,3.14584,0,0,1,.2188,1.12143,3.37534,3.37534,0,0,1-.41935,1.61368,3.02486,3.02486,0,0,1-2.81719,1.88724h-.2188l-.0547.29175a7.81113,7.81113,0,0,1-2.98129,5.00525l-.22793.17323v2.726s8.24185,2.76249,11.99806,4.6406a4.01318,4.01318,0,0,1,2.16074,2.90834C82.80541,58.31626,82.82361,58.44391,82.84186,58.57151Z"/></svg>'
    var icon = new H.map.Icon(svgMarkup)
    this.drowsy = this.firestore.collection('driverDrowsy').doc('session').valueChanges();
    this.drowsy.subscribe(data => {
      console.log(data.imgs)
      this.drowsyImgs = data.imgs
      for (let index = 0; index < this.drowsyImgs.length; index++) {
        this.drowsyImgs[index] = this.domSanitizer.bypassSecurityTrustUrl(this.drowsyImgs[index])
        
      }
      console.log(this.drowsyImgs[0].changingThisBreaksApplicationSecurity)
    })
    this.items = this.firestore.collection('Cordinates').doc('latlong').valueChanges();
    this.items.subscribe(data => {
      // var obj = data
      // this.data.push(obj)
      console.log(data)
      var coords = {
        lat: data.lat,
        lng: data.long
      }
      if(this.marker != undefined) {
        this.map.removeObject(this.marker)
      }
      
      this.marker = new H.map.Marker(coords, {icon: icon})
      this.map.addObject(this.marker);
      this.map.setCenter(coords);

      this.driverRoute.pushPoint(coords)
      if(this.count > 5) {
        console.log(this.driverRoute)
        this.map.addObject(new H.map.Polyline(
          this.driverRoute, { style: { lineWidth: 8,strokeColor: "green"}}
        ))
      }
      if(this.count <= 5) {
        this.count+=1
      } 

    })
    var ui = H.ui.UI.createDefault(this.map, defaultLayers);

  }

}
