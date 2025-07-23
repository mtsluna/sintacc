import {Component, inject, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-next-button',
  imports: [
    NgClass
  ],
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
  disabled: boolean = false;

  @Input()
  action: () => void | Promise<void> = () => {};

  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

}
