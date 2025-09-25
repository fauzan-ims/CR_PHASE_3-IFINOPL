import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { Location } from '@angular/common';

declare global {
  interface Window {
    RTCPeerConnection: RTCPeerConnection;
    mozRTCPeerConnection: RTCPeerConnection;
    webkitRTCPeerConnection: RTCPeerConnection;
  }
}

@Component({
  selector: 'app-vatpaymentlist',
  templateUrl: './vatpaymentlist.component.html'
})
export class vatpaymentlistComponent extends BaseComponent implements OnInit {
  // variable
  public listcode: any = [];
  public payment_status: String = '';
  public lookupsysbranch: any = [];
  public branch_name: String;
  public branch_code: String;
  public from_date: any = [];
  public to_date: any = [];
  public system_date = new Date();

  private APIController: String = 'InvoiceVatPayment';
  private APIControllerSysBranch: String = 'SysBranch';


  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForGetRows: String = 'GetRows';

  private RoleAccessCode = 'R00020800000000A'; // role access 

  // form 2 way binding
  model: any = {};

  // ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  constructor(private dalservice: DALService, public route: Router,
    public getRouteparam: ActivatedRoute,
    private _location: Location,
    private _elementRef: ElementRef,
    private zone: NgZone) { super(); }

  ngOnInit() {
    this.compoSide(this._location, this._elementRef, this.route);
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.loadData();
    this.payment_status = 'HOLD';
    this.Date();
  }

  //#region ddl Status
  PageStatus(event: any) {
    this.payment_status = event.target.value;
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion ddl Status

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
        
        let paramTamps = {};
        paramTamps = {
          'p_branch_code': this.branch_code,
          'p_status': this.payment_status,
          'p_from_date': this.model.from_date,
          'p_to_date': this.model.to_date,
        };
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push(this.JSToNumberFloats(paramTamps))
        
        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listcode = parse.data;

          if (parse.data != null) {
            this.listcode.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 9] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion load all data

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

  btnClearLookupBranch() {
    this.branch_code = '';
    this.branch_name = '';
    $('#datatable').DataTable().ajax.reload();
}

  btnSelectRowSysBranch(code: String, name: String) {
    this.branch_code = code;
    this.branch_name = name;
    $('#datatable').DataTable().ajax.reload();
    $('#lookupModalSysBranch').modal('hide');
  }
  //#endregion SysBranch

  //#region button edit
  btnEdit(codeEdit: string) {
    this.route.navigate(['/billing/subvatpaymentlist/vatpaymentdetail', codeEdit]);
  }
  //#endregion button edit 

  //#region currentDate
  Date() {
    let day: any = this.system_date.getDate();
    let today: any = 1;
    let from_month: any = this.system_date.getMonth() + 1;
    let to_month: any = this.system_date.getMonth() + 2;
    let year: any = this.system_date.getFullYear();

    if (day < 10) {
      day = '0' + day.toString();
    }
    if (from_month < 10) {
      from_month = '0' + from_month.toString();
    }
    if (to_month < 10) {
      to_month = '0' + to_month.toString();
    }

    this.from_date = { 'year': ~~year, 'month': ~~from_month, 'day': ~~day.toString() };
    const obj = {
      dateRange: null,
      isRange: false,
      singleDate: {
        date: this.from_date,
        // epoc: 1600102800,
        formatted: day.toString() + '/' + from_month + '/' + year,
        // jsDate: new Date(dob[key])
      }
    }

    this.to_date = { 'year': ~~year, 'month': ~~from_month, 'day': ~~today.toString() };
    const obj2 = {
      dateRange: null,
      isRange: false,
      singleDate: {
        date: this.to_date,
        // epoc: 1600102800,
        formatted: today.toString() + '/' + from_month + '/' + year,
        // jsDate: new Date(dob[key])
      }
    }

    this.model.from_date = obj2
    this.model.to_date = obj
  }
  //#endregion currentDate

  //#region from date
  FromDate(event: any) {
    this.model.from_date = event;
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion from date

  //#region to date
  ToDate(event: any) {
    this.model.to_date = event;
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion to date
}

