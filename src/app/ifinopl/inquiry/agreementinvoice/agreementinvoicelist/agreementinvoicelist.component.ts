import { OnInit, ViewChild, Component, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import swal from 'sweetalert2';
import { Location } from '@angular/common';


@Component({
  selector: 'app-agreementinvoicelist',
  templateUrl: './agreementinvoicelist.component.html'
})
export class AgreementinvoicelistComponent extends BaseComponent implements OnInit {
  // variable
  public lookupbranch: any = [];
  public listinquiryinvoice: any = [];
  public lookupsysbranch: any = [];
  public branch_code: String = '';
  public branch_name: String = '';
  public tampStatus: String;

  private APIController: String = 'Invoice';
  private APIControllerSysBranch: String = 'SysBranch';

  private APIRouteForGetRows: String = 'GetRowsForInquiry';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private RoleAccessCode = 'R00020570000010A';

  // form 2 way binding
  model: any = {};

  // ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  constructor(private dalservice: DALService,
    public route: Router,
    private _location: Location,
    private _elementRef: ElementRef) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.tampStatus = 'NEW';
    this.compoSide(this._location, this._elementRef, this.route);
    this.loadData();
  }

  //#region ddl master module
  PageStatus(event: any) {
    this.tampStatus = event.target.value;
    $('#datatableagreementinvoice').DataTable().ajax.reload();
  }
  //#endregion ddl master module

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

        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_branch_code': this.branch_code,
          'p_invoice_status': this.tampStatus
        });

        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);

          this.listinquiryinvoice = parse.data;
          if (parse.data != null) {
            this.listinquiryinvoice.numberIndex = dtParameters.start;
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
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 9] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;">No Data Available !</p>'
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion load all data

  //#region button edit
  btnEdit(codeEdit: string) {
    this.route.navigate(['/inquiry/subagreementinvoicelist/agreementinvoicedetail', codeEdit]);
  }
  //#endregion button edit

  //#region SysBranch
  btnLookupSysBranch() {
    $('#datatableLookupSysBranch').DataTable().clear().destroy();
    $('#datatableLookupSysBranch').DataTable({
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
          'p_cre_by': this.uid
        });

        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBranch, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupsysbranch = parse.data;
          if (parse.data != null) {
            this.lookupsysbranch.numberIndex = dtParameters.start;
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

  btnClearLookupBranch() {
    this.branch_code = '';
    this.branch_name = '';
    $('#datatableagreementinvoice').DataTable().ajax.reload();
  }
  btnSelectRowSysBranch(code: String, name: String) {
    this.branch_code = code;
    this.branch_name = name;
    $('#datatableagreementinvoice').DataTable().ajax.reload();
    $('#lookupModalSysBranch').modal('hide');
  }
  //#endregion SysBranch
}
