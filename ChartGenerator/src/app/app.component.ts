import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChartCreatorFormComponent } from '../chart-creator-form/chart-creator-form.component'


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ChartCreatorFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ChartGenerator';
}
