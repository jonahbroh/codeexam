import { Component, OnInit, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { Tweet } from '../tweet';
import { TweetService } from '../tweet.service';
import { FeatureCollection, Feature } from 'geojson';
import { Observable, of, throwError } from 'rxjs';
import { MapMouseEvent } from 'mapbox-gl';

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.css'],
  providers: [TweetService]
})
export class TweetComponent implements OnInit {
  private tweets: FeatureCollection;
  name: string;
  selectedPoint: GeoJSON.Feature<GeoJSON.Point> | null;
  clickedPoints: Object = {};
  lastPoint: string | null;
  @Output() cursorStyle = new EventEmitter();
  @Output() accessed = new EventEmitter();
  clicked: boolean;
  objectKeys = Object.keys;
  constructor(private tweetService: TweetService, private ChangeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.getTweets();
    this.clicked = false;
    this.name = "Blacksnort Hellweed";
  }
  getTweets(): void {
    this.tweetService.getTweets().subscribe(data => this.tweets = this.tweetService.splitTweets(data));
  }
  randomName(api: boolean): void {
    //For use with the API, probably worth hardcoding in a whole bunch of spooky names at some point
    if(api == true){
      this.tweetService.getName().subscribe(data => {
        this.name = (data['names'][0] + " " + data['names'][1]);
      });
    }
    else{
      var firstNames = ["Blacksnort", "Dragonspit", "Beetlebite", "Frogbite", "Skullscare"];
      var lastNames = [" Hellweed", " Flameburp", " Flamecast", " Hatescreech", " Wartsnare"];
      this.name = firstNames[Math.floor(Math.random()*5)] + lastNames[Math.floor(Math.random()*5)];
    }
  }
  activateHoverOn(evt: MapMouseEvent) {
    this.selectedPoint = null;
    this.ChangeDetectorRef.detectChanges();
    this.selectedPoint = (<any>evt).features[0];
    //In theory two tweets at exactly the same time wouldn't change, probably not worth throwing in an id for
    if(this.selectedPoint.properties.time != this.lastPoint){
      this.randomName(false);
    }
    this.lastPoint = this.selectedPoint.properties.time;
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
