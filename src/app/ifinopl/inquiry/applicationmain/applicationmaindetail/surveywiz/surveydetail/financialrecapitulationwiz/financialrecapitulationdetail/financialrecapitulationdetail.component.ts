import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../../../base.component';
import { DALService } from '../../../../../../../../../DALservice.service';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './financialrecapitulationdetail.component.html'
})

export class FinancialrecapitulationdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');
  pageType = this.getRouteparam.snapshot.paramMap.get('page');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public financialrecapitulationdetailData: any = [];
  public listfinancialrecapitulationdetail: any = [];
  public lookupsysgeneralsubcode: any = [];
  public lookupReportType: any = [];
  public report_type_desc: String;
  private report_type: String;
  public isReadOnly: Boolean = false;
  private dataTamp: any = [];

  private APIController: String = 'ApplicationFinancialRecapitulation';
  private APIControllerApplicationFinancialRecapitulationDetail: String = 'ApplicationFinancialRecapitulationDetail';
  private APIControllerSysGeneralSubcode: String = 'SysGeneralSubcode';

  private APIRouteForGetRows: String = 'GETROWS';
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForDelete: String = 'DELETE';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForLookupForFinancialRecapitulationDetail: String = 'GetRowsLookupForFinancialRecapitulationDetail';
  private APIRouteForExecSp: String = 'ExecSp';

  private RoleAccessCode = 'R00022400000000A'; // role access 

  // checklist
  public selectedAllLookup: any;
  private checkedLookup: any = [];

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
    private _elementRef: ElementRef
  ) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.Delimiter(this._elementRef);
    if (this.params != null) {
      this.isReadOnly = true;
      // call web service
      this.callGetrow();
      this.loadData();
    } else {
      this.showSpinner = false;
      this.model.from_periode_month = '01';
      this.model.to_periode_month = '01';
    }
  }

  //#region load all data
  loadData() {
    this.dtOptions = {
      'pagingType': 'first_last_numbers',
      'pageLength': 100,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false
      ajax: (dtParameters: any, callback) => {

        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_financial_recapitulation_code': this.params,
          'p_report_type': this.report_type
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerApplicationFinancialRecapitulationDetail, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listfinancialrecapitulationdetail = parse.data;
          if (parse.data != null) {
            this.listfinancialrecapitulationdetail.numberIndex = dtParameters.start;
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
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 2, 3, 4, 5, 6] }], // for disabled coloumn
      order: [[1, 'ASC']],
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }

  }
  //#endregion load all data

  //#region getrow data
  callGetrow() {

    this.dataTamp = [{
      'p_code': this.params
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
  onFormSubmit(financialrecapitulationdetailForm: NgForm, isValid: boolean) {
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

    this.financialrecapitulationdetailData = financialrecapitulationdetailForm;
    const usersJson: any[] = Array.of(this.financialrecapitulationdetailData);
    if (this.params != null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showSpinner = false;
              $('#applicationDetail').click();
              this.callGetrow();
              this.showNotification('bottom', 'right', 'success');
            } else {
              this.showSpinner = false;
              this.swalPopUpMsg(parse.data);
            }
          },
          error => {
            this.showSpinner = false;
            const parse = JSON.parse(error);
            this.swalPopUpMsg(parse.data);
          });
    } else {
      // call web service
      this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showSpinner = false;
              $('#applicationDetail').click();
              $('#applicationFinancialRecapitulation').click();
              this.showNotification('bottom', 'right', 'success');
              this.route.navigate(['/inquiry/subapplicationmainlist/applicationmaindetail/' + this.param + '/surveydetail/' + this.param + '/financialrecapitulationdetail/', this.param, parse.code], { skipLocationChange: true });
            } else {
              this.showSpinner = false;
              this.swalPopUpMsg(parse.data);
            }
          },
          error => {
            this.showSpinner = false;
            const parse = JSON.parse(error);
            this.swalPopUpMsg(parse.data);
          });
    }
  }
  //#endregion form submit

  //#region button back
  btnBack() {
    this.route.navigate(['/inquiry/inquiryapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/surveydetail/' + this.param + '/banberjalan' + '/financialrecapitulationlist', this.param, 'banberjalan'], { skipLocationChange: true });
    $('#datatableApplicationFinancialRecapitulation').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region lookup SysGeneralSubcode
  btnLookupSysGeneralSubcode() {
    $('#datatablelookupSysGeneralSubcode').DataTable().clear().destroy();
    $('#datatablelookupSysGeneralSubcode').DataTable({
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
          'p_financial_recapitulation_code': this.params,
        });

        // tslint:disable-next-line:max-line-length
        this.dalservice.Getrows(dtParameters, this.APIControllerSysGeneralSubcode, this.APIRouteForLookupForFinancialRecapitulationDetail).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupsysgeneralsubcode = parse.data;
          if (parse.data != null) {
            this.lookupsysgeneralsubcode.numberIndex = dtParameters.start;
          }

          // if use checkAll use this
          $('#checkallLookup').prop('checked', false);
          // end checkall

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }
  //#endregion lookup SysGeneralSubcode

  //#region checkbox all lookup
  btnSelectAllLookup() {
    this.showSpinner = true;
    this.checkedLookup = [];
    for (let i = 0; i < this.lookupsysgeneralsubcode.length; i++) {
      if (this.lookupsysgeneralsubcode[i].selectedLookup) {
        this.checkedLookup.push(this.lookupsysgeneralsubcode[i].code);
      }
    }

    // jika tidak di checklist
    if (this.checkedLookup.length === 0) {
      swal({
        title: this._listdialogconf,
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-danger'
      }).catch(swal.noop)
      return
    }

    for (let J = 0; J < this.checkedLookup.length; J++) {
      const codeData = this.checkedLookup[J];
      this.dataTamp = [{
        'p_report_type': codeData,
        'p_financial_recapitulation_code': this.params
      }];

      this.dalservice.Insert(this.dataTamp, this.APIControllerApplicationFinancialRecapitulationDetail, this.APIRouteForInsert)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showSpinner = false;
              this.showNotification('bottom', 'right', 'success');
              $('#datatableApplicationFinancialRecapitulationDetail').DataTable().ajax.reload();
              $('#datatablelookupSysGeneralSubcode').DataTable().ajax.reload();
              $('#applicationFinancialRecapitulation').click();
            } else {
              this.showSpinner = false;
              this.swalPopUpMsg(parse.data);
            }
          },
          error => {
            this.showSpinner = false;
            const parse = JSON.parse(error);
            this.swalPopUpMsg(parse.data);
          })
    }
  }

  selectAllLookup() {
    for (let i = 0; i < this.lookupsysgeneralsubcode.length; i++) {
      this.lookupsysgeneralsubcode[i].selectedLookup = this.selectedAllLookup;
    }
  }

  checkIfAllLookupSelected() {
    this.selectedAllLookup = this.lookupsysgeneralsubcode.every(function (item: any) {
      return item.selectedLookup === true;
    })
  }
  //#endregion checkbox all table

  //#region delete all table
  btnDeleteAll() {
    // validation form submit
    if (this.report_type == undefined || this.report_type === '') {
      swal({
        title: 'Warning',
        text: 'Please select Report Type',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-warning',
        type: 'warning'
      }).catch(swal.noop)
      return;
    } else {
      this.showSpinner = true;
    }
    swal({
      title: 'Are you sure? to delete this Report Type ' + this.report_type_desc,
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Yes',
      buttonsStyling: false
    }).then((result) => {
      this.showSpinner = true;
      if (result.value) {

        this.dataTamp = [{
          'p_financial_recapitulation_code': this.params,
          'p_report_type': this.report_type,
        }];

        this.dalservice.Delete(this.dataTamp, this.APIControllerApplicationFinancialRecapitulationDetail, this.APIRouteForDelete)
          .subscribe(
            res => {
              const parses = JSON.parse(res);
              if (parses.result === 1) {
                this.showSpinner = false;
                $('#applicationDetail').click();
                $('#applicationFinancialRecapitulation').click();
                this.showNotification('bottom', 'right', 'success');
                $('#datatableApplicationFinancialRecapitulationDetail').DataTable().ajax.reload();
              } else {
                this.showSpinner = false;
                this.swalPopUpMsg(parses.data);
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
    });
  }
  //#endregion delete all table

  //#region ReportType Lookup
  btnLookupReportType() {
    $('#datatableLookupReportType').DataTable().clear().destroy();
    $('#datatableLookupReportType').DataTable({
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
          'p_general_code': 'RPTFR'
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerSysGeneralSubcode, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupReportType = parse.data;
          if (parse.data != null) {
            this.lookupReportType.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
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

  btnSelectRowReportType(code: String, description: String) {
    this.report_type = code;
    this.report_type_desc = description;
    $('#datatableApplicationFinancialRecapitulationDetail').DataTable().ajax.reload();
    $('#lookupModalReportType').modal('hide');
  }

  resteReport() {    
    this.report_type = undefined;
    this.report_type_desc = undefined;
    $('#datatableApplicationFinancialRecapitulationDetail').DataTable().ajax.reload();
  }
  //#endregion ReportType lookup

  //#region button save list
  btnSaveList() {
    this.showSpinner = true;
    this.listfinancialrecapitulationdetail = [];

    let i = 0;

    const getID = $('[name="p_id"]')
      .map(function () { return $(this).val(); }).get();

    const getFromAmount = $('[name="p_statement_from_value_amount"]')
      .map(function () { return $(this).val(); }).get();

    const getToAmount = $('[name="p_statement_to_value_amount"]')
      .map(function () { return $(this).val(); }).get();


    while (i < getID.length) {

      while (i < getFromAmount.length) {

        while (i < getToAmount.length) {

          this.listfinancialrecapitulationdetail.push(
            this.JSToNumberFloats({
              p_id: getID[i],
              p_statement_from_value_amount: getFromAmount[i],
              p_statement_to_value_amount: getToAmount[i],
            })
          );
          i++;
        }
        i++;
      }
      i++;
    }

    this.dataTamp = [{
      'p_financial_recapitulation_code': this.params
    }];

    //#region web service
    // tslint:disable-next-line:max-line-length
    this.dalservice.Update(this.listfinancialrecapitulationdetail, this.APIControllerApplicationFinancialRecapitulationDetail, this.APIRouteForUpdate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.dalservice.ExecSp(this.dataTamp, this.APIControllerApplicationFinancialRecapitulationDetail, this.APIRouteForExecSp)
              .subscribe(
                ress => {
                  const parses = JSON.parse(ress);
                  if (parses.result === 1) {
                    this.callGetrow();
                    this.showSpinner = false;
                    $('#btnSaveApplicationFinancialRecapitulation').click();
                    $('#applicationDetail').click();
                    this.showNotification('bottom', 'right', 'success');
                    $('#datatableApplicationFinancialRecapitulationDetail').DataTable().ajax.reload();
                  } else {
                    this.showSpinner = false;
                    this.swalPopUpMsg(parses.data);
                  }
                },
                error => {
                  this.showSpinner = false;
                  const parses = JSON.parse(error);
                  this.swalPopUpMsg(parses.data)
                });
          } else {
            this.showSpinner = false;
            this.swalPopUpMsg(parse.data);
          }
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
    //#endregion web service

  }

  onBlur(event, i, type) {
    if (type === 'amount1' || type === 'amount2') {
      event = '' + event.target.value;
      event = event.trim();
      event = parseFloat(event).toFixed(2); // ganti jadi 6 kalo mau pct
      event = event.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    } else {
      event = '' + event.target.value;
      event = event.trim();
      event = parseFloat(event).toFixed(6);
    }

    if (event === 'NaN') {
      event = 0;
      event = parseFloat(event).toFixed(2);
    }

    if (type === 'amount1') {
      $('#statement_from_value_amount' + i)
        .map(function () { return $(this).val(event); }).get();
    }
    if (type === 'amount2') {
      $('#statement_to_value_amount' + i)
        .map(function () { return $(this).val(event); }).get();
    }

  }

  onFocus(event, i, type) {
    event = '' + event.target.value;

    if (event != null) {
      event = event.replace(/[ ]*,[ ]*|[ ]+/g, '');
    }

    if (type === 'amount1') {
      $('#statement_from_value_amount' + i)
        .map(function () { return $(this).val(event); }).get();
    }
    if (type === 'amount2') {
      $('#statement_to_value_amount' + i)
        .map(function () { return $(this).val(event); }).get();
    }

  }
  //#endregion button save list
}