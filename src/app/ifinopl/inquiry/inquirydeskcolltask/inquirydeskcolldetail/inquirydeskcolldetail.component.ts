import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { DatePipe } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './inquirydeskcolldetail.component.html'
})

export class InquiryDeskColltaskdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  // params = this.getRouteparam.snapshot.paramMap.get('agreementNo');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public deskcollData: any = [];
  public listdeskcolldetail: any = [];
  public listdeskcolllog: any = [];
  public listdeskcolldetailamort: any = [];
  public listfieldcolldetaildetail: any = [];
  public codeData: any = [];
  public branchCode: String;
  public pageType: String;
  public pageType2: String;
  public branchName: String;
  public lookupMasterDeskcollResult: any = [];
  public lookupMasterDeskcollResultDetail: any = [];
  public isReadOnly: Boolean = false;
  private dataRoleTamp: any = [];
  private dataTamp: any = [];
  private setStyle: any = [];
  private RoleAccessCode = 'R00024780000001A';
  public isFU: boolean = false;
  public system_date = new Date();
  public nextFUDate: any = [];

  private APIControllerAgreementLog: String = 'AgreementLog';
  private APIControllerAgreementMain: String = 'AgreementAmortization';
  private APIControllerDeskcollMain: String = 'DeskcollMain';
  private APIControllerMasterDeskcollResult: String = 'MasterDeskcollResult';
  private APIControllerMasterDeskcollResultDetail: String = 'MasterDeskcollResultDetail';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForGetRows: String = 'GETROWS';
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForPost: String = 'ExecSpForPost';
  private APIRouteForPastDueDetailGetrows: String = 'GetRowsForPastDueDetail';
  private APIRouteForPastDueAmortGetrows: String = 'ExecSpForGetrowsDeskcoll';
  private APIRouteForApplyToAll: String = 'ExecSpForApplyToAll';
  private APIRouteForGetRowForInquiryDeskcollMain: String = 'GetRowForInquiryDeskcollMain';

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = true;
  // end

  // datatable
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtOptionsAddress: DataTables.Settings = {};
  dtOptionsDetail: DataTables.Settings = {};
  dtOptionsAmort: DataTables.Settings = {};

  constructor(private dalservice: DALService,
    public getRouteparam: ActivatedRoute,
    public route: Router,
    private _location: Location,
    private _elementRef: ElementRef, private datePipe: DatePipe
  ) { super(); }

  ngOnInit() {
    this.getRouteparam.url.subscribe(url => this.pageType = url[0].path);
    // this.compoSide('', this._elementRef, this.route);
    this.wizard();
    if (this.pageType === 'deskcolltaskdetailnot') {
      this.pageType2 = 'deskcolltaskmainlist'
    } else {
      this.pageType2 = 'deskcolltasktpastduelist'
    }
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);

    if (this.param != null) {
      this.isReadOnly = true;
      this.model.desk_status = 'HOLD'
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


    this.dalservice.Getrow(this.dataTamp, this.APIControllerDeskcollMain, this.APIRouteForGetRowForInquiryDeskcollMain)
      .subscribe(
        res => {
          const parse = JSON.parse(res);

          const parsedatas = this.getrowNgb(parse.data[0]);

          setTimeout(() => {
            this.amortizationnwiz();
          }, 200);

          // checkbox
          if (parsedatas.is_need_next_fu === '1') {
            parsedatas.is_need_next_fu = true;
          } else {
            parsedatas.is_need_next_fu = false;
          }

          // mapper dbtoui
          Object.assign(this.model, parsedatas);
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
    // validation form submit
    if (!isValid) {
      swal({
        title: 'Warning',
        text: 'Please Fill a Mandatory Field OR Format Is Invalid',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-warning',
        type: 'warning'
      }).catch(swal.noop)
      return;
    } else {
      this.showSpinner = true;
    }

    this.deskcollData = this.JSToNumberFloats(DeskcollForm);
    // if (this.deskcollData.p_result_promise_date == null || this.deskcollData.p_result_promise_date === '' || this.deskcollData.p_result_code !== this.model.value) {
    //   this.deskcollData.p_result_promise_date = undefined;
    // }
    if (this.deskcollData.p_is_need_next_fu == null) {
      this.deskcollData.p_is_need_next_fu = false;
    }

    const usersJson: any[] = Array.of(this.deskcollData);
    // call web service
    this.dalservice.Update(usersJson, this.APIControllerDeskcollMain, this.APIRouteForUpdate)
      .subscribe(
        res => {

          this.showSpinner = false;
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.showNotification('bottom', 'right', 'success');
            this.callGetrow();
          } else {
            this.swalPopUpMsg(parse.data);
          }
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);

        });
  }
  //#endregion form submit

  //#region redirectTo
  redirectTo(uri: string) {
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.route.navigate([uri]));
  }
  //#endregion redirectTo

  //#region amortizationnwiz
  amortizationnwiz() {
    this.route.navigate(['/inquiry/' + this.pageType + '/' + this.param + '/inquiryamortizationlist', this.param], { skipLocationChange: true });
  }
  //#endregion amortizationnwiz

  //#region agreementlognwiz
  historywiz() {
    this.route.navigate(['/inquiry/' + this.pageType + '/' + this.param + '/inquiryagreementloglist', this.param], { skipLocationChange: true });
  }
  //#endregion agreementlognwiz

  //#region button back
  btnBack() {
    this.redirectTo('/inquiry/subinquirydeskcolltasklist/');
  }
  //#endregion button back

  //#region button Post
  btnPost(isValid: boolean) {
    // validation form submit
    if (!isValid) {
      swal({
        title: 'Warning',
        text: 'Please Fill a Mandatory Field OR Format Is Invalid',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-warning',
        type: 'warning'
      }).catch(swal.noop)
      return;
    }

    // param tambahan untuk getrole dynamic
    this.dataRoleTamp = [{
      'p_id': this.param,
    }];
    // param tambahan untuk getrole dynamic

    // call web service
    swal({
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: this._deleteconf,
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIControllerDeskcollMain, this.APIRouteForPost)
          .subscribe(
            res => {
              this.showSpinner = false;
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showNotification('bottom', 'right', 'success');
                this.callGetrow();
              } else {
                this.swalPopUpMsg(parse.data);
              }
            },
            error => {
              this.showSpinner = false;
              const parse = JSON.parse(error);
              this.swalPopUpMsg(parse.data);
            });
      } else {
        this.showSpinner = false;
      }
    })
  }

  //#endregion button Post

  //#region btnLookupMasterDeskcollResult
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
  //#endregion btnLookupMasterDeskcollResult

  //#region master collector lookup
  btnSelectRowMasterDeskcollResult(Code: String, Name: String) {
    this.model.result_code = Code;
    this.model.result_name = Name;
    if (Code == 'MD005') {
      if (this.isFU == true) {
        this.Date();
      }
    } else if (Code != 'MD005' && Code != 'MD004') {
      if (this.isFU == true) {
        this.Date2();
      }
    }
    $('#lookupModalMasterDeskcollResult').modal('hide');
  }
  //#endregion master collector lookup

  //#region btnLookupMasterDeskcollResultDetail
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
  //#endregion btnLookupMasterDeskcollResultDetail

  //#region master collector lookup
  btnSelectRowMasterDeskcollResultDetail(Code: String, Name: String) {
    this.model.result_detail_code = Code;
    this.model.result_detail_name = Name;
    $('#lookupModalMasterDeskcollResultDetail').modal('hide');
  }
  //#endregion master collector lookup

  //#region load data detail
  loadDataDetail() {
    this.dtOptionsAddress = {
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
          'p_id': this.param,
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerDeskcollMain, this.APIRouteForPastDueDetailGetrows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listdeskcolldetail = parse.data;

          if (parse.data != null) {
            this.listdeskcolldetail.numberIndex = dtParameters.start;
          }

          // if use checkAll use this
          $('#checkall').prop('checked', false);
          // end checkall

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
  //#endregion load data detail

  //#region agreement Log
  loadDataLog() {
    this.dtOptionsDetail = {
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
          'p_agreement_no': this.param,
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerAgreementLog, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listdeskcolllog = parse.data;
          if (parse.data != null) {
            this.listdeskcolllog.numberIndex = dtParameters.start;
          }

          // if use checkAll use this
          $('#checkall').prop('checked', false);
          // end checkall

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
  //#endregion load data detail

  //#region load data amort
  loadDataAmort() {
    // this.dtOptionsAmort = {
    //   pagingType: 'full_numbers',
    //   responsive: true,
    //   serverSide: true,
    //   processing: true,
    //   paging: true,
    //   'lengthMenu': [
    //     [10, 25, 50, 100],
    //     [10, 25, 50, 100]
    //   ],
    //   ajax: (dtParameters: any, callback) => {

    //     dtParameters.paramTamp = [];
    //     dtParameters.paramTamp.push({
    //       'p_agreement_no': this.params
    //     });

    //     this.dalservice.GetrowsCore(dtParameters, this.APIControllerAgreementMain, this.APIRouteForPastDueAmortGetrows).subscribe(resp => {
    //       const parse = JSON.parse(resp);

    //       this.listdeskcolldetailamort = parse.data;
    //       if (parse.data != null) {
    //         this.listdeskcolldetailamort.numberIndex = dtParameters.start;
    //       }


    //       // if use checkAll use this
    //       $('#checkall').prop('checked', false);
    //       // end checkall

    //       callback({
    //         draw: parse.draw,
    //         recordsTotal: parse.recordsTotal,
    //         recordsFiltered: parse.recordsFiltered,
    //         data: []
    //       });

    //     }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
    //   },
    //   columnDefs: [{ orderable: false, width: '5%', targets: [1] }], // for disabled coloumn
    //   language: {
    //     search: '_INPUT_',
    //     searchPlaceholder: 'Search records',
    //     infoEmpty: '<p style="color:red;" > No Data Available !</p> '
    //   },
    //   searchDelay: 800 // pake ini supaya gak bug search
    // }
  }
  //#endregion load data detail

  //#region checkbox
  changeFU(event: any) {
    this.isFU = event.target.checked

    if (this.isFU == true) {
      if (this.model.result_code != null) {
        if (this.model.result_code == 'MD005') {
          this.Date();
        } else if (this.model.result_code != 'MD005' && this.model.result_code != 'MD004') {
          this.Date2();
        }
      }
    } else {
      this.model.next_fu_date = undefined;
    }
  }

  //#region currentDate
  Date() {
    let day: any = this.system_date.getDate() + 1;
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

    this.nextFUDate = { 'year': ~~year, 'month': ~~from_month, 'day': ~~day.toString() };
    const obj2 = {
      dateRange: null,
      isRange: false,
      singleDate: {
        date: this.nextFUDate,
        // epoc: 1600102800,
        formatted: day.toString() + '/' + from_month + '/' + year,
        // jsDate: new Date(dob[key])
      }
    }

    this.model.next_fu_date = obj2
    // this.model.to_date = obj2
  }
  //#endregion currentDate

  //#region currentDate
  Date2() {
    let day: any = this.system_date.getDate() + 7;
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

    this.nextFUDate = { 'year': ~~year, 'month': ~~from_month, 'day': ~~day.toString() };
    const obj2 = {
      dateRange: null,
      isRange: false,
      singleDate: {
        date: this.nextFUDate,
        // epoc: 1600102800,
        formatted: day.toString() + '/' + from_month + '/' + year,
        // jsDate: new Date(dob[key])
      }
    }

    this.model.next_fu_date = obj2
    // this.model.to_date = obj2
  }
  //#endregion currentDate

  //#region btnApplyToAll
  btnApplyToAll(isValid: boolean) {
    // validation form submit
    if (!isValid) {
      swal({
        title: 'Warning',
        text: 'Please Fill a Mandatory Field OR Format Is Invalid',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-warning',
        type: 'warning'
      }).catch(swal.noop)
      return;
    }

    // param tambahan untuk getrole dynamic
    this.dataRoleTamp = [{
      'p_id': this.param,
    }];
    // param tambahan untuk getrole dynamic

    // call web service
    swal({
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: this._deleteconf,
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIControllerDeskcollMain, this.APIRouteForApplyToAll)
          .subscribe(
            res => {
              this.showSpinner = false;
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showNotification('bottom', 'right', 'success');
                this.callGetrow();
              } else {
                this.swalPopUpMsg(parse.data);
              }
            },
            error => {
              this.showSpinner = false;
              const parse = JSON.parse(error);
              this.swalPopUpMsg(parse.data);
            });
      } else {
        this.showSpinner = false;
      }
    })
  }
  //#endregion btnApplyToAll
}
