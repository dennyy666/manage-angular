import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.less']
})
export class BreadCrumbComponent implements OnInit {

  constructor(
        private router: Router,
        private modal: NzModalService,
        private message: NzMessageService,
  ) { }

  ngOnInit() {
  }

  toggle() {
    
  }  

  openGithub() {
    window.open("https://github.com/dennyy666/manage-angular", "_blank")
  }

  loginOut() {
    this.modal.confirm({ 
      nzTitle: '您确定要退出Angular admin', 
      nzOkText: '是',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.router.navigateByUrl('login');
        this.message.success('退出登录成功');
      },
      nzCancelText: '否',
      nzOnCancel: () => {

      }      
    })
  }
}
