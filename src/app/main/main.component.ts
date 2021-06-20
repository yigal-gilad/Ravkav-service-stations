import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from "../state.service";
import { URL } from "../consts/url";
import { HttpService } from "../http.service";

declare var ol: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(public httpService: HttpService, public state: StateService, public router: Router) { }

  map: any;

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
        zoom: 6
      })
    });
    this.loadInitMap();
    if (this.state.state.stations_list.length) {
      this.showAllDests();
    }
  }

  loadInitMap() {
    navigator.geolocation.getCurrentPosition(position => {
      this.state.state.user_latitude = position.coords.latitude;
      this.state.state.user_longitude = position.coords.longitude;
      this.setCenter();
      this.addPoint(this.state.state.user_latitude, this.state.state.user_longitude);
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

  showAllDests() {
    var i;
    for (i = 0; i < this.state.state.stations_list.length; i++) {
      if (this.state.state.stations_list[i].service_station.lat &&
        this.state.state.stations_list[i].service_station.lon) {
        this.showDest(this.state.state.stations_list[i].service_station.lat,
          this.state.state.stations_list[i].service_station.lon,
          this.state.state.stations_list[i].service_station.comments ?
            this.state.state.stations_list[i].service_station.comments :
            "name not provided");
      }
    }
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

  getStationsList() {
    navigator.geolocation.getCurrentPosition(position => {
      this.state.state.user_latitude = position.coords.latitude;
      this.state.state.user_longitude = position.coords.longitude;
      // var y = "&lat=" + this.state.state.user_latitude +
      //   "&lon=" + this.state.state.user_longitude
      var x = "";
      if (this.state.state.checkbox_list.accepts_cedit_card) {
        x += "accepts_credit_card"
      }
      if (this.state.state.checkbox_list.accepts_cash) {
        if (x) {
          x += ",";
        }
        x += "accepts_cash"
      }
      if (this.state.state.checkbox_list.ravkav_services) {
        if (x) {
          x += ",";
        }
        x += "ravkav_services"
      }
      if (this.state.state.checkbox_list.sells_rvakav_reader) {
        if (x) {
          x += ",";
        }
        x += "sells_ravkav_reader"
      }
      if (this.state.state.checkbox_list.manned) {
        if (x) {
          x += ",";
        }
        x += "manned"
      }
      if (this.state.state.checkbox_list.reload_reservation) {
        if (x) {
          x += ",";
        }
        x += "reload_reservation"
      }
      x += "&lat=" + this.state.state.user_latitude +
        "&lon=" + this.state.state.user_longitude
      this.httpService.getStationsList(x)
        .subscribe({
          next: data => {
            if (data.data.results.length) {
              this.state.state.stations_list = data.data.results;
              this.setCenter();
              this.addPoint(this.state.state.user_latitude, this.state.state.user_longitude);
              this.showAllDests();
            } else {
              alert("no resalts for this search...")
            }
          },
          error: error => {
            alert(error.error);

          }
        })
    });
  }

  selectStation(index: number) {
    this.state.state.selected_station = this.state.state.stations_list[index];
    this.router.navigate(['details'], { skipLocationChange: true });
  }

}
