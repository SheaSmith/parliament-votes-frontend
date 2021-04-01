import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotesBarComponent } from './votes-bar.component';

describe('VotesBarComponent', () => {
  let component: VotesBarComponent;
  let fixture: ComponentFixture<VotesBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VotesBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VotesBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
