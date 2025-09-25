import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import { DALService } from '../../../../../../../DALservice.service';
import { Location } from '@angular/common';
import swal from 'sweetalert2';

@Component({
  moduleId: module.id,
  selector: 'app-settlementpphlist',
  templateUrl: './invoicelistwiz.component.html',
})

export class InvoicelistwizComponent extends BaseComponent implements OnInit {
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public listinvoice: any = [];
  public tampInvoiceStatus: String;
  public tampSettlementStatus: String;
  public tampSettlementType: String;
  public tempFile: any;
  public tamps = new Array();
  public tampHidden: Boolean;
  public selectedAll: any;
  public checkedList: any = [];
  public checkedListValidate: any = [];
  public pageType: String;
  public pageStatus: Boolean;


  private APIController: String = 'Invoice';

  private APIRouteGetrowsForInvoice: String = 'GetRowsForInquiryAgreement';

  private RoleAccessCode = 'R00020560000000A'; // role access 

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
    public getRouteparam: ActivatedRoute,
    public route: Router,
    private _location: Location,
    private _elementRef: ElementRef,
  ) { super(); }

  ngOnInit() {
    this.compoSide('', this._elementRef, this.route);
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.tampInvoiceStatus = 'ALL';
    this.tampSettlementStatus = 'HOLD';
    this.tampSettlementType = 'PKP';
    this.loadData();
    this.showSpinner = false;
  }


  //#region load all data
  loadData() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      responsive: true,
      serverSide: true,
      processing: true,
      paging: true,
      'lengthMenu': [
        [10, 25, 50, 100],
        [10, 25, 50, 100]
      ],
      ajax: (dtParameters: any, callback) => {

        let paramTamps = {};
        paramTamps = {
          'p_settlement_status': this.tampSettlementStatus,
          'p_agreement_no': this.param
        };
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push(this.JSToNumberFloats(paramTamps))

        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteGetrowsForInvoice).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listinvoice = parse.data;
          // if use checkAll use this
          $('#checkalltable').prop('checked', false);
          // end checkall
          if (parse.data != null) {
            this.listinvoice.numberIndex = dtParameters.start;
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

  // #region changeSettlementStatus 
  changeSettlementStatus(event: any){
    this.tampSettlementStatus = event.target.value
    $('#datatableInvoice').DataTable().ajax.reload();

  }
  // #endregion changeSettlementStatus 
}