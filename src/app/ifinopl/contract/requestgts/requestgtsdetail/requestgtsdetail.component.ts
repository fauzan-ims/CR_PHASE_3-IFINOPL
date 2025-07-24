import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import swal from 'sweetalert2';
import { DALService } from '../../../../../DALservice.service';
import { NgForm } from '@angular/forms';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './requestgtsdetail.component.html'
})

export class RequestgtsdetailComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');
    pageType = this.getRouteparam.snapshot.paramMap.get('page');

    // variable
    public NumberOnlyPattern = this._numberonlyformat;
    public listapplicationasset: any = [];
    private dataTamp: any = [];
    public lookupfixasset: any = [];
    public tempAssetNo: any;
    public requestDate: any;
    public date: any;
    public listdateDeliveryRequest: any = [];

    private APIController: String = 'ApplicationMain';
    private APIControllerApplicationAsset: String = 'ApplicationAsset';
    private APIControllerMasterFixAsset: String = 'Asset';

    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForUpdateRentalStatus: String = 'UpdateRentalStatus';
    private APIRouteForUpdateForFixAsset: String = 'UpdateForFixAsset';
    private APIRouteForGetRows: String = 'GetRowsForRequestGTS';
    private APIRouteForFixedAssetLookup: String = 'GetRowsForFixedAssetLookup';
    private APIRouteForUpdateRequestGTS: String = 'ExecSpForUpdateRequestGTS';
    private APIRouteForUpdateRequestDelivaryDate: String = 'UpdateRequestDate';


    private RoleAccessCode = 'R00023940000001A'; // role access 

    // form 2 way binding
    model: any = {};

    // checklist
    public selectedAll: any;
    public checkedList: any = [];

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
                    'p_application_no': this.param
                })

                this.dalservice.Getrows(dtParameters, this.APIControllerApplicationAsset, this.APIRouteForGetRows).subscribe(resp => {
                    const parse = JSON.parse(resp)
                    this.listapplicationasset = parse.data;
                    if (parse.data != null) {
                        this.listapplicationasset.numberIndex = dtParameters.start;
                    }

                    // if use checkAll use this
                    $('#checkall').prop('checked', false);
                    // end checkall

                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 10] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        }

    }
    //#endregion load all data

    //#region  form submit
    onFormSubmit(assetallocationdetailForm: NgForm, isValid: boolean) {
    }
    //#endregion form submit

    //#region getrow data
    callGetrow() {

        this.dataTamp = [{
            'p_application_no': this.param
        }];

        this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    const parsedata = this.getrowNgb(parse.data[0]);

                    if (parsedata.is_blacklist_area === '1') {
                        parsedata.is_blacklist_area = true;
                    } else {
                        parsedata.is_blacklist_area = false;
                    }

                    if (parsedata.is_blacklist_job === '1') {
                        parsedata.is_blacklist_job = true;
                    } else {
                        parsedata.is_blacklist_job = false;
                    }

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

    //#region btnPurchaseRequest
    btnRequestGTS(code: any) {

        this.dataTamp = [{
            'p_asset_no': code,
            'action': 'default'
        }];
        swal({
            allowOutsideClick: false,
            title: 'Are you sure?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            confirmButtonText: 'Yes',
            buttonsStyling: false
        }).then((result) => {
            this.showSpinner = true;
            if (result.value) {

                this.dalservice.ExecSp(this.dataTamp, this.APIControllerApplicationAsset, this.APIRouteForUpdateRequestGTS)
                    .subscribe(
                        res => {
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showSpinner = false;
                                this.showNotification('bottom', 'right', 'success');
                                $('#datatableApplicationAsset').DataTable().ajax.reload();
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
                this.showSpinner = false;
            }
        });
    }
    //#endregion btnPurchaseRequest

    //#region button back
    btnBack() {
        this.route.navigate(['/contract/subrequestgtslist']);
    }
    //#endregion button back

    //#region FixAsset Lookup
    btnLookupFixAsset(assetNo: any, asset_type_code: any, unit_code: any) {
        this.tempAssetNo = assetNo;
        $('#datatableLookupFixAsset').DataTable().clear().destroy();
        $('#datatableLookupFixAsset').DataTable({
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
                    'p_type_code': asset_type_code,
                    'p_type_item_code': unit_code
                });

                this.dalservice.GetrowsAms(dtParameters, this.APIControllerMasterFixAsset, this.APIRouteForFixedAssetLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupfixasset = parse.data;
                    if (parse.data != null) {
                        this.lookupfixasset.numberIndex = dtParameters.start;
                    }
                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 5] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }

    btnSelectRowFixAsset(code: String, item_name: String, fa_reff_no_01: String, fa_reff_no_02: String, fa_reff_no_03: String) {
        let tempFixedAsset = [];
        tempFixedAsset = [{
            'p_code': code,
            'p_rental_reff_no': this.tempAssetNo,
            'p_rental_status': 'RESERVED'
        }]

        this.dataTamp = [{
            'p_asset_no': this.tempAssetNo
            , 'p_fa_code': code
            , 'p_fa_name': item_name
            , 'p_fa_reff_no_01': fa_reff_no_01
            , 'p_fa_reff_no_02': fa_reff_no_02
            , 'p_fa_reff_no_03': fa_reff_no_03

        }]

        this.dalservice.UpdateAms(tempFixedAsset, this.APIControllerMasterFixAsset, this.APIRouteForUpdateRentalStatus)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                        // call web service
                        this.dalservice.Update(this.dataTamp, this.APIControllerApplicationAsset, this.APIRouteForUpdateForFixAsset)
                            .subscribe(
                                res => {
                                    const parse = JSON.parse(res);
                                    if (parse.result === 1) {
                                        this.showSpinner = false;
                                        $('#datatableApplicationAsset').DataTable().ajax.reload();
                                        $('#applicationDetail').click();
                                        this.callGetrow();
                                        this.showNotification('bottom', 'right', 'success');
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
                        this.tempAssetNo = undefined;
                        $('#lookupModalFixAsset').modal('hide');
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
        this.tempAssetNo = undefined;
        $('#lookupModalFixAsset').modal('hide');
    }
    //#endregion FixAsset lookup

    //#region  btnClearFixedAsset
    btnClearFixedAsset(assetNo: String, fa_code: String) {
        let tempFixedAsset = [];
        tempFixedAsset = [{
            'p_code': fa_code
        }]
        this.dalservice.UpdateAms(tempFixedAsset, this.APIControllerMasterFixAsset, this.APIRouteForUpdateRentalStatus)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                        this.dataTamp = [{
                            'p_asset_no': assetNo
                        }]
                        // call web service
                        this.dalservice.Update(this.dataTamp, this.APIControllerApplicationAsset, this.APIRouteForUpdateForFixAsset)
                            .subscribe(
                                res => {
                                    const parse = JSON.parse(res);
                                    if (parse.result === 1) {
                                        this.showSpinner = false;
                                        $('#datatableApplicationAsset').DataTable().ajax.reload();
                                        $('#applicationDetail').click();
                                        this.callGetrow();
                                        this.showNotification('bottom', 'right', 'success');
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
                        this.showSpinner = false;
                        this.swalPopUpMsg(parse.data);
                    }
                },
                error => {
                    this.showSpinner = false;
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data)
                });
        this.tempAssetNo = undefined;
        $('#lookupModalFixAsset').modal('hide');
    }
    //#endregion  btnClearFixedAsset

    //#region button save in list
    saveList() {

        this.showSpinner = true;
        this.listdateDeliveryRequest = [];

        let i = 0;

        const getAssetNo = $('[name="p_asset_no"]')
            .map(function () { return $(this).val(); }).get();

        const getRequestDeliveryDate = $('[name="p_request_delivery_date"]')
            .map(function () { return $(this).val(); }).get();

        while (i < getAssetNo.length) {

            while (i < getRequestDeliveryDate.length) {

                if (getRequestDeliveryDate[i] === '') {
                    getRequestDeliveryDate[i] = undefined;
                }
                this.listdateDeliveryRequest.push(this.JSToNumberFloats({
                    p_asset_no: getAssetNo[i],
                    p_request_delivery_date: this.dateFormatList(getRequestDeliveryDate[i]),
                }));
                
                i++;
            }
            i++;
        }
        //#region web service
        this.dalservice.Update(this.listdateDeliveryRequest, this.APIControllerApplicationAsset, this.APIRouteForUpdateRequestDelivaryDate)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                        this.showSpinner = false;
                        this.showNotification('bottom', 'right', 'success');
                        $('#datatableApplicationAsset').DataTable().ajax.reload();
                    } else {
                        this.showSpinner = false;
                        this.swalPopUpMsg(parse.data);
                    }
                },
                error => {
                    this.showSpinner = false;
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data);
                });
        //#endregion web service
    }
    //#endregion button save in list
}