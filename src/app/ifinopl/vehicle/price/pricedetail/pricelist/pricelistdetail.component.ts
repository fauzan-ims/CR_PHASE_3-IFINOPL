import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '../../../../../../base.component';
import { DALService } from '../../../../../../DALservice.service';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-pricelistdetail',
  templateUrl: './pricelistdetail.component.html'
})
export class PricelistdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');

  // variable
  public AmountFormat = this._amountformat;
  public CurrencyFormat = this._currencyformat;
  public lookupBranch: any = [];
  public lookupCurrency: any = [];
  public pricelistdetailData: any = [];
  public isReadOnly: Boolean = false;
  public branch_name: String;
  public branch_code: String;
  public currency_name: String;
  public currency_code: String;
  public dataTamp: any = [];
  public notValid: Boolean;
  private asset_value: any = 0;
  private dp_pct: any = 0;
  private dp_amount: any = 0;
  private loan_amount: any = 0;
  private financing_amount: any = 0;
  public setStyle: any = [];

  private APIControllerDetail: String = 'MasterVehiclePricelistDetail';
  private APIRouteLookupSysBranch: String = 'GetRowsLookupSysBranch';
  private APIRouteLookupCurrency: String = 'GetRowsLookupSysCurrency';

  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForInsert: String = 'INSERT';

  private RoleAccessCode = 'R00020050000000A'; // role access 

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
    this.Delimiter(this._elementRef);
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    if (this.params != null) {
      // call web service
      this.callGetrow();
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

  //#region asset value
  assetValue(event) {
    this.asset_value = event.target.value * 1;
    this.dp_amount = this.asset_value * (this.dp_pct / 100);
    this.loan_amount = this.asset_value - this.dp_amount;
    this.model.dp_amount = this.dp_amount;
    this.financing_amount = this.loan_amount;
    this.model.financing_amount = this.financing_amount;
  }
  //#endregion asset value

  //#region dp amount
  dpPct(event) {
    this.dp_pct = event.target.value * 1;
    this.dp_amount = this.asset_value * (this.dp_pct / 100);
    this.loan_amount = this.asset_value - this.dp_amount;
    this.model.asset_value = this.asset_value;
    this.model.dp_amount = this.dp_amount;
    this.model.financing_amount = this.loan_amount;
    if (this.dp_pct > 100) {
      this.notValid = true;
    } else { this.notValid = false; }
  }
  //#endregion dp amount

  //#region dp amount
  dpAmount(event) {
    this.dp_amount = event.target.value * 1;
    this.dp_pct = ((this.dp_amount / this.asset_value) * 100);
    this.loan_amount = this.asset_value - this.dp_amount;
    this.model.dp_pct = this.dp_pct;
    this.model.financing_amount = this.loan_amount;
    if (this.dp_amount > this.asset_value) {
      this.notValid = true;
    } else { this.notValid = false; }
  }
  //#endregion dp amount

  //#region Branch
  btnLookupBranch() {
    $('#datatableLookupBranch').DataTable().clear().destroy();
    $('#datatableLookupBranch').DataTable({
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
        this.dalservice.Getrows(dtParameters, this.APIControllerDetail, this.APIRouteLookupSysBranch).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupBranch = parse.data;
          if (parse.data != null) {
            this.lookupBranch.numberIndex = dtParameters.start;
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
  btnSelectRowBranch(code: String, name: String) {
    this.model.branch_code = code;
    this.model.branch_name = name;
    $('#lookupModalBranch').modal('hide');
  }
  //#endregion branch

  //#region Currency
  btnLookupCurrency() {
    $('#datatableLookupCurrency').DataTable().clear().destroy();
    $('#datatableLookupCurrency').DataTable({
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
        this.dalservice.Getrows(dtParameters, this.APIControllerDetail, this.APIRouteLookupCurrency).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupCurrency = parse.data;
          if (parse.data != null) {
            this.lookupCurrency.numberIndex = dtParameters.start;
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
  btnSelectRowCurrency(code: String) {
    this.model.currency_code = code;
    $('#lookupModalCurrency').modal('hide');
  }
  //#endregion Currency

  //#region getrow data
  callGetrow() {
     
    this.dataTamp = [{
      'p_id': this.params,
    }];
    

    this.dalservice.Getrow(this.dataTamp, this.APIControllerDetail, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          if (parsedata.editable === '0') {
            this.isReadOnly = true;
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
  onFormSubmit(pricelistdetailForm: NgForm, isValid: boolean) {
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

    this.pricelistdetailData = this.JSToNumberFloats(pricelistdetailForm);
    const usersJson: any[] = Array.of(this.pricelistdetailData);
    if (this.params != null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIControllerDetail, this.APIRouteForUpdate)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showSpinner = false;
              this.callGetrow();
              this.showNotification('bottom', 'right', 'success');
            } else {
              this.showSpinner = false;
              this.swalPopUpMsg(parse.data);
            }
          },
          error => {
            this.showSpinner = false;
            const parse = JSON.parse(error);
            this.swalPopUpMsg(parse.data);
          });
    } else {
      // call web service
      this.dalservice.Insert(usersJson, this.APIControllerDetail, this.APIRouteForInsert)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showSpinner = false;
              this.showNotification('bottom', 'right', 'success');
              this.route.navigate(['/vehicle/subpricelist/pricelistdetail', this.param, parse.id]);
            } else {
              this.showSpinner = false;
              this.swalPopUpMsg(parse.data);
            }
          },
          error => {
            this.showSpinner = false;
            const parse = JSON.parse(error);
            this.swalPopUpMsg(parse.data);
          });
    }
  }
  //#endregion form submit

  //#region button back
  btnBack() {
    this.route.navigate(['/vehicle/subpricelist/pricedetail', this.param]);
    $('#datatableVehiclePriceDetail').DataTable().ajax.reload();
  }
  //#endregion button back
}
