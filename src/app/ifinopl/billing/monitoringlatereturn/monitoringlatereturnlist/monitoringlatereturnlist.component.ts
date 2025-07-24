import { OnInit, ViewChild, Component, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-monitoringlatereturn',
  templateUrl: './monitoringlatereturnlist.component.html'
})
export class MonitoringlatereturnlistComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public lookupbranch: any = [];
  public branch_code: String = '';
  public branch_name: String = '';
  public client_no: String;
  public client_name: String;
  public agreement_no: String;
  public agreement_external_no: String;
  public lookupclientname: any = [];
  public lookupagreementno: any = [];
  public listmonitoringlatereturn: any = [];
  public tampPaymentStatus: String;

  // form 2 way binding
  model: any = {};

  //controller
  private APIController: String = 'AgreementObligation';
  private APIControllerSysBranch: String = 'SysBranch';
  private APIControllerClientMain: String = 'ClientMain';
  private APIControllerAgreementMain: String = 'AgreementMain';

  //router
  private APIRouteGetRowsForLookup: String = 'GetRowsForLookup';
  private APIRouteForGetRows: String = 'GetRowsForMonitoringLateReturn';

  private RoleAccessCode = 'R00024700000001A';

  // spinner
  showSpinner: Boolean = false;
  // end

  // ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  lookupPlafond: any;

  constructor(private dalservice: DALService,
    public getRouteparam: ActivatedRoute,
    public route: Router,
    private _location: Location,
    private _elementRef: ElementRef) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.compoSide(this._location, this._elementRef, this.route);
    this.tampPaymentStatus = 'ALL';
    this.loadData();
  }

  //#region Status
  PaymentStatus(event) {
    this.tampPaymentStatus = event.target.value;
    $('#datatablemonitoringlatereturn').DataTable().ajax.reload();
  }
  //#endregion ttatus

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
          'p_client_no': this.client_no,
          'p_agreement_no': this.agreement_no,
          'p_payment_status': this.tampPaymentStatus
        });

        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listmonitoringlatereturn = parse.data;
          if (parse.data != null) {
            this.showSpinner = false;
            this.listmonitoringlatereturn.numberIndex = dtParameters.start;

          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });

        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, searchable: false, width: '5%', targets: [0, 1] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;">No Data Available !</p>'
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion load all data

  //#region LookupSysBranch
  btnLookupSysBranch() {
    $('#datatableLookupSysBranch').DataTable().clear().destroy();
    $('#datatableLookupSysBranch').DataTable({
      'pagingType': 'simple_numbers',
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
        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBranch, this.APIRouteGetRowsForLookup).subscribe(resp => {
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
      'lengthMenu': [
        [5, 25, 50, 100],
        [5, 25, 50, 100]
      ],
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 4] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '

      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowBranch(code: String, name: String) {
    this.branch_code = code;
    this.branch_name = name;
    $('#lookupModalbranch').modal('hide');
    $('#datatablemonitoringlatereturn').DataTable().ajax.reload();
  }

  btnClearLookupBranch() {
    this.branch_code = undefined;
    this.branch_name = undefined;
    this.client_no = undefined;
    this.client_name = undefined;
    this.agreement_no = undefined;
    this.agreement_external_no = undefined;
    $('#datatablemonitoringlatereturn').DataTable().ajax.reload();
  }
  //#endregion LookupSysBranch

  //#region btnLookupClientName
  btnLookupClientName() {
    $('#datatableLookupClientName').DataTable().clear().destroy();
    $('#datatableLookupClientName').DataTable({
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

        this.dalservice.Getrows(dtParameters, this.APIControllerClientMain, this.APIRouteGetRowsForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupclientname = parse.data;
          if (parse.data != null) {
            this.lookupclientname.numberIndex = dtParameters.start;

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

  btnSelectRowClientName(client_no: String, client_name: String) {
    this.client_no = client_no;
    this.client_name = client_name;
    $('#datatablemonitoringlatereturn').DataTable().ajax.reload();
    $('#lookupModalClientName').modal('hide');
  }
  //#endregion btnLookupClientName

  //#region resteClientName
  resteClientName() {
    this.client_no = undefined;
    this.client_name = undefined;
    this.agreement_no = undefined;
    this.agreement_external_no = undefined;
    $('#datatablemonitoringlatereturn').DataTable().ajax.reload();
  }
  //#endregion resteClientName


  //#region btnLookupAgreementNo
  btnLookupAgreementNo() {
    $('#datatableLookupAgreementNo').DataTable().clear().destroy();
    $('#datatableLookupAgreementNo').DataTable({
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
          'p_branch_code': this.branch_code,
          'p_client_no': this.client_no
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerAgreementMain, this.APIRouteGetRowsForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupagreementno = parse.data;
          if (parse.data != null) {
            this.lookupagreementno.numberIndex = dtParameters.start;

          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          })
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 3] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowAgreementNo(agreement_no: String, agreement_external_no: String) {
    this.agreement_no = agreement_no;
    this.agreement_external_no = agreement_external_no;
    $('#datatablemonitoringlatereturn').DataTable().ajax.reload();
    $('#lookupModalAgreementNo').modal('hide');
  }
  //#endregion btnLookupAgreementNo

  //#region resteAgreementNo
  resteAgreementNo() {
    this.agreement_no = undefined;
    this.agreement_external_no = undefined;
    $('#datatablemonitoringlatereturn').DataTable().ajax.reload();
  }
  //#endregion resteAgreementNo
}
