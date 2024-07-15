import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoberGlassToggleComponent } from './sober-glass-toggle.component';

describe('SoberGlassToggleComponent', () => {
  let component: SoberGlassToggleComponent;
  let fixture: ComponentFixture<SoberGlassToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoberGlassToggleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoberGlassToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
