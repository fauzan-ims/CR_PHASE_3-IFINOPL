import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../base.component';
import { DALService } from '../../../../../../DALservice.service';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './masterbudgetinsuranceratedetaildetail.component.html'
})

export class MasterbudgetinsuranceratedetaildetailComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');
    params = this.getRouteparam.snapshot.paramMap.get('id2');

    // variable
    public NumberOnlyPattern = this._numberonlyformat;
    public feedetailData: any = [];
    public listbudgetdetail: any = [];
    public lookupfacility: any = [];
    public lookupPsakGllink: any = [];
    public lookupGllink: any = [];
    public isReadOnly: Boolean = false;
    public dataTamp: any = [];
    public dataTampPush: any = [];
    public setStyle: any = [];
    public lookupRegion: any = [];

    private APIController: String = 'MasterBudgetInsuranceRateDetail';
    private APIControllerSysRegion: String = 'SysRegion';
    private APIControllerSysGeneralSubCode: String = 'SysGeneralSubCode';

    private APIRouteForGetRow: String = 'GETROW';
    private APIRouteForInsert: String = 'INSERT';
    private APIRouteForUpdate: String = 'UPDATE';
    private APIRouteForLookup: String = 'GetRowsForLookup';

    private RoleAccessCode = 'R00024170000001A'; // role access 

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
        private _elementRef: ElementRef
    ) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        this.Delimiter(this._elementRef);
        if (this.params != null) {
            // call web service
            this.callGetrow();
        } else {
            this.showSpinner = false;
            this.model.sum_insured_from = 0;
            this.model.sum_insured_to = 0;
            this.model.rate_1 = 0;
            this.model.rate_2 = 0;
            this.model.rate_3 = 0;
            this.model.rate_4 = 0;
        }
    }

    //#region getrow data
    callGetrow() {

        this.dataTamp = [{
            'p_budget_insurance_rate_code': this.param,
            'p_id': this.params,
        }];

        this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    const parsedata = this.getrowNgb(parse.data[0]);

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
    onFormSubmit(budgetreplacementdetailForm: NgForm, isValid: boolean) {
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

        this.feedetailData = this.JSToNumberFloats(budgetreplacementdetailForm);

        const usersJson: any[] = Array.of(this.feedetailData);

        if (this.params != null) {
            // call web service
            this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
                .subscribe(
                    res => {
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            this.callGetrow();
                            this.showNotification('bottom', 'right', 'success');
                            this.showSpinner = false;
                        } else {
                            this.showSpinner = false;
                            this.swalPopUpMsg(parse.data);
                        }
                    },
                    error => {
                        this.showSpinner = false;
                        const parse = JSON.parse(error);
                        this.swalPopUpMsg(parse.data)
                    });
        } else {
            // call web service
            this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
                .subscribe(
                    res => {
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            this.showSpinner = false;
                            this.showNotification('bottom', 'right', 'success');
                            this.route.navigate(['/generalpolicy/submasterbudgetinsuranceratelist/budgetinsuranceratedetaildetail', this.param, parse.id]);
                        } else {
                            this.showSpinner = false;
                            this.swalPopUpMsg(parse.data);
                        }
                    },
                    error => {
                        this.showSpinner = false;
                        const parse = JSON.parse(error);
                        this.swalPopUpMsg(parse.data)
                    });
        }
    }
    //#endregion form submit

    //#region button back
    btnBack() {
        this.route.navigate(['/generalpolicy/submasterbudgetinsuranceratelist/budgetinsuranceratedetail', this.param]);
        $('#datatablebudgetreplacement').DataTable().ajax.reload();
    }
    //#endregion button back

    //#region lookup region
    btnLookupRegion() {
        $('#datatableLookupRegion').DataTable().clear().destroy();
        $('#datatableLookupRegion').DataTable({
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
                    'p_general_code': 'MAREG',
                    'default': ''
                });

                this.dalservice.Getrows(dtParameters, this.APIControllerSysGeneralSubCode, this.APIRouteForLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupRegion = parse.data;
                    if (parse.data != null) {
                        this.lookupRegion.numberIndex = dtParameters.start;
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
                infoEmpty: '<p style="color:red;">No Data Available !</p>'
            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }

    btnSelectRowRegion(code: String, description: String) {
        this.model.region_code = code;
        this.model.region_description = description;
        $('#lookupModalRegion').modal('hide');
    }
    //#endregion lookup region
}