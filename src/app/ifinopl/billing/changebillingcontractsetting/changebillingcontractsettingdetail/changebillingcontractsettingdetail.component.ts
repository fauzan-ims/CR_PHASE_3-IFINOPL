import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-changebillingcontractsettingdetail',
  templateUrl: './changebillingcontractsettingdetail.component.html'
})
export class ChangebillingcontractsettingdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public generateinvoiceData: any = [];
  public listgenerateinvoicedetail: any = [];
  public NpwpPattern = this._npwpformat;
  public lookupclient: any = [];
  public lookupagreement: any = [];
  public lookupasset: any = [];
  public lookupbranch: any = [];
  public setStyle: any = [];
  public lookupfakturtype: any = [];
  private clientName: String;
  private areaMobileNo: String;
  private mobileNo: String;
  private address: String;
  private documentNo: String;
  public assetdetailData: any = [];
  public EmailPattern = this._emailformat;

  public isReadOnly: Boolean = false;
  public isRequired: any;
  public isBreak: Boolean = false;

  public tamps = new Array();
  private dataTamp: any = [];

  //Controller
  private APIController: String = 'AgreementMain';
  private APIControllerAgreementAsset: String = 'AgreementAsset';
  private APIControllerSysGeneralSubcode: String = 'SysGeneralSubcode';

  //Route
  private APIRouteForGetRow: String = 'GetrowForChangeBillingContractSetting';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForUpdate: String = 'UpdateChangeBillingSetting';
  private APIRouteForInsert: String = 'InsertChangeBillingSetting';

  private RoleAccessCode = 'R00023880000001A'; // role access 

  // checklist
  public selectedAllTable: any;
  public selectedAllLookup: any;
  private checkedList: any = [];
  private checkedLookup: any = [];

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
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    $("#npwp").attr('maxlength', '15');
    if (this.param != null) {
      // call web service
      this.callGetrow();
    } else {
      this.model.status = 'HOLD';
      this.model.billing_mode = 'NORMAL';
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

  //#region getrow data
  callGetrow() {

    this.dataTamp = [{
      'p_agreement_no': this.param,
      'p_asset_no': this.params,
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
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

          if (parsedata.is_auto_email === '1') {
            parsedata.is_auto_email = true
          } else {
            parsedata.is_auto_email = false
          }

          if (parsedata.is_invoice_deduct_pph === '1') {
            parsedata.is_invoice_deduct_pph = true
          } else {
            parsedata.is_invoice_deduct_pph = false
          }

          if (parsedata.is_receipt_deduct_pph === '1') {
            parsedata.is_receipt_deduct_pph = true
          } else {
            parsedata.is_receipt_deduct_pph = false
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

  //#region  form submit
  onFormSubmit(generateinvoiceForm: NgForm, isValid: boolean) {
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

    this.assetdetailData = generateinvoiceForm;

    if (this.assetdetailData.p_is_auto_email == true) {
      this.assetdetailData.p_is_auto_email = 'T'
    } 
    // else {
    //   this.assetdetailData.p_is_auto_email = 'F'
    // }

    if (this.assetdetailData.p_is_invoice_deduct_pph == true) {
      this.assetdetailData.p_is_invoice_deduct_pph = 'T'
    } 
    // else {
    //   this.assetdetailData.p_is_invoice_deduct_pph = 'F'
    // }

    if (this.assetdetailData.p_is_receipt_deduct_pph == true) {
      this.assetdetailData.p_is_receipt_deduct_pph = 'T'
    } 
    // else {
    //   this.assetdetailData.p_is_receipt_deduct_pph = 'F'
    // }

    this.generateinvoiceData = this.JSToNumberFloats(generateinvoiceForm);

    const usersJson: any[] = Array.of(this.generateinvoiceData);

    if (this.param != null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIControllerAgreementAsset, this.APIRouteForUpdate)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.callGetrow();
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
      // call web service
      this.dalservice.Insert(usersJson, this.APIControllerAgreementAsset, this.APIRouteForInsert)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showSpinner = false;
              this.showNotification('bottom', 'right', 'success');
              this.route.navigate(['/billing/subchangebillingcontractsettinglist/changebillingcontractsettingdetail', this.param, this.params]);
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

  //#region button back
  btnBack() {
    this.route.navigate(['/billing/subchangebillingcontractsettinglist']);
    $('#datatablechangebilling').DataTable().ajax.reload();
  }
  //#endregion button back

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


}
