import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import swal from 'sweetalert2';
import { DALService } from '../../../../../../../DALservice.service';
import { NgForm } from '@angular/forms';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './spsettlementamortizationdetail.component.html'
})

export class SpSettlementAmortizationdetailComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');
    params = this.getRouteparam.snapshot.paramMap.get('id2');

    // variable
    public NumberOnlyPattern = this._numberonlyformat;
    public listamortization: any = [];
    public setStyle: any = [];
    private dataTamp: any = [];
    public deliveryAssetDetailData: any = [];
    public lookupMasterDeskcollResult: any = [];

    private APIController: String = 'WarningLetterDelivery';
    private APIControllerMasterDeskcollResult: String = 'MasterDeskcollResult';

    private APIRouteForGetRows: String = 'GetRowsForAmortInvoiceAgreement';
    private APIRouteForGetRow: String = 'GetRowInvoiceDetail';
    private APIRouteForLookup: String = 'GetRowsForLookup';

    private RoleAccessCode = 'R00020670000000A'; // role access 

    // form 2 way binding
    model: any = {};
    modelHeader: any = {};

    // spinner
    showSpinner: Boolean = false;
    // end 

    // datatable
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};

    constructor(private dalservice: DALService,
        public getRouteparam: ActivatedRoute,
        public route: Router,
        private _elementRef: ElementRef
    ) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        this.Delimiter(this._elementRef);
        // call web service
        this.callGetrow();
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
                'pointer-events': 'auto',
            }
        }

        return this.setStyle;
    }
    //#endregion 

    //#region getrow data
    callGetrow() {

        this.dataTamp = [{
            'p_code': this.params,
        }];

        this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    const parsedata = this.getrowNgb(parse.data[0]);

                    // mapper dbtoui
                    Object.assign(this.model, parsedata);
                    // end mapper dbtoui 

                    // $('#datatableApplicationAmortization').DataTable().ajax.reload();
                    this.showSpinner = false;
                },
                error => {
                    this.showSpinner = false;
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data);
                });
    }
    //#endregion getrow data

    //#region button back
    btnBack() {
        // this.route.navigate(['/collection/deskcolltaskdetailpast/' + this.param + '/amortizationlist', this.param]);
        this.route.navigate(['/collection/subspdeliverysettlementlist/spdeliverysettlementdetail/' + this.param,'spsettlementamortizationlist',this.param]);
        $('#datatableAmortizationList').DataTable().ajax.reload();
    }
    //#endregion button back

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

                dtParameters.paramTamp = [];
                dtParameters.paramTamp.push({
                    'p_invoice_no': this.params
                })

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

      //#endregion master Descoll lookup
  btnLookupMasterDeskcollResult() {
    $('#datatableLookupMasterDeskcollResult').DataTable().clear().destroy();
    $('#datatableLookupMasterDeskcollResult').DataTable({
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
          'p_result_code': this.model.result_code
        });
        this.dalservice.Getrows(dtParameters, this.APIControllerMasterDeskcollResult, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupMasterDeskcollResult = parse.data;
          if (parse.data != null) {
            this.lookupMasterDeskcollResult.numberIndex = dtParameters.start;
          }


          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          })
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [1, 4] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  //#region master collector lookup
  btnSelectRowMasterDeskcollResult(Code: String, Name: String) {
    this.model.result_code = Code;
    this.model.result_name = Name;
    $('#lookupModalMasterDeskcollResult').modal('hide');
  }
  //#endregion master Descoll lookup
}