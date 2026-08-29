import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedStateService {
  // 使用 BehaviorSubject 保存 isCollapsed 状态，并设置初始值
  private isCollapsedSubject = new BehaviorSubject<boolean>(false);

  // 对外暴露可观察对象，组件通过它订阅状态变化
  isCollapsed$ = this.isCollapsedSubject.asObservable();

  constructor() { }


  // 设置新值
  setCollapsed(value: boolean): void {
    this.isCollapsedSubject.next(value);
  }

  // 切换状态
  toggleCollapsed(): void {
    this.isCollapsedSubject.next(!this.isCollapsedSubject.value);
  }

}
