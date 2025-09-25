import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../base.component';
import { DALService } from '../../../../../../DALservice.service';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './amortizedeferredincomedetaildetail.component.html'
})

export class AmortizedeferredincomedetaildetailComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');
    params = this.getRouteparam.snapshot.paramMap.get('id2');

    // variable
    public NumberOnlyPattern = this._numberonlyformat;
    public assetdetailData: any = [];
    public isReadOnly: Boolean = false;
    public lookupassettype: any = [];
    private dataTamp: any = [];
    private assettypecode: any = [];
    private APIController: String = 'AgreementAssetInterestIncome';
    private APIRouteForGetRow: String = 'GetRow';
    private RoleAccessCode = 'R00020560000000A'; // role access 



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
        // this.callGetRole(this.userId);
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        if (this.params != null) {
            this.isReadOnly = true;
            // call web service
            this.callGetrow();
            this.wizard();
            setTimeout(() => {
                // this.callWizard($('#applicationAssetTypeCode').val())
                // $('#tabagreementAssetInfo .nav-link').addClass('active');
                // this.assetinfowiz();
            }, 500);
        }
    }

    //#region getrow data
    callGetrow() {

        this.dataTamp = [{
            'p_agreement_no': this.param,
            'p_asset_no': this.params
        }];

        this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    const parsedata = parse.data[0];
                    console.log(parsedata);

                    this.assettypecode = parsedata.asset_type_code;

                    // mapper dbtoui
                    Object.assign(this.model, parsedata);
                    // end mapper dbtoui

                    this.showSpinner = false;
                },
                error => {
                    console.log('There was an error while Retrieving Data(API) !!!' + error);
                });
    }
    //#endregion getrow data

    //#region button back
    btnBack() {
        this.route.navigate(['/inquiry/subamortizedeferredincomelist/amortizedeferredincomedetail', this.param], { skipLocationChange: true });
        $('#datatableAsset').DataTable().ajax.reload();
    }
    //#endregion button back


}
