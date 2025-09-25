import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { DatePipe } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './sktdetail.component.html'
})
export class SktdetailComponent extends BaseComponent implements OnInit {

  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public sktmanualData: any = [];
  public isReadOnly: Boolean = false;
  public isButton: Boolean = false;
  public isStatus: Boolean;
  public lookupagreement: any = [];
  public lookupbranch: any = [];
  private setStyle: any = [];
  private rolecode: any = [];
  private dataRoleTamp: any = [];
  private dataTamp: any = [];
  public lookupMasterCollector: any = [];
  //role code
  private RoleAccessCode = 'R00023780000001A';

  //controller
  private APIController: String = 'RepossessionLetter';
  private APIControllerAgreement: String = 'AgreementMain';
  private APIControllerSysEmployee: String = 'SysEmployeeMain';

  //routing
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForGetRole: String = 'ExecSpForGetRole';
  private APIControllerSysBranch: String = 'sysbranch';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForRepossessionLetterLookup: String = 'GetRowsForNotInRepossessionLetterLookup';
  private APIRouteForRequest: String = 'ExecSpForRequest';
  private APIRouteForCancel: String = 'ExecSpForCancel';
  private APIRouteLookupSignerCollector: String = 'GetRowsForLookupSignerCollector';
  private APIRouteLookupMasterCollector: String = 'GetRowsForLookupCollector';
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
      this.callGetrow();
    } else {
      this.model.letter_status = 'HOLD';
      // this.model.letter_proceed_by = 'INTERNAL';
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
    // param tambahan untuk getrow dynamic
    this.dataTamp = [{
      'p_code': this.param
    }];
    // end param tambahan untuk getrow dynamic

    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);
          // checkbox
          //   if (parsedata.is_wo === '1') {
          //     parsedata.is_wo = true;
          //   } else {
          //     parsedata.is_wo = false;
          //   }
          //   if (parsedata.is_remedial === '1') {
          //     parsedata.is_remedial = true;
          //   } else {
          //     parsedata.is_remedial = false;
          //   }
          // end checkbox

          if (parsedata.letter_status !== 'HOLD') {
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

  //#region  form submit
  onFormSubmit(sktmanualForm: NgForm, isValid: boolean) {
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

    this.sktmanualData = this.JSToNumberFloats(sktmanualForm);
    // if (this.sktmanualData.p_is_wo === null) {
    //   this.sktmanualData.p_is_wo = false;
    // }
    // if (this.sktmanualData.p_is_remedial === null) {
    //   this.sktmanualData.p_is_remedial = false;
    // }

    const usersJson: any[] = Array.of(this.sktmanualData);
    if (this.param != null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
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
      // call web service
      this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
        .subscribe(
          res => {
            this.showSpinner = false;
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showNotification('bottom', 'right', 'success');
              this.route.navigate(['/collection/subsktlist/sktdetail', parse.code]);
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
  }
  //#endregion form submit

  //#region button back
  btnBack() {
    this.route.navigate(['/collection/subsktlist']);
    $('#datatableSktManual').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region lookup branch
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
          'default': ''
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

  btnSelectRowBranch(branch_code: String, branch_name: String) {
    this.model.branch_code = branch_code;
    this.model.branch_name = branch_name;
    this.model.agreement_no = ''
    this.model.agreement_external_no = ''
    this.model.client_name = ''
    $('#lookupModalSysBranch').modal('hide');
  }
  //#endregion lookup branch

  //#region lookup Agreement
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
          'p_is_remedial': '0',
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIControllerAgreement, this.APIRouteForRepossessionLetterLookup).subscribe(resp => {
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
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 6] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
    // } , 1000);
  }

  btnSelectRowAgreement(agremeent_no: String, agreement_external_no: String, client_name: String, overdue_invoice_amount: any, ovd_penalty_amount: any, ovd_days: any, ovd_period: any) {
    this.model.agreement_no = agremeent_no;
    this.model.agreement_external_no = agreement_external_no;
    this.model.client_name = client_name;
    this.model.overdue_period = ovd_period;
    this.model.overdue_days = ovd_days;
    this.model.overdue_invoice_amount = overdue_invoice_amount;
    this.model.overdue_penalty_amount = ovd_penalty_amount;
    $('#lookupModalAgreement').modal('hide');
  }
  //#endregion lookup Agreement

  //#region button Post
  btnPost() {
    // param tambahan untuk getrole dynamic
    this.dataRoleTamp = [{
      'p_code': this.param,
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
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForRequest)
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

  //#region button Cancel
  btnCancel(code: string) {
    // param tambahan untuk button Done dynamic
    this.dataRoleTamp = [{
      'p_code': code,
    }];
    // param tambahan untuk button Done dynamic

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
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForCancel)
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
  //#endregion button Cancel

  //#region Signer Collector
  btnLookupSignerCollector() {
    $('#datatableLookupSignerCollector').DataTable().clear().destroy();
    $('#datatableLookupSignerCollector').DataTable({
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
          'p_collector_code': this.model.letter_collector_code
        });
        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysEmployee, this.APIRouteLookupSignerCollector).subscribe(resp => {
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
      columnDefs: [{ orderable: false, width: '5%', targets: [1, 5] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowSignerCollector(code: String, name: String, position: any) {
    this.model.letter_signer_collector_code = code;
    this.model.letter_signer_collector_name = name;
    this.model.letter_signer_collector_position = position;
    $('#lookupModalSignerCollector').modal('hide');
  }
  //#endregion Signer Collector

  //#region ProceedBy
  ProceedBy(event: any) {
    if (event.target.value === 'I') {
      this.model.letter_executor_code = '';
      this.model.executor_name = '';
    } else {
      this.model.letter_collector_code = '';
      this.model.collector_name = '';
    }
  }
  //#endregion ProceedBy

  //#region Master Collector
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
        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysEmployee, this.APIRouteLookupMasterCollector).subscribe(resp => {
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
      columnDefs: [{ orderable: false, width: '5%', targets: [1, 5] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowMasterCollector(code: String, name: String, position: string) {
    this.model.letter_collector_code = code;
    this.model.letter_collector_name = name;
    this.model.letter_collector_position = position;
    this.model.letter_executor_code = '';
    this.model.executor_name = '';
    // (+) Ari 2023-10-20 ket : saat pemilihan collector tidak mereset signer collector sehingga dicomment
    // this.model.letter_signer_collector_code = '';
    // this.model.letter_signer_collector_name = '';
    // this.model.letter_signer_collector_position = '';
    $('#lookupModalMasterCollector').modal('hide');
  }
  //#endregion Master Collector
}
