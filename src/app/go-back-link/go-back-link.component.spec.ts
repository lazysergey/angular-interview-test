import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoBackLinkComponent } from './go-back-link.component';

describe('GoBackLinkComponent', () => {
  let component: GoBackLinkComponent;
  let fixture: ComponentFixture<GoBackLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoBackLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoBackLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
