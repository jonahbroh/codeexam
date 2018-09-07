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
export class FactService {

  constructor(private http: HttpClient) { }
  getFacts(){
    return this.http.get(environment.data.facts);
  }
  getValues(){
    return this.http.get(environment.data.values, {responseType: 'text'});
  }
  getKeys(key: string){
    return this.http.get(environment.data[key]);
  }
  splitValues(data: string){
    var valuesArray = data.split('\n');
    var values = {};
    for (let v of valuesArray){
      var arr = v.split('	');
      values[arr[0]] = arr[1];
    }
    return values;
  }
}
