import { OnInit, ViewChild, Component, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './saleslist.component.html'
})
export class SaleslistComponent extends BaseComponent implements OnInit {
  // variable
  public tampsalesStatus: String;
  public listsales: any = [];
  public checking_status: String;
  private dataTamp: any = [];
  private APIController: String = 'PrpInterfaceProspectSales';
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForProceed: String = 'ExecSpForGetProceed';
  private RoleAccessCode = 'R00002710000272A';

  // form 2 way binding
  model: any = {};

  // checklist
  public selectedAll: any;
  public checkedList: any = [];

  // spinner
  showSpinner: Boolean = true;
  // end

  // ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  constructor(private dalservice: DALService,
    private _location: Location,
    public route: Router,
    private _elementRef: ElementRef) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.compoSide(this._location, this._elementRef, this.route);
    this.loadData();
    this.tampsalesStatus = 'HOLD';
  }

  //#region salesStatus
  salesStatus(event) {
    this.tampsalesStatus = event.target.value;
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion salesStatus

  //#region btnProceed
  btnProceed(code: any) {
    // param tambahan untuk getrole dynamic
    this.dataTamp = [{
      'p_code': code,
      'action': ''
    }];
    // param tambahan untuk getrole dynamic
    swal({
      allowOutsideClick: false,
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Yes',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForProceed)
          .subscribe(
            res => {
              this.showSpinner = false;
              this.showNotification('bottom', 'right', 'success');
              $('#datatable').DataTable().ajax.reload();
            },
            error => {
              this.showSpinner = false;
              const parse = JSON.parse(error);
              this.swalPopUpMsg(parse.data)
            });
      }
    });
  }
  //#endregion btnProceed

  //#region load all data
  loadData() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      responsive: true,
      serverSide: true,
      processing: true,
      paging: true,
      'lengthMenu': [
        [10, 25, 50, 100],
        [10, 25, 50, 100]
      ],
      ajax: (dtParameters: any, callback) => {
        
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_checking_status': this.tampsalesStatus
        });
        
        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listsales = parse.data;

          if (parse.data != null) {
            this.listsales.numberIndex = dtParameters.start;
          }

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });

        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0] }], // for disabled coloumn
      order: [[1, 'desc']],
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;">No Data Available !</p>'
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion load all data

}

