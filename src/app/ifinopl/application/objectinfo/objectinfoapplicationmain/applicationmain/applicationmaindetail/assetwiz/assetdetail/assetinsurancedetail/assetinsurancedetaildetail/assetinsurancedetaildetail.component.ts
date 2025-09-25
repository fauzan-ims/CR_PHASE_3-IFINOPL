import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../../../../../base.component';
import { DALService } from '../../../../../../../../../../../DALservice.service';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './assetinsurancedetaildetail.component.html'
})

export class ObjectInfoAssetinsurancedetaildetailinquiryComponent extends BaseComponent implements OnInit {
    // get param from url
    appNo = this.getRouteparam.snapshot.paramMap.get('id');
    assetNo = this.getRouteparam.snapshot.paramMap.get('id2');

    // variable
    public NumberOnlyPattern = this._numberonlyformat;
    public assetinsuranceData: any = [];
    public listbudgetinsuranceratedetail: any = [];
    public lookupVehicleType: any = [];
    public lookupMainCoverage: any = [];
    public lookupRegion: any = [];
    public lookupTPLCoverage: any = [];
    public lookupPLLCoverage: any = [];
    public lookupGllink: any = [];
    public isReadOnly: Boolean = false;
    public dataTamp: any = [];
    public dataTampPush: any = [];
    public setStyle: any = [];
    public Id: String;
    public isTPL: any;
    public isPLLL: any;

    private APIController: String = 'AssetInsuranceDetail';
    private APIControllerSysGeneralSubCode: String = 'SysGeneralSubCode';
    private APIControllerInsuranceLiability: String = 'MasterBudgetInsuranceRateLiability';

    private APIRouteForLookup: String = 'GetRowsForLookup';
    private APIRouteForGetRow: String = 'GETROW';
    private APIRouteForInsert: String = 'INSERT';
    private APIRouteForUpdate: String = 'UPDATE';

    private RoleAccessCode = 'R00024180000001A'; // role access 

    // checklist
    public selectedAll: any;
    private checkedList: any = [];

    // form 2 way binding
    model: any = {};
    disabled: any = {};

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
        
        this.Delimiter(this._elementRef);
        this.callGetrow();
        this.showSpinner = false;
        this.model.main_coverage_premium_amount = 0
        this.model.tpl_premium_amount = 0
        this.model.pll_premium_amount = 0
        this.model.pa_passenger_amount = 0
        this.model.pa_passenger_premium_amount = 0
        this.model.pa_driver_amount = 0
        this.model.pa_driver_premium_amount = 0
        this.model.srcc_premium_amount = 0
        this.model.ts_premium_amount = 0
        this.model.flood_premium_amount = 0
        this.model.earthquake_premium_amount = 0
        this.model.commercial_premium_amount = 0
        this.model.authorize_workshop_premium_amount = 0
        this.model.total_premium_amount = 0
        this.model.pa_passenger_seat = 0
        this.model.tbod_premium_amount = 0
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

    //#region lookup coverage
    btnLookupMainCoverage() {
        $('#datatableLookupMainCoverage').DataTable().clear().destroy();
        $('#datatableLookupMainCoverage').DataTable({
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
                    'p_general_code': 'CVRG',
                    'default': ''
                });

                this.dalservice.Getrows(dtParameters, this.APIControllerSysGeneralSubCode, this.APIRouteForLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupMainCoverage = parse.data;
                    if (parse.data != null) {
                        this.lookupMainCoverage.numberIndex = dtParameters.start;
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

    btnSelectRowMainCoverage(code: String, description: String) {
        this.model.main_coverage_code = code;
        this.model.main_coverage_description = description;
        $('#lookupModalMainCoverage').modal('hide');
    }
    //#endregion lookup coverage

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

    //#region lookup tpl coverage
    btnLookupTPLCoverage() {
        $('#datatableLookupTPLCoverage').DataTable().clear().destroy();
        $('#datatableLookupTPLCoverage').DataTable({
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
                    'p_type': 'TPL',
                    'default': ''
                });

                this.dalservice.Getrows(dtParameters, this.APIControllerInsuranceLiability, this.APIRouteForLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupTPLCoverage = parse.data;
                    if (parse.data != null) {
                        this.lookupTPLCoverage.numberIndex = dtParameters.start;
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

    btnSelectRowTPLCoverage(code: String, description: String) {
        this.model.tpl_coverage_code = code;
        this.model.tpl_coverage_description = description;
        $('#lookupModalTPLCoverage').modal('hide');
    }
    //#endregion lookup tpl coverage

    //#region lookup pll coverage
    btnLookupPLLCoverage() {
        $('#datatableLookupPLLCoverage').DataTable().clear().destroy();
        $('#datatableLookupPLLCoverage').DataTable({
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
                    'p_type': 'PLL',
                    'default': ''
                });

                this.dalservice.Getrows(dtParameters, this.APIControllerInsuranceLiability, this.APIRouteForLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupPLLCoverage = parse.data;
                    if (parse.data != null) {
                        this.lookupPLLCoverage.numberIndex = dtParameters.start;
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

    btnSelectRowPLLCoverage(code: String, description: String) {
        this.model.pll_coverage_code = code;
        this.model.pll_coverage_description = description;
        $('#lookupModalPLLCoverage').modal('hide');
    }
    //#endregion lookup pll coverage

    //#region getrow data
    callGetrow() {

        this.dataTamp = [{
            'p_asset_no': this.assetNo
        }];

        this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);

                    const parsedata = this.getrowNgb(parse.data[0]);

                    // checkbox
                    if (parsedata.is_use_tpl === '1') {
                        parsedata.is_use_tpl = true;
                    } else {
                        parsedata.is_use_tpl = false;
                    }

                    if (parsedata.is_use_pll === '1') {
                        parsedata.is_use_pll = true;
                    } else {
                        parsedata.is_use_pll = false;
                    }

                    if (parsedata.is_use_pa_passenger === '1') {
                        parsedata.is_use_pa_passenger = true;
                    } else {
                        parsedata.is_use_pa_passenger = false;
                    }

                    if (parsedata.is_use_pa_driver === '1') {
                        parsedata.is_use_pa_driver = true;
                    } else {
                        parsedata.is_use_pa_driver = false;
                    }

                    if (parsedata.is_use_srcc === '1') {
                        parsedata.is_use_srcc = true;
                    } else {
                        parsedata.is_use_srcc = false;
                    }

                    if (parsedata.is_use_ts === '1') {
                        parsedata.is_use_ts = true;
                    } else {
                        parsedata.is_use_ts = false;
                    }

                    if (parsedata.is_use_flood === '1') {
                        parsedata.is_use_flood = true;
                    } else {
                        parsedata.is_use_flood = false;
                    }

                    if (parsedata.is_use_earthquake === '1') {
                        parsedata.is_use_earthquake = true;
                    } else {
                        parsedata.is_use_earthquake = false;
                    }

                    if (parsedata.is_commercial_use === '1') {
                        parsedata.is_commercial_use = true;
                    } else {
                        parsedata.is_commercial_use = false;
                    }

                    if (parsedata.is_authorize_workshop === '1') {
                        parsedata.is_authorize_workshop = true;
                    } else {
                        parsedata.is_authorize_workshop = false;
                    }

                    if (parsedata.is_tbod === '1') {
                        parsedata.is_tbod = true;
                    } else {
                        parsedata.is_tbod = false;
                    }
                    // end checkbox

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
    onFormSubmit(assetinsurancedetaildetailForm: NgForm, isValid: boolean) {
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

        this.assetinsuranceData = assetinsurancedetaildetailForm;

        if (this.assetinsuranceData.p_is_use_tpl === undefined) {
            this.assetinsuranceData.p_is_use_tpl = 'F'
        }

        if (this.assetinsuranceData.p_is_use_pll === undefined) {
            this.assetinsuranceData.p_is_use_pll = 'F'
        }
        if (this.assetinsuranceData.p_is_use_pa_passenger === undefined) {
            this.assetinsuranceData.p_is_use_pa_passenger = 'F'
        }

        if (this.assetinsuranceData.p_is_use_pa_driver === undefined) {
            this.assetinsuranceData.p_is_use_pa_driver = 'F'
        }

        if (this.assetinsuranceData.p_is_use_srcc === undefined) {
            this.assetinsuranceData.p_is_use_srcc = 'F'
        }

        if (this.assetinsuranceData.p_is_use_ts === undefined) {
            this.assetinsuranceData.p_is_use_ts = 'F'
        }
        if (this.assetinsuranceData.p_is_use_flood === undefined) {
            this.assetinsuranceData.p_is_use_flood = 'F'
        }

        if (this.assetinsuranceData.p_is_use_earthquake === undefined) {
            this.assetinsuranceData.p_is_use_earthquake = 'F'
        }

        if (this.assetinsuranceData.p_is_commercial_use === undefined) {
            this.assetinsuranceData.p_is_commercial_use = 'F'
        }

        if (this.assetinsuranceData.p_is_authorize_workshop === undefined) {
            this.assetinsuranceData.p_is_authorize_workshop = 'F'
        }

        this.assetinsuranceData = this.JSToNumberFloats(this.assetinsuranceData);

        const usersJson: any[] = Array.of(this.assetinsuranceData);

        if (this.model.id != null) {

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
        }
    }
    //#endregion form submit

    //#region button back
    btnBack() {
        // this.route.navigate(['/inquiry/inquiryapplicationmain/applicationmaindetail/' + this.appNo + '/assetlist/' + this.appNo + '/assetdetail/', this.appNo, this.assetNo], { skipLocationChange: true });
        this.route.navigate(['/objectinfoapplication/objectinfoapplicationmain/' + this.appNo + '/' + 'banberjalan' + '/assetlist/' + this.appNo + '/' + 'banberjalan' + '/assetdetail/', this.appNo, this.assetNo, 'banberjalan'], { skipLocationChange: true });
    }
    //#endregion button back

    // #region checkbox
    useTpl(event: any) {
        // this.disabled.TPL = event.target.checked
        this.model.is_use_tpl = event.target.checked
        if (this.model.is_use_tpl == false){
            this.model.tpl_coverage_code = undefined;
            this.model.tpl_coverage_description = undefined;
        }
    }

    usePLL(event: any) {
        this.model.is_use_pll = event.target.checked
        if (this.model.is_use_pll == false){
            this.model.pll_coverage_code = undefined;
            this.model.pll_coverage_description = undefined;
        }
    }

    usePaPassenger(event: any) {
        this.model.is_use_pa_passenger = event.target.checked
    }

    usePaDriver(event: any) {
        this.model.is_use_pa_driver = event.target.checked
    }
    // #endregion checkbox

}