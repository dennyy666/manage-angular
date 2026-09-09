import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';

export interface TableColumn {
  title: string;                 // 列标题
  key: string;                   // 数据字段名
  width?: string;                // 列宽，如 '100px' 或 '10%'
  template?: TemplateRef<any>;   // 自定义单元格模板
  /** 文本对齐方式，可选 'left' | 'center' | 'right'，默认为左对齐 */
  align?: 'left' | 'center' | 'right';
  /** 是否启用文本省略和 Tooltip（仅对默认文本单元格生效） */
  ellipsis?: boolean;  
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.less']
})
export class TableComponent implements OnInit {
  @Input() listOfData: any[] = []; // 表格数据源（当前页的数据）
  @Input() columns: TableColumn[] = []; // 列配置数组，定义表格的列
  @Input() bordered = false;      // 是否显示边框

  @Input() showPagination = true; // 是否显示分页
  @Input() frontPagination = false; // 是否前端分页
  @Input() loading = false; // 加载状态，为 true 时显示加载动画
  @Input() pageIndex = 1; // 当前页码（从 1 开始）
  @Input() pageSize = 10; // 每页显示条数
  @Input() total = 0; // 数据总条数
  
  @Input() actionColumnTemplate?: TemplateRef<any>; // 操作列模板（可选），传入后表格右侧会显示“操作”列


  // checkbox 相关输入
  @Input() showCheckbox = false;                 // 是否显示选择列
  @Input() rowKey: string = 'id';                // 行唯一标识字段
  @Input() checkedIds: any[] = [];               // 受控选中项（外部传入）
  @Input() isRowDisabled?: (row: any) => boolean; // 判断行是否禁用

  // page相关事件
  @Output() pageIndexChange = new EventEmitter<number>(); // 页码变化事件，参数为新页码
  @Output() pageSizeChange = new EventEmitter<number>(); // 每页条数变化事件，参数为新条数

  // checkbox 相关输出
  @Output() checkedIdsChange = new EventEmitter<any[]>(); // 选中项 key 数组变化事件，参数为选中的 key 列表
  @Output() checkedRowsChange = new EventEmitter<any[]>(); //选中行数据变化事件，参数为选中的行数据列表

  // 内部状态
  private checkedSet = new Set<any>();           // 当前选中的 key 集合
  private currentPageData: any[] = [];           // 当前页数据
  checked = false;                               // 表头 checkbox 是否全选
  indeterminate = false;                         // 表头 checkbox 是否半选

  constructor() { }

  ngOnInit() {
    
  }

  ngOnChanges(changes: SimpleChanges) {
    // 当外部传入的 checkedIds 变化时，同步内部 Set
    if (changes['checkedIds'] && !changes['checkedIds'].firstChange) {
      this.checkedSet = new Set(this.checkedIds);
      this.refreshCheckedStatus();
    }
  }

  // 获取是否显示操作列 
  get showActionColumn() {
    return !!this.actionColumnTemplate;
  }

  
  onPageIndexChange(index: number) {
    this.pageIndexChange.emit(index);
  }

  onPageSizeChange(size: number) {
    this.pageSizeChange.emit(size);
  }

  // 表格当前页数据变化时触发
  onCurrentPageDataChange(data:any) {
    this.currentPageData = data;
    this.refreshCheckedStatus();
  }

  // 刷新表头 checkbox 状态
  refreshCheckedStatus() {
    if (!this.showCheckbox) {
      this.checked = false;
      this.indeterminate = false;
      return;
    }

    // 过滤掉禁用行
    const enabledData = this.currentPageData.filter(row => !this.isRowDisabled || !this.isRowDisabled(row));
    if (enabledData.length === 0) {
      this.checked = false;
      this.indeterminate = false;
      return;
    }

    const allChecked = enabledData.every(row => this.checkedSet.has(this.getRowKey(row)));
    const someChecked = enabledData.some(row => this.checkedSet.has(this.getRowKey(row)));

    this.checked = allChecked;
    this.indeterminate = !allChecked && someChecked;
  }

  // 获取行的唯一 key
  getRowKey(row: any){
    return row[this.rowKey];
  }

  // 判断某行是否选中
  isChecked(row: any) {
    return this.checkedSet.has(this.getRowKey(row));
  }

  // 单行 checkbox 变化
  onItemChecked(row: any, checked: boolean) {
    const key = this.getRowKey(row);
    if (checked) {
      this.checkedSet.add(key);
    } else {
      this.checkedSet.delete(key);
    }
    this.refreshCheckedStatus();
    this.emitCheckedChanges();
  }

  // 表头全选/取消全选
  onAllChecked(checked: boolean) {
    // 只操作当前页且非禁用的行
    const enabledData = this.currentPageData.filter(row => !this.isRowDisabled || !this.isRowDisabled(row));
    enabledData.forEach(row => {
      const key = this.getRowKey(row);
      if (checked) {
        this.checkedSet.add(key);
      } else {
        this.checkedSet.delete(key);
      }
    });
    this.refreshCheckedStatus();
    this.emitCheckedChanges();
  }

  // 发出选中变化事件
  emitCheckedChanges() {
    const selectedIds = Array.from(this.checkedSet);
    const selectedRows = this.listOfData.filter(row => this.checkedSet.has(this.getRowKey(row)));
    this.checkedIdsChange.emit(selectedIds);
    this.checkedRowsChange.emit(selectedRows);
  }

  // 公开方法：清空所有选中项
  clearSelection() {
    this.checkedSet.clear();
    this.refreshCheckedStatus();
    this.emitCheckedChanges();
  }

  // 公开方法：设置选中项（传入 key 数组）
  setSelectedKeys(keys: any[]) {
    this.checkedSet = new Set(keys);
    this.refreshCheckedStatus();
    this.emitCheckedChanges();
  }

}
