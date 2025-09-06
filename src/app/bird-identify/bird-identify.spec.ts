import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BirdIdentify } from './bird-identify';

describe('BirdIdentify', () => {
  let component: BirdIdentify;
  let fixture: ComponentFixture<BirdIdentify>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BirdIdentify]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BirdIdentify);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
