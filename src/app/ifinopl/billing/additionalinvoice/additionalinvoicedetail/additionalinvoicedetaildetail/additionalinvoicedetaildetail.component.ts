import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { BaseComponent } from '../../../../../../base.component';
import { DataTableDirective } from 'angular-datatables';
import { DALService } from '../../../../../../DALservice.service';

@Component({
  moduleId: module.id,
  selector: 'app-additionalinvoicedetaildetail',
  templateUrl: './additionalinvoicedetaildetail.component.html'
})

export class AdditionalinvoicedetaildetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');

  // variable
  public NumberOnlyPattern: string = this._numberonlyformat;
  public isReadOnly: Boolean = false;
  public listdetail: any = [];
  public lookupagreement: any = [];
  public lookupasset: any = [];
  public lookuptaxscheme: any = [];
  public billing_amount: any = [];
  public discount_amount: any = [];
  public quantity: any = [];
  public tax_scheme_code: any = [];

  public additionalinvoicedetailData: any = [];
  private dataTamp: any = [];

  public invoicestatus: any = [];
  public Client_No: any = [];
  public invoicetype: any = [];

  private APIController: String = 'AdditionalInvoiceDetail';
  private APIControllerAdditionalInvoice: String = 'AdditionalInvoice';
  private APIControllerAgreementMain: String = 'AgreementMain';
  private APIControllerAgreementAsset: String = 'AgreementAsset';
  private APIControllerMasterTaxScheme: String = 'MasterTaxScheme';

  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForInsert: String = 'Insert';
  private APIRouteForUpdate: String = 'Update';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForLookupAdditionalInvoice: String = 'GetRowsForLookupAdditionalInvoice';

  private RoleAccessCode = 'R00020700000000A'; // role access 

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
    private _elementRef: ElementRef
  ) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.Delimiter(this._elementRef);
    this.callGetrowHeader();
    if (this.params !== null) {
      this.isReadOnly = true;
      // call web service
      this.callGetrow();
      this.callGetrowHeader();
    } else {
      this.model.total_amount = 0;
      this.model.ppn_amount = 0;
      this.model.pph_amount = 0;
      this.model.billing_amount = 0;
      this.model.discount_amount = 0;
      this.model.quantity = 0;
      this.model.ppn_pct = 0;
      this.model.pph_pct = 0;
      this.showSpinner = false;
    }
  }

  onBlur(event, i, type) {
    if (type === 'ppnamount' || type === 'pphamount' || type === 'priceamount' || type === 'discountamount') {
      if (event.target.value.match('[0-9]+(,[0-9]+)')) {
        if (event.target.value.match('(\.\d+)')) {

          event = '' + event.target.value;
          event = event.trim();
          event = event.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
        } else {
          event = '' + event.target.value;
          event = event.trim();
          event = parseFloat(event.replace(/,/g, '')).toFixed(2); // ganti jadi 6 kalo mau pct
          event = event.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
        }
      } else {
        event = '' + event.target.value;
        event = event.trim();
        event = parseFloat(event).toFixed(2); // ganti jadi 6 kalo mau pct
        event = event.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
      }
    } else {
      event = '' + event.target.value;
      event = event.trim();
      event = parseFloat(event).toFixed(6);
    }

    if (event === 'NaN') {
      event = 0;
      event = parseFloat(event).toFixed(2);
    }

    if (type === 'ppnamount') {
      $('#ppn_amount' + i)
        .map(function () { return $(this).val(event); }).get();
    }
    if (type === 'pphamount') {
      $('#pph_amount' + i)
        .map(function () { return $(this).val(event); }).get();
    }
    if (type === 'priceamount') {
      $('#billing_amount' + i)
        .map(function () { return $(this).val(event); }).get();
    }
    if (type === 'discountamount') {
      $('#discount_amount' + i)
        .map(function () { return $(this).val(event); }).get();
    }


  }

  onFocus(event, i, type) {
    event = '' + event.target.value;

    if (event != null) {
      event = event.replace(/[ ]*,[ ]*|[ ]+/g, '');
    }

    if (type === 'ppnamount') {
      $('#ppn_amount' + i)
        .map(function () { return $(this).val(event); }).get();
    }
    if (type === 'pphamount') {
      $('#pph_amount' + i)
        .map(function () { return $(this).val(event); }).get();
    }
    if (type === 'priceamount') {
      $('#billing_amount' + i)
        .map(function () { return $(this).val(event); }).get();
    }
    if (type === 'discountamount') {
      $('#discount_amount' + i)
        .map(function () { return $(this).val(event); }).get();
    }
    if (type === 'totalamount') {
      $('#total_amount' + i)
        .map(function () { return $(this).val(event); }).get();
    }
  }

  //#region getrow data
  callGetrowHeader() {

    this.dataTamp = [{
      'p_code': this.param
    }];


    this.dalservice.Getrow(this.dataTamp, this.APIControllerAdditionalInvoice, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];

          this.invoicestatus = parsedata.invoice_status
          this.Client_No = parsedata.client_no
          this.invoicetype = parsedata.invoice_type

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
  callGetrow() {

    this.dataTamp = [{
      'p_id': this.params
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];

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
  onFormSubmit(additionalinvoicedetailForm: NgForm, isValid: boolean) {
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

    this.additionalinvoicedetailData = this.JSToNumberFloats(additionalinvoicedetailForm);
    const usersJson: any[] = Array.of(this.additionalinvoicedetailData);

    if (this.param != null && this.params != null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showSpinner = false;
              this.showNotification('bottom', 'right', 'success');
              this.callGetrow();
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
              this.route.navigate(['/billing/subadditionalinvoicelist/additionalinvoicedetaildetail', this.param, parse.id]);
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

  //#region Price
  Quantity(event: any) {
    this.quantity = event.target.value;
    this.model.quantity = event.target.value;
    this.model.ppn_amount = (this.model.billing_amount - this.model.discount_amount) * this.quantity * this.model.ppn_pct / 100;
    this.model.pph_amount = (this.model.billing_amount - this.model.discount_amount) * this.quantity * this.model.pph_pct / 100;
    this.model.total_amount = (this.model.billing_amount - this.model.discount_amount) + this.model.ppn_amount - this.model.pph_amount;
  }
  //#endregion Price

  //#region Price
  PriceAmount(event: any) {
    this.billing_amount = event.target.value;
    this.model.billing_amount = event.target.value
    this.model.ppn_amount = (this.billing_amount - this.model.discount_amount) * this.model.quantity * this.model.ppn_pct / 100;
    this.model.pph_amount = (this.billing_amount - this.model.discount_amount) * this.model.quantity * this.model.pph_pct / 100;
    this.model.total_amount = (this.billing_amount - this.model.discount_amount) + this.model.ppn_amount - this.model.pph_amount;
  }
  //#endregion Price

  //#region Discount
  DiscountAmount(event: any) {
    this.discount_amount = event.target.value;
    this.model.discount_amount = event.target.value;
    this.model.ppn_amount = (this.model.billing_amount - this.discount_amount) * this.model.quantity * this.model.ppn_pct / 100;
    this.model.pph_amount = (this.model.billing_amount - this.discount_amount) * this.model.quantity * this.model.pph_pct / 100;
    this.model.total_amount = (this.model.billing_amount - this.discount_amount) + this.model.ppn_amount - this.model.pph_amount;
  }
  //#endregion Discount

  //#region Agreement Lookup
  btnLookupAgreement() {
    $('#datatableLookupAgreement').DataTable().clear().destroy();
    $('#datatableLookupAgreement').DataTable({
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
          'p_branch_code': this.model.branch_code,
          'p_client_no': this.Client_No,
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerAgreementMain, this.APIRouteForLookupAdditionalInvoice).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupagreement = parse.data;
          if (parse.data != null) {
            this.lookupagreement.numberIndex = dtParameters.start;
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

  btnClearAgreement() {
    this.model.agreement_no = '';
    this.model.agreement_external_no = '';
    this.model.client_name = '';
    this.model.asset_no = '';
    this.model.asset_name = '';
    $('#datatable').DataTable().ajax.reload();
  }


  btnSelectRowAgreement(agreement_no: String, agreement_desc: string, client_no: string, agreement_external_no: string) {
    this.model.agreement_no = agreement_no;
    this.model.agreement_external_no = agreement_external_no;
    this.model.client_name = agreement_desc;
    this.model.client_no = client_no;
    this.model.asset_no = '';
    this.model.asset_name = '';
    $('#lookupModalAgreement').modal('hide');
  }
  //#endregion Agreement lookup

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
          'p_agreement_no': this.model.agreement_no
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerAgreementAsset, this.APIRouteForLookup).subscribe(resp => {
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

  btnSelectRowAsset(asset_no: String, asset_name: string) {
    this.model.asset_no = asset_no;
    this.model.asset_name = asset_name;
    $('#lookupModalAsset').modal('hide');
  }
  //#endregion Asset lookup

  //#region Tax Scheme Lookup
  btnLookupTaxScheme() {
    $('#datatableLookupTaxScheme').DataTable().clear().destroy();
    $('#datatableLookupTaxScheme').DataTable({
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

        this.dalservice.GetrowsSys(dtParameters, this.APIControllerMasterTaxScheme, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookuptaxscheme = parse.data;
          if (parse.data != null) {
            this.lookuptaxscheme.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 5] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowTaxScheme(code: String, name: string, ppn_pct: string, pph_pct: string) {
    this.model.tax_scheme_code = code;
    this.model.tax_scheme_name = name;
    this.model.ppn_pct = ppn_pct;
    this.model.pph_pct = pph_pct;
    this.model.ppn_amount = (this.model.billing_amount - this.model.discount_amount) * this.model.quantity * this.model.ppn_pct / 100;
    this.model.pph_amount = (this.model.billing_amount - this.model.discount_amount) * this.model.quantity * this.model.pph_pct / 100;
    this.model.total_amount = (this.model.billing_amount - this.model.discount_amount) + this.model.ppn_amount - this.model.pph_amount;
    $('#lookupModalTaxScheme').modal('hide');
  }
  //#endregion Tax Scheme lookup

  //#region button back
  btnBack() {
    this.route.navigate(['/billing/subadditionalinvoicelist/additionalinvoicedetail', this.param]);
    $('#dataAdditionalInvoiceDetail').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region resetTaxScheme
  resetTaxScheme() {
    this.model.tax_scheme_code = undefined;
    this.model.tax_scheme_name = undefined;
  }
  //#endregion resetTaxScheme
}