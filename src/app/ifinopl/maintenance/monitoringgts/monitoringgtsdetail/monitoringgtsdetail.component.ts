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
    templateUrl: './monitoringgtsdetail.component.html'
})

export class MonitoringgtsdetailComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');
    pageType = this.getRouteparam.snapshot.paramMap.get('page');

    // variable
    public NumberOnlyPattern = this._numberonlyformat;
    public listagreementasset: any = [];
    private dataTamp: any = [];
    public lookupfixasset: any = [];
    public tempAssetNo: any;
    public requestDate: any;
    public date: any;
    public listdateDeliveryRequest: any = [];

    private APIController: String = 'AgreementMain';
    private APIControllerAgreementAsset: String = 'AgreementAsset';

    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForGetRows: String = 'GetRowsForMonitoringGTS';
    private APIRouteForPostMonitoringGTS: String = 'ExecSpForMonitoringGTSPost';
    private APIRouteForUpdateRequestDelivaryDate: String = 'UpdateRequestDate';


    private RoleAccessCode = 'R00024120000001A'; // role access 

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
            'pagingType': 'first_last_numbers',
            'pageLength': 10,
            'processing': true,
            'serverSide': true,
            responsive: true,
            lengthChange: false, // hide lengthmenu
            searching: true, // jika ingin hilangin search box nya maka false
            ajax: (dtParameters: any, callback) => {

                dtParameters.paramTamp = [];
                dtParameters.paramTamp.push({
                    'p_agreement_no': this.param
                })

                this.dalservice.Getrows(dtParameters, this.APIControllerAgreementAsset, this.APIRouteForGetRows).subscribe(resp => {
                    const parse = JSON.parse(resp)
                    this.listagreementasset = parse.data;
                    if (parse.data != null) {
                        this.listagreementasset.numberIndex = dtParameters.start;
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
            'p_agreement_no': this.param
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

    //#region btnPostGTS
    btnPostGTS(code: any) {

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

                this.dalservice.ExecSp(this.dataTamp, this.APIControllerAgreementAsset, this.APIRouteForPostMonitoringGTS)
                    .subscribe(
                        res => {
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showSpinner = false;
                                this.showNotification('bottom', 'right', 'success');
                                this.route.navigate(['/maintenance/submonitoringgtslist']);
                                $('#datatableMonitringGTS').DataTable().ajax.reload();
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
    //#endregion btnPostGTS

    //#region button back
    btnBack() {
        this.route.navigate(['/maintenance/submonitoringgtslist']);
        $('#datatableMonitringGTS').DataTable().ajax.reload();
    }
    //#endregion button back

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
        this.dalservice.Update(this.listdateDeliveryRequest, this.APIControllerAgreementAsset, this.APIRouteForUpdateRequestDelivaryDate)
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