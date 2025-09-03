import { Component, OnInit, ViewChild } from '@angular/core';
import { ExampleManageService } from '../example-manage.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DataConfigurationComponent } from './data-configuration/data-configuration.component';
import { SectionConfigurationComponent } from './section-configuration/section-configuration.component';
import { OutStationSetComponent } from './out-station-set/out-station-set.component';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { filter, lastValueFrom, take } from 'rxjs';
@Component({
  selector: 'app-example-form',
  templateUrl: './example-form.component.html',
  styleUrls: ['./example-form.component.less']
})
export class ExampleFormComponent implements OnInit {
  // 数据配置子组件引用
  @ViewChild('DataConfigurationComponent') dataConfigurationComponent!: DataConfigurationComponent;
  // 区间配置子组件引用
  @ViewChild('SectionConfigurationComponent') sectionConfigurationComponent!: SectionConfigurationComponent;
  // 出站配煤子组件引用
  @ViewChild('OutStationSetComponent') outStationSetComponent!: OutStationSetComponent;
  // 站台化验结果配置列表
  stationQualityItemList: any[] = []
  // 配煤比例指标配置列表
  colalQualityItemList: any[] = []
  // 区间配置
  sectionSetFlag: boolean = false
  // 出站配煤比例配置
  outStationSetFlag: boolean = false
  // 区间范围列表
  sectionNameList: any[] = []
  // 确认取消对话框
  cancelModalFlag: boolean = false
  // 数据提交对话框
  isVisible: boolean = false
  // 判断是添加或者编辑操作
  firstAddFlag: boolean = false

  constructor(
    public service: ExampleManageService,
    private msg: NzMessageService,
    private modal: NzModalService,
  ) {

  }

  ngOnInit() {

  }

  // 判断区间名称是否重复
  sectionNameRepeat() {
    const { stationCoalStatisticsRangList } = this.sectionConfigurationComponent.stationQualityForm.value
    const res: string[] = []
    for (let i = 0; i < stationCoalStatisticsRangList.length; i++) {
      const sectionName = stationCoalStatisticsRangList[i].statisticsRangName
      if (res.includes(sectionName)) {
        return sectionName
      }
      res.push(sectionName)
    }
    return null
  }

  // 判断区间是否重复
  sectionIsRepeat() {
    const { stationCoalStatisticsRangList } = this.sectionConfigurationComponent.stationQualityForm.value
    let standardProject = ''
    const length = stationCoalStatisticsRangList[0].qualityRangList.length
    let res = []
    top:
    for (let i = 0; i < stationCoalStatisticsRangList.length - 1; i++) {
      for (let j = i + 1; j < stationCoalStatisticsRangList.length; j++) {
        res = []
        for (let index = 0; index < length; index++) {
          const a = stationCoalStatisticsRangList[i].qualityRangList[index]
          const b = stationCoalStatisticsRangList[j].qualityRangList[index]
          if (this.isNumberInInterval(+a.beginStandardValue, +a.endStandardValue, +b.beginStandardValue, +b.endStandardValue)) {
            standardProject = a.standardProject
            res.indexOf(a.standardProject) == -1 && res.push(standardProject)
            console.log('res', res)
            if (res.length == length) {
              break top;
            }
          }
        }
      }
    }
    return res.length == length ? res : []
  }

  isNumberInInterval(a1: number, a2: number, b1: number, b2: number) {
    const t1 = b1 >= a1 && b1 <= a2;
    const t2 = b2 >= a1 && b2 <= a2;
    const t3 = a1 >= b1 && a1 <= b2;
    const t4 = a2 >= b1 && a2 <= b2;
    const t5 = a1 == a2 && b1 == b2;
    return (t1 && t2) || (t3 && t4) || t5
  }

  // 出站配煤比例配置
  onOutStationSet(list = []) {
    const valid = this.sectionVerificationValid()
    if (valid === false) {
      return
    }
    this.outStationSetFlag = true;
    this.sectionConfigurationComponent.stationQualityForm.disable();
    this.sectionNameList = this.sectionConfigurationComponent.stationCoalStatisticsRangList.controls.map((item) => {
      return item.get('statisticsRangName')?.value
    })
    this.outStationSetComponent.addOutStation(list)
  }

  // 区间配置是否合法 true:合法 false:不合法 
  sectionVerificationValid(): boolean {
    if (!this.sectionSetFlag) {
      this.msg.warning('请先进行区间配置～')
      return false
    }

    const sectionName = this.sectionNameRepeat()
    if (sectionName) {
      this.msg.warning('区间名称重复：' + sectionName)
      return false
    }

    const standardProject = this.sectionIsRepeat()
    if (standardProject.length > 0) {
      this.msg.warning('区间重复：' + standardProject.join('、'))
      return false
    }

    // 出站配煤比例配置禁止重复点击（标题变为黑色时不可点击）
    if (this.outStationSetFlag) {
      return false
    }

    const controls = this.sectionConfigurationComponent.stationCoalStatisticsRangList.controls;
    Object.values(controls).forEach(controlGroup => {
      Object.values((controlGroup as FormGroup).controls).forEach(formControl => {
        formControl.markAsDirty();
        formControl.updateValueAndValidity();
      });
      const qualityGroups = (controlGroup.get('qualityRangList') as FormArray).controls;
      Object.values(qualityGroups).forEach(qualityGroup => {
        Object.values((qualityGroup as FormGroup).controls).forEach(qualityControl => {
          qualityControl.markAsDirty();
          qualityControl.updateValueAndValidity();
        });
      });
    });

    if (this.sectionConfigurationComponent.stationQualityForm.invalid) {
      return false
    }
    return true
  }

  // 确认按钮（表单校验）
  async formVerify() {
    const dataConfigurationForm = this.dataConfigurationComponent.validateForm;
    Object.values(dataConfigurationForm.controls).forEach(control => {
      control.markAsDirty();
      control.updateValueAndValidity();
    });

    if (dataConfigurationForm.pending) {
      await lastValueFrom(
        dataConfigurationForm.statusChanges.pipe(
          filter(status => status !== 'PENDING'),
          take(1)
        )
      );
    }

    if (dataConfigurationForm.invalid) {
      return
    }

    const controls = this.outStationSetComponent.stationCoalStatisticsMathList.controls;
    Object.values(controls).forEach(controlGroup => {
      Object.values((controlGroup as FormGroup).controls).forEach(formControl => {
        formControl.markAsDirty();
        formControl.updateValueAndValidity();
      });
      const qualityGroups = (controlGroup.get('matchRangList') as FormArray).controls;
      Object.values(qualityGroups).forEach(qualityGroup => {
        Object.values((qualityGroup as FormGroup).controls).forEach(qualityControl => {
          qualityControl.markAsDirty();
          qualityControl.updateValueAndValidity();
        });
      });
    });

    if (this.outStationSetComponent.outStationCoalForm.invalid) {
      return
    }
    const { stationCoalStatisticsMathList } = this.outStationSetComponent.outStationCoalForm.value
    const sectionName = this.sectionNameIsRepeat(stationCoalStatisticsMathList)
    if (!!sectionName) {
      this.msg.warning('定义区间重复:' + sectionName)
      return
    }
    this.formConfirm()
  }

  //判断定义区间是否重复
  sectionNameIsRepeat(list: string | any[]) {
    let repeatName = ''
    top:
    for (let i = 0; i < list.length; i++) {
      const item = list[i].matchRangList
      const arr = item.map((item: { matchRangName: any; }) => item.matchRangName)
      const sarr = arr.sort();
      for (let i = 0; i < sarr.length; i++) {
        if (sarr[i] == sarr[i + 1]) {
          repeatName = sarr[i]
          break top;
        }
      }

    }
    return repeatName
  }


  formConfirm() {
    this.modal.confirm({
      nzTitle: `请确认数据无误后提交`,
      nzOkText: '是',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.submit()
      },
      nzCancelText: '否',
      nzOnCancel: () => {
      }
    });
  }

  // 调用添加数据来源配置接口
  submit() {
    const sectionList: any = []
    const outStationList: any = []
    const { sourceType, vipMobile, ownerMobile } = this.dataConfigurationComponent.validateForm.value
    const { stationCoalStatisticsRangList } = this.sectionConfigurationComponent.stationQualityForm.value
    const { stationCoalStatisticsMathList } = this.outStationSetComponent.outStationCoalForm.value
    stationCoalStatisticsRangList.forEach((item: { statisticsRangName: any; inventory: any; qualityRangList: any[]; }) => {
      const temp = {
        statisticsRangName: item.statisticsRangName,
        inventory: item.inventory,
        qualityRangList: [] as any
      }
      item.qualityRangList.forEach((data) => {
        temp.qualityRangList.push({
          beginStandardValue: data.beginStandardValue,
          endStandardValue: data.endStandardValue,
          standardProject: data.standardProject,
          standardProjectId: data.standardProjectId,
        })
      })
      sectionList.push(temp)
    })

    stationCoalStatisticsMathList.forEach((item: { matchType: any; standardProjectId: any; matchRangList: any[]; }) => {
      const temp = {
        matchType: item.matchType,
        standardProjectId: item.standardProjectId,
        matchRangList: [] as any
      }
      item.matchRangList.forEach((data) => {
        temp.matchRangList.push({
          matchRangName: data.matchRangName,
          statisticsRangName: data.statisticsRangName,
        })
      })
      outStationList.push(temp)
    })

    const stationQualityConfList = this.stationQualityItemList.filter(item => item.checked).map((item) => {
      return { standardProject: item.label, standardProjectId: item.value, beginValue: item.beginValue, endValue: item.endValue }
    })

    const coalBlendingQualityConfList = this.colalQualityItemList.filter(item => item.checked).map((item) => {
      return { standardProject: item.label, standardProjectId: item.value, beginValue: item.beginValue, endValue: item.endValue }
    })

    const params = {
      sourceType,
      vipMobile,
      ownerMobile,
      stationQualityConfList,
      coalBlendingQualityConfList,
      stationCoalStatisticsRangList: sectionList,
      stationCoalStatisticsMathList: outStationList,
    }
    console.log('params', params)
    localStorage.setItem('coal_data', JSON.stringify(params))
    this.msg.success('提交成功');
  }

  // 获取详情
  getDetails() {
    const coalData = localStorage.getItem('coal_data')
    if (coalData) {
      const data = JSON.parse(coalData)
      const { sourceType, vipMobile, ownerMobile } = data
      this.dataConfigurationComponent.validateForm.patchValue({
        sourceType,
        vipMobile,
        ownerMobile
      })

      const selectStationList = (data.stationQualityConfList || []).map((item: { standardProjectId: any; }) => item.standardProjectId)
      this.stationQualityItemList = this.stationQualityItemList.map((item) => {
        return { ...item, checked: selectStationList.includes(item.value) }
      })

      const colalQualityList = (data.coalBlendingQualityConfList || []).map((item: { standardProjectId: any; }) => item.standardProjectId)
      this.colalQualityItemList = this.colalQualityItemList.map((item) => {
        return { ...item, checked: colalQualityList.includes(item.value) }
      })
      setTimeout(() => {
        this.sectionConfigurationComponent.sectionConfigurationSet(data.stationCoalStatisticsRangList)
        this.onOutStationSet(data.stationCoalStatisticsMathList)
      }, 0);
    }
  }

  onClearData() {
    this.sectionConfigurationComponent.stationQualityForm.enable();
  }

}
