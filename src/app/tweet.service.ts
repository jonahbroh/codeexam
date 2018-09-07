import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry, map, tap, take } from 'rxjs/operators';
import { FeatureCollection, Feature, Point } from 'geojson';
import * as mapboxgl from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})
export class TweetService {

  constructor(private http: HttpClient) { }
  getTweets(){
    return this.http.get(environment.data.tweets, {responseType: 'text'});
  }
  getName(){
    return this.http.get(environment.data.names);
  }
  splitTweets(data: string){
    let tweets: FeatureCollection = {
      type: 'FeatureCollection',
      features: Array<Feature>()
    };
    var tweetArray = data.split('\n');
    for(let t of tweetArray){
      var tweetEntries = t.split(',');
      var body = '';
      for(var i = 0; i < tweetEntries.length-4; i++){
        body += tweetEntries[i];
      }
      var timeString = tweetEntries[tweetEntries.length-1].split(';')[0].split(' ');
      var dateArray = timeString[0].split('-');
      var timeArray = timeString[1].split(':');
      var time = new Date(+dateArray[0], +dateArray[1]-1, +dateArray[2], +timeArray[0], +timeArray[1], +timeArray[2]);
      let point: Point = {
        type: 'Point',
        coordinates : [ +tweetEntries[tweetEntries.length-2], +tweetEntries[tweetEntries.length-3]]
      };
      let tweet: Feature = {
        type: "Feature",
        geometry: point,
        properties: {
          tweet: body,
          username: tweetEntries[tweetEntries.length-4],
          time: time
        }
      }
      tweets.features.push(tweet);
    }
    return tweets;
  }
}
