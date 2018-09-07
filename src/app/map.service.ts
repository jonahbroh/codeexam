import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import * as mapboxgl from 'mapbox-gl';
import { Place } from './place';
import { PlaceService } from './place.service';
import { Tweet } from './tweet';
import { TweetService } from './tweet.service';
import { Fact } from './fact';
import { FactService } from './fact.service';

@Injectable()
export class MapService {

  constructor(private placeService: PlaceService, private tweetService: TweetService, private factService: FactService) {
  }
  getTweets(): Observable<string>{
    return this.tweetService.getTweets();
  }
  getPlaces(): Observable<string>{
    return this.placeService.getPlaces();
  }
  //
  // tweetMarkers(): GeoJson[]{
  //   markers: GeoJson[] = [];
  //   for(let t in this.tweets){
  //     let marker: GeoJson = {
  //       coordinates: [t.lon, t.lat],
  //       {message: t.tweet + '\n' + t.time}
  //     };
  //     markers.push(marker);
  //   }
  //   return markers;
  // }

}
