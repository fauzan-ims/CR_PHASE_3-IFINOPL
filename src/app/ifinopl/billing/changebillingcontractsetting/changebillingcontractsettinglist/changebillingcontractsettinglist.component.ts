import { OnInit, ViewChild, Component, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import swal from 'sweetalert2';
import { Location } from '@angular/common';


@Component({
    selector: 'app-changebillingcontractsettinglist',
    templateUrl: './changebillingcontractsettinglist.component.html'
})
export class ChangebillingcontractsettinglistComponent extends BaseComponent implements OnInit {
    // variable
    public lookupbranch: any = [];
    public lookupagreement: any = [];
    public lookupasset: any = [];
    public listagreement: any = [];
    public branch_code: String = '';
    public branch_name: String = '';
    public agreement_no: String = '';
    public client_name: String = '';
    public agreement_external_no: String = '';
    public asset_no: String = '';
    public asset_name: String = '';
    public tampStatus: String;

    //Controller
    private APIController: String = 'AgreementMain';
    private APIControllerAgreementAsset: String = 'AgreementAsset';

    //Route
    private APIRouteForLookup: String = 'GetRowsForLookup';
    private APIRouteForGetRowsForChangeBillingContractSetting: String = 'GetRowsForChangeBillingContractSetting';
    private RoleAccessCode = 'R00023880000001A';

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
        this.tampStatus = 'GO LIVE';
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
                    'p_agreement_no': this.agreement_no,
                    'p_asset_no': this.asset_no
                });

                this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRowsForChangeBillingContractSetting).subscribe(resp => {
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
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 6] }], // for disabled coloumn
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
    btnEdit(codeEdit1: string, codeEdit2: string) {
        this.route.navigate(['/billing/subchangebillingcontractsettinglist/changebillingcontractsettingdetail', codeEdit1, codeEdit2]);
    }
    //#endregion button edit

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
                    'p_branch_code': 'ALL'
                });

                this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForLookup).subscribe(resp => {
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

    btnSelectRowAgreement(agreement_no: String, client_name: String, agreement_external_no: string) {
        this.agreement_no = agreement_no;
        this.client_name = client_name;
        this.agreement_external_no = agreement_external_no
        this.asset_no = '';
        this.asset_name = '';
        $('#lookupModalAgreement').modal('hide');
        $('#datatablechangebilling').DataTable().ajax.reload();
    }

    btnClearAgreement() {
        this.agreement_no = '';
        this.agreement_external_no = '';
        this.client_name = '';
        this.asset_no = '';
        this.asset_name = '';
        $('#datatablechangebilling').DataTable().ajax.reload();
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
          'p_agreement_no': this.agreement_no
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

  btnSelectRowAsset(asset_no: String, asset_name: String) {
    this.asset_no = asset_no;
    this.asset_name = asset_name;
    $('#lookupModalAsset').modal('hide');
    $('#datatablechangebilling').DataTable().ajax.reload();
  }

  btnClearAsset() {
    this.asset_no = '';
    this.asset_name = '';
    $('#datatablechangebilling').DataTable().ajax.reload();
  }
  //#endregion Asset lookup
}
