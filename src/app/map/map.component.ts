import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  cursorStyle: string;
  accessed: boolean;
  upAccessed: boolean;
  upCoincidence: any;
  constructor() { }

  ngOnInit() {
  }

}
