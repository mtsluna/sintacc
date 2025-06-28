import { Component } from '@angular/core';
import { SpinnerService } from '../../../services/spinner/spinner.service';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  imports: [
    AsyncPipe
  ],
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {
  constructor(public spinnerService: SpinnerService) {
    console.log('SpinnerComponent initialized');
  }
}
