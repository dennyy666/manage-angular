/**
 * @desc 该指令用于帮助表单限制只输入数字或者保留两位小数
 * liuya
 */

import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms'

@Directive({
  selector: '[appInputNumber]'
})
export class InputNumberDirective {
  /** 可以保留的小数位数 目前只支持保留两位 */
  @Input('appInputNumber') keepNum: number = 0;
  /** 监听表单keyup事件 */
  @HostListener('input') input() {
    this.inputValueVaild()
  }

  constructor(private ele: ElementRef,private ctrl:NgControl) { }

  /**
   * @desc value正则验证
   */
  private inputValueVaild() {
    const reg = /[^\d]/g   // 输入纯数字
    const keep = this.keepNum || 0;  // 保留位数

    const regForKeep = /^(\-)*(\d+)\.(\d\d).*$/
    if (keep < 1) {
      // 只能输入正整数
      this.ele.nativeElement.value = this.ele.nativeElement.value.replace(reg, '')
      this.ctrl?.control?.setValue(this.ele.nativeElement.value)
    } else {
      const obj = this.ele.nativeElement
      obj.value = obj.value.replace(/[^\d.]/g, '');  // 清除“数字”和“.”以外的字符
      if((obj.value.split('.').length) > 2){//处理 能输入1.1.1.1 的问题
       obj.value = obj.value.split('.')[0]+'.'+obj.value.split('.')[1];
     };
      obj.value = obj.value.replace(/\.{2,}/g, '.'); // 只保留第一个. 清除多余的
      // 保留小数
      obj.value = obj.value.indexOf('.') > -1 ? obj.value.replace(regForKeep, '$1$2.$3') : obj.value
      this.ctrl?.control?.setValue(this.ele.nativeElement.value)
    }

    // 触发input事件
    //  const event = new Event('input')
    //  this.ele.nativeElement.dispatchEvent(event);
  }
}

