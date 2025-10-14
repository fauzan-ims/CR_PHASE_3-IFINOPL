import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { DatePipe } from '@angular/common';

// call function from js shared
declare function headerPage(controller, route): any;
declare function hideButtonLink(idbutton): any;
declare function hideTabWizard(): any;

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './changeduedatedetail.component.html'
})

export class ChangeduedatedetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  pageType = this.getRouteparam.snapshot.paramMap.get('page');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public changeduedateData: any = [];
  public earlyterminationData: any = [];
  public setStyle: any = [];
  public isReadOnly: Boolean = false;
  public lookupagreement: any = [];
  public lookupbranch: any = [];
  public lookupapproval: any = [];
  private dataTamp: any = [];
  private dataTampDynamic: any = [];
  private dataTampTransaction: any = [];
  public lookupbillingtype: any = [];

  //Controller
  private APIControllerBillingType: String = 'MasterBillingType';
  private APIController: String = 'DueDateChangeMain';
  private APIControllerSysBranch: String = 'SysBranch';
  private APIControllerAgreementMain: String = 'AgreementMain';
  private APIControllerAgreementAmortization: String = 'AgreementAmortization';
  private APIControllerAgreementAmortizationPayment: String = 'AgreementAmortizationPayment';
  private APIControllerMasterTransactionParameter: String = 'MasterTransactionParameter';
  private APIControllerDueDateChangeTransaction: String = 'DueDateChangeTransaction';
  private APIControllerAgreementAmortizationHistory: String = 'AgreementAmortizationHistory';
  private APIControllerAgreementAmortizationPaymentHistory: String = 'AgreementAmortizationPaymentHistory';
  private APIControllerApprovalSchedule: String = 'ApprovalSchedule';

  //Route
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForLookupChangeDueDate: String = 'GetRowsForLookupChangeDueDate';
  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForUpdate: String = 'Update';
  private APIRouteForInsert: String = 'Insert';
  private APIRouteForDelete: String = 'Delete';
  private APIRouteForExecSp: String = 'ExecSp';
  private APIRouteForExecSpForGetrow: String = 'ExecSpForGetrowGeneral';
  private APIRouteForProceed: String = 'ExecSpForProceed';
  private APIRouteForCancel: String = 'ExecSpForCancel';
  private APIRouteForRevert: String = 'ExecSpForRevert';

  private RoleAccessCode = 'R00023870000001A'; // role access 

  // report
  private APIControllerReport: String = 'Report';
  private APIRouteForDownloadReport: String = 'getReport';

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
    this.wizard();
    this.Delimiter(this._elementRef);
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    if (this.param != null) {

      // call web service
      this.callGetrow();

      this.changeduedateassetwiz();
    } else {
      // this.callGetrow();
      this.model.change_status = 'HOLD';
      this.showSpinner = false;
      this.model.billing_mode_date = 0;
    }
  }

  //#region getStyles
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
  //#endregion

  //#region getrow data
  callGetrow() {
    // param tambahan untuk getrow dynamic
    this.dataTamp = [{
      'p_code': this.param,
    }];
    // end param tambahan untuk getrow dynamic

    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          if (parsedata.change_status != 'HOLD') {
            this.isReadOnly = true;
          }

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

  //#region 
  callWizard() {
    setTimeout(() => {
      this.wizard();
      // this.changeduedatetransactionwiz();
    }, 1000);
  }
  //#endregion

  //#region form submit
  onFormSubmit(earlyterminationForm: NgForm, isValid: boolean) {
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

    this.earlyterminationData = this.JSToNumberFloats(earlyterminationForm);
    const usersJson: any[] = Array.of(this.earlyterminationData);
    console.log(usersJson);
    
    if (this.param != null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.callGetrow();
              $('#datatableAgreement').DataTable().ajax.reload();
              $('#datatableTransaction').DataTable().ajax.reload();
              $('#datatableTransactionChangeDueDate').DataTable().ajax.reload();
              this.showNotification('bottom', 'right', 'success');
              this.showSpinner = false;
            } else {
              this.swalPopUpMsg(parse.data);
              this.showSpinner = false;
            }
          },
          error => {
            const parse = JSON.parse(error);
            this.swalPopUpMsg(parse.data);
            this.showSpinner = false;
          });
    } else {
      // call web service
      this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.route.navigate(['/management/subchangeduedatelistifinopl/changeduedatedetail', parse.code]);
              this.callGetrow();
              $('#datatableInformation').DataTable().ajax.reload();
              $('#datatableTransaction').DataTable().ajax.reload();
              $('#datatabledetail').DataTable().ajax.reload();
              this.showNotification('bottom', 'right', 'success');
              this.showSpinner = false;
            } else {
              this.swalPopUpMsg(parse.data);
              this.showSpinner = false;
            }
          },
          error => {
            const parse = JSON.parse(error);
            this.swalPopUpMsg(parse.data);
            this.showSpinner = false;
          });
    }
  }
  //#endregion form submit

  //#region btnProceed
  btnProceed(code: any) {
    // param tambahan untuk getrole dynamic
    this.dataTamp = [{
      'p_code': code,
      'action': ''
    }];
    // param tambahan untuk getrole dynamic
    swal({
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Yes',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        this.showSpinner = true;
        this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForProceed)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showSpinner = false;
                this.showNotification('bottom', 'right', 'success');
                this.callGetrow();
                $('#EtDetail').click();
                $('#datatableTransactionChangeDueDate').DataTable().ajax.reload();
                $('#datatableInformation').DataTable().ajax.reload();
                $('#datatableAgreement').DataTable().ajax.reload();
                // this.changeduedateinformationwiz();
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
        this.showSpinner = false;
      }
    });
  }
  //#endregion btnProceed

  //#region btnCancel
  btnCancel(code: any) {
    // param tambahan untuk getrole dynamic
    this.dataTamp = [{
      'p_code': code,
      'action': ''
    }];
    // param tambahan untuk getrole dynamic
    swal({
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Yes',
      buttonsStyling: false
    }).then((result) => {
      this.showSpinner = true;
      if (result.value) {
        this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForCancel)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showSpinner = false;
                this.showNotification('bottom', 'right', 'success');
                this.callGetrow();
                $('#EtDetail').click();
                $('#datatableTransactionChangeDueDate').DataTable().ajax.reload();
                $('#datatableInformation').DataTable().ajax.reload();
                $('#datatableAgreement').DataTable().ajax.reload();
                // this.changeduedateinformationwiz();
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
        this.showSpinner = false;
      }
    });
  }
  //#endregion btnCancel

  //#region btnRevert
  btnRevert(code: any) {
    // param tambahan untuk getrole dynamic
    this.dataTamp = [{
      'p_code': code,
      'action': ''
    }];
    // param tambahan untuk getrole dynamic
    swal({
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Yes',
      buttonsStyling: false
    }).then((result) => {
      this.showSpinner = true;
      if (result.value) {
        this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForRevert)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showSpinner = false;
                this.showNotification('bottom', 'right', 'success');
                this.callGetrow();
                $('#EtDetail').click();
                $('#datatableTransactionChangeDueDate').DataTable().ajax.reload();
                $('#datatableInformation').DataTable().ajax.reload();
                $('#datatableAgreement').DataTable().ajax.reload();
                // this.changeduedateinformationwiz();
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
        this.showSpinner = false;
      }
    });
  }
  //#endregion btnRevert

  //#region button back
  btnBack() {
    this.route.navigate(['/management/subchangeduedatelistifinopl']);
    $('#datatableChangeDueDate').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region Branch Lookup
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
        // param tambahan untuk getrows dynamic
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_cre_by': this.uid
        });
        // end param tambahan untuk getrows dynamic
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
          });
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
  btnSelectRowBranch(branch_code: String, branch_name: string) {
    this.model.branch_code = branch_code;
    this.model.branch_name = branch_name;
    this.model.agreement_no = undefined;
    this.model.agreement_external_no = undefined;
    this.model.client_name = undefined;
    $('#lookupModalBranch').modal('hide');
  }
  //#endregion branch getrole

  //#region Agreement Lookup
  btnLookupAgreement() {
    $('#datatableLookupAgreement').DataTable().clear().destroy();
    $('#datatableLookupAgreement').DataTable({
      'pagingType': 'first_last_numbers',
      'pageLength': 5,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false
      ajax: (dtParameters: any, callback) => {
        // param tambahan untuk getrows dynamic
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_branch_code': this.model.branch_code,
          'p_agreement_status': 'GO LIVE'
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIControllerAgreementMain, this.APIRouteForLookupChangeDueDate).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupagreement = parse.data;
          if (parse.data != null) {
            this.lookupagreement.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [4] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowAgreement(agreement_no: String, agreement_external_no: String, agreement_desc: string, billtype: string, pror: string, billmode: string) {
    this.model.agreement_no           = agreement_no;
    this.model.agreement_external_no  = agreement_external_no;
    this.model.client_name            = agreement_desc;
    this.model.billing_type           = billtype;
    // this.model.billing_mode_date      = billmodedate;
    this.model.billing_mode           = billmode;
    this.model.is_prorate             = pror;
    $('#lookupModalAgreement').modal('hide');
  }
  //#endregion Agreement lookup

  //#region btnPrint
  btnPrint(p_code: string, rpt_code: string, report_name: string) {
    this.showSpinner = true;

    const rptParam = {
      p_user_id: this.userId,
      p_adjustment_duedate_no: p_code,
      p_code: rpt_code,
      p_report_name: report_name,
      p_print_option: 'PDF'
    }

    const dataParam = {
      TableName: this.model.table_name,
      SpName: this.model.sp_name,
      reportparameters: rptParam
    };

    this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownloadReport).subscribe(res => {
      this.showSpinner = false;
      this.printRptNonCore(res);
    }, err => {
      this.showSpinner = false;
      const parse = JSON.parse(err);
      this.swalPopUpMsg(parse.data);
    });
  }
  //#endregion btnPrint

  //#region btnPrintPersetujuan
  btnPrintPersetujuan(p_code: string, rpt_code: string, report_name: string) {
    this.showSpinner = true;

    const rptParam = {
      p_user_id: this.userId,
      p_adjustment_duedate_no: p_code,
      p_code: rpt_code,
      p_report_name: report_name,
      p_print_option: 'PDF'
    }

    const dataParam = {
      TableName: 'RPT_LEMBAR_PERSETUJUAN_OR_SIMULASI_ADJUSTMENT_DUEDATE',
      SpName: 'xsp_rpt_lembar_persetujuan_or_simulasi_adjustment_duedate',
      reportparameters: rptParam
    };

    this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownloadReport).subscribe(res => {
      this.showSpinner = false;
      this.printRptNonCore(res);
    }, err => {
      this.showSpinner = false;
      const parse = JSON.parse(err);
      this.swalPopUpMsg(parse.data);
    });
  }
  //#endregion btnPrint

  //#region List tabs
  // changeduedateinformationwiz() {
  //   this.route.navigate(['/management/subchangeduedatelistifinopl/changeduedatedetail/' + this.param + '/changeduedateinformationlist', this.param], { skipLocationChange: true });
  // }

  changeduedateassetwiz() {
    this.route.navigate(['/management/subchangeduedatelistifinopl/changeduedatedetail/' + this.param + '/changeduedatedetaillistwiz', this.param], { skipLocationChange: true });
  }

  // changeduedatetransactionwiz() {
  //   this.route.navigate(['/management/subchangeduedatelistifinopl/changeduedatedetail/' + this.param + '/changeduedatetransactionlist', this.param], { skipLocationChange: true });
  // }

  // changeduedateagreementamortizationhistorywiz() {
  //   this.route.navigate(['/management/subchangeduedatelistifinopl/changeduedatedetail/' + this.param + '/changeduedateagreementamortizationhistorylist', this.param, this.model.agreement_no], { skipLocationChange: true });
  // }

  //#endregion List tabs

  //#region approval Lookup
  btnViewApproval() {
    $('#datatableLookupApproval').DataTable().clear().destroy();
    $('#datatableLookupApproval').DataTable({
      'pagingType': 'first_last_numbers',
      'pageLength': 5,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false

      ajax: (dtParameters: any, callback) => {
        // param tambahan untuk getrows dynamic
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_reff_no': this.param
        });
        // end param tambahan untuk getrows dynamic

        this.dalservice.GetrowsApv(dtParameters, this.APIControllerApprovalSchedule, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupapproval = parse.data;
          if (parse.data != null) {
            this.lookupapproval.numberIndex = dtParameters.start;
          }

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
  //#endregion approval Lookup

  //#region BillingType Lookup
  btnLookupBillingType() {
    $('#datatableLookupBillingType').DataTable().clear().destroy();
    $('#datatableLookupBillingType').DataTable({
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

        this.dalservice.Getrows(dtParameters, this.APIControllerBillingType, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupbillingtype = parse.data;
          if (parse.data != null) {
            this.lookupbillingtype.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
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

  btnSelectRowBillingType(code: String, description: String) {
    this.model.billing_type = code;
    this.model.billing_type_desc = description;
    $('#lookupModalBillingType').modal('hide');
  }
  //#endregion BillingType lookup
}


