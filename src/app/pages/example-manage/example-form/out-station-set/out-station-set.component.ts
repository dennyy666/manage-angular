import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ExampleManageService } from '../../example-manage.service';

@Component({
  selector: 'app-out-station-set',
  templateUrl: './out-station-set.component.html',
  styleUrls: ['./out-station-set.component.less']
})
export class OutStationSetComponent implements OnInit {
  // 是否点击出站配煤比例配置 true 是 false 否
  @Input() outStationSetFlag: boolean = false
  // 改变 sectionSetFlag事件
  @Output() outStationSetFlagChange = new EventEmitter()  
  // 出站配煤比例配置
  @Output() outStationSet = new EventEmitter();
  // 出站配煤比例配置
  @Output() clearData = new EventEmitter();  
  // 配煤比例指标配置列表
  @Input() colalQualityItemList: any[] = []
  // 区间范围列表
  @Input() sectionNameList: any[] = []
  // 出站配煤比例配置
  outStationCoalForm: FormGroup
  
  constructor(
    private fb: NonNullableFormBuilder,
    public service: ExampleManageService,
  ) {
    this.outStationCoalForm = this.fb.group({
      stationCoalStatisticsMathList: this.fb.array([

      ]),
    })
  }
  // 出站配煤比例配置formArray
  get stationCoalStatisticsMathList(): FormArray { return this.outStationCoalForm.get("stationCoalStatisticsMathList") as FormArray }

  getMatchRangListControls(content: any) {
    return (content.get('matchRangList') as FormArray).controls as any;
  }

  ngOnInit() {

  }

  // 清除数据
  clear() {
    this.stationCoalStatisticsMathList.clear()
    this.outStationSetFlag = false
    this.outStationSetFlagChange.emit(this.outStationSetFlag)
    this.clearData.emit()
  }

  // 根据选中配煤比例指标配置生成出站配煤比例配置
  addOutStation(list: string | any[]) {
    const checkedQualityNameList = this.colalQualityItemList.filter(item => item.checked)
    checkedQualityNameList.forEach((item, index) => {
      this.stationCoalStatisticsMathList.push(
        this.fb.group({
          label: [item.label],
          standardProjectId: [item.value], // 质检指标id
          matchType: [list.length > 0 ? list[index].matchType : '', Validators.required], // 匹配类型
          matchRangList: this.fb.array([])
        })
      )
            
      if (list.length == 0) return
      list[index].matchRangList.forEach((item: { matchRangName: string; statisticsRangName: string; } | undefined) => {
        this.addRange(index, item)
      })
    })
  }

  // 区间类型选择
  matchTypeChange(e: number, i: number) {
    // 每次选择，都要清除所有表单项
    const matchRangList = this.stationCoalStatisticsMathList.at(i).get('matchRangList') as FormArray
    matchRangList.clear()
    // 如果为根据自定义文字，自动添加一项定义区间
    if (e == 2) {
      this.addRange(i)
    }
  }
  
  // 添加定义区间表单项
  addRange(i: number, item = { matchRangName: '', statisticsRangName: '' }) {
    const matchRangList = this.stationCoalStatisticsMathList.at(i).get('matchRangList') as FormArray
    matchRangList.push(
      this.fb.group({
        matchRangName: [item.matchRangName, [Validators.required, Validators.pattern(/^[0-9a-zA-Z\u4e00-\u9fa5]+$/)]],
        statisticsRangName: [item.statisticsRangName, Validators.required],
      })
    )
  }

  // 删除定义区间表单项
  deleteRange(i: number, j: number) {
    const matchRangList = this.stationCoalStatisticsMathList.at(i).get('matchRangList') as FormArray
    matchRangList.removeAt(j)
  }

  outStation() {
    this.outStationSet.emit()
  }

}
