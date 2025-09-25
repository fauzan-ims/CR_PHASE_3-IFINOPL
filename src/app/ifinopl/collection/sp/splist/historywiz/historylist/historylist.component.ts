import { OnInit, ViewChild, Component, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import { DALService } from '../../../../../../../DALservice.service';
import swal from 'sweetalert2';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './historylist.component.html'
})

export class HistorylistComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // checklist
  public selectedAll: any;
  private checkedList: any = [];

  // variable
  public from_date: any = [];
  public to_date: any = [];
  public branch_code: any = [];
  public branch_name: any = [];
  public listhistory: any = [];
  public lookupbranchcode: any = [];
  public letter_type: any = [];
  private currentDate = new Date();
  private RoleAccessCode = 'R00021010000000A';

  private APIController: String = 'WarningLetter';
  private APIRouteForGetRows: String = 'GetRowsForHistory';
  private APIControllerSysBranch: String = 'sysbranch';
  private APIRouteForLookup: String = 'GetRowsForLookup';

  // form 2 way binding
  model: any = {};

  // ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  constructor(private dalservice: DALService,
    public route: Router,
    public getRouteparam: ActivatedRoute,
    private _elementRef: ElementRef) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
 
    this.letter_type = 'SP1';
    this.Date();
    this.loadData();
  }

  //#region currentDate
  Date() {
    let day: any = this.currentDate.getDate();
    let from_month: any = (this.currentDate.getMonth() + 1) * 1 - 1;
    let to_month: any = this.currentDate.getMonth() + 1;
    let year: any = this.currentDate.getFullYear();

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

    this.to_date = { 'year': ~~year, 'month': ~~to_month, 'day': ~~day.toString() };
    const objt = {
      dateRange: null,
      isRange: false,
      singleDate: {
        date: this.to_date,
        // epoc: 1600102800,
        formatted: day.toString() + '/' + to_month + '/' + year,
        // jsDate: new Date(dob[key])
      }
    }

    // this.from_date = this.getrowNgb('2020-07-02 12:35:27.303');
    // this.to_date = year + '-' + from_month + '-' + day.toString();
    this.model.from_date = obj
    this.model.to_date = objt

  }
  //#endregion currentDate

  //#region ddl from date
  FromDate(event: any) {
    this.model.from_date = event;
    $('#datatableHistoryList').DataTable().ajax.reload();
  }
  //#endregion ddl from date

  //#region ddl to date
  ToDate(event: any) {
    this.model.to_date = event;
    $('#datatableHistoryList').DataTable().ajax.reload();
  }
  //#endregion ddl to date

  //#region listhistory load all data
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
        // tambahan param untuk getrows dynamic
        let paramTamps = {};
        paramTamps = {
          'p_branch_code': this.branch_code,
          'p_letter_type': this.letter_type,
          'p_from_date': this.model.from_date,
          'p_to_date': this.model.to_date,
        };

        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push(this.JSToNumberFloats(paramTamps))
        // end tambahan param untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listhistory = parse.data;
          if (parse.data != null) {
            this.listhistory.numberIndex = dtParameters.start;
          }


          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });

        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [1] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion listhistory load all data

  //#region ddl Type
  PageType(event: any) {
    this.letter_type = event.target.value;
    $('#datatableHistoryList').DataTable().ajax.reload();
  }
  //#endregion ddl Type

  //#region lookup branch
  btnLookupSysBranch() {
    $('#datatableLookupBranchcode').DataTable().clear().destroy();
    $('#datatableLookupBranchcode').DataTable({
      'pagingType': 'first_last_numbers',
      'pageLength': 5,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false

      ajax: (dtParameters: any, callback) => {
        // tambahan param untuk getrows dynamic
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'default': ''
        });
        // end tambahan param untuk getrows dynamic
        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBranch, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupbranchcode = parse.data;
          if (parse.data != null) {
            this.lookupbranchcode.numberIndex = dtParameters.start;
          }


          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
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
    // } , 1000);
  }

  btnSelectRowBranchcode(branch_code: String, branch_name: String) {
    this.branch_code = branch_code;
    this.branch_name = branch_name;
    $('#lookupModalSysBranchcode').modal('hide');
    $('#datatableHistoryList').DataTable().ajax.reload();
  }

  btnClearBranch(){
    this.branch_code = '';
    this.branch_name = '';
    $('#lookupModalSysBranchcode').modal('hide');
    $('#datatableHistoryList').DataTable().ajax.reload();
  }
  //#endregion lookup branch
}
