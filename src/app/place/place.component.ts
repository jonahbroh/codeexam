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
  private places: FeatureCollection;
  selectedPoint: GeoJSON.Feature<GeoJSON.Point> | null;
  clickedPoint: GeoJSON.Feature<GeoJSON.Point> | null;
  @Output() cursorStyle = new EventEmitter();
  @Output() accessed = new EventEmitter();
  @Output() upCoincidence = new EventEmitter();
  clicked: boolean;
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
    this.clickedPoint = null;
    this.ChangeDetectorRef.detectChanges();
    this.clickedPoint = (<any>evt).features[0];
    this.cursorStyle.emit('pointer');
    this.accessed.emit(false);
  }
  sendCoincidence(point: any){
    this.upCoincidence.emit(point);
  }
}
