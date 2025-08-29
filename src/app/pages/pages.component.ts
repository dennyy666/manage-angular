import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

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
  constructor() { }

  ngOnInit() {
  }

  toggle() {
    this.isCollapsed = !this.isCollapsed;
  }

}
