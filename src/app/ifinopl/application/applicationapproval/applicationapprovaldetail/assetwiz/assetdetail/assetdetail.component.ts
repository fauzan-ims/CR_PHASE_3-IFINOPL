import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import { DALService } from '../../../../../../../DALservice.service';
import { replaceAll } from 'chartist';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './assetdetail.component.html'
})

export class ApprovalassetdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');
  pageType = this.getRouteparam.snapshot.paramMap.get('page');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public approvalassetdetailData: any = [];
  public isReadOnly: Boolean = false;
  public lookupassettype: any = [];
  public lookupfakturtype: any = [];
  public listBudgetList: any = [];
  public npwp_no: String;
  private dataTamp: any = [];
  private asset_value: any = 0;
  private dp_pct: any = 0;
  private dp_amount: any = 0;
  private tampMarginAmount: any = 0;
  private tampMarginRate: any = 0;
  private tampAssetAmount: any = 0;
  private tampAssetInterestRate: any = 0;
  private tampAssetInterestAmount: any = 0;
  private tampResidualValueRate: any = 0;
  private tampResidualValueAmount: any = 0;
  private tampCogsAmount: any = 0;
  private tampBasicLeaseAmount: any = 0;
  private tampPeriode: any = 0;
  public lookupBudget: any = [];
  public lookupcategory: any = [];
  public lookupsubcategory: any = [];
  public lookupmerk: any = [];
  public lookupmodel: any = [];
  public lookuptype: any = [];
  public lookupunit: any = [];
  public lookupfixasset: any = [];
  private tampAdditionalChargeRate: any = 0;
  private tampAdditionalChargeAmount: any = 0;
  private tampLeaseAmount: any = 0;
  private dataTampPush: any = [];
  private clientName: String;
  private areaMobileNo: String;
  private mobileNo: String;
  private address: String;
  private documentNo: String;
  public isBBNClient: boolean;
  public EmailPattern = this._emailformat;
  public setStyle: any;
  public isOTR: boolean = false;
  public lookupBBN: any = [];

  private APIController: String = 'ApplicationAsset';
  private APIControllerApplicationMain: String = 'ApplicationMain';
  private APIControllerApplicationAssetBudget: String = 'ApplicationAssetBudget';
  private APIControllerSysGeneralSubcode: String = 'SysGeneralSubcode';
  private APIControllerMasterBudgetCost: String = 'MasterBudgetCost';
  private APIControllerMasterFixAsset: String = 'Asset';
  private APIControllerSysCity: String = 'SysCity';
  private APIControllerMasterCategory: String;
  private APIControllerMasterSubcategory: String;
  private APIControllerMasterMerk: String;
  private APIControllerMasterModel: String;
  private APIControllerMasterType: String;
  private APIControllerMasterUnit: String;

  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForInsert: String = 'Insert';
  private APIRouteForUpdate: String = 'Update';
  private APIRouteForDelete: String = 'Delete';
  private APIRouteForExecSpForCopy: String = 'ExecSpForCopy';
  private APIRouteForExecSpForRequestBudgetApproval: String = 'ExecSpForRequestBudgetApproval';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForFixedAssetLookup: String = 'GetRowsForFixedAssetLookup';
  private APIRouteForMultipleLookup: String = 'GetRowsForMultipleLookup';
  private APIRouteForLookupCity: String = 'GetRowsLookupForMasterRegionCity';

  private RoleAccessCode = 'R00020690000010A'; // role access 

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = true;
  // end

  // checklist
  public selectedAllTable: any;
  public selectedAllLookup: any;
  private checkedList: any = [];
  private checkedLookup: any = [];

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
    $("#npwp").attr('maxlength', '15');
    this.getrowApplication();

    if (this.params != null) {
      this.wizard();

      // call web service
      this.callGetrow();
      this.loadData();
      this.amortizationwiz();
      $('#tabapplicationAmortDisbAmortization .nav-link').addClass('active');
    } else {
      this.model.billing_mode_date = 0;
      this.model.monthly_total_budget = 0;
      this.model.capitalize_amount = 0;
      this.model.asset_condition = 'NEW';
      this.showSpinner = false;
      this.model.billing_to = 'CLIENT';
      this.model.deliver_to = 'CLIENT';
      this.model.billing_mode = 'NORMAL';
      this.model.lease_option = 'FULL';
      this.model.margin_by = 'ALL';
      this.model.first_payment_type = 'ADV';
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
  //#endregion getStyles

  //#region load all data
  loadData() {
    this.dtOptions = {
      'pagingType': 'simple',
      'info': false,
      'pageLength': 100,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: false, // jika ingin hilangin search box nya maka false
      ajax: (dtParameters: any, callback) => {

        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_asset_no': this.params
        })

        this.dalservice.Getrows(dtParameters, this.APIControllerApplicationAssetBudget, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listBudgetList = parse.data;
          if (parse.data != null) {
            this.listBudgetList.numberIndex = dtParameters.start;
          }

          // if use checkAll use this
          $('#checkalltable').prop('checked', false);
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
      'p_asset_no': this.params
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          this.APIControllerMasterCategory = "Master" + parsedata.asset_type_for_api + "Category"
          this.APIControllerMasterSubcategory = "Master" + parsedata.asset_type_for_api + "Subcategory"
          this.APIControllerMasterMerk = "Master" + parsedata.asset_type_for_api + "Merk"
          this.APIControllerMasterModel = "Master" + parsedata.asset_type_for_api + "Model"
          this.APIControllerMasterType = "Master" + parsedata.asset_type_for_api + "Type"
          this.APIControllerMasterUnit = "Master" + parsedata.asset_type_for_api + "Unit"
          // checkbox
          if (parsedata.is_purchase_requirement_after_lease === '1') {
            parsedata.is_purchase_requirement_after_lease = true;
          } else {
            parsedata.is_purchase_requirement_after_lease = false;
          }

          if (parsedata.is_auto_email === '1') {
            parsedata.is_auto_email = true
          } else {
            parsedata.is_auto_email = false
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

          if (parsedata.is_bbn_client === '1') {
            parsedata.is_bbn_client = true
            this.isBBNClient = true
          } else {
            parsedata.is_bbn_client = false
            this.isBBNClient = false
          }

          if (parsedata.is_use_insurance === '1') {
            parsedata.is_use_insurance = true
          } else {
            parsedata.is_use_insurance = false
          }

          if (parsedata.is_otr === '1') {
            parsedata.is_otr = true
            this.isOTR = true
          } else {
            parsedata.is_otr = false
            this.isOTR = false
          }

          if (parsedata.is_use_gps === '1') {
            parsedata.is_use_gps = true
          } else {
            parsedata.is_use_gps = false
          }
          // end checkbox 

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

  //#region getrowApplication
  getrowApplication() {

    this.dataTamp = [{
      'p_application_no': this.param
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIControllerApplicationMain, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          this.clientName = parsedata.client_name;
          this.areaMobileNo = parsedata.area_mobile_no;
          this.mobileNo = parsedata.mobile_no;
          this.address = parsedata.address;
          this.documentNo = parsedata.document_no;

          if (this.model.billing_to === 'CLIENT') {
            this.model.billing_to_name = this.clientName;
            this.model.billing_to_area_no = this.areaMobileNo;
            this.model.billing_to_phone_no = this.mobileNo;
            this.model.billing_to_address = this.address;
            this.model.billing_to_npwp = this.documentNo;
          }

          if (this.model.deliver_to === 'CLIENT') {
            this.model.deliver_to_name = this.clientName;
            this.model.deliver_to_area_no = this.areaMobileNo;
            this.model.deliver_to_phone_no = this.mobileNo;
            this.model.deliver_to_address = this.address;
          }

          this.showSpinner = false;
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
  }
  //#endregion getrowApplication

  //#region billingTo
  billingTo(event: any) {
    if (event.target.value === 'CLIENT') {
      this.model.billing_to_name = this.clientName;
      this.model.billing_to_area_no = this.areaMobileNo;
      this.model.billing_to_phone_no = this.mobileNo;
      this.model.billing_to_address = this.address;
      this.model.billing_to_npwp = this.documentNo;
    } else {
      this.model.billing_to_name = "";
      this.model.billing_to_area_no = "";
      this.model.billing_to_phone_no = "";
      this.model.billing_to_address = "";
      this.model.billing_to_npwp = "";
    }
  }
  //#endregion billingTo

  //#region deliverTo
  deliverTo(event: any) {
    if (event.target.value === 'CLIENT') {
      this.model.deliver_to_name = this.clientName;
      this.model.deliver_to_area_no = this.areaMobileNo;
      this.model.deliver_to_phone_no = this.mobileNo;
      this.model.deliver_to_address = this.address;
    } else {
      this.model.deliver_to_name = "";
      this.model.deliver_to_area_no = "";
      this.model.deliver_to_phone_no = "";
      this.model.deliver_to_address = "";
    }
  }
  //#endregion deliverTo

  //#region billingMode
  billingMode(event: any) {
    if (event.target.value === 'NORMAL') {
      this.model.billing_mode = event.target.value;
      this.model.billing_mode_date = '0';
    }
  }
  //#endregion billingMode

  //#region onBlur
  onBlur(event, i, type) {
    if (type === 'cost_amount_monthly' || type === 'cost_amount_yearly') {
      event = '' + event.target.value;
      event = event.trim();
      event = parseFloat(event).toFixed(2); // ganti jadi 6 kalo mau pct
      event = event.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    } else {
      event = '' + event.target.value;
      event = event.trim();
      event = parseFloat(event).toFixed(6);
    }

    if (event === 'NaN') {
      event = 0;
      event = parseFloat(event).toFixed(2);
    }

    if (type === 'cost_amount_monthly') {
      $('#cost_amount_monthly' + i)
        .map(function () { return $(this).val(event); }).get();
    } else if (type === 'cost_amount_yearly') {
      $('#cost_amount_yearly' + i)
        .map(function () { return $(this).val(event); }).get();
    }
  }
  //#endregion onBlur

  //#region onFocus
  onFocus(event, i, type) {
    event = '' + event.target.value;

    if (event != null) {
      event = event.replace(/[ ]*,[ ]*|[ ]+/g, '');
    }

    if (type === 'cost_amount_monthly') {
      $('#cost_amount_monthly' + i)
        .map(function () { return $(this).val(event); }).get();
    } else if (type === 'cost_amount_yearly') {
      $('#cost_amount_yearly' + i)
        .map(function () { return $(this).val(event); }).get();
    }
  }
  //#endregion onFocus

  //#region button save list
  btnSaveList() {
    this.listBudgetList = [];

    let i = 0;

    const getCostCode = $('[name="p_cost_code"]')
      .map(function () { return $(this).val(); }).get();

    const getcostAmountMonthly = $('[name="p_cost_amount_monthly"]')
      .map(function () { return $(this).val(); }).get();

    const getcostAmountYearly = $('[name="p_cost_amount_yearly"]')
      .map(function () { return $(this).val(); }).get();

    while (i < getCostCode.length) {
      while (i < getcostAmountMonthly.length) {
        while (i < getcostAmountYearly.length) {
          this.listBudgetList.push(
            this.JSToNumberFloats({
              p_asset_no: this.params,
              p_cost_code: getCostCode[i],
              p_cost_amount_monthly: getcostAmountMonthly[i],
              p_cost_amount_yearly: getcostAmountYearly[i]
            }));
          i++;
        }
        i++;
      }
      i++;
    }

    //#region web service
    this.dalservice.Update(this.listBudgetList, this.APIControllerApplicationAssetBudget, this.APIRouteForUpdate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            $('#datatableBudgetList').DataTable().ajax.reload();
            $('#btnApplicationAssetSave').click();
          } else {
            this.swalPopUpMsg(parse.data)
          }
        },
        error => {
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data)
        });
    //#endregion web service
  }
  //#endregion button save list

  //#region assetValue
  assetValue(event: any) {
    this.asset_value = event.target.value.replaceAll(',', '') * 1;
    this.model.dp_amount = this.asset_value * (this.model.dp_pct / 100);
    this.model.loan_amount = this.asset_value - (this.model.dp_amount * 1);
    this.model.financing_amount = this.model.loan_amount + this.model.capitalize_amount;
  }
  //#endregion assetValue

  //#region dpPct
  dpPct(event: any) {
    this.dp_pct = event.target.value.replaceAll(',', '') * 1;
    this.model.dp_amount = this.asset_value * (this.dp_pct / 100);
    this.model.loan_amount = this.asset_value - (this.model.dp_amount * 1);
    this.model.financing_amount = this.model.loan_amount + this.model.capitalize_amount;
  }
  //#endregion dpPct

  //#region dpAmount
  dpAmount(event: any) {
    this.dp_amount = event.target.value.replaceAll(',', '') * 1;
    this.model.dp_pct = ((this.dp_amount / this.asset_value) * 100);
    this.model.loan_amount = this.asset_value - this.dp_amount;
    this.model.financing_amount = this.model.loan_amount + this.model.capitalize_amount;
  }
  //#endregion dpAmount

  //#region button back
  btnBack() {
    this.route.navigate(['/application/banberjalanapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/assetlist', this.param, this.pageType], { skipLocationChange: true });
    $('#datatableApplicationAsset').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region List tabs 
  amortizationwiz() {
    this.route.navigate(['/application/banberjalanapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/assetlist/' + this.param + '/' + this.pageType + '/assetdetail/' + this.param + '/' + this.params + '/' + this.pageType + '/amortizationlist/', this.params, 'banberjalan'], { skipLocationChange: true });
  }
  //#endregion List tabs

  redirectTo(uri: string) {
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.route.navigate([uri]));
  }

  //#region AssetType Lookup
  btnLookupAssetType() {
    $('#datatableLookupAssetType').DataTable().clear().destroy();
    $('#datatableLookupAssetType').DataTable({
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
          'p_general_code': 'ASTPRT',
          'p_is_collateral': '0'
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerSysGeneralSubcode, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupassettype = parse.data;
          if (parse.data != null) {
            this.lookupassettype.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 3] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowAssetType(code: String, description: String) {
    let assetTypeCode = null;
    this.model.asset_type_code = code;
    this.model.asset_type_desc = description;
    if (code === 'VHCL') {
      assetTypeCode = 'Vehicle'
    } else if (code === 'MCHN') {
      assetTypeCode = 'Machinery'
    } else if (code === 'HE') {
      assetTypeCode = 'He'
    } else if (code === 'ELEC') {
      assetTypeCode = 'Electronic'
    }

    this.APIControllerMasterUnit = "Master" + assetTypeCode + "Unit"

    this.model.unit_code = null;
    this.model.unit_desc = null;
    this.model.category_code = null;
    this.model.subcategory_code = null;
    this.model.merk_code = null;
    this.model.model_code = null;
    this.model.type_code = null;
    this.model.category_desc = null;
    this.model.subcategory_desc = null;
    this.model.merk_desc = null;
    this.model.model_desc = null;
    this.model.type_desc = null;
    $('#lookupModalAssetType').modal('hide');
  }
  //#endregion AssetType lookup

  //#region FakturType Lookup
  btnLookupFakturType() {
    $('#datatableLookupFakturType').DataTable().clear().destroy();
    $('#datatableLookupFakturType').DataTable({
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
          'p_general_code': 'BTFT'
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerSysGeneralSubcode, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupfakturtype = parse.data;
          if (parse.data != null) {
            this.lookupfakturtype.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 3] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowFakturType(code: String, description: String) {
    this.model.billing_to_faktur_type = code;
    this.model.billing_to_faktur_type_desc = description;
    $('#lookupModalFakturType').modal('hide');
  }
  //#endregion FakturType lookup
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
      this.model.billing_to_npwp = valEvent.replace(/[^0-9]/g, '');
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

      this.model.billing_to_npwp = hh;
    }

  }
  //#endregion npwp

  //#region resteUnit()
  resteUnit() {
    this.model.category_code = undefined;
    this.model.category_desc = undefined;
    this.model.subcategory_code = undefined;
    this.model.subcategory_desc = undefined;
    this.model.merk_code = undefined;
    this.model.merk_desc = undefined;
    this.model.model_code = undefined;
    this.model.model_desc = undefined;
    this.model.type_code = undefined;
    this.model.type_desc = undefined;
    this.model.unit_code = undefined;
    this.model.unit_desc = undefined;
  }
  //#endregion resteUnit()

  //#region Category Lookup
  btnLookupCategory() {
    $('#datatableLookupCategory').DataTable().clear().destroy();
    $('#datatableLookupCategory').DataTable({
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

        this.dalservice.Getrows(dtParameters, this.APIControllerMasterCategory, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupcategory = parse.data;
          if (parse.data != null) {
            this.lookupcategory.numberIndex = dtParameters.start;
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

  btnSelectRowCategory(code: String, description: String) {
    this.model.category_code = code;
    this.model.category_desc = description;
    this.model.subcategory_code = undefined;
    this.model.subcategory_desc = undefined;
    this.model.merk_code = undefined;
    this.model.merk_desc = undefined;
    this.model.model_code = undefined;
    this.model.model_desc = undefined;
    this.model.type_code = undefined;
    this.model.type_desc = undefined;
    this.model.unit_code = undefined;
    this.model.unit_desc = undefined;
    $('#lookupModalCategory').modal('hide');
  }
  //#endregion Category lookup

  //#region SubCategory Lookup
  btnLookupSubCategory() {
    $('#datatableLookupSubCategory').DataTable().clear().destroy();
    $('#datatableLookupSubCategory').DataTable({
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
          'p_category_code': this.model.category_code
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerMasterSubcategory, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupsubcategory = parse.data;
          if (parse.data != null) {
            this.lookupsubcategory.numberIndex = dtParameters.start;
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

  btnSelectRowSubCategory(code: String, description: String) {
    this.model.subcategory_code = code;
    this.model.subcategory_desc = description;
    this.model.model_code = undefined;
    this.model.model_desc = undefined;
    this.model.type_code = undefined;
    this.model.type_desc = undefined;
    this.model.unit_code = undefined;
    this.model.unit_desc = undefined;
    $('#lookupModalSubCategory').modal('hide');
  }
  //#endregion SubCategory lookup

  //#region Merk Lookup
  btnLookupMerk() {
    $('#datatableLookupMerk').DataTable().clear().destroy();
    $('#datatableLookupMerk').DataTable({
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

        this.dalservice.Getrows(dtParameters, this.APIControllerMasterMerk, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupmerk = parse.data;
          if (parse.data != null) {
            this.lookupmerk.numberIndex = dtParameters.start;
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

  btnSelectRowMerk(code: String, description: String) {
    this.model.merk_code = code;
    this.model.merk_desc = description;
    this.model.model_code = undefined;
    this.model.model_desc = undefined;
    this.model.type_code = undefined;
    this.model.type_desc = undefined;
    this.model.unit_code = undefined;
    this.model.unit_desc = undefined;
    $('#lookupModalMerk').modal('hide');
  }
  //#endregion Merk lookup

  //#region Model Lookup
  btnLookupModel() {
    $('#datatableLookupModel').DataTable().clear().destroy();
    $('#datatableLookupModel').DataTable({
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
          'p_merk_code': this.model.merk_code,
          'p_subcategory_code': this.model.subcategory_code
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerMasterModel, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupmodel = parse.data;
          if (parse.data != null) {
            this.lookupmodel.numberIndex = dtParameters.start;
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

  btnSelectRowModel(code: String, description: String) {
    this.model.model_code = code;
    this.model.model_desc = description;
    this.model.type_code = undefined;
    this.model.type_desc = undefined;
    this.model.unit_code = undefined;
    this.model.unit_desc = undefined;
    $('#lookupModalModel').modal('hide');
  }
  //#endregion Model lookup

  //#region Type Lookup
  btnLookupType() {
    $('#datatableLookupType').DataTable().clear().destroy();
    $('#datatableLookupType').DataTable({
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
          'p_model_code': this.model.model_code
        });


        this.dalservice.Getrows(dtParameters, this.APIControllerMasterType, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookuptype = parse.data;
          if (parse.data != null) {
            this.lookuptype.numberIndex = dtParameters.start;
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

  btnSelectRowType(code: String, description: String) {
    this.model.type_code = code;
    this.model.type_desc = description;
    this.model.unit_code = undefined;
    this.model.unit_desc = undefined;



    $('#lookupModalType').modal('hide');
  }
  //#endregion Type lookup

  //#region Unit Lookup
  btnLookupUnit() {
    $('#datatableLookupUnit').DataTable().clear().destroy();
    $('#datatableLookupUnit').DataTable({
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
          'p_category_code': '',
          'p_subcategory_code': '',
          'p_merk_code': '',
          'p_model_code': '',
          'p_type_code': '',
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerMasterUnit, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupunit = parse.data;
          if (parse.data != null) {
            this.lookupunit.numberIndex = dtParameters.start;
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

  // tslint:disable-next-line: max-line-length
  btnSelectRowUnit(code: String, description: String, category_code: String, category_desc: String, subcategory_code: String, subcategory_desc: String, merk_code: String, merk_desc: String, model_code: String, model_desc: String, type_code: String, type_desc: String) {
    this.model.unit_code = code;
    this.model.unit_desc = description;
    this.model.category_code = category_code;
    this.model.subcategory_code = subcategory_code;
    this.model.merk_code = merk_code;
    this.model.model_code = model_code;
    this.model.type_code = type_code;
    this.model.category_desc = category_desc;
    this.model.subcategory_desc = subcategory_desc;
    this.model.merk_desc = merk_desc;
    this.model.model_desc = model_desc;
    this.model.type_desc = type_desc;

    $('#lookupModalUnit').modal('hide');
  }
  //#endregion Unit lookup

  //#region FixAsset Lookup
  btnLookupFixAsset() {
    $('#datatableLookupFixAsset').DataTable().clear().destroy();
    $('#datatableLookupFixAsset').DataTable({
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
          'p_type_code': this.model.asset_type_code,
          'p_merk_code': this.model.merk_code,
          'p_model_code': this.model.model_code,
          'p_type_item_code': this.model.type_code,

        });

        this.dalservice.GetrowsAms(dtParameters, this.APIControllerMasterFixAsset, this.APIRouteForFixedAssetLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupfixasset = parse.data;
          if (parse.data != null) {
            this.lookupfixasset.numberIndex = dtParameters.start;
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

  // tslint:disable-next-line: max-line-length
  btnSelectRowFixAsset(code: String, item_name: String) {
    this.model.fa_code = code;
    this.model.fa_name = item_name;
    $('#lookupModalFixAsset').modal('hide');
  }
  //#endregion FixAsset lookup

  //#region multiplelookup Budget
  btnLookupBudget() {
    $('#datatableLookupBudget').DataTable().clear().destroy();
    $('#datatableLookupBudget').DataTable({
      'pagingType': 'full_numbers',
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: false, // ini untuk hilangin search box nya
      ajax: (dtParameters: any, callback) => {


        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_asset_no': this.params
        });


        this.dalservice.Getrows(dtParameters, this.APIControllerMasterBudgetCost, this.APIRouteForMultipleLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupBudget = parse.data;
          if (parse.data != null) {
            this.lookupBudget.numberIndex = dtParameters.start;
          }

          // if use checkAll use this
          $('#checkallLookup').prop('checked', false);
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
    });
  }
  //#endregion lookup Budget

  //#region btnSelectAllLookup
  btnSelectAllLookup() {
    this.checkedLookup = [];
    for (let i = 0; i < this.lookupBudget.length; i++) {
      if (this.lookupBudget[i].selectedLookup) {
        this.checkedLookup.push({
          'code': this.lookupBudget[i].code
          , 'cost_type': this.lookupBudget[i].cost_type
        });
      }
    }

    // jika tidak di checklist
    if (this.checkedLookup.length === 0) {
      swal({
        title: this._listdialogconf,
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-danger'
      }).catch(swal.noop)
      return
    }

    this.dataTampPush = [];
    for (let J = 0; J < this.checkedLookup.length; J++) {
      this.dataTampPush.push({
        'p_asset_no': this.params,
        'p_cost_code': this.checkedLookup[J].code,
        'p_cost_type': this.checkedLookup[J].cost_type
      });
    }
    this.dalservice.Insert(this.dataTampPush, this.APIControllerApplicationAssetBudget, this.APIRouteForInsert)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.showNotification('bottom', 'right', 'success');
            $('#datatableBudgetList').DataTable().ajax.reload();
            $('#datatableLookupBudget').DataTable().ajax.reload();
            this.callGetrow();
            this.showSpinner = false;
          } else {
            this.swalPopUpMsg(parse.data);
            this.showSpinner = false;
          }
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data)
        })
  }

  selectAllLookup() {
    for (let i = 0; i < this.lookupBudget.length; i++) {
      this.lookupBudget[i].selectedLookup = this.selectedAllLookup;
    }
  }

  checkIfAllLookupSelected() {
    this.selectedAllLookup = this.lookupBudget.every(function (item: any) {
      return item.selectedLookup === true;
    })
  }
  //#endregion btnSelectAllLookup

  //#region checkbox all table
  btnDeleteAll() {
    this.checkedList = [];
    for (let i = 0; i < this.listBudgetList.length; i++) {
      if (this.listBudgetList[i].selected) {
        this.checkedList.push(this.listBudgetList[i].id);
      }
    }
    // jika tidak di checklist
    if (this.checkedList.length === 0) {
      swal({
        title: this._listdialogconf,
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-danger'
      }).catch(swal.noop)
      return
    }

    this.dataTampPush = [];
    swal({
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
        let th = this;
        var J = 0;
        (function loopDeleteApplicationAssetBudget() {
          if (J < th.checkedList.length) {

            th.dataTampPush.push({
              'p_id': th.checkedList[J],
              'action': ''
            });

            th.dalservice.Delete(th.dataTampPush, th.APIControllerApplicationAssetBudget, th.APIRouteForDelete)
              .subscribe(
                res => {
                  const parse = JSON.parse(res);
                  if (parse.result === 1) {
                    if (th.checkedList.length == J + 1) {
                      th.showNotification('bottom', 'right', 'success');
                      $('#datatableBudgetList').DataTable().ajax.reload();
                      th.callGetrow();
                      th.showSpinner = false;
                    } else {
                      J++;
                      loopDeleteApplicationAssetBudget();
                    }
                  } else {
                    th.swalPopUpMsg(parse.data);
                    th.showSpinner = false;
                  }
                },
                error => {
                  th.showSpinner = false;
                  const parse = JSON.parse(error);
                  th.swalPopUpMsg(parse.data);
                });
          }
        })();
      } else {
        this.showSpinner = false;
      }
    });
  }

  selectAllTable() {
    for (let i = 0; i < this.listBudgetList.length; i++) {
      this.listBudgetList[i].selected = this.selectedAllTable;
    }
  }

  checkIfAllTableSelected() {
    this.selectedAllTable = this.listBudgetList.every(function (item: any) {
      return item.selected === true;
    })
  }
  //#endregion checkbox all table

  //#region btnDuplicateAsset
  btnDuplicateAsset(asset_no: any) {
    swal({
      html:
        '<div class="row">' +
        '<div class="col-md-12">' +
        '<div class="form-group">' +
        '<label style="float: left; font-size:12px">Number of Copy</label>' +
        '<input type="number" class="form-control"  value= "" id="input-number_of_copy" ' +
        'maxlength="3">' +
        '</div>' +
        '</div>' +
        '</div>',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Yes',
      buttonsStyling: false
    }).then((result) => {
      this.showSpinner = true;
      if (result.value) {
        this.dataTamp = [{
          'p_asset_no': asset_no,
          'p_number_of_copy': $('#input-number_of_copy').val(),
          'action': ''
        }];

        // call web service
        this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForExecSpForCopy)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showNotification('bottom', 'right', 'success');
                $('#datatableApplicationAsset').DataTable().ajax.reload();
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
  //#endregion btnDuplicateAsset

  //#region btnRequestBudgetApproval
  btnRequestBudgetApproval() {

    this.dataTamp = [{
      'p_asset_no': this.params,
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
        this.dalservice.ExecSp(this.dataTamp, this.APIControllerApplicationAssetBudget, this.APIRouteForExecSpForRequestBudgetApproval)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                $('#datatableBudgetList').DataTable().ajax.reload();
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
  //#endregion btnRequestBudgetApproval

  //#region btnKaroseriAccessories
  btnKaroseriAccessories(type: String) {
    this.route.navigate(['/application/banberjalanapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/assetlist/' + this.param + '/' + 'banberjalan' + '/karoseriaccessorieslistavp/', this.param, this.params, type], { skipLocationChange: true });
  }
  //#endregion btnKaroseriAccessories

  btnInsurance() {
    this.route.navigate(['/application/banberjalanapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/assetlist/' + this.param + '/' + 'banberjalan' + '/assetinsurancedetaildetail/', this.param, this.params], { skipLocationChange: true });
  }

  //#region btnLookupBBN
  btnLookupBBN() {
    $('#datatableLookupBBN').DataTable().clear().destroy();
    $('#datatableLookupBBN').DataTable({
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

        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysCity, this.APIRouteForLookupCity).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupBBN = parse.data;
          if (parse.data != null) {
            this.lookupBBN.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 3] }], // for disabled coloumn
      order: [[2, 'desc']],
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowBBN(code: String, description: String) {
    this.model.bbn_location_code = code;
    this.model.bbn_location_description = description;
    $('#lookupModalBBN').modal('hide');
  }
  //#endregion btnLookupBBN

  //#region getrow data
  callGetrowHeader() {

    this.dataTamp = [{
      'p_application_no': this.param
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIControllerApplicationMain, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];

          this.model.email = parsedata.client_email
          this.model.is_simulation = parsedata.is_simulation

          this.tampPeriode = parsedata.periode * 1;
          this.showSpinner = false;
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
  }
  //#endregion getrow data
}