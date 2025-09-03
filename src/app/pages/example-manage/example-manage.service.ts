import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExampleManageService {


  constructor(private http: HttpClient) { }
  // 获取列表
  getUserList(): Observable<any> {
    return this.http.get('assets/list-role.json');
  }

  // 获取列表
  getVip(): Observable<any> {
    return this.http.get('assets/example-form/vip.json');
  }

  // 获取列表
  getinformation(): Observable<any> {
    return this.http.get('assets/example-form/information.json');
  }

  // 获取列表
  getAssayList(): Observable<any> {
    return this.http.get('assets/example-form/assay.json');
  }

}
