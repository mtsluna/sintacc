import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-next-button',
  imports: [],
  templateUrl: './next-button.component.html',
  standalone: true,
  styleUrl: './next-button.component.scss'
})
export class NextButtonComponent {

  @Input()
  title: string | undefined;

  @Input()
  subtitle: string | undefined;

}
