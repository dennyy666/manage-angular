import { Component, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;
  constructor(private fb: NonNullableFormBuilder, private router: Router, private message: NzMessageService) {
    this.validateForm = this.fb.group({
      account: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {

  }

  submitForm() {
    Object.values(this.validateForm.controls).forEach(control => {
      control.markAsDirty();
      control.updateValueAndValidity();
    });
    if (this.validateForm.invalid) {
      return
    }
    const { account, password } = this.validateForm.value;
    if (['姬虚空', '酒剑仙'].includes(account) && !!password) {
      sessionStorage.setItem('user', JSON.stringify({ name: account, company: '神剑山庄' }));
      this.router.navigateByUrl('/pages');
    } else {
      this.message.warning('用户名或者密码错误');
    }
  }

  onceLogin(account: string) {
    sessionStorage.setItem('user', JSON.stringify({ name: account, company: '神剑山庄' }));
    this.router.navigateByUrl('/pages');
  }

  copy(account: string) {
    navigator.clipboard.writeText(account).then(
      () => {
        this.message.success('复制成功');
      },
      () => {
        this.message.success('复制失败');
      },
    );
  }
}
