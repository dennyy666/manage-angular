import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-slide-bar',
  templateUrl: './slide-bar.component.html',
  styleUrls: ['./slide-bar.component.less']
})
export class SlideBarComponent implements OnInit {
  activeUrl: string = ''
  constructor(
    private router: Router,
  ) {
    this.listenRouter()
  }

  ngOnInit() {
  }

  listenRouter() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeUrl = event.url;
      }
    });
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
