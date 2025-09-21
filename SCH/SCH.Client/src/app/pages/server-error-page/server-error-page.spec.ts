import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerErrorPage } from './server-error-page';

describe('ServerErrorPage', () => {
  let component: ServerErrorPage;
  let fixture: ComponentFixture<ServerErrorPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ServerErrorPage ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServerErrorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
