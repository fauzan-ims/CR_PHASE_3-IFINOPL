import { OnInit, ViewChild, Component, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import { DALService } from '../../../../../../../DALservice.service';
import swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './changeduedatetransactionlist.component.html'
})

export class ChangeduedatetransactionlistComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public listchangeduedatetransaction: any = [];
  public listchangeduedatetransactionData: any = [];
  private dataTamp: any = [];
  private APIController: String = 'DueDateChangeTransaction';
  private APIControllerDueDateChangeMain: String = 'DueDateChangeMain';
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForUpdate: String = 'Update';
  private RoleAccessCode = 'R00023870000001A'; // role access 

  // spinner
  showSpinner: Boolean = false;
  // end

  // form 2 way binding
  model: any = {};

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
    this.compoSide('', this._elementRef, this.route);
    this.callGetrow();
    this.loadData();
  }

  //#region getrow data
  callGetrow() {
    // param tambahan untuk getrow dynamic
    this.dataTamp = [{
      'p_code': this.param,
    }];
    // end param tambahan untuk getrow dynamic

    this.dalservice.Getrow(this.dataTamp, this.APIControllerDueDateChangeMain, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          // mapper dbtoui
          Object.assign(this.model, parsedata);
          // end mapper dbtoui
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
          'p_due_date_change_code': this.param,
          'p_is_transaction': '1'
        });
        // end param tambahan untuk getrow dynamic
        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listchangeduedatetransaction = parse.data;
          if (parse.data != null) {
            this.listchangeduedatetransaction.numberIndex = dtParameters.start;
          }
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
  //#endregion public serviceAddressList load all data

  //#region button save list
  btnSaveList() {

    this.listchangeduedatetransactionData = [];

    let i = 0;

    const getID = $('[name="p_id"]')
      .map(function () { return $(this).val(); }).get();

    const getTransactionAmount = $('[name="p_transaction_amount"]')
      .map(function () { return $(this).val(); }).get();

    const getDiscPct = $('[name="p_disc_pct"]')
      .map(function () { return $(this).val(); }).get();

    const getDiscAmount = $('[name="p_disc_amount"]')
      .map(function () { return $(this).val(); }).get();

    const getTotalAmount = $('[name="p_total_amount"]')
      .map(function () { return $(this).val(); }).get();

    while (i < getID.length) {

      while (i < getTransactionAmount.length) {

        this.listchangeduedatetransactionData.push(
          this.JSToNumberFloats({
            p_id: getID[i],
            p_transaction_amount: getTransactionAmount[i],
            p_disc_pct: getDiscPct[i],
            p_disc_amount: getDiscAmount[i],
            p_total_amount: getTotalAmount[i],
            p_due_date_change_code: this.param
          })
        );
        //#region web service
        this.dalservice.Update(this.listchangeduedatetransactionData, this.APIController, this.APIRouteForUpdate)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                $('#restructureTerminationDetail').click();
                this.showNotification('bottom', 'right', 'success');
                $('#datatableTransactionChangeDueDate').DataTable().ajax.reload();

              } else {
                this.swalPopUpMsg(parse.data);
                $('#datatableTransactionChangeDueDate').DataTable().ajax.reload();
              }
            },
            error => {
              const parse = JSON.parse(error);
              this.swalPopUpMsg(parse.data);
              $('#datatableTransactionChangeDueDate').DataTable().ajax.reload();
            });
        //#endregion web service

        i++;
      }

      i++;
    }

    $('#datatableTransactionChangeDueDate').DataTable().ajax.reload();
  }

  onBlur(event, i, type) {
    if (type === 'amount1' || type === 'amount2') {
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

    if (type === 'amount1') {
      $('#total_amount' + i).val(parseFloat($('#transaction_amount' + i).val().replace(/,/g, '')) - parseFloat($('#disc_amount' + i).val().replace(/,/g, '')));
      $('#total_amount' + i).map(function () { return $(this).val(parseFloat($('#total_amount' + i).val()).toFixed(2)); }).get();
      $('#transaction_amount' + i).map(function () { return $(this).val(event); }).get();
    }
    if (type === 'rate') {
      $('#disc_amount' + i).val(parseFloat($('#transaction_amount' + i).val().replace(/,/g, '')) * (parseFloat($('#disc_pct' + i).val().replace(/,/g, '')) / 100));
      $('#total_amount' + i).map(function () { return $(this).val(parseFloat($('#disc_amount' + i).val()).toFixed(2)); }).get();
      $('#total_amount' + i).val(parseFloat($('#transaction_amount' + i).val().replace(/,/g, '')) - parseFloat($('#disc_amount' + i).val().replace(/,/g, '')));
      $('#total_amount' + i).map(function () { return $(this).val(parseFloat($('#total_amount' + i).val()).toFixed(2)); }).get();
      $('#disc_amount' + i).map(function () { return $(this).val(parseFloat($('#disc_amount' + i).val()).toFixed(2)); }).get();
      $('#disc_pct' + i).map(function () { return $(this).val(event); }).get();
    }
    if (type === 'amount2') {
      $('#disc_pct' + i).val((parseFloat($('#disc_amount' + i).val().replace(/,/g, '')) / parseFloat($('#transaction_amount' + i).val().replace(/,/g, ''))) * 100);
      $('#disc_pct' + i)
        .map(function () { return $(this).val(parseFloat($('#disc_pct' + i).val()).toFixed(6)); }).get();
      $('#total_amount' + i).val(parseFloat($('#transaction_amount' + i).val().replace(/,/g, '')) - parseFloat($('#disc_amount' + i).val().replace(/,/g, '')));
      $('#total_amount' + i)
        .map(function () { return $(this).val(parseFloat($('#total_amount' + i).val()).toFixed(2)); }).get();
      $('#disc_amount' + i)
        .map(function () { return $(this).val(event); }).get();
    }
  }

  onFocus(event, i, type) {
    event = '' + event.target.value;

    if (event != null) {
      event = event.replace(/[ ]*,[ ]*|[ ]+/g, '');
    }

    if (type === 'amount1') {
      $('#transaction_amount' + i)
        .map(function () { return $(this).val(event); }).get();
    } else if (type === 'amount2') {
      $('#disc_amount' + i)
        .map(function () { return $(this).val(event); }).get();
    }
    else {
      $('#disc_pct' + i)
        .map(function () { return $(this).val(event); }).get();
    }
  }
  //#endregion button save list
}




