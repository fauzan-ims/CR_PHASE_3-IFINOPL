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

export class AssetdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');
  pageType = this.getRouteparam.snapshot.paramMap.get('page');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public assetdetailData: any = [];
  public isReadOnly: Boolean = false;
  public lookupassettype: any = [];
  public lookupfakturtype: any = [];
  public listBudgetList: any = [];
  public listBudget: any = [];
  public billing_to_npwp: String;
  public NpwpPattern = this._npwpformat;
  private dataTamp: any = [];
  private asset_value: any = 0;
  private dp_pct: any = 0;
  private dp_amount: any = 0;
  private tampPeriode: any = 0;
  public lookupBudget: any = [];
  public lookupcategory: any = [];
  public lookupBBN: any = [];
  public lookupsubcategory: any = [];
  public lookupmerk: any = [];
  public lookupMileageCategory: any = [];
  public lookupmodel: any = [];
  public lookuptype: any = [];
  public lookupunit: any = [];
  public lookupfixasset: any = [];
  public lookupMobilizationCity: any = [];
  private dataTampPush: any = [];
  private clientName: String;
  private areaMobileNo: String;
  private mobileNo: String;
  private address: String;
  private documentNo: String;
  public statusBudgetApproval: String;
  public unitCondition: String;
  public EmailPattern = this._emailformat;
  public setStyle: any;
  public isOTR: boolean = false;
  public isBBNClient: boolean = false;
  private APIControllerMasterCategory: String;
  private APIControllerMasterSubcategory: String;
  private APIControllerMasterMerk: String;
  private APIControllerMasterModel: String;
  private APIControllerMasterType: String;
  private APIControllerMasterUnit: String;
  private isKaroseriAccessories: boolean = false;
  private isInsurance: boolean = false;
  private additionalItemType: String = '';

  private APIController: String = 'ApplicationAsset';
  private APIControllerApplicationMain: String = 'ApplicationMain';
  private APIControllerApplicationAssetBudget: String = 'ApplicationAssetBudget';
  private APIControllerSysGeneralSubcode: String = 'SysGeneralSubcode';
  private APIControllerSysCity: String = 'SysCity';
  private APIControllerMasterBudgetCost: String = 'MasterBudgetCost';
  private APIControllerMasterFixAsset: String = 'Asset';
  private APIControllerMasterModelRv: String = 'MasterModelRv';
  private APIControllerMasterMileageCategory: String = 'MasterMileageDetail';

  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForInsert: String = 'Insert';
  private APIRouteForUpdate: String = 'Update';
  private APIRouteForUpdateAmount: String = 'UpdateAmount';
  private APIRouteForDelete: String = 'Delete';
  private APIRouteForExecSpForCopy: String = 'ExecSpForCopy';
  private APIRouteForExecSpForGetRate: String = 'ExecSpForGetRate';
  private APIRouteForExecSpForRequestBudgetApproval: String = 'ExecSpForRequestBudgetApproval';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForLookupCity: String = 'GetRowsLookupForMasterRegionCity';
  private APIRouteForFixedAssetLookup: String = 'GetRowsForFixedAssetLookup';
  private APIRouteForMultipleLookup: String = 'GetRowsForMultipleLookup';
  private APIRouteForLookupMileageCategory: String = 'GetRowsForLookupMileage';

  private RoleAccessCode = 'R00019900000000A'; // role access

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
  dtOptionsDetail: DataTables.Settings = {};

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
      this.callGetrowHeader();
      this.model.otr_amount = 0;
      this.model.billing_mode_date = 0;
      this.model.monthly_total_budget = 0;
      this.model.capitalize_amount = 0;
      this.model.asset_condition = 'NEW';
      this.model.unit_source = 'Purchase';
      this.showSpinner = false;
      this.model.billing_to = 'OTHER';
      this.model.deliver_to = 'OTHER';
      this.model.billing_mode = 'NORMAL';
      this.model.plat_colour = 'HITAM';
      this.model.cop = 'NON COP';
      this.model.lease_option = 'FULL';
      this.model.margin_by = 'ALL';
      this.model.first_payment_type = 'ADV';
      this.model.asset_amount = 0;
      this.model.asset_interest_rate = 0;
      this.model.asset_interest_amount = 0;
      this.model.borrowing_interest_rate = 0;
      this.model.borrowing_interest_amount = 0;
      this.model.asset_rv_pct = 0;
      this.model.asset_rv_amount = 0;
      this.model.karoseri_amount = 0;
      this.model.accessories_amount = 0;
      this.model.mobilization_amount = 0;
      this.model.discount_amount = 0;
      this.model.discount_karoseri_amount = 0;
      this.model.discount_accessories_amount = 0;
      this.model.market_value = 0;
      this.model.usage = 'CITY';
      this.model.pmt_amount = 0;
      this.model.transmisi = 'AT';
      this.model.gps_installation_amount = 0;
      this.model.gps_monthly_amount = 0;
      this.model.start_miles = 0;
    }
  }

  //#region load all data
  loadData() {
    this.dtOptionsDetail = {
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

          if (parsedata.is_use_gps === '1') {
            parsedata.is_use_gps = true
          } else {
            parsedata.is_use_gps = false
          }
          // end checkbox

          this.tampPeriode = parsedata.periode * 1;

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
          this.model.client_no = parsedata.client_no
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
          this.model.is_purchase_requirement_after_lease = parsedata.is_purchase_requirement_after_lease;

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

  //#region  form submit
  onFormSubmit(assetdetailForm: NgForm, isValid: boolean) {
    // validation form submit
    if (!isValid) {
      this.isKaroseriAccessories = false;
      this.isInsurance = false;
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

    this.assetdetailData = assetdetailForm;

    if (this.assetdetailData.p_is_auto_email == undefined) {
      this.assetdetailData.p_is_auto_email = 'F'
    }

    if (this.assetdetailData.p_is_otr == undefined) {
      this.assetdetailData.p_is_otr = 'F'
    }

    if (this.assetdetailData.p_is_use_registration == undefined) {
      this.assetdetailData.p_is_use_registration = 'F'
    }

    if (this.assetdetailData.p_is_use_replacement == undefined) {
      this.assetdetailData.p_is_use_replacement = 'F'
    }

    if (this.assetdetailData.p_is_use_maintenance == undefined) {
      this.assetdetailData.p_is_use_maintenance = 'F'
    }

    if (this.assetdetailData.p_is_use_insurance == undefined) {
      this.assetdetailData.p_is_use_insurance = 'F'
    }

    if (this.assetdetailData.p_is_bbn_client == undefined) {
      this.assetdetailData.p_is_bbn_client = 'F'
    }

    if (this.assetdetailData.p_is_use_gps == undefined) {
      this.assetdetailData.p_is_use_gps = 'F'
    }

    this.assetdetailData = this.JSToNumberFloats(assetdetailForm);
    const usersJson: any[] = Array.of(this.assetdetailData);

    if (this.params != null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.callGetrow();
              if (this.isKaroseriAccessories == true) {
                setTimeout(() => {
                  this.route.navigate(['/application/subapplicationmainlist/applicationmaindetail/' + this.param + '/assetlist/' + this.param + '/karoseriaccessorieslist/', this.param, this.params, this.additionalItemType], { skipLocationChange: true });
                }, 200);
              } else if (this.isInsurance == true) {
                setTimeout(() => {
                  this.route.navigate(['/application/subapplicationmainlist/applicationmaindetail/' + this.param + '/assetlist/' + this.param + '/assetinsurancedetaildetail/', this.param, this.params], { skipLocationChange: true });
                }, 200);
              } else {
                $('#datatableApplicationAmortization').DataTable().ajax.reload();
                $('#datatableBudgetList').DataTable().ajax.reload();
                $('#applicationDetail').click();
                this.showNotification('bottom', 'right', 'success');
              }
              this.isKaroseriAccessories = false;
              this.isInsurance = false;
              this.showSpinner = false;
            } else {
              this.isKaroseriAccessories = false;
              this.isInsurance = false;
              this.showSpinner = false;
              this.swalPopUpMsg(parse.data);
            }
          },
          error => {
            this.isKaroseriAccessories = false;
            this.isInsurance = false;
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
              $('#applicationDetail').click();
              $('#datatableBudgetList').DataTable().ajax.reload();
              this.showNotification('bottom', 'right', 'success');
              this.route.navigate(['/application/subapplicationmainlist/applicationmaindetail/' + this.param + '/assetlist/' + this.param + '/assetdetail/', this.param, parse.code], { skipLocationChange: true });
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

  //#region budgetAdjustmentAmount
  budgetAdjustmentAmount() {
    this.btnSaveList();
  }
  //#endregion budgetAdjustmentAmount

  //#region onBlur
  onBlur(event, i, type) {
    if (type === 'budget_adjustment_amount') {
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

    if (type === 'budget_adjustment_amount') {
      $('#budget_adjustment_amount' + i)
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

    if (type === 'budget_adjustment_amount') {
      $('#budget_adjustment_amount' + i)
        .map(function () { return $(this).val(event); }).get();
    }
  }
  //#endregion onFocus

  //#region button save list
  btnSaveList() {
    this.listBudget = [];

    let i = 0;

    const getId = $('[name="p_id_budget"]')
      .map(function () { return $(this).val(); }).get();

    const getCostCode = $('[name="p_cost_code"]')
      .map(function () { return $(this).val(); }).get();

    const getBudgetAmount = $('[name="p_budget_amount"]')
      .map(function () { return $(this).val(); }).get();

    while (i < getBudgetAmount.length) {
      while (i < getCostCode.length) {
        while (i < getId.length) {
          this.listBudget.push(
            this.JSToNumberFloats({
              p_id: getId[i],
              p_asset_no: this.params,
              p_cost_code: getCostCode[i],
              p_budget_amount: getBudgetAmount[i]
            }));
          i++;
        }
        i++;
      }
      i++;
    }

    //#region web service
    this.dalservice.Update(this.listBudget, this.APIControllerApplicationAssetBudget, this.APIRouteForUpdateAmount)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {

            setTimeout(() => {
              $('#btnApplicationAssetSave').click();
            }, 200);
            $('#datatableBudgetList').DataTable().ajax.reload();
            $('#datatableApplicationAmortization').DataTable().ajax.reload();

          } else {
            this.showSpinner = false;
            this.swalPopUpMsg(parse.data)
          }
        },
        error => {
          this.showSpinner = false;
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

  //#region mobilizationAmount
  mobilizationAmount(event: any) {
    this.model.mobilization_amount = event.target.value * 1;
  }
  //#endregion mobilizationAmount

  //#region assetYear
  assetYear(event: any) {
    this.model.asset_year = event.target.value;
    this.getRvRate();
  }
  //#endregion assetYear

  //#region button back
  btnBack() {
    if (this.pageType != null) {
      this.route.navigate(['/application/banberjalanapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/assetlist/', this.param, 'banberjalan'], { skipLocationChange: true });
    } else {
      this.route.navigate(['/application/subapplicationmainlist/applicationmaindetail/' + this.param + '/assetlist/', this.param], { skipLocationChange: true });
    }
    $('#datatableApplicationAsset').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region List tabs
  amortizationwiz() {
    if (this.pageType != null) {
      this.route.navigate(['/application/banberjalanapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/assetlist/' + this.param + '/' + this.pageType + '/assetdetail/' + this.param + '/' + this.params + '/' + this.pageType + '/amortizationlist/', this.params, 'banberjalan'], { skipLocationChange: true });
    } else {
      this.route.navigate(['/application/subapplicationmainlist/applicationmaindetail/' + this.param + '/assetlist/' + this.param + '/assetdetail/' + this.param + '/' + this.params + '/amortizationlist/', this.params], { skipLocationChange: true });
    }
  }
  //#endregion List tabs

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
      order: [[2, 'desc']],
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

  //#region resteFixedAsset()
  resteFixedAsset() {
    this.model.fa_code = undefined;
    this.model.fa_name = undefined;
    this.model.engine_no = undefined;
    this.model.chassis_no = undefined;
    this.model.plat_no = undefined;
    this.model.colour = undefined;
  }
  //#endregion v()

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

  //#region transmisiChange
  transmisiChange(event: any) {
    this.model.transmisi = event.target.value;
    if (this.model.model_code !== '' || this.model.model_code != null) {
      this.getRvRate();
    }
  }
  //#endregion transmisiChange

  //#region Unit Lookup
  btnLookupUnit() {
    if (this.model.asset_type_code == null || this.model.asset_type_code == undefined || this.model.asset_type_code === '') {
      swal({
        allowOutsideClick: true,
        title: 'Warning',
        text: 'Please Select Asset Type First',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-warning',
        type: 'warning'
      }).catch(swal.noop)
      this.resteUnit();
    } else if (this.model.asset_type_code === 'VHCL' && this.model.transmisi == null || this.model.transmisi == undefined || this.model.transmisi === '') {
      swal({
        allowOutsideClick: false,
        title: 'Warning',
        text: 'Please Select Transmisi First',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-warning',
        type: 'warning'
      }).catch(swal.noop);
      this.resteUnit();
    } else {
      $('#openModalUnit').click();
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
  }

  // tslint:disable-next-line: max-line-length
  btnSelectRowUnit(code: String, description: String, category_code: String, category_desc: String, subcategory_code: String, subcategory_desc: String,
    merk_code: String, merk_desc: String, model_code: String, model_desc: String, type_code: String, type_desc: String,
    fa_code: String, fa_name: String, engine_no: String, chassis_no: String, plat_no: String, colour: String, purchase_price: String
  ) {
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
    this.model.asset_name = description;
    //
    this.model.fa_code = fa_code;
    this.model.fa_name = fa_name;
    this.model.engine_no = engine_no;
    this.model.chassis_no = chassis_no;
    this.model.plat_no = plat_no;
    this.model.colour = colour;
    this.model.initial_price_amount = purchase_price;
    this.getRvRate();
    $('#lookupModalUnit').modal('hide');
  }
  //#endregion Unit lookup

  //#region FixAsset Lookup
  btnLookupFixAsset() {
    if (this.model.unit_code == null || this.model.unit_code == undefined || this.model.unit_code === '') {
      swal({
        allowOutsideClick: true,
        title: 'Warning',
        text: 'Please Select Unit First',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-warning',
        type: 'warning'
      }).catch(swal.noop)
      this.resteUnit();
    } else {
      $('#openFaNo').click();
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
            'p_type_item_code': this.model.type_code
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
        columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 7] }], // for disabled coloumn
        language: {
          search: '_INPUT_',
          searchPlaceholder: 'Search records',
          infoEmpty: '<p style="color:red;" > No Data Available !</p> '
        },
        searchDelay: 800 // pake ini supaya gak bug search
      });
    }
  }

  // tslint:disable-next-line: max-line-length
  btnSelectRowFixAsset(code: String, item_name: String, engine_no: String, chassis_no: String, plat_no: String,
    colour: String, purchase_price: any, last_meter: any) {
    this.model.fa_code = code;
    this.model.fa_name = item_name;
    this.model.engine_no = engine_no;
    this.model.chassis_no = chassis_no;
    this.model.plat_no = plat_no;
    this.model.colour = colour;
    this.model.initial_price_amount = purchase_price;
    this.model.start_miles = last_meter;
    $('#lookupModalFixAsset').modal('hide');
  }
  //#endregion FixAsset lookup

  //#region getRvRate()
  getRvRate() {
    this.dataTamp = [{
      'p_model_code': this.model.model_code,
      'p_periode': this.tampPeriode,
      'p_asset_year': this.model.asset_year,
      'p_transmisi': this.model.transmisi,
      'action': 'getResponse'
    }];

    this.dalservice.ExecSpBam(this.dataTamp, this.APIControllerMasterModelRv, this.APIRouteForExecSpForGetRate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];
          if (parsedata.rv_rate * 1 == null || parsedata.rv_rate * 1 == undefined) {
            this.model.asset_rv_pct = 0;
          } else {
            this.model.asset_rv_pct = parsedata.rv_rate * 1;
          }

          this.showSpinner = false;
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
  }
  //#endregion getRvRate()

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
          , 'is_subject_to_purchase': this.lookupBudget[i].is_subject_to_purchase
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
        'p_cost_type': this.checkedLookup[J].cost_type,
        'p_is_subject_to_purchase': this.checkedLookup[J].is_subject_to_purchase
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

  //#region btnDeleteAll()
  btnDeleteAll() {
    this.checkedList = [];
    for (let i = 0; i < this.listBudgetList.length; i++) {
      if (this.listBudgetList[i].selectedTable) {
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

  selectAllTables() {
    for (let i = 0; i < this.listBudgetList.length; i++) {
      this.listBudgetList[i].selectedTable = this.selectedAllTable;
    }
  }

  checkIfAllTableSelected() {
    this.selectedAllTable = this.listBudgetList.every(function (item: any) {
      return item.selectedTable === true;
    })
  }
  //#endregion btnDeleteAll()

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
                $('#applicationDetail').click();
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
  btnRequestBudgetApproval(cost_code: any, cost_amount_yearly: any, cost_amount_monthly: any) {
    this.dataTamp = [{
      'p_asset_no': this.params,
      'p_cost_code': cost_code,
      'p_cost_amount_yearly': cost_amount_yearly,
      'p_cost_amount_monthly': cost_amount_monthly,
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
                $('#applicationAssetBudgetRequest').click()
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

  //#region changeCondition
  changeCondition(event: any) {
    this.model.unit_source = event.target.value;
  }
  //#endregion changeCondition

  //#region platColour
  platColour(event: any) {
    this.model.plat_colour = event.target.value;
  }
  //#endregion platColour

  //#region changeCOP
  changeCOP(event: any) {
    this.model.cop = event.target.value;
  }
  //#endregion changeCOP

  //#region changeUsage
  changeUsage(event: any) {
    this.model.prorate = event.target.value;
  }
  //#endregion changeUsage

  //#region changeprorate
  changeprorate(event: any) {
    this.model.location = event.target.value;
  }
  //#endregion changeprorate

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
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 4] }], // for disabled coloumn
      order: [[2, 'desc']],
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowBBN(code: String, description: String, province_description: String) {
    this.model.bbn_location_code = code;
    this.model.bbn_location_description = description + '-' + province_description;
    $('#lookupModalBBN').modal('hide');
  }
  //#endregion btnLookupBBN

  //#region btnLookupMobilizationCity
  btnLookupMobilizationCity() {
    $('#datatableLookupMobilizationCity').DataTable().clear().destroy();
    $('#datatableLookupMobilizationCity').DataTable({
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
          this.lookupMobilizationCity = parse.data;
          if (parse.data != null) {
            this.lookupMobilizationCity.numberIndex = dtParameters.start;
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
      order: [[2, 'desc']],
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowMobilizationCity(code: String, description: String, province_code: String, province_description: String) {
    this.model.mobilization_city_code = code;
    this.model.mobilization_city_description = description;
    this.model.mobilization_province_code = province_code;
    this.model.mobilization_province_description = province_description;
    $('#lookupModalMobilizationCity').modal('hide');
  }
  //#endregion btnLookupMobilizationCity

  //#region resteCity
  resteCity() {
    this.model.mobilization_city_code = undefined;
    this.model.mobilization_city_description = undefined;
    this.model.mobilization_province_code = undefined;
    this.model.mobilization_province_description = undefined;
  }
  //#endregion resteCity

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

  //#region btnKaroseriAccessories
  btnKaroseriAccessories(type: String) {
    this.additionalItemType = type;
    this.isKaroseriAccessories = true;
    $('#btnApplicationAssetSave').click();
  }
  //#endregion btnKaroseriAccessories

  //#region btnInsurance
  changeInsurance(event: any) {
    this.model.is_use_insurance = event.target.checked
  }

  btnInsurance() {
    this.isInsurance = true;
    $('#btnApplicationAssetSave').click();
  }
  //#endregion btnInsurance

  //#region  changeGPS
  changeGPS(event: any) {
    this.model.is_use_gps = event.target.checked
  }
  //#endregion changeGPS

  //#region checkbox
  changeOTR(event: any) {
    this.isOTR = event.target.checked
    this.model.bbn_location_code = undefined;
    this.model.bbn_location_description = undefined;
  }

  changeBBNClient(event: any) {
    this.isBBNClient = event.target.checked
  }
  //#endregion checkbox

  //#region copy button
  copyNPWPFromBilling() {
    this.model.npwp_name = $('#idbillingToName').val();
    this.model.npwp_address = $('#idbillingToAddress').val();
  }

  copyDeliverFromBilling() {
    this.model.deliver_to_name = $('#idbillingToName').val();
    this.model.deliver_to_area_no = $('#idbillingToAreaNo').val();
    this.model.deliver_to_phone_no = $('#idbillingToPhoneNo').val();
    this.model.deliver_to_address = $('#idbillingToAddress').val();

  }

  copyPickupFromBilling() {
    this.model.pickup_name = $('#idbillingToName').val();
    this.model.pickup_phone_area_no = $('#idbillingToAreaNo').val();
    this.model.pickup_phone_no = $('#idbillingToPhoneNo').val();
    this.model.pickup_address = $('#idbillingToAddress').val();
  }
  //#endregion copy button

  //#region MileageCategory Lookup
  btnLookupMileageCategory() {
    $('#datatableLookupMileageCategory').DataTable().clear().destroy();
    $('#datatableLookupMileageCategory').DataTable({
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
          'p_item_code': this.model.unit_code,
          'default': ''
        });

        this.dalservice.GetrowsBam(dtParameters, this.APIControllerMasterMileageCategory, this.APIRouteForLookupMileageCategory).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupMileageCategory = parse.data;
          if (parse.data != null) {
            this.lookupMileageCategory.numberIndex = dtParameters.start;
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

  btnSelectRowMileageCategory(mileage: any) {
    this.model.monthly_miles = mileage;
    $('#lookupModalMileageCategory').modal('hide');
  }
  //#endregion MileageCategory lookup
}