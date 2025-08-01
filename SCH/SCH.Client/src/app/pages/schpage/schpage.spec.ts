import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SCHPage } from './schpage';

describe('SCHPage', () => {
  let component: SCHPage;
  let fixture: ComponentFixture<SCHPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SCHPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SCHPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
