import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
@Component({
  selector: 'app-employee-name',
  templateUrl: './employee-name.component.html',
  styleUrls: ['./employee-name.component.scss'],
})
export class EmployeeNameComponent implements ICellRendererAngularComp {
  params: any;

  constructor(private router: Router) {}

  agInit(params: any): void {
    this.params = params;
  }
  refresh(params: any): boolean {
    return false;
  }
  openTasks() {
    console.log('click');
    this.router.navigate(['/tasks', this.params.data.id]);
  }
}
