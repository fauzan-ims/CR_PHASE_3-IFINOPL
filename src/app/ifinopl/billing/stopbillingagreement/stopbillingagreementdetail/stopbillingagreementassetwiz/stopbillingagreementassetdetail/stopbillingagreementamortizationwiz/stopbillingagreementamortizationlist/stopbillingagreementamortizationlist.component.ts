import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../../../base.component';
import { DALService } from '../../../../../../../../../DALservice.service';
import swal from 'sweetalert2';

@Component({
  moduleId: module.id,
  selector: 'app-stopbillingagreementamortizationlist',
  templateUrl: './stopbillingagreementamortizationlist.component.html'
})

export class StopbillingagreementamortizationlistComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');

  // variable
  public listamortization: any = [];
  public tempFile: any;
  public isButton: Boolean = false;
  public setStyle: any = [];

  private APIController: String = 'AgreementAssetAmortization';
  private APIRouteForGetRows: String = 'GetRowsForStopBilling';

  APIRouteForUpdate

  private RoleAccessCode = 'R00020750000000A'; // role access 

  // spinner
  showSpinner: Boolean = false;
  // end

  // form 2 way binding
  model: any = {};
  dataTampPush: any[];
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
    this.compoSide('', this._elementRef, this.route);
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.loadData();
  }

  //#region getStyles
  getStyles(isTrue: Boolean) {
    if (isTrue) {
      this.setStyle = {
        'pointer-events': 'none',
      }
    } else {
      this.setStyle = {
        'pointer-events': 'unset',
      }
    }

    return this.setStyle;
  }
  //#endregion getStyles

  //#region load all data
  loadData() {
    this.dtOptions = {
      'pageLength': 500,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false
      ajax: (dtParameters: any, callback) => {
        // param tambahan untuk getrows dynamic
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_agreement_no': this.param,
          'p_asset_no': this.params
        })
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listamortization = parse.data;
          if (parse.data != null) {
            this.listamortization.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }

  }
  //#endregion load all data

  //#region paymentType
  BillingStatus(event: any) {
    this.model.hold_billing_status = event.target.value;

    if (this.model.hold_billing_status !== 'HOLD') {
      this.isButton = true;
    }
    else {
      this.isButton = false;
    }

  }
  //#endregion paymentType

  SaveList() {

    this.showSpinner = true;
    this.listamortization = [];

    let i = 0;

    const getID = $('[name="p_id"]')
      .map(function () { return $(this).val(); }).get();

    const getDate = $('[name="p_date"]')
      .map(function () { return $(this).val(); }).get();

    const getBillingStatus = $('[name="p_hold_billing_status"]')
      .map(function () { return $(this).val(); }).get();

    while (i < getID.length) {

      while (i < getDate.length) {

        while (i < getBillingStatus.length) {

          if (getDate[i] === '') {
            getDate[i] = undefined;
          }

          this.listamortization.push(this.JSToNumberFloats({
            p_id: getID[i],
            p_hold_billing_status: getBillingStatus[i],
            p_date: this.dateFormatList(getDate[i])
          }));
          i++;
        }
        i++;
      }
      i++;
    }

    //#region web service
    this.dalservice.Update(this.listamortization, this.APIController, this.APIRouteForUpdate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.showSpinner = false;
            this.showNotification('bottom', 'right', 'success');
            $('#datatableAgreementAmortization').DataTable().ajax.reload();
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
    //#endregion web service

  }
  //#endregion button save in list
}