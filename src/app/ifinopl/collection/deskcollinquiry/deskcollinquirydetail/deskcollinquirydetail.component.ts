import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { DatePipe } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './deskcollinquirydetail.component.html'
})

export class DeskCollinquirydetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public deskcollData: any = [];
  public listdeskcolldetail: any = [];
  public listfieldcolldetaildetail: any = [];
  public branchCode: String;
  public branchName: String;
  public lookupMasterDeskcollResult: any = [];
  public lookupMasterDeskcollResultDetail: any = [];
  public isReadOnly: Boolean = false;
  private rolecode: any = [];
  private setStyle: any = [];
  private dataRoleTamp: any = [];
  private dataTamp: any = [];
  private RoleAccessCode = 'R00020980000000A';

  private APIController: String = 'DeskcollMain';
  private APIControllerMasterDeskcollResult: String = 'MasterDeskcollResult';
  private APIControllerMasterDeskcollResultDetail: String = 'MasterDeskcollResultDetail';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForGetRole: String = 'ExecSpForGetRole';

  // checklist
  public selectedAll: any;
  private checkedList: any = [];
  private checkedLookup: any = [];
  public selectedAllLookup: any;

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = true;
  // end

  // datatable
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  constructor(private dalservice: DALService,
    public getRouteparam: ActivatedRoute,
    public route: Router,
    private _elementRef: ElementRef, private datePipe: DatePipe
  ) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
 
    if (this.param != null) {
      this.isReadOnly = true;

      // call web service
      this.callGetrow();
    } else {
      this.showSpinner = false;
    }
  }

  //#region  set datepicker
  getStyles(isTrue: Boolean) {
    if (isTrue) {
      this.setStyle = {
        'pointer-events': 'none',
      }
    } else {
      this.setStyle = {
        'pointer-events': 'auto',
      }
    }

    return this.setStyle;
  }
  //#endregion  set datepicker

  //#region getrow data
  callGetrow() {
    
    this.dataTamp = [{
      'p_id': this.param,
    }];
    

    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          // mapper dbtoui
          Object.assign(this.model, parsedata);
          // end mapper dbtoui

          this.showSpinner = false;
        },
        error => {
          console.log('There was an error while Retrieving Data(API) !!!' + error);
        });
  }
  //#endregion getrow data

  //#region  form submit
  onFormSubmit(DeskcollForm: NgForm, isValid: boolean) {

  }
  //#endregion form submit

  //#region button back
  btnBack() {
    // this.route.navigate(['/collection/subdeskcollinquirylist/']);
    this.route.navigate(['/collection/subdeskcollinquerylist/']);

    $('#datatableDeskCollInquiryList').DataTable().ajax.reload();
  }
  //#endregion button back

  //#endregion master Descoll lookup
  btnLookupMasterDeskcollResult() {
    $('#datatableLookupMasterDeskcollResult').DataTable().clear().destroy();
    $('#datatableLookupMasterDeskcollResult').DataTable({
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
          'p_result_code': this.model.result_code
        });
        this.dalservice.Getrows(dtParameters, this.APIControllerMasterDeskcollResult, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupMasterDeskcollResult = parse.data;
          if (parse.data != null) {
            this.lookupMasterDeskcollResult.numberIndex = dtParameters.start;
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

  //#region master collector lookup
  btnSelectRowMasterDeskcollResult(Code: String, Name: String) {
    this.model.result_code = Code;
    this.model.result_name = Name;
    $('#lookupModalMasterDeskcollResult').modal('hide');
  }
  //#endregion master Descoll lookup

  //#region master collector lookup
  btnLookupMasterDeskcollResultDetail() {
    $('#datatableLookupMasterDeskcollResultDetail').DataTable().clear().destroy();
    $('#datatableLookupMasterDeskcollResultDetail').DataTable({
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
          'p_result_code': this.model.result_code
        });
        this.dalservice.Getrows(dtParameters, this.APIControllerMasterDeskcollResultDetail, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupMasterDeskcollResultDetail = parse.data;
          if (parse.data != null) {
            this.lookupMasterDeskcollResultDetail.numberIndex = dtParameters.start;
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

  //#region master collector lookup
  btnSelectRowMasterDeskcollResultDetail(Code: String, Name: String) {
    this.model.desck_collector_code = Code;
    this.model.result_detail_name = Name;
    $('#lookupModalMasterDeskcollResultDetail').modal('hide');
  }
  //#endregion master collector lookup
}
