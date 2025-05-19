import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DashboardInfo } from '../Interfaces/dashboard-info';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-create-dashboard-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-creator-form.component.html',
  styleUrl: './dashboard-creator-form.component.css'
})
export class DashboardCreatorFormComponent implements OnChanges {
  @Input() openRequested = false
  dashboard: DashboardInfo = {
      Name: "",
      Id: '',
      Description: ''
  }
@Output() saveDashboard = new EventEmitter<DashboardInfo>();
  @Output() dontDashboard = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges)  {
    if (changes['openRequested'] && this.openRequested) {
      this.openModal();
    }
  }
  restForm() {
    this.dashboard = {
      Name: "",
      Id: '',
      Description: ''
    }
  }
    openModal() {
    (window as any).$('#dashboaedModal').modal('show');

  }
  saveDashboardClicked() {
    this.dashboard.Id = uuidv4();

    this.saveDashboard.emit(this.dashboard);
    (window as any).$('#dashboaedModal').modal('hide');
    this.restForm();

  }
  dontSaveClicked() {
    this.restForm();
    this.dontDashboard.emit()
  }

  DisableSave() {
    if (this.dashboard.Description == "" && this.dashboard.Name == "") {
      return true
    }
    return false
  }
}
