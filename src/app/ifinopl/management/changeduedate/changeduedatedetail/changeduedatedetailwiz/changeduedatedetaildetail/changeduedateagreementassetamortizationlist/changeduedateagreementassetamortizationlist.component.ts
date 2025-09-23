import { OnInit, ViewChild, Component, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../../base.component';
import { DALService } from '../../../../../../../../DALservice.service';
import swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './changeduedateagreementassetamortizationlist.component.html'
})

export class ChangeduedateagreementassetamortizationlistComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');
  code = this.getRouteparam.snapshot.paramMap.get('id3');

  // variable
  public listchangeduedateagreementamortizationhistory: any = [];
  private dataTamp: any = [];
  private newDate: any;
  public due_date_change_code: any;
  public listLookupAsset: any = [];
  public asset_no: String;
  public asset_name: String;
  public listinvoicedetail: any = [];

  //controller
  private APIController: String = 'DueDateChangeAmortizationHistory';
  private APIControllerDueDateChangeMain: String = 'DueDateChangeMain';
  private APIControllerAgreementAsset: String = 'AgreementAsset';
  private APIControllerDueDateChangeDetail: String = 'DueDateChangeDetail';

  //rooute
  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteLookup: String = 'GetRowsForLookup';
  private APIRouteForUpdate: String = 'Update';
  private RoleAccessCode = 'R00023870000001A'; // role access 

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = false;
  // end

  // ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  constructor(private dalservice: DALService,
    private _location: Location,
    public route: Router,
    public getRouteparam: ActivatedRoute,
    private _elementRef: ElementRef) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.loadData();
    this.compoSide('', this._elementRef, this.route);
    this.callGetrow();
  }

  //#region getrow data
  callGetrow() {
    // param tambahan untuk getrow dynamic
    this.dataTamp = [{
      'p_asset_no': this.params,
    }];
    // end param tambahan untuk getrow dynamic

    this.dalservice.Getrow(this.dataTamp, this.APIControllerAgreementAsset, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

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

  //#region load all data
  loadData() {
    this.dtOptions = {
      'pagingType': 'first_last_numbers',
      'pageLength': 500,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false
      ajax: (dtParameters: any, callback) => {
        // param tambahan untuk getrow dynamic
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_asset_no': this.params,
          'p_due_date_change_code': this.code
        });

        // end param tambahan untuk getrow dynamic
        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);

          this.listinvoicedetail = parse.data;
          if (parse.data != null) {
            this.listinvoicedetail.numberIndex = dtParameters.start;
          }


          this.listchangeduedateagreementamortizationhistory = parse.data;
          if (parse.data != null) {
            this.listchangeduedateagreementamortizationhistory.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });

        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion public serviceAddressList load all data

  //#region Branch Name
  btnLookupAsset() {
    $('#datatableLookAsset').DataTable().clear().destroy();
    $('#datatableLookAsset').DataTable({
      'pagingType': 'first_last_numbers',
      'pageLength': 5,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false
      ajax: (dtParameters: any, callback) => {
        // param tambahan untuk getrows dynamic
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_due_date_change_code': this.param
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIControllerDueDateChangeDetail, this.APIRouteLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listLookupAsset = parse.data;
          if (parse.data != null) {
            this.listLookupAsset.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          })
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
  //#endregion branch

  //#region button back
  btnBack() {
    this.route.navigate(['/management/subchangeduedatelistifinopl/changeduedatedetail/' + this.code + '/changeduedatedetaillistwiz', this.code], { skipLocationChange: true });
    $('#datatabledetail').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region onBlur
  onBlur(event, i, type) {
    // console.log(event, i, type);

    if (type === 'new_billing_date_day') {
      event = '' + event.target.value;
      event = event.trim();
      event = parseFloat(event).toFixed(2); // ganti jadi 6 kalo mau pct
      event = event.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
      // console.log(event);

    } else {
      event = '' + event.target.value;
      event = event.trim();
      event = parseFloat(event).toFixed(6);
    }

    if (event === 'NaN') {
      event = 0;
      event = parseFloat(event).toFixed(2);
    }

    if (type === 'new_billing_date_day') {
      $('#new_billing_date_day' + i)
        .map(function () { return $(this).val(event); }).get();
    }
  }
  //#endregion onBlur

  //#region onFocus
  onFocus(event, i, type) {
    // console.log(event, i, type);
    event = '' + event.target.value;

    if (event != null) {
      event = event.replace(/[ ]*,[ ]*|[ ]+/g, '');
    }

    if (type === 'new_billing_date_day') {
      $('#new_billing_date_day' + i)
        .map(function () { return $(this).val(event); }).get();
      // console.log(event);
    }
  }
  //#endregion onFocus

  //#region button save in list 
  btnSaveList() {
    this.showSpinner = true;
    this.listinvoicedetail = [];

    let i = 0;
    const getID = $('[name="p_id_doc"]')
      .map(function () { return $(this).val(); }).get();

    const getInstallment = $('[name="p_installment_no"]')
      .map(function () { return $(this).val(); }).get();

    const getNewBillingDateDay = $('[name="p_new_billing_date_day"]')
      .map(function () { return $(this).val(); }).get();

    const getAssetNo = $('[name="p_asset_no_row"]')
      .map(function () { return $(this).val(); }).get();

    const getBillingDateChangeCode = $('[name="p_due_date_change_code"]')
      .map(function () { return $(this).val(); }).get();

    const getBillDate = $('[name="p_billing_date"]')
      .map(function () { return $(this).val(); }).get();

    // console.log(getID);
    // console.log(getInstallment);
    // console.log(getNewBillingDateDay);
    // console.log(getAssetNo);
    // console.log(getBillingDateChangeCode);
    // console.log(getBillDate);


    while (i < getID.length) {

      while (i < getInstallment.length) {

        while (i < getNewBillingDateDay.length) {

          while (i < getAssetNo.length) {

            while (i < getBillingDateChangeCode.length) {

              while (i < getBillDate.length) {

                if (getAssetNo[i] == null) {
                  swal({
                    title: 'Warning',
                    text: 'Please fill in assets first.',
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-danger',
                    type: 'warning'
                  }).catch(swal.noop)
                  return;
                }
                // this.listinvoicedetail.push(this.JSToNumberFloats({
                //   p_due_date_change_code: getBillingDateChangeCode[i],
                //   p_installment_no: getInstallment[i],
                //   p_asset_no: getAssetNo[i],
                //   p_id: getInstallment[i],
                //   p_billing_date: getNewBillingDateDay[i] == '' ? getBillDate[i] : getNewBillingDateDay[i],
                //   // p_credit_note_code: this.creditnotecode,
                //   // p_invoice_no: this.model.invoice_no
                // }));
                this.listinvoicedetail.push(this.JSToNumberFloats({
                  p_due_date_change_code: getBillingDateChangeCode[i],
                  p_installment_no: getInstallment[i],
                  p_asset_no: getAssetNo[i],
                  p_id: getInstallment[i],
                  p_billing_date: (() => {
                    let raw = getNewBillingDateDay[i] == '' ? getBillDate[i] : getNewBillingDateDay[i];

                    // kalau dari angular-mydatepicker (object)
                    if (raw && raw.singleDate && raw.singleDate.jsDate) {
                      raw = raw.singleDate.jsDate;
                    }

                    const dateObj = new Date(raw);
                    return !isNaN(dateObj.getTime())
                      ? dateObj.toISOString().split('T')[0]  // yyyy-MM-dd
                      : null;
                  })()
                }));
                i++
              }
              i++;
            }
            i++;
          }
          i++;
        }
        i++;
      }
      i++;
    }
    // console.log
    //   (getInstallment
    //     , getNewBillingDateDay
    //     , getAssetNo
    //     , getBillingDateChangeCode);

    // while (i < getInstallment.length) {

    //   while (i < getNewBillingDateDay.length) {
    //     this.listinvoicedetail.push(this.JSToNumberFloats({
    //       p_id: getInstallment[i],
    //       new_billing_date_day: getNewBillingDateDay[i],
    //       p_asset_no: getAssetNo[i],
    //       p_due_date_change_code: getBillingDateChangeCode[i],
    //       // p_credit_note_code: this.creditnotecode,
    //       // p_invoice_no: this.model.invoice_no
    //     }));
    //     i++;
    //   }
    //   i++;
    // }
    // console.log(this.listinvoicedetail);

    //#region web service
    this.dalservice.Update(this.listinvoicedetail, this.APIController, this.APIRouteForUpdate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.callGetrow();
            this.showNotification('bottom', 'right', 'success');
            $('#datatableAgreement').DataTable().ajax.reload();
            this.showSpinner = false;
          } else {
            $('#datatableAgreement').DataTable().ajax.reload();
            this.swalPopUpMsg(parse.data);
            this.showSpinner = false;
          }
        },
        error => {
          this.showSpinner = false;
          $('#datatableAgreement').DataTable().ajax.reload();
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
    //#endregion web service
  }
  //#endregion button save in list 

  //#region changeAdjusmentAmount
  changeAdjusmentAmount(event: any, id: any, asset_no: any, due_date_change_code: any) {
    this.showSpinner = true;
    this.listinvoicedetail = [];
    console.log(event.singleDate.formatted);
    // return;


    this.listinvoicedetail.push(this.JSToNumberFloats({
      p_installment_no: id,
      p_billing_date: event.singleDate.formatted,
      p_asset_no: asset_no,
      p_due_date_change_code: due_date_change_code,
      // p_credit_note_code: this.creditnotecode,
      // p_invoice_no: this.model.invoice_no
    }));
    console.log(this.listinvoicedetail);



    //#region web service
    this.dalservice.Update(this.listinvoicedetail, this.APIController, this.APIRouteForUpdate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.callGetrow();
            $('#datatableAgreement').DataTable().ajax.reload();
            this.showNotification('bottom', 'right', 'success');
            this.showSpinner = false;
          } else {
            $('#datatableAgreement').DataTable().ajax.reload();
            this.swalPopUpMsg(parse.data);
            this.showSpinner = false;
          }
        },
        error => {
          this.showSpinner = false;
          $('#datatableAgreement').DataTable().ajax.reload();
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
    //#endregion web service
  }
  //#endregion changeAdjusmentAmount


}