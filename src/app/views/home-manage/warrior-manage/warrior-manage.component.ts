import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HomeManageService } from '../home-manage.service';
import { TableColumn, TableComponent } from 'src/app/shared/components/table/table.component';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { formatDate } from 'src/app/library/time';
const HERO_STORAGE_KEY = 'hero_data';

@Component({
  selector: 'app-warrior-manage',
  templateUrl: './warrior-manage.component.html',
  styleUrls: ['./warrior-manage.component.less']
})
export class WarriorManageComponent implements OnInit {
  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;

  // 获取共享表格组件实例，用于调用其公开方法
  @ViewChild(TableComponent) tableComponent!: TableComponent;

  /** 全量数据（数据源） */
  allHeroes: any[] = [];
  /** 当前页数据（仅用于表格展示） */
  listOfData: any[] = [];
  columns: TableColumn[] = [];

  // 分页 相关
  showPagination = true
  loading = false;
  pageIndex = 1;
  pageSize = 10;
  total = 0;

  // checkbox 相关
  showCheckbox = true;
  rowKey = 'id';
  selectedIds: any[] = [];        // 用于接收选中 id
  selectedRows: any[] = [];       // 用于接收选中行数据
  isRowDisabled = (row: any) => row.status === '禁用'; // 示例：禁用状态不可选


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
    // 初始化列定义
    this.columns = [
      { title: '姓名', key: 'name' },
      { title: '手机号', key: 'mobile' },
      { title: '角色', key: 'roleName' },
      { title: '位置', key: 'positionName' },
      { title: '状态', key: 'status', template: this.statusTemplate },
      { title: '备注', key: 'remark' , ellipsis: true },
      { title: '添加时间', key: 'createTime' },
    ];

    let localHeroes = this.loadHeroes()
    if (localHeroes.length > 0) {
      this.allHeroes = localHeroes;
      this.applyTablePage();
    } else {
      this.fetchHeroes();
    }
  }

  loadHeroes() {
    const data = localStorage.getItem(HERO_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveHeroes(heroes: any[]) {
    this.allHeroes = heroes;
    localStorage.setItem(HERO_STORAGE_KEY, JSON.stringify(heroes));
  }

  applyTablePage() {
    this.total = this.allHeroes.length;
    const maxPage = Math.max(1, Math.ceil(this.total / this.pageSize));
    if (this.pageIndex > maxPage) {
      this.pageIndex = maxPage;
    }
    const start = (this.pageIndex - 1) * this.pageSize;
    this.listOfData = this.allHeroes.slice(start, start + this.pageSize);
  }

  fetchHeroes() {
    this.loading = true;
    this.service.getUserList().subscribe(res => {
      this.saveHeroes(res || []);
      this.applyTablePage();
      this.loading = false;
    });
  }

  onPageIndexChange(index: number) {
    this.pageIndex = index;
    this.applyTablePage();
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.pageIndex = 1;
    this.applyTablePage();
  }


  deleteHero(id: string, name: string) {
    this.modal.confirm({
      nzTitle: `是否确认删除英雄${name}?`,
      nzOkText: '是',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        const heroes = this.allHeroes.filter(item => item.id != id);
        this.saveHeroes(heroes);
        this.message.create('success', '删除成功');
        this.applyTablePage();
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
    const roleItem: any = this.roleType.find((item) => item.value == role)
    const positionItem: any = this.positionType.find((item) => item.value == position)
    let heroData = this.allHeroes
    if (id) {
      let index = heroData.findIndex((item: { [x: string]: any; }) => {
        return item['id'] == id;
      })
      heroData[index] = {
        ...this.validateForm.value,
        roleName: roleItem.label,
        positionName: positionItem.label,
        createTime: formatDate(new Date())
      }

    } else {
      const nextId = heroData.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
      heroData.push({
        ...this.validateForm.value,
        id: nextId,
        roleName: roleItem.label,
        positionName: positionItem.label,
        createTime: formatDate(new Date())
      })
    }
    this.saveHeroes(heroData);
    this.applyTablePage();
    this.addHeroCancel();
    this.message.create('success', id ? '修改成功' : '添加成功');
  }

  // checkbox 事件
  onCheckedIdsChange(ids: any[]) {
    this.selectedIds = ids;
    console.log('选中的 ids:', ids);
  }

  onCheckedRowsChange(rows: any[]) {
    this.selectedRows = rows;
    console.log('选中的行数据:', rows);
  }

  batchDelete() {
    const idSet = new Set(this.selectedIds.map(id => String(id)));
    if (idSet.size == 0) {
      this.message.create('warning', '请选择要删除的英雄');
      return
    }
    this.modal.confirm({
      nzTitle: `是否确认进行批量删除?`,
      nzOkText: '是',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        
        const heroes = this.allHeroes.filter(item => !idSet.has(String(item.id)));
        this.saveHeroes(heroes);
        this.applyTablePage();
        this.clearAllSelection();
        this.message.create('success', '批量删除成功');
      },
      nzCancelText: '否',
      nzOnCancel: () => {
      }
    });
  }
  
  // 调用子组件的 clearSelection 方法清空所有选中
  clearAllSelection() {
    // 确保子组件实例已存在
    if (this.tableComponent) {
      this.tableComponent.clearSelection();
    }
  }

  // 调用子组件的 setSelectedKeys 方法设置选中项（例如选中 id 为 1、3、5 的行）
  setSomeSelection() {
    if (this.tableComponent) {
      this.tableComponent.setSelectedKeys([1, 3, 5]);
    }
  }


}
