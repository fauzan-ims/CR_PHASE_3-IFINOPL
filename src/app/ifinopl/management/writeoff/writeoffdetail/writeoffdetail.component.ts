import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { DatePipe } from '@angular/common';
// import { log } from 'console';

// call function from js shared
declare function headerPage(controller, route): any;
declare function hideButtonLink(idbutton): any;
declare function hideTabWizard(): any;

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './writeoffdetail.component.html'
})

export class WriteoffdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public writeoffData: any = [];
  public isReadOnly: Boolean = false;
  public lookupAgreement: any = [];
  public lookupbranch: any = [];
  public lookupslikcondition: any = [];
  public lookupapproval: any = [];
  public isButton: Boolean = false; 
  private dataTamps: any = [];
  private dataTamp: any = [];
  private setStyle: any = [];

  private APIControllerWriteOffMain: String = 'WriteOffMain';
  private APIControllerSysBranch: String = 'SysBranch';
  private APIControllerAgreementMain: String = 'AgreementMain';
  private APIControllerApprovalSchedule: String = 'ApprovalSchedule';

  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForUpdate: String = 'Update';
  private APIRouteForInsert: String = 'Insert';

  private APIRouteForlookup: String = 'GetRowsForLookup';
  private APIRouteForlookupWo: String = 'GetRowsForLookupWO';

  private APIRouteForProceed: String = 'ExecSpForGetProceed';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForPost: String = 'ExecSpForGetPost';
  private APIRouteForCancel: String = 'ExecSpForGetCancel';
  private APIRouteForRevert: String = 'ExecSpForGetRevert';

  // report
  private APIControllerReport: String = 'Report';
  private APIRouteForDownload: String = 'getReport';

  private RoleAccessCode = 'R00020890000000A';

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
    this.Delimiter(this._elementRef);
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.wizard();
    if (this.param != null) {
      this.isReadOnly = true;

      this.callGetrow();
      this.writeoffdetailwiz();
    } else {
      this.model.wo_status = 'HOLD';
      this.model.wo_type = "WO";
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

  //#region ddl WoType
  WoType(event: any) {
    this.model.wo_type = event.target.value; 
  }
  //#endregion ddl WoType

  //#region getrow data
  callGetrow() {

    this.dataTamp = [{
      'p_code': this.param,
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIControllerWriteOffMain, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);
          // this.wizard();
          // this.writeoffinformationwiz();

          if (parsedata.wo_status !== 'HOLD') {
            this.isButton = true;
          } else {
            this.isButton = false;
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

  //#region form submit
  onFormSubmit(writeoffForm: NgForm, isValid: boolean) {
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

    //this.writeoffData = writeoffForm;
    this.writeoffData = this.JSToNumberFloats(writeoffForm);
    const usersJson: any[] = Array.of(this.writeoffData);

    if (this.param != null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIControllerWriteOffMain, this.APIRouteForUpdate)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showSpinner = false;
              this.showNotification('bottom', 'right', 'success');
              this.callGetrow();
              $('#datatableWoInformation').DataTable().ajax.reload();
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
      this.dalservice.Insert(usersJson, this.APIControllerWriteOffMain, this.APIRouteForInsert)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showNotification('bottom', 'right', 'success');
              this.route.navigate(['/management/subwriteofflist/writeoffdetail', parse.code]);
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
  //#endregion writeoffDetail form submit

  //#region button back
  btnBack() {
    $('#datatableWriteOff').DataTable().ajax.reload();
    this.route.navigate(['/management/subwriteofflist']);
  }
  //#endregion button back

  //#region button Proceed
  btnProceed(isValid: boolean) {
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
    // param tambahan untuk button Proceed dynamic
    this.dataTamps = [{
      'p_code': this.param,
      'action': 'default'
    }];
    // param tambahan untuk button Proceed dynamic

    swal({
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: this._deleteconf,

      buttonsStyling: false
    }).then((result) => {
      this.showSpinner = true;
      if (result.value) {
        // call web service
        this.dalservice.ExecSp(this.dataTamps, this.APIControllerWriteOffMain, this.APIRouteForProceed)
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
    });
  }
  //#endregion button Proceed

  //#region button Cancel
  btnCancel() {
    // param tambahan untuk button Proceed dynamic
    this.dataTamps = [{
      'p_code': this.param,
      'action': ''
    }];
    // param tambahan untuk button Proceed dynamic

    swal({
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: this._deleteconf,

      buttonsStyling: false
    }).then((result) => {
      this.showSpinner = true;
      if (result.value) {
        // call web service
        this.dalservice.ExecSp(this.dataTamps, this.APIControllerWriteOffMain, this.APIRouteForCancel)
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
    });
  }
  //#endregion button Cancel

  //#region button Revert
  btnRevert() {
    // param tambahan untuk button Proceed dynamic
    this.dataTamps = [{
      'p_code': this.param,
      'action': ''
    }];
    // param tambahan untuk button Proceed dynamic

    swal({
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: this._deleteconf,

      buttonsStyling: false
    }).then((result) => {
      this.showSpinner = true;
      if (result.value) {
        // call web service
        this.dalservice.ExecSp(this.dataTamps, this.APIControllerWriteOffMain, this.APIRouteForRevert)
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
    });
  }
  //#endregion button Revert

  //#region button Revert
  btnApprove() {
    // param tambahan untuk button Proceed dynamic
    this.dataTamps = [{
      'p_code': this.param,
      'action': ''
    }];
    // param tambahan untuk button Proceed dynamic

    swal({
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: this._deleteconf,

      buttonsStyling: false
    }).then((result) => {
      this.showSpinner = true;
      if (result.value) {
        // call web service
        this.dalservice.ExecSp(this.dataTamps, this.APIControllerWriteOffMain, this.APIRouteForPost)
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
    });
  }
  //#endregion button Revert

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

        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_cre_by': this.uid
        });

        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBranch, this.APIRouteForlookup).subscribe(resp => {
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

  btnSelectRowBranch(branch_code: String, branch_name: String) {
    this.model.branch_code = branch_code;
    this.model.branch_name = branch_name;
    this.model.agreement_no = undefined;
    this.model.client_name = undefined;
    $('#lookupModalBranch').modal('hide');
  }
  //#endregion lookup branch

  //#region lookup agreement
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
        // tambahan param untuk getrows dynamic
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_branch_code': this.model.branch_code,
        });
        // endtambahan param untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIControllerAgreementMain, this.APIRouteForlookupWo).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupAgreement = parse.data;
          if (parse.data != null) {
            this.lookupAgreement.numberIndex = dtParameters.start;
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
    // } , 1000);
  }

  btnSelectRowAgreement(agreement_no: String, agreement_external_no: String, client_name: String, agreement_sub_status: String) {
    this.model.agreement_no = agreement_no;
    this.model.agreement_external_no = agreement_external_no;
    this.model.client_name = client_name;
    this.model.agreement_sub_status = agreement_sub_status;

    $('#lookupModalAgreement').modal('hide');
  }
  //#endregion lookup agreement

  //#region List tabs
  writeoffdetailwiz() {
    this.route.navigate(['/management/subwriteofflist/writeoffdetail/' + this.param + '/writeoffdetaillist', this.param], { skipLocationChange: true });
  }

  writeoffinformationwiz() {
    this.route.navigate(['/management/subwriteofflist/writeoffdetail/' + this.param + '/writeoffinformationlist', this.param], { skipLocationChange: true });
  }
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

        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_reff_no': this.param
        });


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

  //#region button print

  btnPrint() {
    this.showSpinner = true;
    const dataParam = {
      TableName: this.model.table_name,
      SpName: this.model.sp_name,
      reportparameters: {
        p_user_id: this.userId,
        p_code: this.param,
        p_print_option: 'PDF'
      }
    };

    this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
      this.printRptNonCore(res);
      this.showSpinner = false;
    }, err => {
      this.showSpinner = false;
      const parse = JSON.parse(err);
      this.swalPopUpMsg(parse.data);
    });
  }
  //#end region button print

  //#region button print surat tagih
  btnPrintSuratTagih() {
    this.showSpinner = true;
    const dataParam = {
      TableName: 'RPT_SURAT_TAGIH_WRITE_OFF',
      SpName: 'xsp_rpt_surat_tagih_write_off',
      reportparameters: {
        p_user_id: this.userId,
        p_wo_no: this.model.code,
        p_print_option: 'PDF'
      }
    };

    this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
      this.printRptNonCore(res);
      this.showSpinner = false;
    }, err => {
      this.showSpinner = false;
      const parse = JSON.parse(err);
      this.swalPopUpMsg(parse.data);
    });
  }

  //#end region button print surat tagih
}


