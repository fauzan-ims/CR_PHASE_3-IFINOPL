import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';

@Component({
  selector: 'app-agreementdetail',
  templateUrl: './agreementdetail.component.html'
})
export class AgreementdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public agreementData: any = [];
  public listasset: any = [];
  public isReadOnly: Boolean = false;
  private dataTamp: any = [];
  public setStyle: any = [];
  private dataTempThirdParty: any = [];
  private ClientPersonalIframe: any;
  private ClientCompanyIframe: any;

  private APIController: String = 'AgreementMain';
  private APIControllerAgreementAsset: String = 'AgreementAsset';
  private APIControllerSysGlobalParam: String = 'SysGlobalParam';
  private APIControllerIntergration: String = 'Intergration';

  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForGetRows: String = 'GETROWS';
  private APIRouteForThirdPartyGetToken: String = 'ThirdPartyGetToken';
  private APIRouteForGetThirddParty: String = 'ExecSpForGetThirddParty';

  private RoleAccessCode = 'R00020560000000A';

  // report
  private APIControllerReport: String = 'Report';
  private APIRouteForDownload: String = 'getReport';

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = true;
  // end

  // ini buat datatables
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
    // this.callGetRole('');
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);

    if (this.param != null) {
      this.isReadOnly = true;

      // call web service
      this.callGetrow();
      this.callGlobalParamForThirdPartyIframeClient();
      this.wizard();
      this.agreementassetwiz();
      $('#tabAsset .nav-link').addClass('active');
    } else {
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

  //#region routing wiz

  //agreement wiz
  agreementassetwiz() {
    this.route.navigate(['/inquiry/subagreementlist/agreementdetail/' + this.param + '/agreementassetlist/', this.param], { skipLocationChange: true });
  }

  //deposit wiz
  deposit() {
    this.route.navigate(['/inquiry/subagreementlist/agreementdetail/' + this.param + '/depositlist/', this.param], { skipLocationChange: true });
  }

  ////write off wiz
  writeoff() {
    this.route.navigate(['/inquiry/subagreementlist/agreementdetail/' + this.param + '/agreementwriteofflist/', this.param], { skipLocationChange: true });
  }

  ////invoice wiz
  invoice() {
    this.route.navigate(['/inquiry/subagreementlist/agreementdetail/' + this.param + '/invoicelistwiz/', this.param], { skipLocationChange: true });
  }

  //#endregion routing wiz

  //#region GlobalParam for Thirdparty
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

  //#region getrow data
  callGetrow() {

    this.dataTamp = [{
      'p_agreement_no': this.param
    }]

    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

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
          console.log('There was an error while Retrieving Data(API) !!!' + error);
        });
  }
  //#endregion getrow data 

  //#region button back
  btnBack() {
    this.route.navigate(['/inquiry/subagreementlist']);
  }
  //#endregion button back

  //#region button print
  btnPrint() {
    this.showSpinner = true;
    const dataParam = {
      TableName: 'rpt_agreement_amortization',
      SpName: 'xsp_rpt_agreement_amortization',
      reportparameters: {
        p_user_id: this.userId,
        p_agreement_no: this.model.agreement_no,
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

  //#region button print keterlambatan
  btnPrintKeterlambatan() {
    this.showSpinner = true;
    const dataParam = {
      TableName: 'RPT_INVOICE_DENDA_KETERLAMBATAN',
      SpName: 'xsp_rpt_invoice_denda_keterlambatan',
      reportparameters: {
        p_user_id: this.userId,
        p_agreement_no: this.model.agreement_no,
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
  //#endregion button print keterlambatan

  //#region button print btnPrintKeterlambatanPengembalianAsset
  btnPrintKeterlambatanPengembalianAsset() {
    this.showSpinner = true;
    const dataParam = {
      TableName: 'RPT_INVOICE_DENDA_KETERLAMBATAN_PENGEMBALIAN_ASSET',
      SpName: 'xsp_rpt_invoice_denda_keterlambatan_pengembalian_asset',
      reportparameters: {
        p_user_id: this.userId,
        p_agreement_no: this.model.agreement_no,
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
  //#endregion button print btnPrintKeterlambatanPengembalianAsset

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
}
