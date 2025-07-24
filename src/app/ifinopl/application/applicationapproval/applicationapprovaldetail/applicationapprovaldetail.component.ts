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
  templateUrl: './applicationapprovaldetail.component.html'
})

export class ApplicationapprovaldetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  pageType = this.getRouteparam.snapshot.paramMap.get('page');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public listexposureData: any = [];
  public isStatus: Boolean = false;
  public isProceed: Boolean = false;
  public isCancel: Boolean = false;
  public isApproval: Boolean = false;
  public isSimulation: Boolean = false;
  public applicationapprovaldetailData: any = [];
  public isReadOnly: Boolean = false;
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
  private dataTampSimulation: any = {};
  private dataTempApplication: any = [];
  private dataTempThirdParty: any = [];
  public EmailPattern = this._emailformat;
  public NpwpPattern = this._npwpformat;
  private dataTempApprovalReturn: any = [];
  private MatchingPersonal: any;
  private MatchingCompany: any;
  private GetDataClient: any;
  private GetDataforDeviation: any;
  private GetDataforScoring: any;
  private GetDataforDSR: any;
  private GetDataforPlafond: any;
  private ExistingAgreement: any;
  private ApplicationInProcess: any;
  private ClientPersonalIframe: any;
  private ClientCompanyIframe: any;
  private GetClientBlackList: any;
  public amountFinanceAmount: any = 0;
  public osInstallmentAmount: any = 0;
  public installmentAmount: any = 0;
  public ovdInstallmentAmount: any = 0;

  // client matching
  public client_type: String;
  public document_type: String;
  public disabledRow: any = 10;
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

  //controller
  private APIController: String = 'ApplicationMain';
  private APIControllerSysGlobalParam: String = 'SysGlobalParam';
  private APIControllerAgreementMain: String = 'AgreementMain';
  private APIControllerApplicationExposure: String = 'ApplicationExposure';
  private APIControllerFacility: String = 'MasterFacility';
  private APIControllerSysBranch: String = 'SysBranch';
  private APIControllerSysEmployeeMain: String = 'SysEmployeeMain';
  private APIControllerCurrency: String = 'SysCurrency';
  private APIControllerBillingType: String = 'MasterBillingType';
  private APIControllerIntergration: String = 'Intergration';

  //route
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForGetThirddParty: String = 'ExecSpForGetThirddParty';
  private APIRouteForGetRows: String = 'GETROWS';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForDelete: String = 'DELETE';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForInsertExposure: String = 'ExecSpForInsertExposure';
  private APIRouteForProceed: String = 'ExecSpForProceed';
  private APIRouteForRejectAfterApproval: String = 'ExecSpForRejectAfterApproval';
  private APIRouteForCancel: String = 'ExecSpForCancel';
  private APIRouteForBackToEntry: String = 'ExecSpForBackToEntry';
  private APIRouteForExecSpForUpdateAfterSimulation: String = 'ExecSpForUpdateAfterSimulation';
  private APIRouteForGetRowsClientMatching: String = 'GetRowsClientMatching';
  private APIRouteForGetRowClientMatching: String = 'GetRowClientMatching';
  private APIRouteForGetAgrmntHist: String = 'GetAgrmntHist';
  private APIRouteForThirdPartyGetToken: String = 'ThirdPartyGetToken';

  // report
  private APIControllerReport: String = 'Report';
  private APIRouteForDownload: String = 'getReport';

  private RoleAccessCode = 'R00020690000010A'; // role access 

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
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.Delimiter(this._elementRef);
    if (this.param != null) {
      this.isReadOnly = false;
      // call web service
      this.client_type = 'CORPORATE';
      this.document_type = 'NPWP';
      $("#npwp").attr('maxlength', '15');
      $("#ktp").attr('maxlength', '16');
      this.callGetrow();
      this.callGlobalParamForThirdPartyIframeClient();
      this.callGlobalParamForThirdPartyClient();
      this.callGlobalParamForThirdPartyExposure();
      this.callGetrowWizard();
      this.loadData()
    } else {
      this.model.application_date = new Date();
      this.model.lease_type = 'DL';
      this.model.buyback_type = 'NG';
      this.model.application_status = 'HOLD';
      this.model.level_status = 'ENTRY';
      this.showSpinner = false;
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

          this.GetClientBlackList = parsedata.check_black_list_url

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

  //#region GlobalParam for Thirdparty
  callGlobalParamForThirdPartyClient() {

    this.dataTempThirdParty = [{
      'p_type': "CLIENT",
      'action': "getResponse"
    }];

    this.dalservice.ExecSp(this.dataTempThirdParty, this.APIControllerSysGlobalParam, this.APIRouteForGetThirddParty)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data);

          for (let i = 0; i < parsedata.length; i++) {
            if (parsedata[i].code === 'ENFOU02') {
              this.MatchingPersonal = parsedata[i].value
            } else if (parsedata[i].code === 'ENFOU03') {
              this.MatchingCompany = parsedata[i].value
            } else if (parsedata[i].code === 'ENFOU04') {
              this.GetDataClient = parsedata[i].value
            } else if (parsedata[i].code === 'ENFOU05') {
              this.GetDataforDeviation = parsedata[i].value
            } else if (parsedata[i].code === 'ENFOU06') {
              this.GetDataforScoring = parsedata[i].value
            } else if (parsedata[i].code === 'ENFOU07') {
              this.GetDataforDSR = parsedata[i].value
            } else if (parsedata[i].code === 'ENLOS03') {
              this.GetDataforPlafond = parsedata[i].value
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
                          this.route.navigate(['/application/banberjalanapplicationmain']);
                          $('#datatableApplicationapprovalList').DataTable().ajax.reload();
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
                  this.route.navigate(['/application/banberjalanapplicationmain']);
                  $('#datatableApplicationapprovalList').DataTable().ajax.reload();
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
                this.route.navigate(['/application/banberjalanapplicationmain']);
                $('#datatableApplicationapprovalList').DataTable().ajax.reload();
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
  // btnReturn(code: any) {
  //   swal({
  //     html:
  //       '<label style="float: left; font-size:12px">Remark</label>' +
  //       '<div class="form-group">' +
  //       '<textarea id="input-remark" type="text" class="form-control" ></textarea>' +
  //       '</div>' +
  //       '<label style="float: left; font-size:12px">Password</label>' +
  //       '<div class="form-group">' +
  //       '<input id="input-password" type="password" class="form-control" />' +
  //       '</div>',
  //     showCancelButton: true,
  //     confirmButtonClass: 'btn btn-success',
  //     cancelButtonClass: 'btn btn-danger',
  //     confirmButtonText: 'Yes',
  //     buttonsStyling: false
  //   }).then((result) => {
  //     this.showSpinner = true;
  //     if (result.value) {
  //       const remark = $('#input-remark').val();
  //       const password = $('#input-password').val();

  //       this.dataTamp = [{
  //         'p_application_no': code,
  //         'p_approval_reff': password,
  //         'p_approval_remark': remark,
  //         'action': 'default'
  //       }];


  //       this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForBackToEntry)
  //         .subscribe(
  //           res => {
  //             const parse = JSON.parse(res);
  //             if (parse.result === 1) {
  //               this.route.navigate(['/application/banberjalanapplicationmain']);
  //               $('#datatableApplicationapprovalList').DataTable().ajax.reload();

  //               this.showNotification('bottom', 'right', 'success');
  //               this.showSpinner = false;
  //             } else {
  //               this.swalPopUpMsg(parse.data);
  //               this.showSpinner = false;
  //             }
  //           },
  //           error => {
  //             const parse = JSON.parse(error);
  //             this.swalPopUpMsg(parse.data);
  //             this.showSpinner = false;
  //           });
  //     } else {
  //       this.showSpinner = false;
  //     }
  //   });
  // }
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
    this.route.navigate(['/application/banberjalanapplicationmain']);
    $('#datatableApplicationapprovalList').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region List tabs 
  assetwiz() {
    this.route.navigate(['/application/banberjalanapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/assetlist', this.param, this.pageType], { skipLocationChange: true });
  }

  administrationwiz() {
    this.route.navigate(['/application/banberjalanapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/administrationdetail', this.param, this.pageType], { skipLocationChange: true });
  }

  legalwiz() {
    this.route.navigate(['/application/banberjalanapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/legaldetail', this.param, this.model.branch_code, this.pageType], { skipLocationChange: true });
  }

  surveywiz() {
    this.route.navigate(['/application/banberjalanapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/surveydetail', this.param, this.pageType], { skipLocationChange: true });
  }

  approvalwiz() {
    this.route.navigate(['/application/banberjalanapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/approvaldetail', this.param, this.model.level_code, this.pageType], { skipLocationChange: true });
  }
  //#endregion List tabs

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

  //#region client matching
  //#region ddl clientType
  clientType(event: any) {
    this.client_type = event.target.value;
    if (this.client_type === 'PERSONAL') {
      this.document_type = 'KTP';
      this.disabledRow = 9;
      this.npwp_no = undefined
      this.full_name = undefined
      this.est_date = undefined
    } else {
      this.document_type = 'NPWP';
      this.disabledRow = 7;
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
  onFormSubmit(clientmatchingdetailForm: NgForm, isValid: boolean) {
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

  //#region load all data
  loadData() {
    this.showSpinner = false;
    this.dtOptions = {
      pagingType: 'first_last_numbers',
      responsive: true,
      serverSide: true,
      processing: true,
      paging: true,
      lengthChange: false, // hide lengthmenu
      searching: false, // jika ingin hilangin search box nya maka false
      'pageLength': 10,
      ajax: (dtParameters: any, callback) => {
        let paramTamps = {};
        dtParameters.paramTamp = [];

        if (this.client_type === 'PERSONAL') {
          paramTamps =
          {
            'draw': 1,
            'RowPage': dtParameters.length,
            'PageNumber': (dtParameters.start + 10) / 10,
            'SortBy': dtParameters.order[0].dir,
            'OrderBy': dtParameters.order[0].column,
            'Keyword': dtParameters.search.value,
            'Name': this.full_name,
            'IdNo': this.document_no,
            'BirthPlace': this.place_of_birth,
            'BirthDate': this.date_of_birth,
            'MotherMaidenName': this.mother_maiden_name,
            'URL': this.MatchingPersonal,
            'DataObj': 'ListMatchCustPersonalObjs'
          }

        } else {
          paramTamps =
          {
            'draw': 1,
            'RowPage': dtParameters.length,
            'PageNumber': (dtParameters.start + 10) / 10,
            'SortBy': dtParameters.order[0].dir,
            'OrderBy': dtParameters.order[0].column,
            'Keyword': dtParameters.search.value,
            'Name': this.full_name,
            'NpwpNo': this.document_no,
            'EstablishmentDate': this.est_date,
            'URL': this.MatchingCompany,
            'DataObj': 'ListMatchCustCompanyObjs'
          }
        }
        dtParameters.paramTamp.push(paramTamps);
        this.dalservice.Getrows(dtParameters, this.APIControllerIntergration, this.APIRouteForGetRowsClientMatching).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listclient = parse.data;

          if (parse.data != null) {
            this.listclient.numberIndex = dtParameters.start;
          }

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
          this.showSpinner = false;
        }, err => {
          this.showSpinner = false;
        });
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 10] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion load all data 

  //#region select client
  btnSelectClient(custNo: any) {
    this.dataTampSimulation = {};
    let tempDeviation = {};
    let tempScoring = {};
    let tempDSR = {};
    let tempPlafond = {};
    this.dataTampSimulation = {
      "CustNo": custNo,
      "reff_no": this.param,
      "URL": this.GetDataClient,
      "GetDataType": "CLIENT"
    };

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

        this.dalservice.ExecSp(this.dataTampSimulation, this.APIControllerIntergration, this.APIRouteForGetRowClientMatching)
          .subscribe(
            resGetClientData => {
              const parseGetClientData = JSON.parse(resGetClientData);

              if (parseGetClientData.result === 1) {

                tempDeviation = {
                  "reff_no": this.param,
                  "CustNo": custNo,
                  "URL": this.GetDataforDeviation,
                  "GetDataType": "DEVIATION"
                };
                this.dalservice.ExecSp(tempDeviation, this.APIControllerIntergration, this.APIRouteForGetRowClientMatching)
                  .subscribe(
                    resGetDeviation => {
                      const parseGetDeviation = JSON.parse(resGetDeviation);
                      if (parseGetDeviation.result === 1) {

                        tempScoring = {
                          "reff_no": this.param,
                          "CustNo": custNo,
                          "URL": this.GetDataforScoring,
                          "GetDataType": "SCORING"
                        };
                        this.dalservice.ExecSp(tempScoring, this.APIControllerIntergration, this.APIRouteForGetRowClientMatching)
                          .subscribe(
                            resGetScoring => {
                              const parseGetScoring = JSON.parse(resGetScoring);
                              if (parseGetScoring.result === 1) {

                                tempDSR = {
                                  "reff_no": this.param,
                                  "CustNo": custNo,
                                  "URL": this.GetDataforDSR,
                                  "GetDataType": "DSR"
                                };
                                this.dalservice.ExecSp(tempDSR, this.APIControllerIntergration, this.APIRouteForGetRowClientMatching)
                                  .subscribe(
                                    resGetDSR => {
                                      const parseGetDSR = JSON.parse(resGetDSR);
                                      if (parseGetDSR.result === 1) {
                                        tempPlafond = {
                                          "reff_no": this.param,
                                          // "requestDateTime": "2023-07-10T04:26:43.716Z",
                                          // "rowVersion": "",
                                          "customerNo": custNo,
                                          "URL": this.GetDataforPlafond,
                                          "GetDataType": "PLAFOND"
                                        };
                                        this.dalservice.ExecSp(tempPlafond, this.APIControllerIntergration, this.APIRouteForGetRowClientMatching)
                                          .subscribe(
                                            resGetPlafond => {
                                              const parseGetPlafond = JSON.parse(resGetPlafond);
                                              if (parseGetPlafond.result === 1) {
                                                this.dataTempApplication.push({
                                                  "p_application_no": this.param,
                                                  "p_client_code": parseGetClientData.code
                                                });
                                                this.dalservice.ExecSp(this.dataTempApplication, this.APIController, this.APIRouteForExecSpForUpdateAfterSimulation)
                                                  .subscribe(
                                                    resProceedToApplication => {
                                                      const parseProceedToApplication = JSON.parse(resProceedToApplication);
                                                      if (parseProceedToApplication.result === 1) {
                                                        $('#lookupClientMatching').modal('hide');
                                                        this.route.navigate(['/application/banberjalanapplicationmain']);
                                                        $('#datatableApplicationapprovalList').DataTable().ajax.reload();
                                                        this.showNotification('bottom', 'right', 'success');
                                                        this.showSpinner = false;
                                                      } else {
                                                        this.showSpinner = false;
                                                        this.swalPopUpMsg(parseProceedToApplication.data);
                                                      }
                                                    },
                                                    errorProceedToApplication => {
                                                      this.showSpinner = false;
                                                      const parseProceedToApplication = JSON.parse(errorProceedToApplication);
                                                      this.swalPopUpMsg(parseProceedToApplication.data)
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
                                        this.showSpinner = false;
                                        this.swalPopUpMsg(parseGetDSR.data);
                                      }
                                    },
                                    errorGetDSR => {
                                      this.showSpinner = false;
                                      const parseGetDSR = JSON.parse(errorGetDSR);
                                      this.swalPopUpMsg(parseGetDSR.data)
                                    });

                              } else {
                                this.showSpinner = false;
                                this.swalPopUpMsg(parseGetScoring.data);
                              }
                            },
                            errorGetScoring => {
                              this.showSpinner = false;
                              const parseGetScoring = JSON.parse(errorGetScoring);
                              this.swalPopUpMsg(parseGetScoring.data)
                            });
                      } else {
                        this.showSpinner = false;
                        this.swalPopUpMsg(parseGetDeviation.data);
                      }
                    },
                    errorGetDeviation => {
                      this.showSpinner = false;
                      const parseGetDeviation = JSON.parse(errorGetDeviation);
                      this.swalPopUpMsg(parseGetDeviation.data)
                    });
              } else {
                this.swalPopUpMsg(parseGetClientData.data);
                this.showSpinner = false;
              }
            },
            errorGetClientData => {
              this.showSpinner = false;
              const parseGetClientData = JSON.parse(errorGetClientData);
              this.swalPopUpMsg(parseGetClientData.data);
            });
      } else {
        this.showSpinner = false;
      }
    });
  }
  //#endregion select client
  //#endregion client matching

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

  //#region form submit
  onFormSubmitApprovalReturn(ApprovalReturnForm: NgForm, isValid: boolean) {
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

    this.dataTempApprovalReturn = ApprovalReturnForm;

    const usersJson: any[] = Array.of(this.JSToNumberFloats(this.dataTempApprovalReturn));

    this.dalservice.ExecSp(usersJson, this.APIController, this.APIRouteForBackToEntry)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            $('#lookupRemark').modal('hide');
            this.route.navigate(['/application/banberjalanapplicationmain']);
            $('#datatableApplicationapprovalList').DataTable().ajax.reload();

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
  //#endregion form submit

  //#region form close
  btnLookupClose() {
    this.model.approval_remark = undefined;
  }
  //#endregion form close

  //#region btnReturn
  btnReturn() {
    this.btnLookupClose();
  }
  //#endregion btnReturn
}