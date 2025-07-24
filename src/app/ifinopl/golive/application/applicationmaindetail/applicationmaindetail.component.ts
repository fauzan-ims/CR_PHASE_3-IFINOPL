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
  public isProceed: Boolean = false;
  public isCancel: Boolean = false;
  public isApproval: Boolean = false;
  public applicationmaindetailData: any = [];
  public isReadOnly: Boolean = false;
  public lookupAsset: any = [];
  public lookupfacility: any = [];
  public lookupcurrency: any = [];
  public lookupsysbranch: any = [];
  public lookupmarketing: any = [];
  public lookupclient: any = [];
  public lookupSelectView: any = [];
  public listapplicationasset: any = [];
  public lookupasset: any = [];
  public setStyle: any = [];
  private dataTamp: any = [];
  private dataTampCms: any = [];
  private dataTampClientStatus: any = [];

  private APIController: String = 'ApplicationMain';
  private APIControllerClientMain: String = 'ClientMain';
  private APIControllerApplicationAsset: String = 'ApplicationAsset';
  private APIControllerAgreementInformation: String = 'AgreementInformation';
  private APIControllerMasterAsset: String = 'AgreementInformation';

  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForGetRows: String = 'GetRowsForAssetAllocation';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForUpdateStatus: String = 'UpdateStatus';
  private APIRouteForValidate: String = 'ExecSpForValidateRulesandDeviation';
  private APIRouteForExecSpForBlacklistValidation: String = 'ExecSpForBlacklistValidation';
  private APIRouteForProceed: String = 'ExecSpForProceed';
  private APIRouteForCancel: String = 'ExecSpForCancel';
  private APIRouteForExecSpForGetOsInstallmentAmount: String = 'ExecSpForGetOsInstallmentAmount';

  private RoleAccessCode = 'R00020650000000A'; // role access 

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
    // call web service
    this.callGetrow();
    this.loadData();
  }

  //#region load all data
  loadData() {
    this.dtOptions = {
      'pagingType': 'first_last_numbers',
      'pageLength': 10,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false
      ajax: (dtParameters: any, callback) => {
        
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_application_no': this.param
        })
        
        this.dalservice.Getrows(dtParameters, this.APIControllerApplicationAsset, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listapplicationasset = parse.data;
          if (parse.data != null) {
            this.listapplicationasset.numberIndex = dtParameters.start;
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
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1] }], // for disabled coloumn
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
      'p_application_no': this.param
    }];
    
    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

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
    //                             this.callGetrow();
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
    //                                               this.route.navigate(['../approval/banberjalanapplicationmain']);
    //                                             } else {
    //                                               this.route.navigate(['../golive/subapplicationmainlist']);
    //                                             }
    //                                             $('#datatableApplicationMainList').DataTable().ajax.reload();
    //                                             this.showNotification('bottom', 'right', 'success');
    //                                             // this.showSpinner = false;
    //                                           } else {
    //                                             // this.showSpinner = false;
    //                                             this.swalPopUpMsg(parseProceed.data);
    //                                           }
    //                                         },
    //                                         error => {
    //                                           // this.showSpinner = false;
    //                                           const parseProceed = JSON.parse(error);
    //                                           this.swalPopUpMsg(parseProceed.data)
    //                                         });
    //                                   } else {
    //                                     // this.showSpinner = false;
    //                                     this.swalPopUpMsg(parseValidationDeviation.data);
    //                                   }
    //                                 },
    //                                 error => {
    //                                   // this.showSpinner = false;
    //                                   const parseValidationDeviation = JSON.parse(error);
    //                                   this.swalPopUpMsg(parseValidationDeviation.data)
    //                                 });
    //                           } else {
    //                             // this.showSpinner = false;
    //                             this.swalPopUpMsg(parseUpdateClientStatus.data);
    //                           }
    //                         },
    //                         error => {
    //                           // this.showSpinner = false;
    //                           const parseUpdateClientStatus = JSON.parse(error);
    //                           this.swalPopUpMsg(parseUpdateClientStatus.data)
    //                         });
    //                   } else {
    //                     // this.showSpinner = false;
    //                     this.swalPopUpMsg(parseBlacklistValidation.data);
    //                   }
    //                 },
    //                 error => {
    //                   // this.showSpinner = false;
    //                   const parseBlacklistValidation = JSON.parse(error);
    //                   this.swalPopUpMsg(parseBlacklistValidation.data)
    //                 });
    //           } else {
    //             // this.showSpinner = false;
    //             this.swalPopUpMsg(parseOsInstallmentAmount.data);
    //           }
    //         },
    //         error => {
    //           // this.showSpinner = false;  
    //           const parseOsInstallmentAmount = JSON.parse(error);
    //           this.swalPopUpMsg(parseOsInstallmentAmount.data)
    //         });
    //   } else {
    //     this.showSpinner = false;
    //   }
    // });
  }
  //#endregion btnProceed

  //#region btnReturn
  btnReturn(code: any) {

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
                this.showSpinner = false;
                this.isStatus = true
                this.isCancel = true;
                this.showNotification('bottom', 'right', 'success');
                if (this.pageType === 'banberjalan') {
                  this.route.navigate(['../approval/banberjalanapplicationmain']);
                } else {
                  this.route.navigate(['../golive/subapplicationmainlist']);
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
              this.swalPopUpMsg(parse.data)
            });
      } else {
        this.showSpinner = false;
      }
    });
  }
  //#endregion btnReturn

  //#region button back
  btnBack() {
    this.route.navigate(['/golive/subapplicationmainlist']);
  }
  //#endregion button back

  //#region Asset Lookup
  btnLookupAsset() {
    $('#datatableLookupAsset').DataTable().clear().destroy();
    $('#datatableLookupAsset').DataTable({
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
        
        this.dalservice.Getrows(dtParameters, this.APIControllerMasterAsset, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupasset = parse.data;
          if (parse.data != null) {
            this.lookupasset.numberIndex = dtParameters.start;
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

  btnSelectRowAsset(code: String, description: String) {
    this.model.asset_code = code;
    this.model.asset_desc = description;
    $('#lookupModalAsset').modal('hide');
  }
  //#endregion Asset lookup

  //#region  form submit
  onFormSubmit(applicationmaindetailForm: NgForm, isValid: boolean) {
  }
  //#endregion form submit
}