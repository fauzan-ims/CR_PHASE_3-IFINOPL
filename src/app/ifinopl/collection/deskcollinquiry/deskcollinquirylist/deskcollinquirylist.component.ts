import { OnInit, ViewChild, Component, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './deskcollinquirylist.component.html'
})

export class DeskcollInquirylistComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public listdeskcollinquiry: any = [];
  public from_date: any = [];
  public to_date: any = [];
  public lookupMasterCollector: any = [];
  public collector_code: String;
  public collector_name: String;
  private currentDate = new Date();
  private RoleAccessCode = 'R00020980000000A';

  private APIController: String = 'DeskcollMain';
  private APIControllerMasterCollector: String = 'MasterCollector';
  private APIControllerSysEmployeeMain: String = 'SysEmployeeMain';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForGetRows: String = 'GETROWS';

  // form 2 way binding
  model: any = {};

  // ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  // spinner
  showSpinner: Boolean = true;
  // end

  constructor(private dalservice: DALService,
    public route: Router,
    private _location: Location,
    public getRouteparam: ActivatedRoute,
    private _elementRef: ElementRef) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.compoSide(this._location, this._elementRef, this.route);
    this.loadData();
    this.Date();
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

    $('#datatableDeskCollInquiryList').DataTable().ajax.reload();
  }
  //#endregion ddl from date

  //#region ddl to date
  ToDate(event: any) {
    this.model.to_date = event;
    $('#datatableDeskCollInquiryList').DataTable().ajax.reload();
  }
  //#endregion ddl to date

  //#region listdeskcollinquiry load all data
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
          'p_collector_code': this.collector_code,
          'p_from_date': this.model.from_date,
          'p_to_date': this.model.to_date,
        };

        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push(this.JSToNumberFloats(paramTamps))
        
        

        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listdeskcollinquiry = parse.data;
          if (parse.data != null) {
            this.listdeskcollinquiry.numberIndex = dtParameters.start;
          }
          

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
          this.showSpinner=false;

        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [1, 7] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion listdeskcollinquiry load all data

  //#region button edit
  btnEdit(codeEdit: string) {
    this.route.navigate(['/collection/subdeskcollinquerylist/deskcollinquirydetail', codeEdit]);
  }
  //#endregion button edit

  //#region master collector lookup
  btnLookupMasterCollector() {
    $('#datatableLookupMasterCollector').DataTable().clear().destroy();
    $('#datatableLookupMasterCollector').DataTable({
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
        
        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysEmployeeMain, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupMasterCollector = parse.data;
          if (parse.data != null) {
            this.lookupMasterCollector.numberIndex = dtParameters.start;
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

  btnClearMasterCollector(){
    this.collector_code = '';
    this.collector_name = '';
    $('#datatableDeskCollInquiryList').DataTable().ajax.reload();
  }

  btnSelectRowMasterCollector(Code: String, Name: String) {
    this.collector_code = Code;
    this.collector_name = Name;
    $('#datatableDeskCollInquiryList').DataTable().ajax.reload();
    $('#lookupModalMasterCollector').modal('hide');
  }
  //#endregion master collector lookup
}




