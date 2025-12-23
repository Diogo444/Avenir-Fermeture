import { ComponentFixture, TestBed } from '@angular/core/testing';
import { General } from './general';

describe('General', () => {
  let component: General;
  let fixture: ComponentFixture<General>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [General],
    }).compileComponents();

    fixture = TestBed.createComponent(General);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
