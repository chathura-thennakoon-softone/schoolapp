import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralContainer } from './general-container';

describe('GeneralContainer', () => {
  let component: GeneralContainer;
  let fixture: ComponentFixture<GeneralContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
