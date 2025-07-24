import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../../../base.component';
import { DALService } from '../../../../../../../../../DALservice.service';
import swal from 'sweetalert2';

@Component({
  moduleId: module.id,
  selector: 'app-pendingbillingagreementamortizationlist',
  templateUrl: './pendingbillingagreementamortizationlist.component.html'
})

export class PendingbillingagreementamortizationlistComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');

  // variable
  public listamortization: any = [];
  public dataTamp: any = [];
  public tempFile: any;
  public isButton: Boolean = false;
  public setStyle: any = [];

  private APIController: String = 'AgreementAssetAmortization';
  private APIRouteForGetRows: String = 'GetRowsForPendingBilling';

  private APIRouteForUpdate: String = 'ExecSpForUpdatePending';

  private RoleAccessCode = 'R00023160000001A'; // role access 

  // spinner
  showSpinner: Boolean = false;
  // end

  // form 2 way binding
  model: any = {};
  row: any = {};
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
    this.row.hold_billing_status = ''
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
    if (this.model.hold_billing_status !== 'PENDING') {
      this.isButton = true;
    }
    else {
      this.isButton = false;
    }

  }
  //#endregion paymentType

  saveList() {
    this.showSpinner = true;
    this.listamortization = [];

    let i = 0;

    const getBillingNo = $('[name="p_billing_no_detail"]')
      .map(function () { return $(this).val(); }).get();

    const getBillingStatus = $('[name="p_hold_billing_status"]')
      .map(function () { return $(this).val(); }).get();
 
    while (i < getBillingNo.length) {

      while (i < getBillingStatus.length) {

        this.dataTamp.push({
          'p_agreement_no': this.param,
          'p_asset_no': this.params,
          'p_billing_no': getBillingNo[i],
          'p_hold_billing_status': getBillingStatus[i],
          'action': ''
        });
        i++;
      }
      i++;
    } 

    this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForUpdate)
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
            $('#datatableAgreementAmortization').DataTable().ajax.reload();
          }
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
  }
  //#endregion button save in list
}