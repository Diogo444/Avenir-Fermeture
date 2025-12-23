import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddClient } from './addClient';

describe('AddClient', () => {
  let component: AddClient;
  let fixture: ComponentFixture<AddClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddClient],
    }).compileComponents();

    fixture = TestBed.createComponent(AddClient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
