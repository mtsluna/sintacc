import {Component, Input} from '@angular/core';
import {CardComponent} from '../../components/card/card.component';

@Component({
  selector: 'app-recommendation',
  imports: [
    CardComponent
  ],
  templateUrl: './recommendation.component.html',
  standalone: true,
  styleUrl: './recommendation.component.scss'
})
export class RecommendationComponent {

  @Input() title: string | undefined;
  @Input() category: string | undefined;

}
