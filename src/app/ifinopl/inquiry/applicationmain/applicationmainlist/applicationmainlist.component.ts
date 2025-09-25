import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { Location } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './applicationmainlist.component.html',
})

export class ApplicationmainlistComponent extends BaseComponent implements OnInit {
  // variable
  public listapplicationmain: any = [];
  public listposition: any = [];
  public lookupsysbranch: any = [];
  public lookupworkflow: any = [];
  public branch_name: String;
  public branch_code: String;
  public level_name: String;
  public tampapplicationStatus: String;
  public tamplevelStatus: String;
  public pageType: String;
  public pageStatus: Boolean;
  private tampGetrows: String;
  private dataTamp: any = [];
  public simulation: String;

  private APIController: String = 'ApplicationMain';
  private APIControllerSysEmployeePosition: String = 'SysEmployeePosition';
  private APIControllerMasterWorkflow: String = 'MasterWorkflow';
  private APIControllerSysBranch: String = 'SysBranch';

  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForGetRowsApproval: String = 'GetRowsApproval';
  private APIRouteForGetRowsInquiry: String = 'GetRowsInquiry';
  private APIRouteForGetPosition: String = 'ExecSpForGetPosition';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForLookupApproval: String = 'GetRowsForLookupApproval';

  private RoleAccessCode = 'R00022400000000A'; // role access 

  // spinner
  showSpinner: Boolean = false;
  // end

  // ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  constructor(private dalservice: DALService,
    public getRouteparam: ActivatedRoute,
    public route: Router,
    private _location: Location,
    private _elementRef: ElementRef,
  ) { super(); }

  ngOnInit() {
    this.compoSide(this._location, this._elementRef, this.route);
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.getRouteparam.url.subscribe(url => this.pageType = url[0].path);

    this.tampGetrows = this.APIRouteForGetRowsInquiry;
    this.pageStatus = true;

    this.tampapplicationStatus = 'HOLD';
    this.loadData();
    this.getPosition();
    this.simulation = '1'
  }

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
          'p_branch_code': this.branch_code,
          'p_application_status': this.tampapplicationStatus,
          'p_level_status': this.tamplevelStatus,
          'p_is_simulation': this.simulation,
        })

        this.dalservice.Getrows(dtParameters, this.APIController, this.tampGetrows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listapplicationmain = parse.data;
          if (parse.data != null) {
            this.listapplicationmain.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 8] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }

  }
  //#endregion load all data

  //#region applicationStatus
  applicationStatus(event) {
    this.tampapplicationStatus = event.target.value;
    $('#datatableApplicationMainList').DataTable().ajax.reload();
  }
  //#endregion applicationStatus

  //#region button add
  btnAdd() {
    this.route.navigate(['/client/clientmatchingdetail', 'APPLICATION']);
  }
  //#endregion button add

  //#region button edit
  btnEdit(codeEdit: String) {
    this.route.navigate(['/inquiry/inquiryapplicationmain/applicationmaindetail', codeEdit, 'banberjalan']);
  }
  //#endregion button edit

  //#region WorkFlow
  btnLookupWorkFlow() {
    $('#datatableLookupWorkFlow').DataTable().clear().destroy();
    $('#datatableLookupWorkFlow').DataTable({
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
          'p_flow_type': 'APPLICATION',
          'p_array_data': JSON.stringify(this.listposition)
        });


        this.dalservice.Getrows(dtParameters, this.APIControllerMasterWorkflow, this.APIRouteForLookupApproval).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupworkflow = parse.data;
          if (parse.data != null) {
            this.lookupworkflow.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          })
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 4] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowWorkFlow(code: String, name: String) {
    this.tamplevelStatus = code;
    this.level_name = name;
    $('#datatableApplicationMainList').DataTable().ajax.reload();
    $('#lookupModalWorkFlow').modal('hide');
  }
  //#endregion WorkFlow

  //#region btnPost
  getPosition() {
    // param tambahan untuk getrole dynamic 
    this.dataTamp = [{
      'p_emp_code': this.userId,
      'action': 'getResponse'
    }];
    // param tambahan untuk getrole dynamic
    this.dalservice.ExecSpSys(this.dataTamp, this.APIControllerSysEmployeePosition, this.APIRouteForGetPosition)
      .subscribe(
        res => {
          this.showSpinner = false;
          const parse = JSON.parse(res);
          this.listposition = parse.data;

        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data)
        });
  }
  //#endregion btnPost

  //#region SysBranch
  btnLookupSysBranch() {
    $('#datatableLookupSysBranch').DataTable().clear().destroy();
    $('#datatableLookupSysBranch').DataTable({
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
          'p_cre_by': this.uid
        });

        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBranch, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupsysbranch = parse.data;
          if (parse.data != null) {
            this.lookupsysbranch.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          })
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 4] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowSysBranch(code: String, name: String) {
    this.branch_code = code;
    this.branch_name = name;
    $('#datatableApplicationMainList').DataTable().ajax.reload();
    $('#lookupModalSysBranch').modal('hide');
  }
  //#endregion SysBranch

  //#region resteBranch
  resteBranch() {
    this.branch_code = undefined;
    this.branch_name = undefined;
    $('#datatableApplicationMainList').DataTable().ajax.reload();
  }
  //#endregion resteBranch

  //#region resteWorkFlowStatus
  resteWorkFlowStatus() {
    this.tamplevelStatus = undefined;
    this.level_name = undefined;
    $('#datatableApplicationMainList').DataTable().ajax.reload();
  }
  //#endregion resteWorkFlowStatus

  //#region isSimulation
  isSimulation(event) {
    this.simulation = event.target.value;
    $('#datatableApplicationMainList').DataTable().ajax.reload();
  }
  //#endregion isSimulation
}