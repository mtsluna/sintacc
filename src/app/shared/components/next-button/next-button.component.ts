import {Component, inject, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgClass} from '@angular/common';
import {SafeAreaService} from '../../../services/safe-area/safe-area.service';

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
  safeAreaService = inject(SafeAreaService);

  getButtonPositionClass(): string {
    return this.safeAreaService.getBottomButtonPosition();
  }

  protected readonly window = window;
}
