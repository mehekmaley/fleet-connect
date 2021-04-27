import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

declare var H: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  private platform: any;

  @ViewChild("map")
  public mapElement!: ElementRef;

  constructor() {
    this.platform = new H.service.Platform({
      "apikey": "d5hfkR1b0FzgRzxBIbvXY8KyDmqJpM7Uw-ykICXBIYA"
    });
  }

  ngOnInit(): void {
  }

  public ngAfterViewInit() {
    let defaultLayers = this.platform.createDefaultLayers();
    let map = new H.Map(
        this.mapElement.nativeElement,
        defaultLayers.vector.normal.map,
        {
            zoom: 13,
            center: { lat: 19.1366768, lng: 72.8160973 }
        }
    );

    var svgMarkup = '<svg width="24" height="24" ' +
    'xmlns="http://www.w3.org/2000/svg">' +
    '<rect stroke="white" fill="#1b468d" x="1" y="1" width="22" ' +
    'height="22" /><text x="12" y="18" font-size="12pt" ' +
    'font-family="Arial" font-weight="bold" text-anchor="middle" ' +
    'fill="white">H</text></svg>';
    var icon = new H.map.Icon(svgMarkup),
    coords = {lat: 19.1366768, lng: 72.8160973},
    marker = new H.map.Marker(coords, {icon: icon})
    map.addObject(marker);
    map.setCenter(coords);
    var ui = H.ui.UI.createDefault(map, defaultLayers);
}

}
