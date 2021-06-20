import { environment } from 'src/environments/environment';

export const URL = environment.production ? window.location.href : "http://localhost:3000/";