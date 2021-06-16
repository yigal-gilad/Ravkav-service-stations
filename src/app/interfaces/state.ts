import { checkbox_list } from "./checkbox_list";
import { station } from "./station";

export interface state {
  checkbox_list: checkbox_list,
  stations_list: station[],
  user_latitude: number,
  user_longitude: number
}