import { Injectable } from '@angular/core';

import { state } from "./interfaces/state";
import { INTIAL_STATE } from "./consts/initial_state";

@Injectable({
  providedIn: 'root'
})
export class StateService {
  state: state;
  constructor() {
    this.state = INTIAL_STATE;
  }
}
