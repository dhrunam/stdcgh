import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomCategoryMasterComponent } from './room-category-master.component';

describe('RoomCategoryMasterComponent', () => {
  let component: RoomCategoryMasterComponent;
  let fixture: ComponentFixture<RoomCategoryMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomCategoryMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomCategoryMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
