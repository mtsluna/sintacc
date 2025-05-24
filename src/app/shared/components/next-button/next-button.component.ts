import {Component, inject, Input} from '@angular/core';
import {Router} from '@angular/router';

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

  @Input()
  action: () => void = () => {}

  router = inject(Router);

}
