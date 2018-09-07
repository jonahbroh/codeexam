import { Component, OnInit, ChangeDetectorRef, EventEmitter, Output, Input } from '@angular/core';
import { FactService } from '../fact.service';
import { FeatureCollection, Feature } from 'geojson';
import { Observable, of, throwError } from 'rxjs';
import { MapMouseEvent } from 'mapbox-gl';

@Component({
  selector: 'app-fact',
  templateUrl: './fact.component.html',
  styleUrls: ['./fact.component.css']
})
export class FactComponent implements OnInit {
  private facts: FeatureCollection;
  private displayedKeys: string[] = [];
  private values: Object;
  private _accessed = false;
  clicked: boolean;
  selectedPoint: GeoJSON.Feature<GeoJSON.Point> | null;
  lastPoint: string | null;
  selectedCoords: GeoJSON.Point | null;
  @Input()
  set accessed(accessed: boolean){
    this._accessed = accessed;
    if(this.displayedKeys.length == 1){
      this.selectedPoint = null;
      this.selectedCoords = null;
      this.clicked = false;
    }
  }
  @Output() cursorStyle = new EventEmitter();
  constructor(private factService: FactService, private ChangeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.clicked = false;
    this.getFacts();
    this.getValues();
  }
  getFacts(): void {
    this.factService.getFacts().subscribe(data => this.facts = data as FeatureCollection);
  }
  getValues(): void {
    this.factService.getValues().subscribe(data => this.values = this.factService.splitValues(data));
  }
  getName(label: string): string {
    var hdArray = ['e','m'];
    var labelArray = label.split('_');
    var key = '';
    //First part of the label, B00000
    key += labelArray[3];
    //Number that comes after HD, either 0 or 1. Corresponds to values in hdArray.
    if(labelArray[6] == null){
      console.log(label);
      return "???";
    }
    var hd = +labelArray[6].split('HD')[1] - 1;
    key += hdArray[hd];
    //Number that comes after VD, minus one if 01002
    var vd = +labelArray[7].split('VD')[1];
    if (labelArray[3] == 'B01002'){
      key += vd-1
    }
    else{
      key += vd;
    }
    return this.values[key];
  }

  getTotal(label: string): string {
    var totalLabel = label.slice(0, -2);
    if (totalLabel == 'ACS_13_5YR_B01002_with_ann_HD01_VD'){
      totalLabel += '02';
    }
    else{
      totalLabel += '01';
    }
    return this.selectedPoint.properties[totalLabel];
  }

  isDisplayed(label: string): boolean {
    var labelArray = label.split('_');
    //Maybe show margin of error alongside?
    if(labelArray.length > 1 && labelArray[6] == 'HD01' && labelArray[7] != 'VD01' && label != 'ACS_13_5YR_B01002_with_ann_HD01_VD02'){
      return true;
    }
    else{
      return false;
    }
  }
  activateHoverOn(evt: MapMouseEvent) {
    if(this.clicked == false && this._accessed == false){
      this.selectedPoint = null;
      this.ChangeDetectorRef.detectChanges();
      this.selectedPoint = (<any>evt).features[0];
      if(this.selectedPoint.properties['GEOID'] != this.lastPoint){
        this.updateKeysShowRandom();
      }
      this.lastPoint = this.selectedPoint.properties['GEOID'];
      this.selectedCoords = (<any>evt).lngLat;
      this.cursorStyle.emit('pointer');
    }
  }
  disableHover(){
    if(this.clicked == false && this._accessed == false){
      this.selectedPoint = null;
      this.selectedCoords = null;
      this.cursorStyle.emit('');
    }
  }
  onClick(evt: MapMouseEvent){
    this.clicked = !this.clicked;
    if(this.clicked == true && this._accessed == false){
      this.selectedPoint = null;
      this.ChangeDetectorRef.detectChanges();
      this.selectedPoint = (<any>evt).features[0];
      this.selectedCoords = (<any>evt).lngLat;
      this.cursorStyle.emit('pointer');
      this.updateKeysShowAll();
    }
    else if(this._accessed == false){
      this.selectedPoint = null;
      this.selectedCoords = null;
      this.cursorStyle.emit('');
    }
  }
  updateKeysShowAll(){
    this.displayedKeys = [];
    for(let f of Object.keys(this.selectedPoint.properties)){
      if (this.isDisplayed(f)){
        this.displayedKeys.push(f);
      }
    }
  }
  updateKeysShowRandom(){
    this.updateKeysShowAll();
    this.displayedKeys = [(this.displayedKeys[Math.floor(Math.random()*this.displayedKeys.length)])];
  }
  getPercentage(key: string): string{
    var percentage = ((+this.selectedPoint.properties[key])/(+this.getTotal(key))).toFixed(2);
    var percentageString = '' + percentage + '%';
    return percentageString;
  }
}
