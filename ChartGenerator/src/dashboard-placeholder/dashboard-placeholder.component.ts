import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-dashboard-placeholder',
  imports: [],
  templateUrl: './dashboard-placeholder.component.html',
  styleUrl: './dashboard-placeholder.component.css'
})
export class DashboardPlaceholderComponent {

  @Output() addDashboardClick = new EventEmitter<void>();


  handleAddDashboard() {
      this.addDashboardClick.emit();
    }

}


