import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TowerFormComponent } from './tower-form.component';

describe('TowerFormComponent', () => {
  let component: TowerFormComponent;
  let fixture: ComponentFixture<TowerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TowerFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TowerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
