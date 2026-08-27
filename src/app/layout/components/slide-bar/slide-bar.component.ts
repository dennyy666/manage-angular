import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-slide-bar',
  templateUrl: './slide-bar.component.html',
  styleUrls: ['./slide-bar.component.less']
})
export class SlideBarComponent implements OnInit {

  constructor(
        private router: Router,
  ) { }

  ngOnInit() {
  }

  baidu() {
    window.open("https://www.baidu.com", "_blank")
  }

  openGithub() {
    window.open("https://github.com/dennyy666/manage-angular", "_blank")
  }

  jumpNotFound() {
    this.router.navigateByUrl('/layout/homeManage/notFound');
  }

}
