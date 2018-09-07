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
  // private testTweet: Feature = {
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
  // private tweets: FeatureCollection = {
  //   type: "FeatureCollection",
  //   features: Array<Feature>()
  // }
  private tweets: FeatureCollection;
  selectedPoint: GeoJSON.Feature<GeoJSON.Point> | null;
  clickedPoints: Object = {};
  @Output() cursorStyle = new EventEmitter();
  @Output() accessed = new EventEmitter();
  clicked: boolean;
  objectKeys = Object.keys;
  constructor(private tweetService: TweetService, private ChangeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.getTweets();
    this.clicked = false;
    // this.tweets.features.push(this.testTweet);
  }
  getTweets(): void {
    this.tweetService.getTweets().subscribe(data => this.tweets = this.tweetService.splitTweets(data));
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
