import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import swal from 'sweetalert2';
import { DALService } from '../../../../../../../DALservice.service';
import { NgForm } from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './applicationmaindetail.component.html'
})

export class ObjectInfoApplicationmaindetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  pageType = this.getRouteparam.snapshot.paramMap.get('pagetype');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public listexposureData: any = [];
  public isStatus: Boolean = false;
  public isProceed: Boolean = false;
  public isCancel: Boolean = false;
  public isApproval: Boolean = false;
  public applicationmaindetailData: any = [];
  public isReadOnly: Boolean = false;
  public isSimulation: Boolean = false;
  public lookupfacility: any = [];
  public lookupcurrency: any = [];
  public lookupsysbranch: any = [];
  public lookupmarketing: any = [];
  public lookupclient: any = [];
  public lookupSelectView: any = [];
  public lookupbillingtype: any = [];
  public setStyle: any = [];
  private oldApplicationDate: Boolean = false;
  private dataTamp: any = [];
  private dataTampCms: any = [];
  private dataTampClientStatus: any = [];
  public EmailPattern = this._emailformat;
  private ExistingAgreement: any;
  private ApplicationInProcess: any;
  private dataTempThirdParty: any = [];
  private ClientPersonalIframe: any;
  private ClientCompanyIframe: any;
  public amountFinanceAmount: any = 0;
  public osInstallmentAmount: any = 0;
  public installmentAmount: any = 0;
  public ovdInstallmentAmount: any = 0;

  private APIController: String = 'ApplicationMain';
  private APIControllerSysGlobalParam: String = 'SysGlobalParam';
  private APIControllerClientMain: String = 'ClientMain';
  private APIControllerAgreementMain: String = 'AgreementMain';
  private APIControllerApplicationExposure: String = 'ApplicationExposure';
  private APIControllerFacility: String = 'MasterFacility';
  private APIControllerSysBranch: String = 'SysBranch';
  private APIControllerSysEmployeeMain: String = 'SysEmployeeMain';
  private APIControllerCurrency: String = 'SysCurrency';
  private APIControllerAgreementInformation: String = 'AgreementInformation';
  private APIControllerBillingType: String = 'MasterBillingType';
  private APIControllerIntergration: String = 'Intergration';

  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForGetThirddParty: String = 'ExecSpForGetThirddParty';
  private APIRouteForGetRows: String = 'GETROWS';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForDelete: String = 'DELETE';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForUpdateStatus: String = 'UpdateStatus';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForValidate: String = 'ExecSpForValidateRulesandDeviation';
  private APIRouteForExecSpForBlacklistValidation: String = 'ExecSpForBlacklistValidation';
  private APIRouteForInsertExposure: String = 'ExecSpForInsertExposure';
  private APIRouteForProceed: String = 'ExecSpForProceed';
  private APIRouteForRejectAfterApproval: String = 'ExecSpForRejectAfterApproval';
  private APIRouteForCancel: String = 'ExecSpForCancel';
  private APIRouteForBackToEntry: String = 'ExecSpForBackToEntry';
  private APIRouteForExecSpForGetOsInstallmentAmount: String = 'ExecSpForGetOsInstallmentAmount';
  private APIRouteForGetAgrmntHist: String = 'GetAgrmntHist';
  private APIRouteForThirdPartyGetToken: String = 'ThirdPartyGetToken';

  // report
  private APIControllerReport: String = 'Report';
  private APIRouteForDownload: String = 'getReport';

  private RoleAccessCode = 'R00022400000000A'; // role access 

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = false;
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
    
    // this.smartWizard();
    this.Delimiter(this._elementRef);
    if (this.param != null) {
      this.isReadOnly = true;
      this.callGetrow();
      this.callGlobalParamForThirdPartyIframeClient();
      this.callGlobalParamForThirdPartyExposure();
      // call web service
      this.callGetrowWizard();
    } else {
      this.model.application_date = new Date();
      this.model.lease_type = 'DL';
      this.model.buyback_type = 'NG';
      this.model.application_status = 'HOLD';
      this.model.level_status = 'ENTRY';
      this.showSpinner = false;
    }
  }

  //#region GlobalParam for Thirdparty
  callGlobalParamForThirdPartyExposure() {

    this.dataTempThirdParty = [{
      'p_type': "EXPOSURE",
      'action': "getResponse"
    }];

    this.dalservice.ExecSp(this.dataTempThirdParty, this.APIControllerSysGlobalParam, this.APIRouteForGetThirddParty)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data);

          for (let i = 0; i < parsedata.length; i++) {
            if (parsedata[i].code === 'ENLOS01') {
              this.ExistingAgreement = parsedata[i].value
            } else if (parsedata[i].code === 'ENLOS02') {
              this.ApplicationInProcess = parsedata[i].value
            }
          }

          this.showSpinner = false;
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
  }

  callGlobalParamForThirdPartyIframeClient() {

    this.dataTempThirdParty = [{
      'p_type': "CLIENT_IFRAME",
      'action': "getResponse"
    }];

    this.dalservice.ExecSp(this.dataTempThirdParty, this.APIControllerSysGlobalParam, this.APIRouteForGetThirddParty)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data);

          for (let i = 0; i < parsedata.length; i++) {
            if (parsedata[i].code === 'ENIFR01') {
              this.ClientPersonalIframe = parsedata[i].value
            } else if (parsedata[i].code === 'ENIFR02') {
              this.ClientCompanyIframe = parsedata[i].value
            }
          }

          this.showSpinner = false;
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
  }
  //#endregion GlobalParam for Thirdparty

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

  //#region btnPrint
  btnPrint() {
    this.showSpinner = true;
    this.dataTamp = {
      'p_user_id': this.userId,
      'p_application_no': this.param,
      'p_agreement_no': this.model.agreement_no,
      'p_print_option': 'PDF',
      'p_type': 'APPLICATION'
    };

    const dataParam = {
      TableName: 'RPT_AMORTIZATION_INFO',
      SpName: 'xsp_rpt_amortization_info',
      reportparameters: this.dataTamp
    };
    this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
      this.showSpinner = false;
      this.printRptNonCore(res);
    }, err => {
      this.showSpinner = false;
      const parse = JSON.parse(err);
      this.swalPopUpMsg(parse.data);
    });
  }
  //#endregion btnPrint

  //#region getrow data
  callGetrow() {

    this.dataTamp = [{
      'p_application_no': this.param
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          if (parsedata.application_date !== null) {
            this.oldApplicationDate = true;
          }

          if (parsedata.is_blacklist_area === '1') {
            parsedata.is_blacklist_area = true;
          } else {
            parsedata.is_blacklist_area = false;
          }

          if (parsedata.is_blacklist_job === '1') {
            parsedata.is_blacklist_job = true;
          } else {
            parsedata.is_blacklist_job = false;
          }

          if (parsedata.is_rent_to_own === '1') {
            parsedata.is_rent_to_own = true;
          } else {
            parsedata.is_rent_to_own = false;
          }

          if (parsedata.application_status !== 'HOLD') {
            this.isStatus = true;
            this.isCancel = false;
          }
          if (parsedata.application_status === 'CANCEL' || parsedata.application_status === 'ON PROCESS') {
            this.isCancel = true;
          }

          if (parsedata.is_purchase_requirement_after_lease === '1') {
            parsedata.is_purchase_requirement_after_lease = true;
          } else {
            parsedata.is_purchase_requirement_after_lease = false;
          }

          if (parsedata.is_approval === '1') {
            this.isApproval = true;
          }

          if (parsedata.is_simulation === '1') {
            this.isSimulation = true
          } else {
            this.isSimulation = false
          }

          // mapper dbtoui
          Object.assign(this.model, parsedata);
          // end mapper dbtoui

          this.showSpinner = false;
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
  }
  //#endregion getrow data

  //#region callGetrowWizard
  callGetrowWizard() {

    this.dataTamp = [{
      'p_application_no': this.param
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          if (parsedata.application_date != null) {
            if (parsedata.is_simulation === '1') {
              $('#surveywiz').remove();
              $('#legalwiz').remove();
            }
            setTimeout(() => {
              this.wizard();
              this.assetwiz();
            }, 200);
          }

          if (parsedata.is_purchase_requirement_after_lease === '1') {
            parsedata.is_purchase_requirement_after_lease = true;
          } else {
            parsedata.is_purchase_requirement_after_lease = false;
          }

          if (parsedata.is_blacklist_area === '1') {
            parsedata.is_blacklist_area = true;
          } else {
            parsedata.is_blacklist_area = false;
          }

          if (parsedata.is_blacklist_job === '1') {
            parsedata.is_blacklist_job = true;
          } else {
            parsedata.is_blacklist_job = false;
          }

          if (parsedata.is_rent_to_own === '1') {
            parsedata.is_rent_to_own = true;
          } else {
            parsedata.is_rent_to_own = false;
          }

          // mapper dbtoui
          Object.assign(this.model, parsedata);
          // end mapper dbtoui

          this.showSpinner = false;
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
  }
  //#endregion callGetrowWizard

  //#region btnCheck
  btnCheck(client_no: string) {
    this.showSpinner = true;
    this.dataTamp = [{
      'p_client_no': client_no,
      'p_application_no': this.param,
      'action': 'getResponse'
    }];

    const tempExiAgr = {
      "reff_no": this.param,
      "requestDateTime": new Date(),
      "rowVersion": "",
      "listCustNo": [
        client_no
      ],
      "GetDataType": "AGREEMENT EXPOSURE",
      "URL": this.ExistingAgreement
    };
    const tempAppInPro = {
      "reff_no": this.param,
      "CustNo": client_no,
      "GetDataType": "AGREEMENT EXPOSURE",
      "URL": this.ExistingAgreement
    };

    // call web service 
    this.dalservice.Delete(this.dataTamp, this.APIControllerApplicationExposure, this.APIRouteForDelete)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {

            // this.dalservice.Getrow(tempExiAgr, this.APIControllerIntergration, this.APIRouteForGetAgrmntHist)
            //   .subscribe(
            //     res => {
            //       const parse = JSON.parse(res);
            //       this.dataTamp = [];
            //       this.dataTamp = parse.data;

            //       if (parse.result === 1) {
            this.dalservice.Getrow(tempAppInPro, this.APIControllerIntergration, this.APIRouteForGetAgrmntHist)
              .subscribe(
                res => {
                  const parse = JSON.parse(res);
                  this.dataTamp = [];
                  this.dataTamp = parse.data;

                  if (parse.result === 1) {
                    $("#btnViewExposureApplication").click();
                    this.showSpinner = false;
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
            //   } else {
            //     this.showSpinner = false;
            //     this.swalPopUpMsg(parse.data);
            //   }
            // },
            // error => {
            //   this.showSpinner = false;
            //   const parse = JSON.parse(error);
            //   this.swalPopUpMsg(parse.data);
            // });
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
  //#endregion btnCheck

  //#region btnView
  btnView() {
    $('#datatableLookupSelectView').DataTable().clear().destroy();
    $('#datatableLookupSelectView').DataTable({
      pagingType: 'full_numbers',
      responsive: true,
      processing: true,
      serverSide: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false
      ajax: (dtParameters: any, callback) => {

        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_application_no': this.param,
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerApplicationExposure, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupSelectView = parse.data;
          this.lookupSelectView.numberIndex = dtParameters.start;

          this.calculateTotalExposureAmount();
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          })
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, searchable: false, width: '5%', targets: [0, 1] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }
  //#endregion btnView

  //#region calculateTotalExposureAmount
  calculateTotalExposureAmount() {
    this.dataTamp = [{
      'p_application_no': this.param,
      'action': 'getResponse'
    }];
    this.dalservice.Getrow(this.dataTamp, this.APIControllerApplicationExposure, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data);

          if (parse.result === 1) {
            this.amountFinanceAmount = parsedata[0].amountFinanceAmount;
            this.osInstallmentAmount = parsedata[0].osInstallmentAmount;
            this.installmentAmount = parsedata[0].installmentAmount;
            this.ovdInstallmentAmount = parsedata[0].ovdInstallmentAmount;
            this.showSpinner = false;
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
  //#endregion calculateTotalExposureAmount

  //#region btnProceed
  btnProceed(code: any) {
    // this.dataTamp = [{
    //   'p_application_no': code,
    //   'action': 'default'
    // }];

    // swal({
    //   allowOutsideClick: false,
    //   title: 'Are you sure?',
    //   type: 'warning',
    //   showCancelButton: true,
    //   confirmButtonClass: 'btn btn-success',
    //   cancelButtonClass: 'btn btn-danger',
    //   confirmButtonText: 'Yes',
    //   buttonsStyling: false
    // }).then((result) => {
    //   this.showSpinner = true;
    //   if (result.value) {
    //     this.dataTampCms = [{
    //       'p_client_no': this.model.client_no,
    //       'action': 'getResponse'
    //     }];

    //     this.dalservice.ExecSpCore(this.dataTampCms, this.APIControllerAgreementInformation, this.APIRouteForExecSpForGetOsInstallmentAmount)
    //       .subscribe(
    //         resOsInstallmentAmount => {
    //           const parseOsInstallmentAmount = JSON.parse(resOsInstallmentAmount);

    //           if (parseOsInstallmentAmount.result === 1) {
    //             this.dalservice.ExecSpCms(this.dataTampCms, this.APIControllerClientMain, this.APIRouteForExecSpForBlacklistValidation)
    //               .subscribe(
    //                 resBlacklistValidation => {
    //                   const parseBlacklistValidation = JSON.parse(resBlacklistValidation);
    //                   if (parseBlacklistValidation.result === 1) {

    //                     this.dataTampClientStatus = [{
    //                       'p_reff_no': this.param,
    //                       'p_is_red_flag': parseBlacklistValidation.data[0].is_red_flag,
    //                       'p_watchlist_status': parseBlacklistValidation.data[0].watchlist_status,
    //                       'p_group_limit_amount': parseBlacklistValidation.data[0].group_limit_amount,
    //                       'p_os_expousure_amount': parseOsInstallmentAmount.data[0].os_installment_amount
    //                     }];

    //                     this.dalservice.Update(this.dataTampClientStatus, this.APIControllerClientMain, this.APIRouteForUpdateStatus)
    //                       .subscribe(
    //                         resUpdateClientStatus => {
    //                           const parseUpdateClientStatus = JSON.parse(resUpdateClientStatus);
    //                           if (parseUpdateClientStatus.result === 1) {
    //                             this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForValidate)
    //                               .subscribe(
    //                                 resValidationDeviation => {
    //                                   const parseValidationDeviation = JSON.parse(resValidationDeviation);
    //                                   if (parseValidationDeviation.result === 1) {
    //                                     this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForProceed)
    //                                       .subscribe(
    //                                         resProceed => {
    //                                           const parseProceed = JSON.parse(resProceed);
    //                                           if (parseProceed.result === 1) {


    //                                             this.isProceed = true;
    //                                             this.isCancel = false;
    //                                             if (this.pageType === 'banberjalan') {
    //                                               this.route.navigate(['/inquiry/inquiryapplicationmain']);
    //                                             } else {
    //                                               this.route.navigate(['/inquiry/subapplicationmainlist']);
    //                                             }
    //                                             $('#datatableApplicationMainList').DataTable().ajax.reload();
    //                                             this.showNotification('bottom', 'right', 'success');
    //                                             this.showSpinner = false;
    //                                           } else {
    //                                             this.swalPopUpMsg(parseProceed.data);
    //                                             this.showSpinner = false;
    //                                           }
    //                                         },
    //                                         error => {
    //                                           const parseProceed = JSON.parse(error);
    //                                           this.swalPopUpMsg(parseProceed.data)
    //                                           this.showSpinner = false;
    //                                         });
    //                                   } else {
    //                                     this.swalPopUpMsg(parseValidationDeviation.data);
    //                                     this.showSpinner = false;
    //                                   }
    //                                 },
    //                                 error => {
    //                                   const parseValidationDeviation = JSON.parse(error);
    //                                   this.swalPopUpMsg(parseValidationDeviation.data)
    //                                   this.showSpinner = false;
    //                                 });
    //                           } else {
    //                             this.swalPopUpMsg(parseUpdateClientStatus.data);
    //                             this.showSpinner = false;
    //                           }
    //                         },
    //                         error => {
    //                           const parseUpdateClientStatus = JSON.parse(error);
    //                           this.swalPopUpMsg(parseUpdateClientStatus.data)
    //                           this.showSpinner = false;
    //                         });
    //                   } else {
    //                     this.swalPopUpMsg(parseBlacklistValidation.data);
    //                     this.showSpinner = false;
    //                   }
    //                 },
    //                 error => {
    //                   const parseBlacklistValidation = JSON.parse(error);
    //                   this.swalPopUpMsg(parseBlacklistValidation.data)
    //                   this.showSpinner = false;
    //                 });
    //           } else {
    //             this.swalPopUpMsg(parseOsInstallmentAmount.data);
    //             this.showSpinner = false;
    //           }
    //         },
    //         error => {
    //           const parseOsInstallmentAmount = JSON.parse(error);
    //           this.swalPopUpMsg(parseOsInstallmentAmount.data)
    //           this.showSpinner = false;
    //         });
    //   } else {
    //     this.showSpinner = false;
    //   }
    // });
  }
  //#endregion btnProceed

  //#region btnCancel
  btnCancel(code: any) {

    this.dataTamp = [{
      'p_application_no': code,
      'action': 'default'
    }];

    swal({
      allowOutsideClick: false,
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
                this.isStatus = true
                this.isCancel = true;
                this.showNotification('bottom', 'right', 'success');
                if (this.pageType === 'banberjalan') {
                  this.route.navigate(['/inquiry/inquiryapplicationmain']);
                } else {
                  this.route.navigate(['/inquiry/subapplicationmainlist']);
                }
                $('#datatableApplicationMainList').DataTable().ajax.reload();
                this.showSpinner = false;
              } else {
                this.swalPopUpMsg(parse.data);
                this.showSpinner = false;
              }
            },
            error => {
              const parse = JSON.parse(error);
              this.swalPopUpMsg(parse.data)
              this.showSpinner = false;
            });
      } else {
        this.showSpinner = false;
      }
    });
  }
  //#endregion btnCancel

  //#region btnReturn
  btnReturn(code: any) {
    swal({
      html:
        '<label style="float: left; font-size:12px">Remark</label>' +
        '<div class="form-group">' +
        '<textarea id="input-remark" type="text" class="form-control" ></textarea>' +
        '</div>' +
        '<label style="float: left; font-size:12px">Password</label>' +
        '<div class="form-group">' +
        '<input id="input-password" type="password" class="form-control" />' +
        '</div>',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Yes',
      buttonsStyling: false
    }).then((result) => {
      this.showSpinner = true;
      if (result.value) {
        const remark = $('#input-remark').val();
        const password = $('#input-password').val();

        this.dataTamp = [{
          'p_application_no': code,
          'p_approval_reff': password,
          'p_approval_remark': remark,
          'action': 'default'
        }];


        this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForBackToEntry)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {

                if (this.pageType === 'banberjalan') {
                  this.route.navigate(['/inquiry/inquiryapplicationmain']);
                } else {
                  this.route.navigate(['/inquiry/subapplicationmainlist']);
                }
                $('#datatableApplicationMainList').DataTable().ajax.reload();

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
        this.showSpinner = false;
      }
    });
  }
  //#endregion btnReturn

  //#region btnReject
  btnReject(code: any) {
    swal({
      html:
        '<label style="float: left; font-size:12px">Remark</label>' +
        '<div class="form-group">' +
        '<textarea id="input-remark" type="text" class="form-control" ></textarea>' +
        '</div>' +
        '<label style="float: left; font-size:12px">Password</label>' +
        '<div class="form-group">' +
        '<input id="input-password" type="password" class="form-control" />' +
        '</div>',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Yes',
      buttonsStyling: false
    }).then((result) => {
      this.showSpinner = true;
      if (result.value) {
        const remark = $('#input-remark').val();
        const password = $('#input-password').val();

        this.dataTamp = [{
          'p_application_no': code,
          'p_approval_reff': password,
          'p_approval_remark': remark,
          'action': 'default'
        }];


        this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForRejectAfterApproval)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showSpinner = false;
                this.showNotification('bottom', 'right', 'success');
                if (this.pageType === 'banberjalan') {
                  this.route.navigate(['/inquiry/inquiryapplicationmain']);
                } else {
                  this.route.navigate(['/inquiry/subapplicationmainlist']);
                }
                $('#datatableApplicationMainList').DataTable().ajax.reload();
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
  //#endregion btnReject

  //#region reset()
  restePackage() {
    this.model.package_code = undefined;
    this.model.package_name = undefined;
    this.model.facility_code = undefined;
    this.model.facility_desc = undefined;
    this.model.purpose_loan_code = undefined;
    this.model.purpose_loan_name = undefined;
    this.model.purpose_loan_detail_code = undefined;
    this.model.purpose_loan_detail_name = undefined;
    this.model.currency_code = undefined;
    this.model.currency_desc = undefined;
  }

  restePlafond() {
    this.model.plafond_group_code = undefined;
    this.model.plafond_group_name = undefined;
    this.model.currency_code = undefined;
    this.model.plafond_facility_code = undefined;
    this.model.plafond_facility_name = undefined;
    this.model.facility_code = undefined;
    this.model.facility_desc = undefined;
    this.model.purpose_loan_code = undefined;
    this.model.purpose_loan_name = undefined;
    this.model.purpose_loan_detail_code = undefined;
    this.model.purpose_loan_detail_name = undefined;
  }

  restePlafondFacility() {
    this.model.plafond_facility_code = undefined;
    this.model.plafond_facility_name = undefined;
    this.model.facility_code = undefined;
    this.model.facility_desc = undefined;
    this.model.purpose_loan_code = undefined;
    this.model.purpose_loan_name = undefined;
    this.model.purpose_loan_detail_code = undefined;
    this.model.purpose_loan_detail_name = undefined;
  }
  //#endregion reset()

  //#region btnClientMain
  btnClientMain(codeEdit: string) {
    this.showSpinner = true;
    let clientUrl;
    this.dalservice.ExecSp("", this.APIControllerIntergration, this.APIRouteForThirdPartyGetToken)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (this.model.client_type === 'PERSONAL') {
            clientUrl = this.ClientPersonalIframe + "?CustId=" + codeEdit + "&Token=" + parse.Token
          } else {
            clientUrl = this.ClientCompanyIframe + "?CustId=" + codeEdit + "&Token=" + parse.Token
          }

          window.open(clientUrl)

          this.showSpinner = false;
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
  }
  //#endregion btnClientMain

  //#region button back
  btnBack() {
    this.route.navigate(['/inquiry/inquiryapplicationmain']);
  }
  //#endregion button back

  //#region List tabs 
  assetwiz() {
    this.route.navigate(['/objectinfoapplication/objectinfoapplicationmain/' + this.param + '/' + this.pageType + '/assetlist', this.param, this.pageType], { skipLocationChange: true });
  }

  administrationwiz() {
    this.route.navigate(['/objectinfoapplication/objectinfoapplicationmain/' + this.param + '/' + this.pageType + '/administrationdetail', this.param, this.pageType], { skipLocationChange: true });
  }

  legalwiz() {
    this.route.navigate(['/objectinfoapplication/objectinfoapplicationmain/' + this.param + '/' + this.pageType + '/legaldetail', this.param, this.model.branch_code, this.pageType], { skipLocationChange: true });
  }

  surveywiz() {
    this.route.navigate(['/objectinfoapplication/objectinfoapplicationmain/' + this.param + '/' + this.pageType + '/surveydetail', this.param, this.pageType], { skipLocationChange: true });
  }

  approvalwiz() {
    this.route.navigate(['/objectinfoapplication/objectinfoapplicationmain/' + this.param + '/' + this.pageType + '/approvaldetail', this.param, this.model.level_code, this.pageType], { skipLocationChange: true });
  }
  //#endregion List tabs

  //#region  form submit
  onFormSubmit(applicationmaindetailForm: NgForm, isValid: boolean) {

    // validation form submit
    if (!isValid) {
      swal({
        allowOutsideClick: false,
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

    this.applicationmaindetailData = this.JSToNumberFloats(applicationmaindetailForm);
    const usersJson: any[] = Array.of(this.applicationmaindetailData);
    if (this.param != null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showSpinner = false;
              this.ngOnInit();
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
            this.swalPopUpMsg(parse.data)
          });
    } else {
      // call web service
      this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showSpinner = false;
              this.showNotification('bottom', 'right', 'success');
              this.route.navigate(['/inquiry/subapplicationmainlist/applicationmaindetail', parse.code]);
            } else {
              this.showSpinner = false;
              this.swalPopUpMsg(parse.data);
            }
          },
          error => {
            this.showSpinner = false;
            const parse = JSON.parse(error);
            this.swalPopUpMsg(parse.data)
          });
    }
  }
  //#endregion form submit

  //#region Facility Lookup
  btnLookupFacility() {
    $('#datatableLookupFacility').DataTable().clear().destroy();
    $('#datatableLookupFacility').DataTable({
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

        this.dalservice.Getrows(dtParameters, this.APIControllerFacility, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupfacility = parse.data;
          if (parse.data != null) {
            this.lookupfacility.numberIndex = dtParameters.start;
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

  btnSelectRowFacility(code: String, description: String) {
    this.model.facility_code = code;
    this.model.facility_desc = description;
    $('#lookupModalFacility').modal('hide');
  }
  //#endregion Facility lookup

  //#region SysBranch Lookup
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
          'p_cre_by': this.uid,
          'p_branch_code': this.model.branch_code
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

  btnSelectRowSysBranch(code: String, description: String, region_code: String, region_description: String) {
    this.model.branch_code = code;
    this.model.branch_name = description;
    this.model.branch_region_code = region_code;
    this.model.branch_region_name = region_description;
    this.model.package_code = undefined;
    this.model.package_name = undefined;
    this.model.plafond_group_code = undefined;
    this.model.plafond_group_name = undefined;
    this.model.currency_code = undefined;
    this.model.plafond_facility_code = undefined;
    this.model.plafond_facility_name = undefined;
    this.model.facility_code = undefined;
    this.model.facility_desc = undefined;
    this.model.purpose_loan_code = undefined;
    this.model.purpose_loan_name = undefined;
    this.model.purpose_loan_detail_code = undefined;
    this.model.purpose_loan_detail_name = undefined;
    $('#lookupModalSysBranch').modal('hide');
  }
  //#endregion SysBranch lookup

  //#region Marketing Lookup
  btnLookupMarketing() {
    $('#datatableLookupMarketing').DataTable().clear().destroy();
    $('#datatableLookupMarketing').DataTable({
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
          this.lookupmarketing = parse.data;
          if (parse.data != null) {
            this.lookupmarketing.numberIndex = dtParameters.start;
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

  btnSelectRowMarketing(code: String, description: String) {
    this.model.marketing_code = code;
    this.model.marketing_name = description;
    $('#lookupModalMarketing').modal('hide');
  }
  //#endregion Marketing lookup

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

  //#region applicationDate
  applicationDate(event) {
    this.model.application_date = event;

    if (this.oldApplicationDate == false) {
      this.model.package_code = undefined;
      this.model.package_name = undefined;
      this.model.plafond_group_code = undefined;
      this.model.plafond_group_name = undefined;
      this.model.currency_code = undefined;
      this.model.plafond_facility_code = undefined;
      this.model.plafond_facility_name = undefined;
      this.model.facility_code = undefined;
      this.model.facility_desc = undefined;
      this.model.purpose_loan_code = undefined;
      this.model.purpose_loan_name = undefined;
      this.model.purpose_loan_detail_code = undefined;
      this.model.purpose_loan_detail_name = undefined;
    }
  }
  //#endregion applicationDate

  //#region Lookup Currency
  btnLookupCurrency() {
    $('#datatableLookupCurrency').DataTable().clear().destroy();
    $('#datatableLookupCurrency').DataTable({
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

        this.dalservice.GetrowsSys(dtParameters, this.APIControllerCurrency, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupcurrency = parse.data;
          if (parse.data != null) {
            this.lookupcurrency.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, targets: [0, 1, 4] }],
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowCurrency(currency_code: String, currency_desc: string) {
    this.model.currency_code = currency_code;
    this.model.currency_desc = currency_desc;
    $('#lookupModalCurrency').modal('hide');
  }
  //#endregion Lookup Currency

  //#region btnPrintCredit
  btnPrintCredit() {
    this.dataTamp = {
      'p_user_id': this.userId,
      'p_application_no': this.param,
      'p_print_option': 'PDF'
    };

    const dataParam = {
      TableName: 'RPT_CREDIT_APPROVAL',
      SpName: 'xsp_rpt_credit_approval',
      reportparameters: this.dataTamp
    };

    this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
      this.showSpinner = false;
      this.printRptNonCore(res);
    }, err => {
      this.showSpinner = false;
      const parse = JSON.parse(err);
      this.swalPopUpMsg(parse.data);
    });
  }
  //#endregion btnPrintCredit

  //#region btnPrintAnalisa
  btnPrintAnalisa() {
    this.showSpinner = true;

    this.dataTamp = {
      'p_user_id': this.userId,
      'p_application_no': this.param,
      'p_print_option': 'PDF'
    };

    const dataParam = {
      TableName: 'RPT_ANALISA_KREDIT',
      SpName: 'xsp_rpt_analisa_kredit',
      reportparameters: this.dataTamp
    };

    this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {

      this.showSpinner = false;
      this.printRptNonCore(res);
    }, err => {
      this.showSpinner = false;
      const parse = JSON.parse(err);
      this.swalPopUpMsg(parse.data);
    });
  }
  //#endregion btnPrintAnalisa

  //#region btnPrintAnalisa
  btnPrintDoc() {
    this.showSpinner = true;

    this.dataTamp = {
      'p_user_id': this.userId,
      'p_application_no': this.param,
      'p_print_option': 'PDF'
    };

    const dataParam = {
      TableName: 'RPT_DOCUMENT_CHECKLIST',
      SpName: 'xsp_rpt_document_checklist',
      reportparameters: this.dataTamp
    };

    this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
      this.showSpinner = false;
      this.printRptNonCore(res);
    }, err => {
      this.showSpinner = false;
      const parse = JSON.parse(err);
      this.swalPopUpMsg(parse.data);
    });
  }
  //#endregion btnPrintAnalisa

  //#region button print rental schedule

  btnPrintRentalSchedule() {
    this.showSpinner = true;
    const dataParam = {
      TableName: 'rpt_schedule_rental',
      SpName: 'xsp_rpt_schedule_rental_print',
      reportparameters: {
        p_user_id: this.userId,
        p_application_no: this.param,
        p_print_option: 'PDF'
      }
    };
    console.log(dataParam);

    this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
      this.printRptNonCore(res);
      this.showSpinner = false;
    }, err => {
      this.showSpinner = false;
      const parse = JSON.parse(err);
      this.swalPopUpMsg(parse.data);
    });
  }

  //#endregion button print rental schedule
}