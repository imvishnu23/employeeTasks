import { Component } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { ActivatedRoute } from '@angular/router';
import {
  ModalDismissReasons,
  NgbDatepickerModule,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
})
export class TasksComponent {
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
  public closeResult = '';
  public description = '';
  public userId = null;
  public count = null;
  public lastId = 1;
  public isLoading=true;
  constructor(
    private empService: EmployeeService,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {
    this.columnDefs = [
      {
        headerName: 'Task ID',
        field: 'id',
        width: 100,
      },
      {
        headerName: 'Description',
        field: 'title',
        width: 400,
      },
      {
        headerName: 'Status',
        width: 300,
        field: 'completed',
        cellRenderer: (data: any) => {
          if (data.value) {
            return 'Completed';
          } else {
            return 'Not Completed';
          }
        },
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
    const userId = this.route.snapshot.paramMap.get('id');
    // const userId = this.route.snapshot.queryParamMap.get('id');
    console.log(userId);
    this.empService
      .getTasksList(userId ? userId : '')
      .subscribe((data: any) => {
        this.isLoading=false
        this.rowData = data;
        this.count = this.rowData.length;
        this.lastId = this.rowData[this.rowData.length - 1].id;
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
  addTask(task: Task) {
    this.rowData.unshift(task);
    this.rowData = [...this.rowData];
    this.description = '';
    this.count ? this.count++ : '';
  }
  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          console.log(result);
          if (result.action == 'Save click') {
            this.addTask({
              userId: this.userId ?? '',
              id: ++this.lastId,
              title: result.value,
              completed: false,
            });
          }
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
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
export interface Task {
  userId: string;
  id: number;
  title: string;
  completed: boolean;
}
