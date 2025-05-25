import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DashboardInfo } from '../Interfaces/dashboard-info';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-control',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-control.component.html',
  styleUrl: './dashboard-control.component.css',
  standalone: true
})
export class DashboardControlComponent {


  //@Input() dashboards: DashboardInfo[] = [];
  ////@Output() countChange = new EventEmitter<number>();
  @Output() showModeChanged = new EventEmitter<boolean>();
  @Output() createChartClicked = new EventEmitter<boolean>();

  @Input() isShowMode: boolean = true;
  @Input() isCreeateChartClicked = false;
  @Input() dashboarScope: string = ""
  @Input() dashboardName: string = "";


  //@Output() generateChartClick = new EventEmitter<void>();
  //@Input() selectedDashboard: string="";
  //@Output() addDashboardClick = new EventEmitter<void>();
  //@Output() selectDashboardChange = new EventEmitter<string>();
  //@Output() saveClicked = new EventEmitter<void>();



  //cancelBtnClick() {
  //  this.isShowMode = true
  //  this.showModeChanged.emit(this.isShowMode)
  //}
  editClick() {

    this.isShowMode = false
    this.showModeChanged.emit(this.isShowMode)
  }
  cancelClicked() {
    this.isShowMode = true
    this.isCreeateChartClicked = false;

    this.showModeChanged.emit(this.isShowMode)
    this.createChartClicked.emit(this.isCreeateChartClicked);


  }
  deleteClick() {

  }
  createChartClick() {
    this.isCreeateChartClicked = true;
    this.createChartClicked.emit(this.isCreeateChartClicked);
  }
  //generateChartBtnClick() {
  //  this.generateChartClick.emit();
  //}
  //handleDashboardChange() {
  //  console.log(this.selectedDashboard)
  //  if (this.selectedDashboard == "AddDashboard") {
  //    this.addDashboardClick.emit();
  //  }
  //  else {
  //    this.selectDashboardChange.emit(this.selectedDashboard)
  //  }
  //}

  //saveChangesCliked() {
  //  this.saveClicked.emit();
  //}
}
