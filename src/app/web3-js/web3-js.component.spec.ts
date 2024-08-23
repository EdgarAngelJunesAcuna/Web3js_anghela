import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Web3JsComponent } from './web3-js.component';

describe('Web3JsComponent', () => {
  let component: Web3JsComponent;
  let fixture: ComponentFixture<Web3JsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Web3JsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Web3JsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
