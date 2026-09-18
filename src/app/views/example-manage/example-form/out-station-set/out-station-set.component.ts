import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ExampleManageService } from '../../example-manage.service';
@Component({
  selector: 'app-out-station-set',
  templateUrl: './out-station-set.component.html',
  styleUrls: ['./out-station-set.component.less']
})
export class OutStationSetComponent implements OnInit {
  // 改变 sectionSetFlag事件
  @Output() outStationSetFlagChange = new EventEmitter()
  // 配煤比例指标配置列表
  @Input() colalQualityItemList: any[] = []
  // 区间范围列表
  @Input() sectionNameList: any[] = []
  // 出站配煤比例配置
  outStationCoalForm: FormGroup

  // 是否激活，true时显示表单
  @Input() active = false;
  // 进入出站配煤配置事件
  @Output() enterOutStation = new EventEmitter();
  // 退出出站配煤配置事件（清除数据时触发）
  @Output() exitOutStation = new EventEmitter();

  constructor(
    private fb: NonNullableFormBuilder,
    public service: ExampleManageService,
  ) {
    this.outStationCoalForm = this.fb.group({
      stationCoalStatisticsMathList: this.fb.array([

      ]),
    })
  }

  get stationCoalStatisticsMathList(): FormArray { return this.outStationCoalForm.get("stationCoalStatisticsMathList") as FormArray }


  getMatchRangListControls(outStationIndex: number): FormArray {
    return this.stationCoalStatisticsMathList.at(outStationIndex).get('matchRangList') as FormArray;
  }

  ngOnInit() {

  }

  // 清除数据
  clearData() {
    this.stationCoalStatisticsMathList.clear()
    this.exitOutStation.emit()
  }

  // 区间类型选择
  matchTypeChange(e: number, i: number) {
    // 每次选择，都要清除所有表单项
    const matchRangList = this.stationCoalStatisticsMathList.at(i).get('matchRangList') as FormArray
    matchRangList.clear()
    // 如果为根据自定义文字，自动添加一项定义区间
    if (e == 2) {
      this.addMatchRange(i)
    }
  }

  // 删除定义区间表单项
  deleteMatchRange(i: number, j: number) {
    const matchRangList = this.stationCoalStatisticsMathList.at(i).get('matchRangList') as FormArray
    matchRangList.removeAt(j)
  }

  outStation() {
    if (this.active) {
      return
    }
    this.enterOutStation.emit();
  }


  // 根据选中配煤比例指标配置生成出站配煤比例配置
  buildOutStation(options: { mode: 'add' | 'edit', data?: any[] } = { mode: 'add' }) {
    const { mode, data = [] } = options;
    const checkedQualityNameList = this.colalQualityItemList.filter(item => item.checked)
    checkedQualityNameList.forEach((indicator, index) => {
      const selectItem = data.find(item => item.standardProjectId === indicator.value);
      this.stationCoalStatisticsMathList.push(
        this.createMatchGroup(indicator, selectItem)
      )

      if (selectItem?.matchType == 2 && mode === 'edit' && selectItem.matchRangList?.length > 0) {
        selectItem.matchRangList.forEach((rangeItem: { matchRangName: string; statisticsRangName: string; }) => {
          this.addMatchRange(index, rangeItem)
        })
      }
    })
  }

  // 创建配煤比例匹配表单组
  createMatchGroup(indicator: { label: string; value: any }, patch?: { matchType?: any; matchRangList?: any[] }) {
    return this.fb.group({
      label: [indicator.label],
      standardProjectId: [indicator.value],
      matchType: [patch?.matchType ?? '', Validators.required],
      matchRangList: this.fb.array([]),
    });
  }


  // 添加定义区间表单项
  addMatchRange(i: number, item = { matchRangName: '', statisticsRangName: '' }) {
    const matchRangList = this.stationCoalStatisticsMathList.at(i).get('matchRangList') as FormArray
    matchRangList.push(
      this.fb.group({
        matchRangName: [item.matchRangName, [Validators.required, Validators.pattern(/^[0-9a-zA-Z\u4e00-\u9fa5]+$/)]],
        statisticsRangName: [item.statisticsRangName, Validators.required],
      })
    )
  }

}
