import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { EmployeeNameComponent } from '../employee-name/employee-name.component';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  public gridApi: any;
  public gridColumnApi: any;
  public columnDefs: any;
  public defaultColDef: any;
  public rowData: any = [];
  public searchValue = '';
  public showPagination = true;
  public pageSize = 10;
  public page = 1;
  public pages = [5, 8, 10];
  public isLoading = true;
  constructor(private empService: EmployeeService) {
    this.columnDefs = [
      {
        headerName: 'Employee Name',
        field: 'name',
        width: 300,
        cellRendererFramework: EmployeeNameComponent,
      },
      {
        headerName: 'Phone',
        field: 'phone',
        width: 300,
      },
      {
        headerName: 'Email',
        width: 300,
        field: 'email',
      },
    ];
    this.defaultColDef = {
      sortable: true,
      suppressHorizontalScroll: true,
      enableColResize: true,
      unSortIcon: true,
      suppressMovable: true,
    };
  }
  ngOnInit(): void {
    this.empService.getUsersList().subscribe((data) => {
      this.isLoading = false;
      this.rowData = data;
    });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;

    if (this.isLoading) {
      this.gridApi.showLoadingOverlay();
    }
    this.gridApi.sizeColumnsToFit();
    this.gridApi.resetRowHeights();
  }
  onQuickFilterChanged() {
    this.gridApi.setQuickFilter(this.searchValue);
    if (this.gridApi && this.gridApi.rowModel.rowsToDisplay.length == 0) {
      this.showPagination = false;
      this.gridApi.showNoRowsOverlay();
    }
    if (this.gridApi && this.gridApi.rowModel.rowsToDisplay.length > 0) {
      this.rowData.length = this.gridApi.rowModel.rowsToDisplay.length;
      this.gridApi.hideOverlay();
    }
  }
  onItemsPerPageChange(event: any) {
    this.pageSize = event.target.selectedOptions[0].value;
    this.gridApi.paginationSetPageSize(this.pageSize);
  }
  onPageChange(pageNumber: any) {
    if (!isNaN(pageNumber) && pageNumber !== 0) {
      this.gridApi.paginationGoToPage(pageNumber - 1);
      this.page = pageNumber;
    } else if (pageNumber === 0) {
      this.gridApi.paginationGoToPage(pageNumber);
      this.page = pageNumber;
    }
  }
}
