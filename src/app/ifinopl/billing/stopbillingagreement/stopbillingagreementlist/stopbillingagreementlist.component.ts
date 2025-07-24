import { OnInit, ViewChild, Component, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import swal from 'sweetalert2';
import { Location } from '@angular/common';


@Component({
  selector: 'app-stopbillingagreementlist',
  templateUrl: './stopbillingagreementlist.component.html'
})
export class StopbillingagreementlistComponent extends BaseComponent implements OnInit {
  // variable
  public lookupbranch: any = [];
  public listagreement: any = [];
  public branch_code: String = '';
  public branch_name: String = '';
  public tampStatus: String;
  private APIController: String = 'AgreementMain';
  private APIControllerSysBranch: String = 'SysBranch';
  private APIRouteForGetRows: String = 'GetRowsForStopBilling';
  private APIRouteForGetRowsSys: String = 'GetRowsForLookup';
  private RoleAccessCode = 'R00020750000000A';

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
    this.tampStatus = 'TERMINATE';
    this.compoSide(this._location, this._elementRef, this.route);
    this.loadData();
  }

  //#region ddl master module
  PageStatus(event: any) {
    this.tampStatus = event.target.value;
    $('#datatable').DataTable().ajax.reload();
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
          'p_agreement_status': this.tampStatus
        });
        

        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listagreement = parse.data;
          if (parse.data != null) {
            this.listagreement.numberIndex = dtParameters.start;
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
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 8] }], // for disabled coloumn
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
    this.route.navigate(['/billing/substopbillingagreementlist/stopbillingagreementdetail', codeEdit]);
  }
  //#endregion button edit

  //#region LookupSysBranch
  btnLookupSysBranch() {
    $('#datatableLookupSysBranch').DataTable().clear().destroy();
    $('#datatableLookupSysBranch').DataTable({
      'pagingType': 'simple_numbers',
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
        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBranch, this.APIRouteForGetRowsSys).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupbranch = parse.data;
          if (parse.data != null) {
            this.lookupbranch.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          })
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      'lengthMenu': [
        [5, 25, 50, 100],
        [5, 25, 50, 100]
      ],
      columnDefs: [{ orderable: false, width: '5%', targets: [4] }], // for disabled coloumn
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
    $('#datatable').DataTable().ajax.reload();
}
  btnSelectRowBranch(code: String, name: String) {
    this.branch_code = code;
    this.branch_name = name;
    $('#lookupModalbranch').modal('hide');
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion LookupSysBranch
}
