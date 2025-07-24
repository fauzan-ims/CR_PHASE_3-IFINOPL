import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import { DALService } from '../../../../../../../DALservice.service';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './agreementassetdetail.component.html'
})

export class AgreementassetdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');
  pageType = this.getRouteparam.snapshot.paramMap.get('page');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public assetdetailData: any = [];
  public isReadOnly: Boolean = false;
  public lookupassettype: any = [];
  public isBBNClient: boolean = false;

  public isOTR: boolean = false;
  private dataTamp: any = [];
  private assettypecode: any = [];
  private APIController: String = 'AgreementAsset';
  private APIRouteForGetRow: String = 'GETROW';
  private RoleAccessCode = 'R00020560000000A'; // role access 

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
    private _elementRef: ElementRef,
    private parserFormatter: NgbDateParserFormatter
  ) { super(); }


  ngOnInit() {
    // this.callGetRole(this.userId);
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.wizard();
    if (this.params != null) {
      this.model.asset_condition = 'NEW';
      this.isReadOnly = true;
      // call web service
      this.callGetrow();
      setTimeout(() => {
        // this.callWizard($('#applicationAssetTypeCode').val())
        // $('#tabagreementAssetInfo .nav-link').addClass('active');
        // this.assetinfowiz();
        $('#tabagreementAmortization .nav-link').addClass('active');
      }, 500);
      this.amortizationwiz();
    }
  }

  //#region getrow data
  callGetrow() {

    this.dataTamp = [{
      'p_asset_no': this.params
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];

          // checkbox
          if (parsedata.is_auto_email === '1') {
            parsedata.is_auto_email = true
          } else {
            parsedata.is_auto_email = false
          }

          if (parsedata.is_otr === '1') {
            parsedata.is_otr = true
            this.isOTR = true
          } else {
            parsedata.is_otr = false
            this.isOTR = false
          }

          if (parsedata.is_use_registration === '1') {
            parsedata.is_use_registration = true
          } else {
            parsedata.is_use_registration = false
          }

          if (parsedata.is_use_replacement === '1') {
            parsedata.is_use_replacement = true
          } else {
            parsedata.is_use_replacement = false
          }

          if (parsedata.is_use_maintenance === '1') {
            parsedata.is_use_maintenance = true
          } else {
            parsedata.is_use_maintenance = false
          }

          if (parsedata.is_use_insurance === '1') {
            parsedata.is_use_insurance = true
          } else {
            parsedata.is_use_insurance = false
          }

          if (parsedata.is_bbn_client === '1') {
            parsedata.is_bbn_client = true
            this.isBBNClient = true
          } else {
            parsedata.is_bbn_client = false
            this.isBBNClient = false
          }
          
          if (parsedata.is_purchase_requirement_after_lease === '1') {
            parsedata.is_purchase_requirement_after_lease = true;
          } else {
            parsedata.is_purchase_requirement_after_lease = false;
          }
          // end checkbox


          this.assettypecode = parsedata.asset_type_code;

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

  //#region List tabs
  amortizationwiz() {
    this.route.navigate(['/inquiry/subagreementlist/agreementdetail/' + this.param + '/agreementassetlist/' + this.param + '/agreementassetdetail/' + this.param + '/' + this.params + '/amortizationlistwiz/', this.param, this.params], { skipLocationChange: true });
  }
  replacementwiz() {
    this.route.navigate(['/inquiry/subagreementlist/agreementdetail/' + this.param + '/agreementassetlist/' + this.param + '/agreementassetdetail/' + this.param + '/' + this.params + '/agreementassetreplacementlistwiz/', this.params], { skipLocationChange: true });
  }
  obligationwiz() {
    this.route.navigate(['/inquiry/subagreementlist/agreementdetail/' + this.param + '/agreementassetlist/' + this.param + '/agreementassetdetail/' + this.param + '/' + this.params + '/agreementobligationlistwiz/', this.param, this.params], { skipLocationChange: true });
  }

  //#region button back
  btnBack() {
    this.route.navigate(['/inquiry/subagreementlist/agreementdetail/' + this.param + '/agreementassetlist/', this.param], { skipLocationChange: true });
    $('#datatableAsset').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region button print expense
  // btnPrintExpense() {
  //   this.showSpinner = true;
  //   const dataParam = {
  //     TableName: 'RPT_EXPENSE',
  //     SpName: 'xsp_rpt_expense',
  //     reportparameters: {
  //       p_user_id: this.userId,
  //       p_code: this.param,
  //       p_asset_no: this.params,
  //       p_print_option: 'PDF'
  //     }
  //   };

  //   this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
  //     this.printRptNonCore(res);
  //     this.showSpinner = false;
  //   }, err => {
  //     this.showSpinner = false;
  //     const parse = JSON.parse(err);
  //     this.swalPopUpMsg(parse.data);
  //   });
  // }
  //#endregion button print expense

  btnPrintExpense() {
    this.showSpinner = true;
    const dataParam = {
      TableName: 'RPT_EXPENSE',
      SpName: 'xsp_rpt_expense',
      reportparameters: {
        p_user_id: this.userId,
        p_asset_no: this.model.asset_no,
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


  //#region btnKaroseriAccessories
  btnKaroseriAccessories(type: String) {
    this.route.navigate(['/application/banberjalanapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/assetlist/' + this.param + '/' + 'banberjalan' + '/karoseriaccessorieslistavp/', this.param, this.params, type], { skipLocationChange: true });
  }
  //#endregion btnKaroseriAccessories

  btnInsurance() {
    this.route.navigate(['/application/banberjalanapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/assetlist/' + this.param + '/' + 'banberjalan' + '/assetinsurancedetaildetail/', this.param, this.params], { skipLocationChange: true });
  }

}
