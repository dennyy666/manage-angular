import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { ExampleManageService } from '../../example-manage.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-assay-indicator',
  templateUrl: './assay-indicator.component.html',
  styleUrls: ['./assay-indicator.component.less']
})
export class AssayIndicatorComponent implements OnInit {
  // 站台化验结果配置列表
  @Input() stationQualityItemList: any[] = []
  // 改变stationQualityItemList事件
  @Output() stationQualityItemListChange = new EventEmitter()
  // 配煤比例指标配置列表
  @Input() colalQualityItemList: any[] = []
  // 改变colalQualityItemListChange事件
  @Output() colalQualityItemListChange = new EventEmitter()
  // 通知父组件已经获取到了站台化验结果配置列表和配煤比例指标配置列表事件 
  @Output() notice = new EventEmitter();
  // 配煤比例指标配置是否禁用 true：是 false：否
  @Input() nzDisabled: boolean = false
  constructor(
    public service: ExampleManageService,
    private msg: NzMessageService,
  ) { }

  ngOnInit() {
    this.getQualityItemList()
  }

  // 站台化验结果配置选择
  stationQualityChecked(){
    this.stationQualityItemListChange.emit(this.stationQualityItemList)
  }

  // 配煤比例指标配置选择
  colalQualityChecked() {
    this.colalQualityItemListChange.emit(this.colalQualityItemList)
  }

  // 获取指标列表
  getQualityItemList() {
    this.service.getAssayList().subscribe((res: { code: number; data: any; msg: string | TemplateRef<void>; }) => {
      if (res.code == 0) {
        this.stationQualityItemList = (res.data || []).map((item: any) => {
          return { label: item.itemName, value: item.id, checked: false, beginValue: item.beginValue, endValue: item.endValue }
        })
        this.colalQualityItemList = (res.data || []).map((item: any) => {
          return { label: item.itemName, value: item.id, checked: false, beginValue: item.beginValue, endValue: item.endValue }
        })
        this.stationQualityItemListChange.emit(this.stationQualityItemList)
        this.colalQualityItemListChange.emit(this.colalQualityItemList)
        this.notice.emit();
      } else {
        this.msg.error(res.msg);
      }
    });
  }
}
