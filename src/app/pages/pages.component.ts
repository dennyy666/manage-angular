import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.less']
})
export class PagesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  baidu(){
    window.open("https://www.baidu.com","_blank")
  }

}
