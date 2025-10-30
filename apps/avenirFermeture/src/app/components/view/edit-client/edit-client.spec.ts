import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditClient } from './edit-client';

describe('EditClient', () => {
  let component: EditClient;
  let fixture: ComponentFixture<EditClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditClient],
    }).compileComponents();

    fixture = TestBed.createComponent(EditClient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
