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
  templateUrl: './sktsettlementdetail.component.html'
})
export class SktsettlementdetailComponent extends BaseComponent implements OnInit {

  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public collateralData: any = [];
  public NumberOnlyPattern = this._numberonlyformat;
  public settlementsktData: any = [];
  public settlementsktlistData: any = [];
  public listsettlementsktdetail: any = [];
  public isReadOnly: Boolean = false;
  public isButton: Boolean = false;
  public tampStatus: String;
  public lookupagreement: any = [];
  public lookupMAK: any = [];
  public lookupMasterExecutor: any = [];
  public lookupMasterCollector: any = [];
  public lookupbranch: any = [];
  private rolecode: any = [];
  private dataRoleTamp: any = [];
  private dataCoreTampI: any = [];
  private dataCoreTampP: any = [];
  private tamps = new Array();
  private dataTamp: any = [];
  private repoData: any = [];
  private setStyle: any = [];

  //role code
  private RoleAccessCode = 'R00023790000001A';

  //controller
  private APIController: String = 'RepossessionLetter';
  private APIControllerAgreementMain: String = 'AgreementMain';
  private APIControllerSktdetail: String = 'RepossessionLetterCollateral';
  private APIControllerMakMain: String = 'MakMain';
  private APIControllerMasterExecutor: String = 'MasterExecutor';
  private APIControllerMasterCollector: String = 'MasterCollector';
  private APIControllerAgreement: String = 'AgreementMain';

  //router
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForUpdateSettlement: String = 'UpdateSettlement';
  private APIRouteForUpdate: String = 'Update';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForGetRole: String = 'ExecSpForGetRole';
  private APIRouteForLookupBranch: String = 'GetRowsLookupSysBranch';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteLookupMasterExecutor: String = 'GetRowsForLookup';
  private APIRouteLookupMasterCollector: String = 'GetRowsForLookup'
  private APIRouteForCollateralUpdate: String = 'UPDATE';
  private APIRouteForPost: String = 'ExecSpForSettlement';
  private APIRouteForGetAmount: String = 'ExecSpForGetAmount';
  private APIRouteForDownloadMailMerge: String = 'MailMergeFile';

  // report
  private APIControllerReport: String = 'Report';
  private APIRouteForDownload: String = 'getReport';

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

    if (this.param != null) {
      this.isReadOnly = true;

      // call web service
      this.callGetrow();
      this.loadData();
    } else {
      this.model.letter_status = 'POST';
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
        // param tambahan untuk getrows dynamic
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_skt_no': this.param
        });
        // end param tambahan untuk getrows dynamic

        this.dalservice.Getrows(dtParameters, this.APIControllerSktdetail, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)

          for (let i = 0; i < parse.data.length; i++) {
            if (parse.data[i].is_success_repo === '1') {
              parse.data[i].is_success_repo = true;
            } else {
              parse.data[i].is_success_repo = false;
            }
          }

          this.listsettlementsktdetail = parse.data;

          if (parse.data != null) {
            this.listsettlementsktdetail.numberIndex = dtParameters.start;
          }

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });

        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 2] }], // for disabled coloumn
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
          if (parsedata.is_wo === '1') {
            parsedata.is_wo = true;
          } else {
            parsedata.is_wo = false;
          }
          if (parsedata.is_remedial === '1') {
            parsedata.is_remedial = true;
          } else {
            parsedata.is_remedial = false;
          }
          // end checkbox

          if (parsedata.letter_status !== 'POST') {
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
  onFormSubmit(settlementsktForm: NgForm, isValid: boolean) {
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

    this.settlementsktData = this.JSToNumberFloats(settlementsktForm);
    if (this.settlementsktData.p_is_wo === null) {
      this.settlementsktData.p_is_wo = false;
    }
    if (this.settlementsktData.p_is_remedial === null) {
      this.settlementsktData.p_is_remedial = false;
    }

    const usersJson: any[] = Array.of(this.settlementsktData);
    if (this.param != null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdateSettlement)
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
              this.route.navigate(['/collection/sublistsettlementsktifincoll/settlementsktdetailifincoll', parse.code]);
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

  //#region button Post
  btnSettlement(isValid: boolean) {
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
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForPost)
          .subscribe(
            res => {
              this.showSpinner = false;
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showNotification('bottom', 'right', 'success');
                this.callGetrow();
                $('#datatableSettlementTskDetail').DataTable().ajax.reload();
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

  //#region Executor detail  form submit
  onFormSubmitdetail(settlementsktlistForm: NgForm) {
    this.settlementsktlistData = settlementsktlistForm;
    const usersJson: any[] = Array.of(this.settlementsktlistData);
    for (let i = 0; i < this.tamps.length; i++) {
      usersJson[0].p_file.push({
        p_code: this.tamps[i].p_code,
        p_base64: this.tamps[i].base64
      });
    }

    // call web service
    this.dalservice.Update(usersJson, this.APIController, this.APIRouteForInsert)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.dalservice.UploadFile(usersJson, this.APIController, this.APIRouteForInsert)
              .subscribe(
                // tslint:disable-next-line:no-shadowed-variable
                res => {
                  // tslint:disable-next-line:no-shadowed-variable
                  const parse = JSON.parse(res);
                  if (parse.result === 1) {
                    this.showNotification('bottom', 'right', 'success');
                    setTimeout(function () { window.location.reload(); }, 500);
                  } else {
                    this.swalPopUpMsg(parse.data);
                  }
                },
                error => {
                  // tslint:disable-next-line:no-shadowed-variable
                  const parse = JSON.parse(error);
                  this.swalPopUpMsg(parse.data);
                });
          } else {
            this.swalPopUpMsg(parse.data);
          }
        },
        error => {
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
  }

  //#endregion on form submit

  //#region button back
  btnBack() {
    this.route.navigate(['/collection/sublistsettlementsktifincoll']);
    $('#datatableSettlementTskList').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region ddl master module
  valueDate(event: any) {
    // this.model.result_date = event.target.value;

    // if (this.model.result_status === 'CURRENT' && this.model.result_date != null) {
    //   this.dataCoreTampP = []
    //   // param tambahan untuk button Generate dynamic
    //   this.dataCoreTampP = [{
    //     'p_agreement_no': this.model.agreement_no,
    //     'p_date': this.model.result_date,
    //     'p_transaction_code': 'OVD_PNLTY',
    //     'action': 'default'
    //   }];
    //   // param tambahan untuk button Generate dynamic

    //   this.dalservice.ExecSpCore(this.dataCoreTampP, this.APIControllerAgreementMain, this.APIRouteForGetAmount)
    //     .subscribe(
    //       res => {
    //         this.showSpinner = false;
    //         const parse = JSON.parse(res);
    //         if (parse.result === 1) {
    //           this.model.current_overdue_penalty_amount = parse.data[0].transaction_amount
    //           this.model.result_received_penalty_amount = parse.data[0].transaction_amount
    //         } else {
    //           this.swalPopUpMsg(parse.data);
    //         }
    //       },
    //       error => {
    //         this.showSpinner = false;
    //         const parse = JSON.parse(error);
    //         this.swalPopUpMsg(parse.data);
    //       });

    //   this.dataCoreTampI = []
    //   // param tambahan untuk button Generate dynamic
    //   this.dataCoreTampI = [{
    //     'p_agreement_no': this.model.agreement_no,
    //     'p_date': this.model.result_date,
    //     'p_transaction_code': 'OVD_INSTL',
    //     'action': 'default'
    //   }];
    //   // param tambahan untuk button Generate dynamic

    //   this.dalservice.ExecSpCore(this.dataCoreTampI, this.APIControllerAgreementMain, this.APIRouteForGetAmount)
    //     .subscribe(
    //       res => {
    //         this.showSpinner = false;
    //         const parse = JSON.parse(res);
    //         if (parse.result === 1) {
    //           this.model.current_overdue_installment_amount = parse.data[0].transaction_amount
    //           this.model.result_received_installment_amount = parse.data[0].transaction_amount
    //         } else {
    //           this.swalPopUpMsg(parse.data);
    //         }
    //       },
    //       error => {
    //         this.showSpinner = false;
    //         const parse = JSON.parse(error);
    //         this.swalPopUpMsg(parse.data);
    //       });
    // }
  }
  //#endregion ddl master module

  //#region ddl master module
  ResultStatus(event: any) {
    // this.model.result_status = event.target.value;

    // if (this.model.result_status === 'FAILED') {
    //   this.model.result_action = 'CHANGE'
    // } else {
    //   this.model.result_action = ''
    // }

    // if (this.model.result_status === 'CURRENT' && this.model.result_date != null) {
    //   this.dataCoreTampP = []
    //   // param tambahan untuk button Generate dynamic
    //   this.dataCoreTampP = [{
    //     'p_agreement_no': this.model.agreement_no,
    //     'p_date': this.model.result_date,
    //     'p_transaction_code': 'OVD_PNLTY',
    //     'action': 'default'
    //   }];
    //   // param tambahan untuk button Generate dynamic

    //   this.dalservice.ExecSpCore(this.dataCoreTampP, this.APIControllerAgreementMain, this.APIRouteForGetAmount)
    //     .subscribe(
    //       res => {
    //         this.showSpinner = false;
    //         const parse = JSON.parse(res);
    //         if (parse.result === 1) {
    //           this.model.current_overdue_penalty_amount = parse.data[0].transaction_amount
    //           this.model.result_received_penalty_amount = parse.data[0].transaction_amount
    //         } else {
    //           this.swalPopUpMsg(parse.data);
    //         }
    //       },
    //       error => {
    //         this.showSpinner = false;
    //         const parse = JSON.parse(error);
    //         this.swalPopUpMsg(parse.data);
    //       });

    //   this.dataCoreTampI = []
    //   // param tambahan untuk button Generate dynamic
    //   this.dataCoreTampI = [{
    //     'p_agreement_no': this.model.agreement_no,
    //     'p_date': this.model.result_date,
    //     'p_transaction_code': 'OVD_INSTL',
    //     'action': 'default'
    //   }];
    //   // param tambahan untuk button Generate dynamic

    //   this.dalservice.ExecSpCore(this.dataCoreTampI, this.APIControllerAgreementMain, this.APIRouteForGetAmount)
    //     .subscribe(
    //       res => {
    //         this.showSpinner = false;
    //         const parse = JSON.parse(res);
    //         if (parse.result === 1) {
    //           this.model.current_overdue_installment_amount = parse.data[0].transaction_amount
    //           this.model.result_received_installment_amount = parse.data[0].transaction_amount
    //         } else {
    //           this.swalPopUpMsg(parse.data);
    //         }
    //       },
    //       error => {
    //         this.showSpinner = false;
    //         const parse = JSON.parse(error);
    //         this.swalPopUpMsg(parse.data);
    //       });
    // } else {
    //   this.model.current_overdue_penalty_amount = 0
    //   this.model.result_received_penalty_amount = 0
    //   this.model.current_overdue_installment_amount = 0
    //   this.model.result_received_installment_amount = 0
    //   this.model.result_received_deposit_amount = 0
    // }
  }
  //#endregion ddl master module

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
        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForLookupBranch).subscribe(resp => {
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
          'default': ''
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIControllerAgreement, this.APIRouteForLookup).subscribe(resp => {
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

  btnSelectRowAgreement(agremeent_no: String, agreement_external_no: String, client_name: String) {
    this.model.agreement_no = agremeent_no;
    this.model.agreement_external_no = agreement_external_no;
    this.model.client_name = client_name;
    $('#lookupModalAgreement').modal('hide');
  }
  //#endregion lookup Agreement

  //#region mak no Lookup
  btnLookupMAK() {
    $('#datatableLookupMAK').DataTable().clear().destroy();
    $('#datatableLookupMAK').DataTable({
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
          'p_mak_status': 'APPROVE',
          'p_is_remedial': '0'
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIControllerMakMain, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupMAK = parse.data;
          if (parse.data != null) {
            this.lookupMAK.numberIndex = dtParameters.start;
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
  }

  btnSelectRowMAK(mak_code: String, mak_no: String) {
    this.model.mak_code = mak_code;
    this.model.mak_no = mak_no;
    $('#lookupModalMAK').modal('hide');
  }
  //#endregion mak no lookup

  //#region Master Executor
  btnLookupMasterExecutor() {
    $('#datatableLookupMasterExecutor').DataTable().clear().destroy();
    $('#datatableLookupMasterExecutor').DataTable({
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
        this.dalservice.Getrows(dtParameters, this.APIControllerMasterExecutor, this.APIRouteLookupMasterExecutor).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupMasterExecutor = parse.data;
          if (parse.data != null) {
            this.lookupMasterExecutor.numberIndex = dtParameters.start;
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

  btnSelectRowMasterExecutor(code: String, name: String) {
    this.model.branch_code = code;
    this.model.branch_name = name;
    $('#lookupModalMasterExecutor').modal('hide');
  }
  //#endregion Master Executor

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
        // param tambahan untuk getrows dynamic
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'default': ''
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIControllerMasterCollector, this.APIRouteLookupMasterCollector).subscribe(resp => {
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

  btnSelectRowMasterCollector(code: String, name: String) {
    this.model.collector_code = code;
    this.model.collector_name = name;
    $('#lookupModalMasterCollector').modal('hide');
  }
  //#endregion Master Collector

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
        // param tambahan untuk getrows dynamic
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'default': ''
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIControllerMasterCollector, this.APIRouteLookupMasterCollector).subscribe(resp => {
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

  btnSelectRowSignerCollector(code: String, name: String) {
    this.model.collector_code = code;
    this.model.collector_name = name;
    $('#lookupModalSignerCollector').modal('hide');
  }
  //#endregion Signer Collector

  //#region button save list
  btnSaveList() {
    this.repoData = [];
    var i = 0;

    var getID = $('[name="p_id"]')
      .map(function () { return $(this).val(); }).get();

    var getStatus = $('[name="p_is_success_repo"]')
      .map(function () { return $(this).prop('checked'); }).get();

    while (i < getID.length) {

      while (i < getStatus.length) {

        this.repoData.push({
          p_id: getID[i],
          p_is_success_repo: getStatus[i],
        });

        i++;
      }

      i++;
    }

    //#region web service
    this.dalservice.Update(this.repoData, this.APIControllerSktdetail, this.APIRouteForCollateralUpdate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);

          if (parse.result === 1) {
            $('#datatableSettlementTskDetail').DataTable().ajax.reload();
            this.showNotification('bottom', 'right', 'success');
          } else {
            this.swalPopUpMsg(parse.data);
          }
        },
        error => {
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);

        });
    //#endregion web service
  }
  //#endregion button save list

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

  //#endregion button print
}
