import { environment } from 'src/environments/environment';
export const URL: string = environment.backendServerURL;

export const URLS = {
    GET_NEARBY_SCOOTERS: `${URL}/api/get-nearby-scooters`,
};
