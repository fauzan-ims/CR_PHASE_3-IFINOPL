import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import { DALService } from '../../../../../../../DALservice.service';

@Component({
  moduleId: module.id,
  selector: 'app-pendingbillingagreementassetdetail',
  templateUrl: './pendingbillingagreementassetdetail.component.html'
})

export class PendingbillingagreementassetdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public assetdetailData: any = [];
  public isReadOnly: Boolean = false;
  public lookupassettype: any = [];
  public isOTR: boolean = false;
  public isBBNClient: boolean = false;
  private dataTamp: any = [];
  private assettypecode: any = [];
  private APIController: String = 'AgreementAsset';
  private APIRouteForGetRow: String = 'GETROW';
  private RoleAccessCode = 'R00023160000001A'; // role access 

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
    private _elementRef: ElementRef
  ) { super(); }

  ngOnInit() {
    // this.callGetRole(this.userId);
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    if (this.params != null) {
      this.model.asset_condition = 'NEW';
      this.isReadOnly = true;
      // call web service
      this.callGetrow();
      this.wizard();
      this.amortizationwiz();
      // setTimeout(() => {
      //   // this.callWizard($('#applicationAssetTypeCode').val())
      //   $('#tabagreementAssetInfo .nav-link').addClass('active');
      //   this.assetinfowiz();
      // }, 500);
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
          const parsedata = this.getrowNgb(parse.data[0]);

          // checkbox
          if (parsedata.is_rent_to_own === '1') {
            parsedata.is_rent_to_own = true;
          } else {
            parsedata.is_rent_to_own = false;
          }

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
  // assetinfowiz() {

  //   if (this.assettypecode === 'VHCL') {
  //     console.log('Masuk')
  //     this.route.navigate(['/inquiry/subagreementlist/agreementassetdetail/' + this.param + '/' + this.params + '/assetvehicledetail/', this.param, this.params], { skipLocationChange: true });
  //   } else if (this.assettypecode === 'MCHN') {
  //     this.route.navigate(['/inquiry/subagreementlist/agreementassetdetail/' + this.param + '/' + this.params + '/assetmachinedetail/', this.param, this.params], { skipLocationChange: true });
  //   } else if (this.assettypecode === 'HE') {
  //     this.route.navigate(['/inquiry/subagreementlist/agreementassetdetail/' + this.param + '/' + this.params + '/assetheavyequipmentdetail/', this.param, this.params], { skipLocationChange: true });
  //   } else if (this.assettypecode === 'ELEC') {
  //     this.route.navigate(['/inquiry/subagreementlist/agreementassetdetail/' + this.param + '/' + this.params + '/assetelectronicdetail/', this.param, this.params], { skipLocationChange: true });
  //   }
  // }
  
  amortizationwiz() {
    // this.route.navigate(['/application/subapplicationmainlist/applicationmaindetail/' + this.param + '/amortizationlist', this.param], { skipLocationChange: true });
    this.route.navigate(['/billing/subpendingbillingagreementlist/pendingbillingagreementassetdetail/' + this.param + '/' + this.params + '/pendingbillingagreementamortizationlist/', this.param, this.params], { skipLocationChange: true });
  }

  // replacementwiz() {
  //   // this.route.navigate(['/application/subapplicationmainlist/applicationmaindetail/' + this.param + '/amortizationlist', this.param], { skipLocationChange: true });
  //   this.route.navigate(['/inquiry/subagreementlist/agreementassetdetail/' + this.param + '/' + this.params + '/agreementassetreplacementlist/', this.params], { skipLocationChange: true });
  // }

  //#region button back
  btnBack() {
    this.route.navigate(['/billing/subpendingbillingagreementlist/pendingbillingagreementdetail', this.param], { skipLocationChange: true });
    $('#datatableAsset').DataTable().ajax.reload();
    // this.route.navigate(['/agreement/subagreementlist/agreementdetail/' + this.param + '/agreementassetlist/' + this.param], { skipLocationChange: true });
  }
  //#endregion button back

    //#region resteCity
    resteCity() {
      this.model.mobilization_province_code = undefined;
      this.model.mobilization_province_description = undefined;
      this.model.mobilization_city_code = undefined;
      this.model.mobilization_city_description = undefined;
    }
    //#endregion resteCity

}
