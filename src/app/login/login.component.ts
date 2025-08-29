import { Component, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LoginService } from './login.service';
import { AuthService } from '../auth/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;
  constructor(
    private fb: NonNullableFormBuilder,
    private router: Router,
    private message: NzMessageService,
    private service: LoginService,
    private authService: AuthService,
  ) {
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
    this.performLogin(account, password);    
  }

  performLogin(account: string, password: string = '123456') {
    this.service.login(account, password).subscribe(res => {
      const { data } = res
      const user = data.find((item) => item.username === account)
      if (user) {
        this.authService.setAuthentication(user)
        this.router.navigateByUrl('/pages');
      } else {
        this.message.warning('用户名或者密码错误');
      }
    });
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
