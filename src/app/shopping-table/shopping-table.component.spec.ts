import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingTableComponent } from './shopping-table.component';

describe('ShoppingTableComponent', () => {
  let component: ShoppingTableComponent;
  let fixture: ComponentFixture<ShoppingTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShoppingTableComponent]
    });
    fixture = TestBed.createComponent(ShoppingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
