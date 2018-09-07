import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { MapService } from './map.service';
import { MapComponent } from './map/map.component';
import { PlaceService } from './place.service';
import { TweetService } from './tweet.service';
import { FactService } from './fact.service';
import { TweetComponent } from './tweet/tweet.component';
import { PlaceComponent } from './place/place.component';
import { FactComponent } from './fact/fact.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';


@NgModule({
  declarations: [
    AppComponent,
    TweetComponent,
    PlaceComponent,
    FactComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgxMapboxGLModule.withConfig({
      accessToken: 'pk.eyJ1Ijoiam9uYWhicm9oIiwiYSI6ImNqbG12ZmM1ODFjbmkza281Y2NvY2x6ZncifQ.gHjZYsOCjn3Fzi9B72Xk4Q'
    })
  ],
  providers: [MapService, PlaceService, TweetService, FactService],
  bootstrap: [AppComponent]
})
export class AppModule { }
