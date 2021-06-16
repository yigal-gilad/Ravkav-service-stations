import { state } from "../interfaces/state";

export const INTIAL_STATE: state = {
  checkbox_list: {
    accepts_cedit_card: false,
    accepts_cash: false,
    ravkav_services: false,
    sells_rvakav_reader: false,
    manned: false,
    reload_reservation: false
  },
  stations_list: [],
  user_latitude: null,
  user_longitude: null
}