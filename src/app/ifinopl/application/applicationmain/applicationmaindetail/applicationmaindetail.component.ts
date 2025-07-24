import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import swal from 'sweetalert2';
import { DALService } from '../../../../../DALservice.service';
import { NgForm } from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './applicationmaindetail.component.html'
})

export class ApplicationmaindetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  pageType = this.getRouteparam.snapshot.paramMap.get('page');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public listexposureData: any = [];
  public isStatus: Boolean = false;
  public isSimulation: Boolean = false;
  public isProceed: Boolean = false;
  public isCancel: Boolean = false;
  public isApproval: Boolean = false;
  public applicationmaindetailData: any = [];
  public isReadOnly: Boolean = false;
  public lookupfacility: any = [];
  public lookupcurrency: any = [];
  public lookupsysbranch: any = [];
  public lookupmarketing: any = [];
  public lookupclient: any = [];
  public lookupSelectView: any = [];
  public lookupbillingtype: any = [];
  public setStyle: any = [];
  private dataTamp: any = [];
  private dataTampSimulation: any = [];
  public EmailPattern = this._emailformat;
  public NpwpPattern = this._npwpformat;
  private dataTempThirdParty: any = [];
  private ExistingAgreement: any;
  private ApplicationInProcess: any;
  private ClientPersonalIframe: any;
  private ClientCompanyIframe: any;
  private GetClientBlackList: any;
  public amountFinanceAmount: any = 0;
  public osInstallmentAmount: any = 0;
  public installmentAmount: any = 0;
  public ovdInstallmentAmount: any = 0;
  public lookupapproval: any = [];
  private tempApprovaForm: any = [];

  // client matching
  private APIControllerClient: String;
  public client_type: String;
  public document_type: String;
  public npwp_no: String;
  public clientmatchingdetailData: any = [];
  public full_name: String;
  public alias_name: String;
  public mother_maiden_name: String;
  public place_of_birth: String;
  public date_of_birth: any = {};
  public est_date: any;
  public document_no: String;
  public listclient: any = [];

  private APIController: String = 'ApplicationMain';
  private APIControllerSysGlobalParam: String = 'SysGlobalParam';
  private APIControllerAgreementMain: String = 'AgreementMain';
  private APIControllerApplicationExposure: String = 'ApplicationExposure';
  private APIControllerFacility: String = 'MasterFacility';
  private APIControllerSysBranch: String = 'SysBranch';
  private APIControllerSysEmployeeMain: String = 'SysEmployeeMain';
  private APIControllerCurrency: String = 'SysCurrency';
  private APIControllerBillingType: String = 'MasterBillingType';
  private APIControllerClientPersonal: String = 'ClientPersonalInfo';
  private APIControllerClientCorporate: String = 'ClientCorporateInfo';
  private APIControllerIntergration: String = 'Intergration';
  private APIControllerApprovalMain: String = 'ApprovalMain';

  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForGetThirddParty: String = 'ExecSpForGetThirddParty';
  private APIRouteForGetRows: String = 'GETROWS';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForDelete: String = 'DELETE';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForGetRowsForMatching: String = 'GetRowsForMatching';
  private APIRouteForInsertExposure: String = 'ExecSpForInsertExposure';
  private APIRouteForProceed: String = 'ExecSpForProceed';
  private APIRouteForRejectAfterApproval: String = 'ExecSpForRejectAfterApproval';
  private APIRouteForCancel: String = 'ExecSpForCancel';
  private APIRouteForBackToEntry: String = 'ExecSpForBackToEntry';
  private APIRouteForExecSpForUpdateAfterSimulation: String = 'ExecSpForUpdateAfterSimulation';
  private APIRouteForGetAgrmntHist: String = 'GetAgrmntHist';
  private APIRouteForThirdPartyGetToken: String = 'ThirdPartyGetToken';
  private APIRouteForGetRowClientMatching: String = 'GetRowClientMatching';
  private APIRouteForUpdateCommentReturn: String = 'UpdateCommentReturn';



  // report
  private APIControllerReport: String = 'Report';
  private APIRouteForDownload: String = 'getReport';

  private RoleAccessCode = 'R00019900000000A'; // role access 

  // form 2 way binding
  model: any = {};
  modelApproval: any = {};

  // spinner
  showSpinner: Boolean = true;
  showSpinnerLookup: Boolean = false;
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
    if (this.param != null) {
      this.isReadOnly = false;
      this.client_type = 'CORPORATE';
      this.document_type = 'NPWP';
      this.APIControllerClient = this.APIControllerClientCorporate
      $("#npwp").attr('maxlength', '15');
      $("#ktp").attr('maxlength', '16');
      // call web service
      this.callGetrow();
      this.callGlobalParamForThirdPartyIframeClient();
      this.callGlobalParamForThirdParty();
      this.callGetrowWizard();
    } else {
      this.model.is_purchase_requirement_after_lease = false;
      this.model.first_payment_type = 'ARR';
      this.model.lease_option = 'FULL';
      this.model.lease_type = 'DL';
      this.model.buyback_type = 'NG';
      this.model.application_status = 'HOLD';
      this.model.level_status = 'ENTRY';
      this.showSpinner = false;
      this.isSimulation = true;
    }
  }

  //#region GlobalParam for Thirdparty
  callGlobalParamForThirdParty() {

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
  //#endregion getStyles

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

  //#region btn print Quotation
  btnPrintQuotation() {
    this.showSpinner = true;

    this.dataTamp = {
      'p_user_id': this.userId,
      'p_application_no': this.param,
      'p_print_option': 'PDF',
    };

    const dataParam = {
      TableName: 'RPT_QUOTATION_APPLICATION',
      SpName: 'xsp_rpt_quotation_application',
      reportparameters: this.dataTamp
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
  //#endregion tbn print Quotation

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

          this.GetClientBlackList = parsedata.check_black_list_url

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

          if (parsedata.is_purchase_requirement_after_lease === '1') {
            parsedata.is_purchase_requirement_after_lease = true;
          } else {
            parsedata.is_purchase_requirement_after_lease = false;
          }

          if (parsedata.application_status !== 'HOLD' || parsedata.application_status !== 'APPROVE') {
            this.isStatus = true;
            this.isCancel = false;
          }
          if (parsedata.application_status === 'CANCEL' || parsedata.application_status === 'ON PROCESS') {
            this.isCancel = true;
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

          this.GetClientBlackList = parsedata.check_black_list_url

          if (parsedata.application_date != null) {
            if (parsedata.is_simulation === '1') {
              $('#surveywiz').remove();
              $('#legalwiz').remove();
              $('#administrationwiz').remove();
            }
            setTimeout(() => {
              this.wizard();
              this.assetwiz();
            }, 200);
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

          if (parsedata.is_purchase_requirement_after_lease === '1') {
            parsedata.is_purchase_requirement_after_lease = true;
          } else {
            parsedata.is_purchase_requirement_after_lease = false;
          }

          if (parsedata.application_status !== 'HOLD') {
            this.isStatus = true;
            this.isCancel = false;
          }
          if (parsedata.application_status === 'CANCEL' || parsedata.application_status === 'ON PROCESS') {
            this.isCancel = true;
          }

          if (parsedata.is_approval === '1') {
            this.isApproval = true;
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
    this.dataTamp = [{
      'p_application_no': code,
      'action': 'default'
    }];
    let tempCustomerNo = {};

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
        if (!this.isSimulation) {
          tempCustomerNo = {
            "reff_no": this.param,
            "requestDateTime": this.sysDate,
            "rowVersion": "",
            "custNo": this.model.client_no,
            "URL": this.GetClientBlackList,
            'GetDataType': 'CHECK BLACKLIST'
          }
          this.dalservice.ExecSp(tempCustomerNo, this.APIControllerIntergration, this.APIRouteForGetRowClientMatching)
            .subscribe(
              resGetPlafond => {
                const parseGetPlafond = JSON.parse(resGetPlafond);
                if (parseGetPlafond.result === 1) {
                  this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForProceed)
                    .subscribe(
                      resProceed => {
                        const parseProceed = JSON.parse(resProceed);
                        if (parseProceed.result === 1) {
                          this.isProceed = true;
                          this.isCancel = false;
                          if (this.pageType === 'banberjalan') {
                            this.route.navigate(['/application/banberjalanapplicationmain']);
                          } else {
                            this.route.navigate(['/application/subapplicationmainlist']);
                          }
                          $('#datatableApplicationMainList').DataTable().ajax.reload();
                          this.showNotification('bottom', 'right', 'success');
                          this.showSpinner = false;
                        } else {
                          this.swalPopUpMsg(parseProceed.data);
                          this.showSpinner = false;
                        }
                      },
                      error => {
                        const parseProceed = JSON.parse(error);
                        this.swalPopUpMsg(parseProceed.data)
                        this.showSpinner = false;
                      });
                } else {
                  this.showSpinner = false;
                  this.swalPopUpMsg(parseGetPlafond.data);
                }
              },
              errorGetPlafond => {
                this.showSpinner = false;
                const parseGetPlafond = JSON.parse(errorGetPlafond);
                this.swalPopUpMsg(parseGetPlafond.data)
              });
        } else {
          this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForProceed)
            .subscribe(
              resProceed => {
                const parseProceed = JSON.parse(resProceed);
                if (parseProceed.result === 1) {
                  this.isProceed = true;
                  this.isCancel = false;
                  if (this.pageType === 'banberjalan') {
                    this.route.navigate(['/application/banberjalanapplicationmain']);
                  } else {
                    this.route.navigate(['/application/subapplicationmainlist']);
                  }
                  $('#datatableApplicationMainList').DataTable().ajax.reload();
                  this.showNotification('bottom', 'right', 'success');
                  this.showSpinner = false;
                } else {
                  this.swalPopUpMsg(parseProceed.data);
                  this.showSpinner = false;
                }
              },
              error => {
                const parseProceed = JSON.parse(error);
                this.swalPopUpMsg(parseProceed.data)
                this.showSpinner = false;
              });
        }
      } else {
        this.showSpinner = false;
      }
    });
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
                  this.route.navigate(['/application/banberjalanapplicationmain']);
                } else {
                  this.route.navigate(['/application/subapplicationmainlist']);
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
                  this.route.navigate(['/application/banberjalanapplicationmain']);
                } else {
                  this.route.navigate(['/application/subapplicationmainlist']);
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
                  this.route.navigate(['/application/banberjalanapplicationmain']);
                } else {
                  this.route.navigate(['/application/subapplicationmainlist']);
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
    if (this.pageType === 'applicationstatus') {
      this.route.navigate(['/application/applicationstatus']);
    } else if (this.pageType === 'banberjalan') {
      this.route.navigate(['/application/banberjalanapplicationmain']);
    } else {
      this.route.navigate(['/application/subapplicationmainlist']);
      $('#datatableApplicationMainList').DataTable().ajax.reload();
    }
  }
  //#endregion button back

  //#region List tabs 
  assetwiz() {
    if (this.pageType != null) {
      this.route.navigate(['/application/banberjalanapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/assetlist', this.param, this.pageType], { skipLocationChange: true });
    } else {
      this.route.navigate(['/application/subapplicationmainlist/applicationmaindetail/' + this.param + '/' + 'assetlist', this.param], { skipLocationChange: true });
    }
  }

  administrationwiz() {
    if (this.pageType != null) {
      this.route.navigate(['/application/banberjalanapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/administrationdetail', this.param, this.pageType], { skipLocationChange: true });
    } else {
      this.route.navigate(['/application/subapplicationmainlist/applicationmaindetail/' + this.param + '/administrationdetail', this.param], { skipLocationChange: true });
    }
  }

  legalwiz() {
    if (this.pageType != null) {
      this.route.navigate(['/application/banberjalanapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/legaldetail', this.param, this.model.branch_code, this.pageType], { skipLocationChange: true });
    } else {
      this.route.navigate(['/application/subapplicationmainlist/applicationmaindetail/' + this.param + '/legaldetail', this.param, this.model.branch_code], { skipLocationChange: true });
    }
  }

  surveywiz() {
    if (this.pageType != null) {
      this.route.navigate(['/application/banberjalanapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/surveydetail', this.param, this.pageType], { skipLocationChange: true });
    } else {
      this.route.navigate(['/application/subapplicationmainlist/applicationmaindetail/' + this.param + '/surveydetail', this.param], { skipLocationChange: true });
    }
  }

  approvalwiz() {
    if (this.pageType != null) {
      this.route.navigate(['/application/banberjalanapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/approvaldetail', this.param, this.model.level_code, this.pageType], { skipLocationChange: true });
    } else {
      this.route.navigate(['/application/subapplicationmainlist/applicationmaindetail/' + this.param + '/approvaldetail', this.param, this.model.level_code], { skipLocationChange: true });
    }
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

    this.applicationmaindetailData = applicationmaindetailForm;

    if (this.applicationmaindetailData.p_is_purchase_requirement_after_lease == undefined) {
      this.applicationmaindetailData.p_is_purchase_requirement_after_lease = this.model.is_purchase_requirement_after_lease;
    }
    const usersJson: any[] = Array.of(this.JSToNumberFloats(this.applicationmaindetailData));

    if (this.param != null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showSpinner = false;
              this.callGetrow();
              this.callGetrowWizard();
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
              this.route.navigate(['/application/subapplicationmainlist/applicationmaindetail', parse.code]);
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

  //#region client matching
  //#region ddl clientType
  clientType(event: any) {
    this.client_type = event.target.value;
    if (this.client_type === 'PERSONAL') {
      this.document_type = 'KTP';
      this.APIControllerClient = this.APIControllerClientPersonal;
      this.npwp_no = undefined
      this.full_name = undefined
      this.est_date = undefined
    } else {
      this.document_type = 'NPWP';
      this.APIControllerClient = this.APIControllerClientCorporate;
    }
    $('#datatableClientMatchingList').DataTable().ajax.reload();

  }
  //#endregion ddl clientType

  //#region ddl documentType
  documentType(event: any) {
    this.document_type = event.target.value;
  }
  //#endregion ddl documentType

  //#region npwp
  onKeydownNpwp(event: any) {

    let ctrlDown = false;

    if (event.keyCode == 17 || event.keyCode == 91) {
      ctrlDown = true;
    }

    if (!((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)
      || (ctrlDown && (event.keyCode == 86 || event.keyCode == 67 || event.keyCode == 65 || event.keyCode == 90))
      || event.keyCode == 8 || event.keyCode == 9
      || (event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 38 || event.keyCode == 40)
    )) {

      return false;
    }

  }

  onPasteNpwp(event: any) {

    if (!event.originalEvent.clipboardData.getData('Text').match(/^[0-9,.-]*$/)) {
      event.preventDefault();
    }

  }

  onFokusNpwp(event: any) {
    let valEvent: any;
    valEvent = '' + event.target.value;

    if (valEvent != null) {
      this.npwp_no = valEvent.replace(/[^0-9]/g, '');
    }

  }

  onChangeNpwp(event: any) {

    let valEvent: any;

    valEvent = '' + event.target.value;
    var x = valEvent.split('');

    if (x.length == 15) {
      var tt = x[0] + x[1] + '.';
      var dd = tt + x[2] + x[3] + x[4] + '.';
      var ee = dd + x[5] + x[6] + x[7] + '.';
      var ff = ee + x[8] + '-';
      var gg = ff + x[9] + x[10] + x[11] + '.';
      var hh = gg + x[12] + x[13] + x[14];

      this.npwp_no = hh;
    }

  }
  //#endregion npwp

  //#region form submit
  onFormSubmitClientMathcing(clientmatchingdetailForm: NgForm, isValid: boolean) {
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
    this.clientmatchingdetailData = this.JSToNumberFloats(clientmatchingdetailForm);
    this.isReadOnly = true;
    this.full_name = this.clientmatchingdetailData.p_full_name;
    this.alias_name = this.clientmatchingdetailData.p_alias_name;
    this.mother_maiden_name = this.clientmatchingdetailData.p_mother_maiden_name;
    this.place_of_birth = this.clientmatchingdetailData.p_place_of_birth;
    this.date_of_birth = this.clientmatchingdetailData.p_date_of_birth;
    this.est_date = this.clientmatchingdetailData.p_est_date;
    this.document_type = this.clientmatchingdetailData.p_document_type;
    if (this.document_type === 'KTP') {
      this.document_no = this.clientmatchingdetailData.p_ktp_no;
    } else if (this.document_type === 'KITAS') {
      this.document_no = this.clientmatchingdetailData.p_kitas_no;
    } else if (this.document_type === 'NPWP') {
      this.document_no = this.clientmatchingdetailData.p_npwp_no;
    }
    $('#datatableClientMatchingList').DataTable().ajax.reload();
  }
  //#endregion form submit

  //#region btnReset
  btnReset() {
    this.isReadOnly = false;
  }
  //#endregion btnReset

  //#region select client
  btnSelectClient() {
    this.dataTampSimulation = []
    this.dataTampSimulation.push(this.JSToNumberFloats({
      'p_application_no': this.param,
      'p_client_type': this.client_type,
      'p_date_of_birth': this.date_of_birth,
      'p_est_date': this.est_date,
      'p_full_name': this.full_name,
      'p_mother_maiden_name': this.mother_maiden_name,
      'p_id_no': this.document_no,
      'p_place_of_birth': this.place_of_birth,
      'p_document_type': this.document_type,
      'action': 'default'
    }));
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

        this.dalservice.ExecSp(this.dataTampSimulation, this.APIController, this.APIRouteForExecSpForUpdateAfterSimulation)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                $('#lookupClientMatching').modal('hide');
                this.route.navigate(['/application/subapplicationmainlist/applicationmaindetail', this.param, 0]);
                this.showNotification('bottom', 'right', 'success');
                this.showSpinner = false;
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
        this.showSpinner = false;
      }
    });
  }
  //#endregion select client
  //#endregion client matching

  //#region btnViewApprovalForProceed
  btnViewApprovalForProceed() {
    this.showSpinnerLookup = true;

    this.dataTamp = [{
      'p_code': this.model.last_approval_code
    }];

    this.dalservice.GetrowApv(this.dataTamp, this.APIControllerApprovalMain, this.APIRouteForGetRow)
      .subscribe(
        res => {

          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);
          // mapper dbtoui
          Object.assign(this.modelApproval, parsedata);
          // end mapper dbtoui

          this.showSpinnerLookup = false;
        },
        error => {
          this.showSpinnerLookup = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
  }
  //#endregion btnViewApprovalForProceed

  //#region  form submit
  onFormSubmitApproval(approvalForm: NgForm, isValid: boolean) {

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
      this.showSpinnerLookup = true;
    }

    this.tempApprovaForm = approvalForm;

    this.dataTamp = [{
      'p_application_no': this.param,
      'p_last_return': 'Yes',
      'p_approval_comment': this.tempApprovaForm.p_approval_comment,
      'action': 'default'
    }];
    let tempCustomerNo = {};

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
      this.showSpinnerLookup = true;
      if (result.value) {
        if (!this.isSimulation) {
          tempCustomerNo = {
            "reff_no": this.param,
            "requestDateTime": this.sysDate,
            "rowVersion": "",
            "custNo": this.model.client_no,
            "URL": this.GetClientBlackList,
            'GetDataType': 'CHECK BLACKLIST'
          }
          this.dalservice.ExecSp(tempCustomerNo, this.APIControllerIntergration, this.APIRouteForGetRowClientMatching)
            .subscribe(
              resGetPlafond => {
                const parseGetPlafond = JSON.parse(resGetPlafond);
                if (parseGetPlafond.result === 1) {
                  this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForProceed)
                    .subscribe(
                      resProceed => {
                        const parseProceed = JSON.parse(resProceed);
                        if (parseProceed.result === 1) {
                          this.isProceed = true;
                          this.isCancel = false;
                          this.route.navigate(['/application/subapplicationmainlist']);
                          $('#datatableApplicationMainList').DataTable().ajax.reload();
                          this.showNotification('bottom', 'right', 'success');
                          this.showSpinnerLookup = false;

                          $('#lookupModalApproval').modal('hide');
                        } else {
                          this.swalPopUpMsg(parseProceed.data);
                          this.showSpinnerLookup = false;

                          $('#lookupModalApproval').modal('hide');
                        }
                      },
                      error => {
                        const parseProceed = JSON.parse(error);
                        this.swalPopUpMsg(parseProceed.data)
                        this.showSpinnerLookup = false;

                        $('#lookupModalApproval').modal('hide');
                      });
                } else {
                  this.showSpinnerLookup = false;
                  this.swalPopUpMsg(parseGetPlafond.data);

                  $('#lookupModalApproval').modal('hide');
                }
              },
              errorGetPlafond => {
                this.showSpinnerLookup = false;
                const parseGetPlafond = JSON.parse(errorGetPlafond);
                this.swalPopUpMsg(parseGetPlafond.data)

                $('#lookupModalApproval').modal('hide');
              });
        } else {
          this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForProceed)
            .subscribe(
              resProceed => {
                const parseProceed = JSON.parse(resProceed);
                if (parseProceed.result === 1) {
                  this.isProceed = true;
                  this.isCancel = false;
                  this.route.navigate(['/application/subapplicationmainlist']);
                  $('#datatableApplicationMainList').DataTable().ajax.reload();
                  this.showNotification('bottom', 'right', 'success');
                  this.showSpinnerLookup = false;

                  $('#lookupModalApproval').modal('hide');
                } else {
                  this.swalPopUpMsg(parseProceed.data);
                  this.showSpinnerLookup = false;

                  $('#lookupModalApproval').modal('hide');
                }
              },
              error => {
                const parseProceed = JSON.parse(error);
                this.swalPopUpMsg(parseProceed.data)
                this.showSpinnerLookup = false;

                $('#lookupModalApproval').modal('hide');
              });
        }
      } else {
        this.showSpinnerLookup = false;
      }
    });
  }
  //#endregion form submit
}