import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ScooterPosition } from '../models/ScooterPosition';
import { URLS } from '../URL';

@Injectable({
  providedIn: 'root'
})
export class ScooterService {
  constructor(private http: HttpClient) { }
  getNearbyScooters(searchScooterForm: FormGroup) {
    const formData = searchScooterForm.value;
    const url = `${URLS.GET_NEARBY_SCOOTERS}/${
      formData.noOfScooters
      }/${formData.latitude}/${formData.longitude}/${
      formData.radiusMeters
      }/`;
    return this.http.get<ScooterPosition[]>(url);
  }
}
