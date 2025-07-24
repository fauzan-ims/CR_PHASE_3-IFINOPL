import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../../../base.component';
import { DALService } from '../../../../../../../../../DALservice.service';
import swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-agreementobligationlist',
  templateUrl: './agreementobligationlist.component.html'
})
export class AgreementobligationlistComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');


  // variable
  public listagreement: any = [];
  public lookupGeneral: any = [];
  private APIController: String = 'AgreementObligation';
  private APIRouteLookup: String = 'GetRowsForLookupInquiry';
  private APIRouteForGetRows: String = 'GetRows';
  private RoleAccessCode = 'R00020560000000A'; // role access 

  // ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  // spinner
  showSpinner: Boolean = true;
  // end

  // form 2 way binding
  model: any = {};

  constructor(private dalservice: DALService,
    private _location: Location,
    public getRouteparam: ActivatedRoute,
    public route: Router,
    private _elementRef: ElementRef) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.compoSide('', this._elementRef, this.route);
    this.loadData();
    this.model.obligation_type = ''
  }

  btnLookupGeneral() {
    $('#datatableLookupGeneral').DataTable().clear().destroy();
    $('#datatableLookupGeneral').DataTable({
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
          'p_agreement_no': this.param,
          'p_obligation_type': this.model.obligation_type,
          'p_asset_no': this.params,
          'default': ''
        });
        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupGeneral = parse.data;
          if (parse.data != null) {
            this.lookupGeneral.numberIndex = dtParameters.start;
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

  btnSelectRowGeneral(code: String, description: String) {
    this.model.obligation_type = code;
    this.model.obligation_name = description;
    $('#lookupModalGeneral').modal('hide');
    $('#datatableAgreementObligationList').DataTable().ajax.reload();
  }
  //#endregion sorce

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
        // param tambahan untuk getrows dynamic
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_agreement_no': this.param,
          'p_obligation_type': this.model.obligation_type,
          'p_asset_no': this.params,

        });

        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);

          this.listagreement = parse.data;

          if (parse.data != null) {
            this.listagreement.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });

        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 8] }], // for disabled coloumn
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
    this.route.navigate(['/inquiry/subagreementlist/agreementdetail/' + this.param + '/agreementassetlist/' + this.param + '/agreementassetdetail/' + this.param + '/' + this.params + '/agreementobligationdetailwiz', this.param, codeEdit, this.params], { skipLocationChange: true });
  }
  //#endregion button edit

  // #region btnClearObligation
  btnClearObligation() {
    this.model.obligation_type = undefined;
    this.model.obligation_name = '';
    $('#datatableAgreementObligationList').DataTable().ajax.reload();
  }
  // #endregion btnClearObligation
}
