import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { state } from "../interfaces/state";
import { INTIAL_STATE } from "../consts/initial_state";

const URL = environment.production ? window.location.href : "http://localhost:3000/";


const httpOptions = {
  headers: new HttpHeaders({
    'Referrer-Policy': 'no-referrer',
    'Access-Control-Allow-Origin': '*',
  }),
  fetchOptions: {
    mode: "no-cors",
  }
};

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  state: state;

  constructor(public http: HttpClient) {
    this.state = INTIAL_STATE;
  }

  ngOnInit() { }

  getStationsList() {
    navigator.geolocation.getCurrentPosition(position => {
      this.state.user_latitude = position.coords.latitude;
      this.state.user_longitude = position.coords.longitude;
      var y = "&lat=" + this.state.user_latitude +
        "&lon=" + this.state.user_longitude
      var x = "";
      if (this.state.checkbox_list.accepts_cedit_card) {
        x += "accepts_credit_card"
      }
      if (this.state.checkbox_list.accepts_cash) {
        if (x) {
          x += ",";
        }
        x += "accepts_cash"
      }
      if (this.state.checkbox_list.ravkav_services) {
        if (x) {
          x += ",";
        }
        x += "ravkav_services"
      }
      if (this.state.checkbox_list.sells_rvakav_reader) {
        if (x) {
          x += ",";
        }
        x += "sells_ravkav_reader"
      }
      if (this.state.checkbox_list.manned) {
        if (x) {
          x += ",";
        }
        x += "manned"
      }
      if (this.state.checkbox_list.reload_reservation) {
        if (x) {
          x += ",";
        }
        x += "reload_reservation"
      }
      x += y


      // fetch("https://ravkavonline.co.il/api/pos/service-station/search/?attributes=" + x, {
      //     headers: {
      //       'Content-Type': 'application/json',
      //       'Access-Control-Allow-Origin':'*'
      //     },
      //     method: 'GET', // GET, POST, PUT, DELETE
      //     mode: 'no-cors' // the most important option
      // })
      //   .then(response => {console.log(response)})

      return this.http.get<any>
        (URL + "getstations/?url=https://ravkavonline.co.il/api/pos/service-station/search/?attributes=" + x)
        .subscribe({
          next: data => {
            this.state.stations_list = data.data.results;

          },
          error: error => {
            alert(error.error);

          }
        })
    });
  }

}
