import { Component, OnInit } from '@angular/core';
import { HomeManageService } from '../home-manage.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { formatDate } from '../../../library/time';
@Component({
  selector: 'app-hero-manage',
  templateUrl: './hero-manage.component.html',
  styleUrls: ['./hero-manage.component.less']
})
export class HeroManageComponent implements OnInit {
  listOfData: any[] = [];
  addHeroModal: boolean = false;
  validateForm: FormGroup
  roleType: any[] = [
    {
      label: '剑士',
      value: 1
    },
    {
      label: '射手',
      value: 2
    },
    {
      label: '坦克',
      value: 3
    },
    {
      label: '法师',
      value: 4
    },
  ]
  positionType: any[] = [
    {
      label: '上单',
      value: 1
    },
    {
      label: '中单',
      value: 2
    },
    {
      label: '打野',
      value: 3
    },
    {
      label: 'ADC',
      value: 4
    },
    {
      label: '辅助',
      value: 5
    },
  ]

  // 多选
  checked = false;
  indeterminate = false;
  listOfCurrentPageData: any[] = []
  setOfCheckedId = new Set<number>();
  constructor(
    private service: HomeManageService,
    private modal: NzModalService,
    private message: NzMessageService,
    private formBuilder: NonNullableFormBuilder
  ) {
    this.validateForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      mobile: ['', [Validators.required]],
      role: ['', [Validators.required]],
      roleName: [''],
      position: ['', [Validators.required]],
      positionName: [''],
      remark: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    let heroData = localStorage.getItem('hero_data')
    if (!heroData) {
      this.getList();
    } else {
      this.listOfData = JSON.parse(heroData)
    }
  }

  // 获取列表
  getList() {
    this.service.getUserList().subscribe(res => {
      this.listOfData = res || [];
      localStorage.setItem('hero_data', JSON.stringify(this.listOfData))
    })
  }

  deleteHero(id: string, name: string) {
    this.modal.confirm({
      nzTitle: `是否确认删除英雄${name}?`,
      nzOkText: '是',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        let index = this.listOfData.find(item => {
          return item['id'] == id;
        })
        this.listOfData.splice(index, 1)
        this.listOfData = [...this.listOfData]
        localStorage.setItem('hero_data', JSON.stringify(this.listOfData))
        this.message.create('success', '删除成功');
      },
      nzCancelText: '否',
      nzOnCancel: () => {
      }
    });
  }

  addHero() {
    this.validateForm.reset();
    this.addHeroModal = true;
  }

  updateHero(data: any) {
    this.addHeroModal = true;
    this.validateForm.patchValue({ ...data })
  }

  addHeroCancel() {
    this.addHeroModal = false;
  }

  addHeroOk() {
    Object.values(this.validateForm.controls).forEach(control => {
      control.markAsDirty();
      control.updateValueAndValidity();
    });
    if (this.validateForm.invalid) {
      return
    }
    const { id, role, position } = this.validateForm.value
    if (id) {
      let index = this.listOfData.findIndex(item => {
        return item['id'] == id;
      })
      const roleItem: any = this.roleType.find((item) => item.value == role)
      const positionItem: any = this.positionType.find((item) => item.value == position)
      this.listOfData[index] = { ...this.validateForm.value, roleName: roleItem.label, positionName: positionItem.label, createTime: formatDate(new Date()) }
    } else {
      let length = this.listOfData.length
      const roleItem: any = this.roleType.find((item) => item.value == role)
      const positionItem: any = this.positionType.find((item) => item.value == position)
      this.listOfData.push({ ...this.validateForm.value, id: length, roleName: roleItem.label, positionName: positionItem.label, createTime: formatDate(new Date()) })
    }
    this.listOfData = [...this.listOfData]
    this.addHeroCancel();
    this.message.create('success', id ? '修改成功' : '添加成功');
    localStorage.setItem('hero_data', JSON.stringify(this.listOfData))
  }


  onCurrentPageDataChange(data: any) {
    this.listOfCurrentPageData = data;
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean) {
    this.listOfCurrentPageData
      .filter(({ disabled }) => !disabled)
      .forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  updateCheckedSet(id: number, checked: boolean) {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }


  refreshCheckedStatus() {
    const listOfEnabledData = this.listOfCurrentPageData.filter(({ disabled }) => !disabled);
    this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
    this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  }

  onItemChecked(id: number, checked: boolean) {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  batchDelete() {
    console.log(this.setOfCheckedId.size)
    if (this.setOfCheckedId.size == 0) {
      this.message.create('warning', '请选择要删除的英雄');
      return
    }
    this.modal.confirm({
      nzTitle: `是否确认进行批量删除?`,
      nzOkText: '是',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.listOfData = this.listOfData.filter(data => !this.setOfCheckedId.has(data.id));
        this.listOfData = [...this.listOfData]
        localStorage.setItem('hero_data', JSON.stringify(this.listOfData))
        this.message.create('success', '批量删除成功');
      },
      nzCancelText: '否',
      nzOnCancel: () => {
      }
    });
  }

}
