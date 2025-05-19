import { Component, Input } from '@angular/core';
import { DashboardPlaceholderComponent } from '../dashboard-placeholder/dashboard-placeholder.component';
import { DashboardControlComponent } from '../dashboard-control/dashboard-control.component';
import { ChartGeneratorComponent } from '../chart-generator/chart-generator.component';
import { DashboardCreatorFormComponent } from '../dashboard-creator-form/dashboard-creator-form.component';
import { DashboardInfo } from '../Interfaces/dashboard-info';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardPlaceholderComponent, DashboardControlComponent, ChartGeneratorComponent, DashboardCreatorFormComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  dashboardCount: number=0
  isShowMode: boolean = true;
  openForm = false
  openCreateDashboard = false
  @Input({ required: true }) getTableNamesByTypeURL = "";
  @Input({ required: true }) getColumnURL = "";
  @Input({ required: true }) getDataURL = "";
  @Input({ required: true }) tableType = "";
  @Input({ required: true }) token: string = "";
  selectedDashboardID: string="" 
  dashboards: DashboardInfo[] = [];
  isSaved: boolean = false
  handleCountChange(count: number) {
    this.dashboardCount = count
  }
  handleGenerateChartClick() {
    this.openForm = true
    setTimeout(() => this.openForm = false, 0);
  }
  handleChangeEditMode(IsEdit: boolean) {
    this.isShowMode = IsEdit
  }
  handleAddDashboard() {
    this.openCreateDashboard = true;
    setTimeout(() => this.openCreateDashboard = false, 1);

  }
  handleSavedDashboard(dashboard: any) {
    console.log(dashboard)
    this.dashboards.push(dashboard);
    this.selectedDashboardID = dashboard.Id
    this.isShowMode = false
  }
  handleselectDashboar(DashboardID: string) {
    this.selectedDashboardID = DashboardID

  }
  handleDontDashboard() {
    console.log("osma")
    this.selectedDashboardID = "";
    console.log(this.selectedDashboardID)

  }

  handleSaveDashboard() {
    this.isSaved = true
  }
}
