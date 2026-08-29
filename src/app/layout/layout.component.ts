import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SharedStateService } from './shared-state.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less'],
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
export class LayoutComponent implements OnInit {
  // 将 isCollapsed 暴露为可观察对象，模板中通过 async 管道订阅
  isCollapsed$
  constructor(
    private sharedState: SharedStateService
  ) {
    this.isCollapsed$ = this.sharedState.isCollapsed$;
  }

  ngOnInit() {
  }

}
