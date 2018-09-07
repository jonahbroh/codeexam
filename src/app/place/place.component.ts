import { Component, OnInit, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { PlaceService } from '../place.service';
import { FeatureCollection, Feature } from 'geojson';
import { Observable, of, throwError } from 'rxjs';
import { MapMouseEvent } from 'mapbox-gl';

@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.css'],
  providers: [PlaceService]
})
export class PlaceComponent implements OnInit {
  // private testPlace: Feature = {
  //   type: "Feature",
  //   geometry: {
  //     type: 'Point',
  //     coordinates : [ 35.05, -106.5]
  //   },
  //   properties: {
  //     name: "name",
  //     category: "category",
  //     checkins: 17
  //   }
  // }
  // private places: FeatureCollection = {
  //   type: "FeatureCollection",
  //   features: Array<Feature>()
  // }
  private places: FeatureCollection;
  selectedPoint: GeoJSON.Feature<GeoJSON.Point> | null;
  clickedPoints: Object = {};
  @Output() cursorStyle = new EventEmitter();
  @Output() accessed = new EventEmitter();
  clicked: boolean;
  objectKeys = Object.keys;
  constructor(private placeService: PlaceService, private ChangeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.getPlaces();
    this.clicked = false;
    // this.places.features.push(this.testPlace);
  }
  getPlaces(): void {
    this.placeService.getPlaces().subscribe(data => this.places = this.placeService.splitPlaces(data));
  }
  activateHoverOn(evt: MapMouseEvent) {
    this.selectedPoint = null;
    this.ChangeDetectorRef.detectChanges();
    this.selectedPoint = (<any>evt).features[0];
    this.cursorStyle.emit('pointer');
    this.accessed.emit(true);
  }
  disableHover(){
    this.selectedPoint = null;
    this.cursorStyle.emit('');
    this.accessed.emit(false);
  }
  onClick(evt: MapMouseEvent){
    this.ChangeDetectorRef.detectChanges();
    var point = (<any>evt).features[0];
    this.clickedPoints['' + point.properties.lon + "," + point.properties.lat] = point;
    this.cursorStyle.emit('pointer');
    this.accessed.emit(false);
  }

}
