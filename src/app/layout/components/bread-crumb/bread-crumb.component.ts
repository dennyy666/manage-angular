import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AuthService } from 'src/app/auth/auth.service';
import { SharedStateService } from '../../shared-state.service';

@Component({
  selector: 'app-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.less']
})
export class BreadCrumbComponent implements OnInit {
  // 将 isCollapsed 暴露为可观察对象，模板中通过 async 管道订阅
  isCollapsed$
  constructor(
    private router: Router,
    private modal: NzModalService,
    private message: NzMessageService,
    public authService: AuthService,
    private sharedState: SharedStateService,
  ) {
    this.isCollapsed$ = this.sharedState.isCollapsed$;
  }

  ngOnInit() {
  }

  toggle() {
    this.sharedState.toggleCollapsed(); // 修改共享变量
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
        this.authService.logout();
        this.router.navigateByUrl('login');
        this.message.success('退出登录成功');
      },
      nzCancelText: '否',
      nzOnCancel: () => {

      }
    })
  }
}
