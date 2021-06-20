export interface station {
  distance: number,
  service_station: {
    id: number,
    attributes: string[],
    city: string,
    address: string,
    activity_hours: string,
    operating_company: string,
    comments: string,
    lat: number,
    lon: number,
    reform_area: number,
    remote_id: any
  }
}