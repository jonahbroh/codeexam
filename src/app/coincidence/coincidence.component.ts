import { Component, OnInit, ChangeDetectorRef, EventEmitter, Output, Input } from '@angular/core';
import { FeatureCollection, Feature, LineString } from 'geojson';
import { MapMouseEvent } from 'mapbox-gl';

@Component({
  selector: 'app-coincidence',
  templateUrl: './coincidence.component.html',
  styleUrls: ['./coincidence.component.css']
})
export class CoincidenceComponent implements OnInit {
  private _upCoincidence: any;
  private _accessed: boolean;
  private coincidences: FeatureCollection;
  private coincidence: Feature;
  private textLength: number;
  private textIndices: number[];
  selectedPoint: GeoJSON.Feature<GeoJSON.Point> | null;
  clickedPoint: GeoJSON.Feature<GeoJSON.Point> | null;
  lastPoint: Object | null;
  selectedCoords: GeoJSON.Point | null;
  clickedCoords: GeoJSON.Point | null;
  objectKeys = Object.keys;
  @Output() cursorStyle = new EventEmitter();
  @Output() upAccessed = new EventEmitter();
  @Input()
  set upCoincidence(upCoincidence: any){
    if(upCoincidence != null){
      this._upCoincidence = upCoincidence;
      this.addText(upCoincidence[0]);
      this.addCoords(upCoincidence[1]);
    }
  }
  @Input()
  set accessed(accessed: boolean){
    this._accessed = accessed;
    if(this.clickedPoint == null){
      this.selectedPoint = null;
      this.selectedCoords = null;
    }
  }
  constructor(private ChangeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    console.log("???")
    this.coincidences = {
      type: 'FeatureCollection',
      features: []
    };
    this.coincidenceReset();
  }

  coincidenceReset(): void{
    let line: LineString = {
      type: 'LineString',
      coordinates : []
    };
    let coinc: Feature = {
      type: "Feature",
      properties: {},
      geometry: line
    };
    this.coincidence = coinc;
    this.textLength = 0;
    this.textIndices = [];
  }

  addCoords(coords: number[]){
    this.coincidence.geometry['coordinates'].push(coords);
  }
  addText(text: string){
    if(this.textLength != 0){
      this.coincidence.properties[''+this.textLength] = "and also";
      this.textIndices.push(this.textLength);
      this.textLength += 1;
    }
    this.coincidence.properties[''+this.textLength] = text;
    this.textIndices.push(this.textLength);
    this.textLength += 1;
  }
  addCoincidence(){
    this.coincidences.features.push(this.coincidence);
    this.coincidences = {...this.coincidences};
    this.coincidenceReset();
    console.log(this.coincidences);
  }
  activateHoverOn(evt: MapMouseEvent) {
    if((this._accessed == false) && (this.clickedPoint == null || (this.clickedPoint.properties != this.selectedPoint.properties))){
      this.selectedPoint = null;
      this.ChangeDetectorRef.detectChanges();
      this.selectedPoint = (<any>evt).features[0];
      if(this.selectedPoint.properties != this.lastPoint){
      }
      this.lastPoint = this.selectedPoint.properties;
      this.selectedCoords = (<any>evt).lngLat;
      this.cursorStyle.emit('pointer');
      this.upAccessed.emit(true);
    }
  }
  disableHover(){
    if(this._accessed == false){
      this.selectedPoint = null;
      this.selectedCoords = null;
      this.cursorStyle.emit('');
      this.upAccessed.emit(false);
    }
  }
  onClick(evt: MapMouseEvent){
    if(this._accessed == false){
      this.clickedPoint = null;
      this.ChangeDetectorRef.detectChanges();
      this.clickedPoint = (<any>evt).features[0];
      this.clickedCoords = (<any>evt).lngLat;
      this.cursorStyle.emit('pointer');
      this.upAccessed.emit(true);
    }
  }
  updateText(key: string, text: string){
    this.coincidence.properties[key] = text;
  }
}
