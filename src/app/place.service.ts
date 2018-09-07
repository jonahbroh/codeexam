import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry, map, tap } from 'rxjs/operators';
import { FeatureCollection, Feature, Point } from 'geojson';
import * as mapboxgl from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  constructor(private http: HttpClient) { }
  getPlaces(){
    return this.http.get(environment.data.places, {responseType: 'text'});
  }

  splitPlaces(data: string){
    let places: FeatureCollection = {
      type: 'FeatureCollection',
      features: Array<Feature>()
    };
    var placeArray = data.split('\n');
    // var places:Place[] = new Array(placeArray.length);
    for(let p of placeArray){
      var placeEntries = p.split(',');
      var name = '';
      for(var i = 0; i < placeEntries.length-4; i++){
        name += placeEntries[i] + '\n';
      }
      let point: Point = {
        type: 'Point',
        coordinates : [ +placeEntries[placeEntries.length-1], +placeEntries[placeEntries.length-2]]
      };
      let place: Feature = {
        type: "Feature",
        geometry: point,
        properties: {
          name: name,
          category: placeEntries[placeEntries.length-4],
          checkins: placeEntries[placeEntries.length-3],
        }
      };
      // let place: Place = {
      //   name: name,
      //   category: placeEntries[placeEntries.length-4],
      //   checkins: +placeEntries[placeEntries.length-3],
      //   lat: +placeEntries[placeEntries.length-2],
      //   lon: +placeEntries[placeEntries.length-1],
      //   id: id++
      // };
      places.features.push(place);
    }
    console.log(places)
    return places;
  }
}
