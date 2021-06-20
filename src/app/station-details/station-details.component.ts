import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from "../state.service";
import { URL } from "../consts/url";

declare var ol: any;

@Component({
  selector: 'app-station-details',
  templateUrl: './station-details.component.html',
  styleUrls: ['./station-details.component.css']
})
export class StationDetailsComponent implements OnInit {
  map: any;
  constructor(public state: StateService, public router: Router) { }

  ngOnInit() {
    this.map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([35.217018, 31.771959]),
        zoom: 8
      })
    });
    this.loadInitMap();
  }

  loadInitMap() {
    navigator.geolocation.getCurrentPosition(position => {
      this.state.state.user_latitude = position.coords.latitude;
      this.state.state.user_longitude = position.coords.longitude;
      this.setCenter();
      this.addPoint(this.state.state.user_latitude, this.state.state.user_longitude);
      this.showDest(this.state.state.selected_station.service_station.lat,
        this.state.state.selected_station.service_station.lon,
        this.state.state.selected_station.service_station.comments ?
          this.state.state.selected_station.service_station.comments :
          "name not provided")
    });
  }

  setCenter() {
    var view = this.map.getView();
    view.setCenter(ol.proj.fromLonLat([this.state.state.user_longitude, this.state.state.user_latitude]));
    view.setZoom(12);
  }

  addPoint(lat: number, lng: number) {
    var vectorLayer = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: [new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857')),
        })]
      }),
      style: new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 0.5],
          anchorXUnits: "fraction",
          anchorYUnits: "fraction",
          opacity: 1,
          scale: 0.2,
          src: URL + "/you.png"
        })
      })
    });
    this.map.addLayer(vectorLayer);
  }

  showDest(lat: number, lng: number, name: string) {
    var vectorLayer = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: [new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857')),
        })]
      }),
      style: new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 0.5],
          anchorXUnits: "fraction",
          anchorYUnits: "fraction",
          opacity: 1,
          scale: 0.1,
          src: URL + "/dest.png"
        }),
        text: new ol.style.Text({
          text: name,
          scale: 1.2,
          fill: new ol.style.Fill({
            color: "#000000"
          })
        })
      })
    });
    this.map.addLayer(vectorLayer);
  }

}
