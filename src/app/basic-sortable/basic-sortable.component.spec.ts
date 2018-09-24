import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicSortableComponent } from './basic-sortable.component';

describe('BasicSortableComponent', () => {
  let component: BasicSortableComponent;
  let fixture: ComponentFixture<BasicSortableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicSortableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicSortableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
