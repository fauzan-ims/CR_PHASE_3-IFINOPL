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
  templateUrl: './prospectmainlist.component.html'
})
export class ProspectmainlistComponent extends BaseComponent implements OnInit {
  // variable
  public tampprospectmainStatus: String;
  public listprospectmain: any = [];
  public lookupbranch: any = [];
  public request_status: String;
  private dataTamp: any = [];
  private APIController: String = 'PrpInterfaceProspectMain';
  private APIControllerSysBranch: String = 'SysBranch';
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForProceed: String = 'ExecSpForGetProceed';
  private RoleAccessCode = 'R00002670000268A';

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
    this.tampprospectmainStatus = 'HOLD';
  }

  //#region prospectmainStatus
  prospectmainStatus(event) {
    this.tampprospectmainStatus = event.target.value;
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion prospectmainStatus

  //#region btnProceed
  btnProceed(id: any) {
    // param tambahan untuk getrole dynamic
    this.dataTamp = [{
      'p_id': id,
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
          'p_branch_code': this.model.branch_code,
          'p_prospect_status': this.tampprospectmainStatus
        });
        
        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listprospectmain = parse.data;

          if (parse.data != null) {
            this.listprospectmain.numberIndex = dtParameters.start;
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

  //#region button edit
  btnEdit(codeEdit: string) {
    this.route.navigate(['/interface/subinterfaceprospectmainlist/prospectmaindetail', codeEdit]);
  }
  //#endregion button edit

  //#region Branch
  btnLookupBranch() {
    $('#datatableLookupBranch').DataTable().clear().destroy();
    $('#datatableLookupBranch').DataTable({
      'pagingType': 'first_last_numbers',
      'pageLength': 5,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false
      ajax: (dtParameters: any, callback) => {
        
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'default': ''
        });
        
        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBranch, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupbranch = parse.data;

          if (parse.data != null) {
            this.lookupbranch.numberIndex = dtParameters.start;
          }

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          })
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [1, 4] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowBranch(code: String, name: String) {
    this.model.branch_code = code;
    this.model.branch_name = name;
    $('#lookupModalBranch').modal('hide');
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion branch

}

