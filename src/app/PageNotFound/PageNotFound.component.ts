import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-PageNotFound',
  templateUrl: './PageNotFound.component.html',
  styleUrls: ['./PageNotFound.component.less']
})
export class PageNotFoundComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {

  }

  backHome() {
    this.router.navigateByUrl('/pages');
  }

}
