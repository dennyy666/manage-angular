/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HomeManageService } from './home-manage.service';

describe('Service: HomeManage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HomeManageService]
    });
  });

  it('should ...', inject([HomeManageService], (service: HomeManageService) => {
    expect(service).toBeTruthy();
  }));
});
