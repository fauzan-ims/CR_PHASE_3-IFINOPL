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
  templateUrl: './earlyterminationtransactionlist.component.html'
})

export class EarlyterminationtransactionlistComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public listearlyterminationtransaction: any = [];
  public listearlyterminationtransactionData: any = [];
  private dataTamp: any = [];
  private APIController: String = 'EtTransaction';
  private APIControllerEtMain: String = 'EtMain';
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForUpdate: String = 'Update';
  private RoleAccessCode = 'R00020880000000A'; // role access 

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
    
    this.dataTamp = [{
      'p_code': this.param,
    }];
    

    this.dalservice.Getrow(this.dataTamp, this.APIControllerEtMain, this.APIRouteForGetRow)
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

  //#region button save list
  btnSaveList() {

    this.listearlyterminationtransactionData = [];

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

        while (i < getDiscPct.length) {

          while (i < getDiscAmount.length) {

            while (i < getTotalAmount.length) {

              if ((getDiscPct[i] * 1) > 100) {
                swal({
                  title: 'Warning',
                  text: 'Discount PCT must be less or equal than 100',
                  buttonsStyling: false,
                  confirmButtonClass: 'btn btn-warning',
                  type: 'warning'
                }).catch(swal.noop)
                return;

              } else {
                this.listearlyterminationtransactionData.push(
                  this.JSToNumberFloats({
                    p_id: getID[i],
                    p_transaction_amount: getTransactionAmount[i],
                    p_disc_pct: getDiscPct[i],
                    p_disc_amount: getDiscAmount[i],
                    p_total_amount: getTotalAmount[i],
                    p_et_code: this.param
                  })
                );
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

    //#region web service
    this.dalservice.Update(this.listearlyterminationtransactionData, this.APIController, this.APIRouteForUpdate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            $('#etTerminationDetail').click();
            this.showNotification('bottom', 'right', 'success');
            $('#datatableTransaction').DataTable().ajax.reload();

          } else {
            this.swalPopUpMsg(parse.data);
            $('#datatableTransaction').DataTable().ajax.reload();
          }
        },
        error => {
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
          $('#datatableTransaction').DataTable().ajax.reload();
        });
    //#endregion web service

  }

  onBlur(event, i, type) {

    let dispct;


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

    // if (type === 'amount1') {
    //   $('#total_amount' + i).val(parseFloat($('#transaction_amount' + i).val().replace(/,/g, '')) - parseFloat($('#disc_amount' + i).val().replace(/,/g, '')));
    //   $('#total_amount' + i)
    //     .map(function () { return $(this).val(parseFloat($('#total_amount' + i).val()).toFixed(2)); }).get();
    //   $('#transaction_amount' + i)
    //     .map(function () { return $(this).val(event); }).get();
    // }
    // if (type === 'rate') {
    //   $('#disc_amount' + i).val((parseFloat($('#disc_pct' + i).val().replace(/,/g, '')) / 100) * parseFloat($('#transaction_amount' + i).val().replace(/,/g, '')));
    //   $('#total_amount' + i)
    //     .map(function () { return $(this).val(parseFloat($('#disc_amount' + i).val()).toFixed(2)); }).get();
    //   $('#total_amount' + i).val(parseFloat($('#transaction_amount' + i).val().replace(/,/g, '')) - parseFloat($('#disc_amount' + i).val().replace(/,/g, '')));
    //   $('#total_amount' + i)
    //     .map(function () { return $(this).val(parseFloat($('#total_amount' + i).val()).toFixed(2)); }).get();
    //   $('#disc_pct' + i)
    //     .map(function () { return $(this).val(event); }).get();
    // }
    // if (type === 'amount2') {
    //   $('#disc_pct' + i).val((parseFloat($('#disc_amount' + i).val().replace(/,/g, '')) / parseFloat($('#transaction_amount' + i).val().replace(/,/g, ''))) * 100);
    //   $('#total_amount' + i)
    //     .map(function () { return $(this).val(parseFloat($('#disc_pct' + i).val()).toFixed(6)); }).get();
    //   $('#total_amount' + i).val(parseFloat($('#transaction_amount' + i).val().replace(/,/g, '')) - parseFloat($('#disc_amount' + i).val().replace(/,/g, '')));
    //   $('#total_amount' + i)
    //     .map(function () { return $(this).val(parseFloat($('#total_amount' + i).val()).toFixed(2)); }).get();
    //   $('#disc_amount' + i)
    //     .map(function () { return $(this).val(event); }).get();
    // }
  }
  //#endregion button save list

  //#region load all data
  loadData() {
    this.dtOptions = {
      'pagingType': 'first_last_numbers',
      'pageLength': 50,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false
      ajax: (dtParameters: any, callback) => {
        
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_et_code': this.param,
          'p_is_transaction': '1'
        });
        
        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listearlyterminationtransaction = parse.data;
          if (parse.data != null) {
            this.listearlyterminationtransaction.numberIndex = dtParameters.start;
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
  //#endregion load all data
}







