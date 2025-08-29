import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.less'],
  animations: [
    trigger('slide', [
      state('collapsed', style({
        maxWidth: '0',
        opacity: 0
      })),
      state('expanded', style({
        maxWidth: '220px',
        opacity: 1
      })),
      transition('collapsed <=> expanded', [
        animate('300ms ease-in-out')
      ])
    ])
  ],
})
export class PagesComponent implements OnInit {
  isCollapsed: boolean = false
  constructor(
    private router: Router,
    private message: NzMessageService,
    private modal: NzModalService,
    public authService: AuthService,
  ) { }

  ngOnInit() {
  }

  toggle() {
    this.isCollapsed = !this.isCollapsed;
  }

  baidu() {
    window.open("https://www.baidu.com", "_blank")
  }  

  loginOut() {
    this.modal.confirm({
      nzTitle: `您确定要退出Angular admin`,
      nzOkText: '是',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.authService.logout();
        this.router.navigateByUrl('login');
        this.message.success('退出登录成功');
      },
      nzCancelText: '否',
      nzOnCancel: () => {
      }
    });
  }


}
