import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.less']
})
export class PagesComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  baidu(){
    window.open("https://www.baidu.com","_blank")
  }

  jumpNotFound(){
    this.router.navigateByUrl('/pages/homeManage/notFound');
  }

}
