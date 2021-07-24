import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MpPictureComponent } from './mp-picture.component';

describe('MpPictureComponent', () => {
  let component: MpPictureComponent;
  let fixture: ComponentFixture<MpPictureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MpPictureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MpPictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
