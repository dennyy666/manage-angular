import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, NonNullableFormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { ExampleManageService } from '../../example-manage.service';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-section-configuration',
  templateUrl: './section-configuration.component.html',
  styleUrls: ['./section-configuration.component.less']
})
export class SectionConfigurationComponent implements OnInit {
  // 区间配置表单对象
  stationQualityForm: FormGroup
  // 配煤比例指标配置列表
  @Input() colalQualityItemList: any[] = []
  // 是否已进入区间配置（为 true 时展示表单，且不再重复触发进入）
  @Input() active: boolean = false
  // 是否锁定区间增删（出站配煤比例配置后为 true，隐藏新增/删除）
  @Input() locked: boolean = false

  // 进入区间配置（通知父组件将步骤切到 section）
  @Output() enterSection = new EventEmitter();
  // 退出区间配置（区间全部删除后通知父组件将步骤切回 dataList）
  @Output() exitSection = new EventEmitter();

  constructor(
    private fb: NonNullableFormBuilder,
    public service: ExampleManageService,
    private msg: NzMessageService,
  ) {
    this.stationQualityForm = this.fb.group({
      stationCoalStatisticsRangList: this.fb.array([]),
    })
  }


  get stationCoalStatisticsRangList(): FormArray { return this.stationQualityForm.get("stationCoalStatisticsRangList") as FormArray }


  getQualityRangListControls(stationIndex: number): FormArray {
    return this.stationCoalStatisticsRangList.at(stationIndex).get('qualityRangList') as FormArray;
  }

  ngOnInit() {

  }

  // 区间配置
  sectionSet() {
    if (this.active) {
      return
    }
    if (!this.colalQualityItemList?.some(item => item.checked)) {
      this.msg.warning('请选择配煤比例指标配置')
      return
    }
    this.enterSection.emit()
    this.buildSection()
  }

  // 区间配置表单项添加
  buildSection(options: { mode: 'add' | 'edit', data?: any } = { mode: 'add' }) {
    const { mode, data = { statisticsRangName: null, inventory: null, qualityRangList: [] } } = options;
    const qualityRangList = mode === 'edit' ? (data.qualityRangList || []) : [];
    this.stationCoalStatisticsRangList.push(
      this.fb.group({
        statisticsRangName: [data.statisticsRangName, [Validators.required, Validators.pattern(/^[0-9a-zA-Z一-龥]+$/)]], // 区间名称
        inventory: [data.inventory, [Validators.required, Validators.min(0), Validators.max(10000000 - 0.01)]], // 当前库存
        qualityRangList: this.fb.array(this.getQualityArray({ mode, data: qualityRangList }))
      })
    )
    this.setQualityValidators()
  }

  // 根据选中配煤比例指标配置生成动态指标项
  getQualityArray(options: { mode: 'add' | 'edit', data?: any[] } = { mode: 'add' }) {
    const { mode, data = [] } = options;
    const checkedQualityNameList = this.colalQualityItemList.filter(item => item.checked)
    return checkedQualityNameList.map((item, index) => {
      const historicalData = data.find(
        (q) => q.standardProjectId === item.value
      )
      return this.fb.group({
        standardProjectId: [item.value],
        standardProject: [item.label],
        beginStandardValue: [mode === 'edit' ? historicalData.beginStandardValue : null],
        endStandardValue: [mode === 'edit' ? historicalData.endStandardValue : null],
        beginValue: [item.beginValue],
        endValue: [item.endValue],
      })
    })
  }


  // 区间配置指标范围设置
  setQualityValidators() {
    const stationQualityControls = this.stationCoalStatisticsRangList.controls
    stationQualityControls.forEach((station, i) => {
      const qualityControls = (station.get('qualityRangList') as FormArray).controls;
      qualityControls.forEach((control: AbstractControl, j: number) => {
        const controlGroup = control as FormGroup;
        const beginValue = controlGroup.get('beginValue')?.value
        const endValue = controlGroup.get('endValue')?.value
        controlGroup.get('beginStandardValue')?.setValidators([Validators.required, Validators.min(beginValue), Validators.max(endValue), this.validateRange(i, j, 'beginValue', 'endStandardValue', { min: beginValue, max: endValue })]);
        controlGroup.get('endStandardValue')?.setValidators([Validators.required, Validators.min(beginValue), Validators.max(endValue), this.validateRange(i, j, 'endValue', 'beginStandardValue', { min: beginValue, max: endValue })]);
      })
    })

  }

  // 指标验证器（开始区间不能大于结束区间）
  validateRange(i: number, j: number, type: string, key: string, objRanage: { min: any; max: any; }): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let compareFlag = false
      const stationQualityControl = this.stationCoalStatisticsRangList.at(i) as FormGroup
      const qualityRangControl = stationQualityControl.get('qualityRangList') as FormArray
      const controlValue = control.value
      const compareValue = qualityRangControl.at(j).get(key)?.value

      const t1 = [null, ''].includes(controlValue) || [null, ''].includes(compareValue)
      const t2 = +controlValue < objRanage.min || +controlValue > objRanage.max
      const t3 = controlValue === compareValue
      // 如果满足t1 t2任一条件，不做比较
      if (t1 || t2 || t3) {
        compareFlag = false;
        if (t3) {
          this.updateIndexValidity(qualityRangControl, j, key)
        }
      } else {
        if (this.numberCompare(+control.value, +compareValue, type)) {
          compareFlag = false
          this.updateIndexValidity(qualityRangControl, j, key)
        } else {
          compareFlag = true;
        }
      }
      return compareFlag ? { errorNumber: true } : {};
    };
  }

  // 根据type比较大小
  numberCompare(value1: number, value2: number, type: string) {
    if (type == 'beginValue') {
      return value1 < value2
    } else {
      return value1 > value2
    }
  }

  updateIndexValidity(control: FormArray, index: number, key: string) {
    if (control.at(index).get(key)?.invalid) {
      control.at(index).get(key)?.updateValueAndValidity();
    }
  }


  // 区间配置表单项删除
  deleteSection(index: number) {
    this.stationCoalStatisticsRangList.removeAt(index);
    this.setQualityValidators()
    if (this.stationCoalStatisticsRangList.controls.length == 0) {
      this.exitSection.emit()
    }
  }

  // 区间配置设置
  sectionConfigurationSet(list: any[]) {
    list.forEach(item => {
      this.buildSection({ mode: 'edit', data: item })
    })
  }


}
