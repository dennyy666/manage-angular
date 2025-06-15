import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormGroup, NonNullableFormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { ExampleManageService } from '../../example-manage.service';
import { catchError, map, of } from 'rxjs';
const IPHONERULES: any[] = [Validators.required, Validators.pattern(/^[1][0-9]{10}$/)]
@Component({
  selector: 'app-data-configuration',
  templateUrl: './data-configuration.component.html',
  styleUrls: ['./data-configuration.component.less']
})
export class DataConfigurationComponent implements OnInit {
  // 数据配置表单组
  validateForm: FormGroup
  constructor(
    private fb: NonNullableFormBuilder,
    public service: ExampleManageService,
  ) {
    this.validateForm = this.fb.group({
      sourceType: ['', Validators.required],
      vipMobile: [''],
      vipName: [''],
      ownerMobile: [''],
      ownerName: ['']
    });
  }

  ngOnInit() {

  }

  // 数据配置选择事件
  sourceTypeChange(value: number) {
    switch (value) {
      case 1:
        this.validateForm.get('ownerName')?.setValue(null)
        this.setValidatorsAndsyncValidators('vipMobile', 'vipName')
        this.clearValidatorsAndsyncValidators('ownerMobile')
        break;
      case 2:
        this.validateForm.get('vipName')?.setValue(null)
        this.setValidatorsAndsyncValidators('ownerMobile', 'ownerName')
        this.clearValidatorsAndsyncValidators('vipMobile')
        break;
      case 3:
        this.setValidatorsAndsyncValidators('vipMobile', 'vipName')
        this.setValidatorsAndsyncValidators('ownerMobile', 'ownerName')
        break;
    }
  }

  setValidatorsAndsyncValidators(mobile: string, accountName: string) {
    const control = this.validateForm.get(mobile);
    control?.setValidators(IPHONERULES)
    control?.setAsyncValidators(this.accountExistsAsyncValidator(accountName))
  }

  clearValidatorsAndsyncValidators(mobile: string) {
    const control = this.validateForm.get(mobile);
    control?.reset();
    control?.clearValidators();
    control?.clearAsyncValidators();
  }


  // 汽运账号（信息部账号）是否存在异步验证器
  accountExistsAsyncValidator(type: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const val = control.value;
      if (!val) return of(null); // 空值直接通过验证
      const action = type == 'vipName' ? this.service.getVip() : this.service.getinformation()
      return action.pipe(
        map((res: { code: number; data: any[] }) => {
          const { data } = res;
          const selectItem = data.find(item => item.phone == val);
          if (!selectItem) {
            this.validateForm.patchValue({
              [type]: ''
            })
            // 仅在验证失败时返回错误对象
            return { notExist: true };
          } else {
            this.validateForm.patchValue({
              [type]: selectItem.name
            })
            return null;
          }
        }),
        catchError(() => of({ requestFailed: true })) // 处理请求失败
      );
    }
  }


}
