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
  conjunctions: string[] = [", though ", ", although", ", even though", ", while",
  ", if", ", only if", ", unless", ", until", ", provided that", ", assuming that",
  ", even if", ", in case", ", lest", ", rather than", ", whether", ", as much as",
  ", whereas"];
  selectedPoint: GeoJSON.Feature<GeoJSON.Point> | null;
  clickedPoint: GeoJSON.Feature<GeoJSON.Point> | null;
  lastPoint: Object | null;
  selectedCoords: GeoJSON.Point | null;
  clickedCoords: GeoJSON.Point | null;
  objectKeys = Object.keys;
  selectedIndex: number | null;
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
      this.coincidence.properties[''+this.textLength] = this.conjunctions[Math.floor(Math.random()*this.conjunctions.length)];
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
  }
  removeCoincidence(){
    if(this.textLength == 1){
      this.coincidenceReset();
    }
    else{
      this.coincidence.geometry['coordinates'].splice(Math.floor(this.selectedIndex/2),1);
      for(let i of this.textIndices){
        if(i >= this.selectedIndex){
          this.coincidence.properties[i] = this.coincidence.properties[i+2];
        }
      }
      delete this.coincidence.properties[this.textLength-2];
      delete this.coincidence.properties[this.textLength-1];
      this.textLength = this.textLength - 2;
      this.textIndices.splice(this.textLength,2);
      this.selectedIndex = null;
    }
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
  selectIndex(t: number){
    this.selectedIndex = t;
  }
}
