/// <reference types="@types/googlemaps" />
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ScooterService } from './services/scooter.service';
import { ScooterPosition } from './models/ScooterPosition';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('providerMap') public mapElement: ElementRef;
  map: google.maps.Map;

  scooters: google.maps.LatLng[];

  isSubmitting$ = new BehaviorSubject<boolean>(false);
  showMap$ = new BehaviorSubject<boolean>(false);

  searchScooterForm = new FormGroup({
    noOfScooters: new FormControl(undefined),
    latitude: new FormControl(undefined),
    longitude: new FormControl(undefined),
    radiusMeters: new FormControl(undefined)
  });

  private readonly circleColor = '#6b54b6';

  constructor(private scooterService: ScooterService) {
    this.scooters = [];
  }

  ngOnInit() { }

  retrieveScooters() {
    this.toggleSubmit(true);
    this.scooters = [];

    if (this.searchScooterForm && this.searchScooterForm.value) {
      this.scooterService.getNearbyScooters(this.searchScooterForm).subscribe((data: ScooterPosition[]) => {
        this.toggleSubmit(false);
        this.showMap$.next(true);

        data.forEach(foundScooter => {
          this.scooters.push(this.getLatLng(foundScooter.latitude, foundScooter.longitude));
        });
        // this.displayMap(1.2775875, 103.8429406, data);
        this.displayMap(this.searchScooterForm.value.latitude, this.searchScooterForm.value.longitude, data);
      },
        error => {
          console.log(error.message);
          this.toggleSubmit(false);
        });
    }
  }

  resetForm() {
    this.scooters = [];
    this.searchScooterForm.reset();
    this.showMap$.next(false);
    this.isSubmitting$.next(false);
  }

  private toggleSubmit(show: boolean) {
    this.isSubmitting$.next(show);
  }

  private getLatLng(latitude: number, longitude: number) {
    return new google.maps.LatLng(
      latitude,
      longitude
    );
  }

  private displayMap(latitude: number, longitude: number, scootersPositions: ScooterPosition[]) {
    const userlatLng = this.setMapConfiguration(latitude, longitude);
    const userLocationMarker = this.setUserLocationMarker(userlatLng);
    this.drawCircleOfDefinedRadius(userlatLng, userLocationMarker, this.searchScooterForm.value.radiusMeters);
    this.setScooterMarkers();
  }

  private setScooterMarkers() {
    this.scooters.forEach((scooter) => {
      const marker = new google.maps.Marker({
        position: scooter,
        title: 'location',
        icon: 'assets/icons/scooter4.png'
      });
      marker.setMap(this.map);
    });
  }

  private drawCircleOfDefinedRadius(userlatLng: google.maps.LatLng, userLocationMarker: google.maps.Marker, circleRadius: number) {
    const circleHighlight = {
      strokeColor: this.circleColor,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: this.circleColor,
      fillOpacity: 0.35,
      map: this.map,
      center: userlatLng,
      radius: circleRadius // in meters
    };
    const radiusCircle = new google.maps.Circle(circleHighlight);
    radiusCircle.bindTo('center', userLocationMarker, 'position');
  }

  private setMapConfiguration(latitude: number, longitude: number) {
    const userlatLng = this.getLatLng(latitude, longitude);
    const mapProperties = {
      center: userlatLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      clickableIcons: false,
      disableDoubleClickZoom: true,
      fullscreenControl: false,
      mapTypeControl: false,
      streetViewControl: false,
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapProperties);
    this.map.setOptions({ draggable: true, keyboardShortcuts: false });
    this.map.data.setStyle({ clickable: false });
    return userlatLng;
  }

  private setUserLocationMarker(userlatLng: google.maps.LatLng) {
    const userLocationMarker = new google.maps.Marker({
      position: userlatLng,
      title: 'location',
    });
    userLocationMarker.setMap(this.map);
    return userLocationMarker;
  }
}
