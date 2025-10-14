import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
//import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
//import { DatePipe } from '@angular/common';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './assetreplacementmaindetail.component.html'
})

export class AssetreplacementmaindetailComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');

    // variable
    public NumberOnlyPattern = this._numberonlyformat;
    public uncrosscollateraldetailData: any = [];
    public listassetdetail: any = [];
    public listassetdetailData: any = [];
    public listassetreplacementdetailData: any = [];
    public lookupfixasset: any = [];
    public lookupNewAsset: any = [];
    public lookupReason: any = [];
    public agreementno: any = [];
    public newfacode: any = [];
    public collaterlano: any = [];
    public isReadOnly: Boolean = false;
    public isBreak: Boolean = false;
    public lookupagreement: any = [];
    public lookupbranch: any = [];
    public lookupcollateral: any = [];
    public lookupapproval: any = [];
    public lookupAssetMultiple: any = [];
    private idAssetDetail: any;
    public isButton: Boolean = false;
    public isData: Boolean = false;
    public isReplacement: Boolean = false;
    public isDataAsset: Boolean = false;
    public isDate: Boolean = false;
    private dataTamps: any = [];
    private dataTamp: any = [];
    private setStyle: any = [];
    private dataTampClient: any = [];
    public tempAssetNo: any;

    //controller
    private APIControllerLookupNewAsset: String = 'Asset';
    private APIController: String = 'AssetReplacement';
    private APIControllerAssetReplacementDetail: String = 'AssetReplacementDetail';
    private APIControllerAgreementAsset: String = 'AgreementAsset';
    private APIControllerSysBranch: String = 'SysBranch';
    private APIControllerAgreementMain: String = 'AgreementMain';
    private APIControllerSysGeneralSubcode: String = 'SysGeneralSubcode';
    private APIControllerApprovalSchedule: String = 'ApprovalSchedule';

    //routing
    private APIRouteForGetRows: String = 'GetRows';
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForDelete: String = 'DELETE';
    private APIRouteForUpdate: String = 'Update';
    private APIRouteForInsert: String = 'Insert';
    private APIRouteForLookup: String = 'GetRowsForLookup';
    private APIRouteForLookupAssetReplcement: String = 'GetRowsForLookupAssetReplacement';
    private APIRouteForLookuptReplacementDetail: String = 'GetRowsForLookupReplacementDetail';
    private APIRouteForProceed: String = 'ExecSpForGetProceed';
    private APIRouteForPost: String = 'ExecSpForGetPost';
    private APIRouteForReturn: String = 'ExecSpForGetReturn';
    private APIRouteForReturnAsset: String = 'ExecSpForGetReturnAsset';
    private APIRouteForCancel: String = 'ExecSpForGetCancel';
    private APIRouteForUpdateNewAsset = 'UpdateForNewAsset';
    private APIRouteForUpdateReplacementType = 'UpdateForReplacementType';
    private APIRouteForUpdateReason = 'UpdateForReason';
    private APIRouteForGetDataAsset = 'ExecSpForGetDataAsset';
    private APIRouteForUpdateRentalStatus: String = 'UpdateRentalStatus';

    private RoleAccessCode = 'R00020250000000A';

    // checklist
    public selectedAllLookup: any;
    private selectedAll: any;
    private checkedList: any = [];
    private checkedLookup: any = [];

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
        private _elementRef: ElementRef//, private datePipe: DatePipe
    ) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        if (this.param != null) {
            this.isReadOnly = true;

            // call web service
            this.callGetrow();
            this.loadData();
        } else {
            this.model.status = 'HOLD';
            this.showSpinner = false;
        }
    }

    //#region getStyles
    getStyles(isTrue: Boolean) {
        if (isTrue) {
            this.setStyle = {
                'pointer-events': 'none',
            }
        } else {
            this.setStyle = {
                'pointer-events': 'unset',
            }
        }

        return this.setStyle;
    }
    //#endregion getStyles

    //#region onFocus
    onFocusEstimate(event, i, type) {
        event = '' + event.target.value;

        if (event != null) {
            event = event.replace(/[ ]*,[ ]*|[ ]+/g, '');
        }

        if (type === 'amount') {
            $('#estimate' + i)
                .map(function () { return $(this).val(event); }).get();
        } else {
            $('#estimate' + i)
                .map(function () { return $(this).val(event); }).get();
        }
    }
    //#endregion onFocus

    //#region onBlur
    onBlurEstimate(event, i, type) {
        if (type === 'amount') {
            if (event.target.value.match('[0-9]+(,[0-9]+)')) {
                if (event.target.value.match('(\.\d+)')) {
                    event = '' + event.target.value;
                    event = event.trim();
                    event = event.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
                } else {
                    event = '' + event.target.value;
                    event = event.trim();
                    event = parseFloat(event.replace(/,/g, '')).toFixed(2); // ganti jadi 6 kalo mau pct
                    event = event.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
                }
            } else {
                event = '' + event.target.value;
                event = event.trim();
                event = parseFloat(event).toFixed(0); // ganti jadi 6 kalo mau pct
                event = event.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
            }
        } else {
            event = '' + event.target.value;
            event = event.trim();
            event = parseFloat(event).toFixed(6);
        }

        if (event === 'NaN') {
            event = 0;
            event = parseFloat(event).toFixed(0);
        }

        if (type === 'amount') {
            $('#estimate' + i)
                .map(function () { return $(this).val(event); }).get();
        } else {
            $('#estimate' + i)
                .map(function () { return $(this).val(event); }).get();
        }
    }
    //#endregion onBlur

    //#region getrow data
    callGetrow() {

        this.dataTamp = [{
            'p_code': this.param
        }];
        this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    const parsedata = this.getrowNgb(parse.data[0]);

                    this.agreementno = parsedata.agreement_no;

                    if (parsedata.status !== 'HOLD') {
                        this.isButton = true;
                    } else {
                        this.isButton = false;
                    }
                    if (parsedata.replacement === '0') {
                        this.isReplacement = true;
                    } else {
                        this.isReplacement = false;
                    }

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

    //#region load all data
    loadData() {
        this.dtOptions = {
            pagingType: 'first_last_numbers',
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
                    'p_replacement_code': this.param,
                })

                // tslint:disable-next-line:max-line-length
                this.dalservice.Getrows(dtParameters, this.APIControllerAssetReplacementDetail, this.APIRouteForGetRows).subscribe(resp => {
                    const parseassetdetail = JSON.parse(resp);

                    for (let i = 0; i < parseassetdetail.data.length; i++) {
                        // checkbox
                        if (parseassetdetail.data[i].new_fa_code != '') {
                            this.isDataAsset = true;
                        } else {
                            this.isDataAsset = false;
                        }
                        // end checkbox

                        this.listassetdetail = parseassetdetail.data;
                    }

                    this.listassetdetail = parseassetdetail.data;

                    if (parseassetdetail.data != null) {
                        this.listassetdetail.numberIndex = dtParameters.start;
                    }

                    if (parseassetdetail.data.length == 0) {
                        this.isData = false
                    } else {
                        this.isData = true
                    }



                    // if use checkAll use this
                    $('#checkall').prop('checked', false);
                    // end checkall

                    callback({
                        draw: parseassetdetail.draw,
                        recordsTotal: parseassetdetail.recordsTotal,
                        recordsFiltered: parseassetdetail.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1] }], // for disabled coloumn
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
    onFormSubmit(assetreplacementmaindetailForm: NgForm, isValid: boolean) {
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

        this.uncrosscollateraldetailData = this.JSToNumberFloats(assetreplacementmaindetailForm);
        const usersJson: any[] = Array.of(this.uncrosscollateraldetailData);
        if (this.param !== null) {
            // call web service
            this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
                .subscribe(
                    res => {
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {

                            this.showSpinner = false;
                            this.showNotification('bottom', 'right', 'success');
                            this.callGetrow();
                            this.loadData();
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
            console.log('usersJson', usersJson)
            // call web service
            this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
                .subscribe(
                    res => {
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            this.showSpinner = false;
                            this.callGetrow();
                            this.showNotification('bottom', 'right', 'success');
                            this.route.navigate(['maintenance/subassetreplacementmainlist/assetreplacementmaindetail', parse.code]);
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

    //#region button Proceed
    btnProceed() {
        // param tambahan untuk button Proceed dynamic
        this.dataTamps = [{
            'p_code': this.param,
            'action': ''
        }];

        // param tambahan untuk button Proceed dynamic

        swal({
            title: 'Are you sure?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            confirmButtonText: this._deleteconf,

            buttonsStyling: false
        }).then((result) => {
            this.showSpinner = true;
            if (result.value) {
                // call web service
                this.dalservice.ExecSp(this.dataTamps, this.APIController, this.APIRouteForProceed)
                    .subscribe(
                        res => {
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showSpinner = false;
                                this.showNotification('bottom', 'right', 'success');
                                this.callGetrow();
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
            } else {
                this.showSpinner = false;
            }
        });
    }
    //#endregion button Proceed

    //#region button Approve
    // btnApprove() {
    //     this.dataTamps = [{
    //         'p_code': this.param,
    //         'action': ''
    //     }];

    //     swal({
    //         title: 'Are you sure?',
    //         type: 'warning',
    //         showCancelButton: true,
    //         confirmButtonClass: 'btn btn-success',
    //         cancelButtonClass: 'btn btn-danger',
    //         confirmButtonText: this._deleteconf,

    //         buttonsStyling: false
    //     }).then((result) => {
    //         this.showSpinner = true;
    //         if (result.value) {
    //             // call web service
    //             this.dalservice.ExecSp(this.dataTamps, this.APIController, this.APIRouteForPost)
    //                 .subscribe(
    //                     res => {
    //                         const parse = JSON.parse(res);
    //                         if (parse.result === 1) {
    //                             this.showSpinner = false;
    //                             this.showNotification('bottom', 'right', 'success');
    //                             this.callGetrow();
    //                         } else {
    //                             this.showSpinner = false;
    //                             this.swalPopUpMsg(parse.data);
    //                         }
    //                     },
    //                     error => {
    //                         this.showSpinner = false;
    //                         const parse = JSON.parse(error);
    //                         this.swalPopUpMsg(parse.data);
    //                     });
    //         } else {
    //             this.showSpinner = false;
    //         }
    //     });
    // }
    //#endregion button Approve

    //#region button Post
    btnPost(code: string) {
        // param tambahan untuk getrole dynamic
        this.dataTamps = [{
            'p_code': code,
        }];
        // param tambahan untuk getrole dynamic

        // call web service
        swal({
            title: 'Are you sure?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            confirmButtonText: this._deleteconf,
            buttonsStyling: false
        }).then((result) => {
            if (result.value) {
                this.dalservice.ExecSp(this.dataTamps, this.APIController, this.APIRouteForPost)
                    .subscribe(
                        res => {
                            this.showSpinner = false;
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success');
                                this.callGetrow();
                            } else {
                                this.swalPopUpMsg(parse.data);
                            }
                        },
                        error => {
                            this.showSpinner = false;
                            const parse = JSON.parse(error);
                            this.swalPopUpMsg(parse.data);
                        });
            } else {
                this.showSpinner = false;
            }
        })
    }
    //#endregion button Post

    //#region button Post
    btnReturnAsset(code: string) {
        // param tambahan untuk getrole dynamic
        this.dataTamps = [{
            'p_code': code,
            'p_branch_code': this.model.branch_code,
            'p_branch_name': this.model.branch_name
        }];

        // param tambahan untuk getrole dynamic

        // call web service
        swal({
            title: 'Are you sure?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            confirmButtonText: this._deleteconf,
            buttonsStyling: false
        }).then((result) => {
            if (result.value) {
                this.dalservice.ExecSp(this.dataTamps, this.APIController, this.APIRouteForReturnAsset)
                    .subscribe(
                        res => {
                            this.showSpinner = false;
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success');
                                this.callGetrow();
                            } else {
                                this.swalPopUpMsg(parse.data);
                            }
                        },
                        error => {
                            this.showSpinner = false;
                            const parse = JSON.parse(error);
                            this.swalPopUpMsg(parse.data);
                        });
            } else {
                this.showSpinner = false;
            }
        })
    }
    //#endregion button Post

    //#region button btnReturn
    btnReturn() {
        this.dataTamps = [{
            'p_code': this.param,
            'action': ''
        }];

        swal({
            title: 'Are you sure?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            confirmButtonText: this._deleteconf,

            buttonsStyling: false
        }).then((result) => {
            this.showSpinner = true;
            if (result.value) {
                // call web service
                this.dalservice.ExecSp(this.dataTamps, this.APIController, this.APIRouteForReturn)
                    .subscribe(
                        res => {
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showSpinner = false;
                                this.showNotification('bottom', 'right', 'success');
                                this.callGetrow();
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
            } else {
                this.showSpinner = false;
            }
        });
    }
    //#endregion button btnReturn

    //#region button Cancel
    btnCancel() {
        // param tambahan untuk getrole dynamic
        this.dataTamps = [{
            'p_code': this.param,
            'action': ''
        }];
        // param tambahan untuk getrole dynamic

        // call web service
        swal({
            title: 'Are you sure?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            confirmButtonText: this._deleteconf,

            buttonsStyling: false
        }).then((result) => {
            if (result.value) {
                this.dalservice.ExecSp(this.dataTamps, this.APIController, this.APIRouteForCancel)
                    .subscribe(
                        res => {
                            this.showSpinner = false;
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success');
                                this.callGetrow();
                            } else {
                                this.swalPopUpMsg(parse.data);
                            }
                        },
                        error => {
                            this.showSpinner = false;
                            const parse = JSON.parse(error);
                            this.swalPopUpMsg(parse.data);
                        });
            } else {
                this.showSpinner = false;
            }
        });
    }
    //#endregion button Cancel

    //#region List button back
    btnBack() {
        this.route.navigate(['/maintenance/subassetreplacementmainlist']);
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion List button back

    //#region Branch Lookup
    btnLookupBranch() {
        $('#datatableLookupBranch').DataTable().clear().destroy();
        $('#datatableLookupBranch').DataTable({
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
                    this.lookupbranch = parse.data;
                    if (parse.data != null) {
                        this.lookupbranch.numberIndex = dtParameters.start;
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

    btnSelectRowBranch(branch_code: String, branch_desc: string) {
        this.model.branch_code = branch_code;
        this.model.branch_name = branch_desc;
        this.model.agreement_no = undefined;
        this.model.client_name = undefined;
        $('#lookupModalBranch').modal('hide');
    }
    //#endregion branch getrole

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
                    'p_branch_code': this.model.branch_code
                });

                this.dalservice.Getrows(dtParameters, this.APIControllerAgreementMain, this.APIRouteForLookup).subscribe(resp => {
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

    btnSelectRowAgreement(agreement_no: String, agreement_desc: string, agreement_external_no: string) {
        this.model.agreement_no = agreement_no;
        this.model.agreement_external_no = agreement_external_no;
        this.model.client_name = agreement_desc;
        $('#lookupModalAgreement').modal('hide');
    }
    //#endregion Agreement lookup

    //#region button save list
    btnSaveList() {
        // this.showSpinner = true;
        this.listassetreplacementdetailData = [];

        let i = 0;
        const getID = $('[name="p_id_detail"]').map(function () { return $(this).val(); }).get();
        const getEstimate = $('[name="p_estimate_return_date"]').map(function () { return $(this).val(); }).get();
        const getRemark = $('[name="p_remarks"]').map(function () { return $(this).val(); }).get();
        const getDeliveryAddress = $('[name="p_delivery_address"]').map(function () { return $(this).val(); }).get();
        const getContactName = $('[name="p_contact_name"]').map(function () { return $(this).val(); }).get();
        const getContactPhoneNo = $('[name="p_contact_phone_no"]').map(function () { return $(this).val(); }).get();

        console.log(getRemark
            , getDeliveryAddress
            , getContactName
            , getContactPhoneNo);
            
        while (i < getID.length) {
            const estimateDate = getEstimate[i] !== "" ? this.dateFormatList(getEstimate[i]) : null;
            this.listassetreplacementdetailData.push(
                this.JSToNumberFloats({
                    p_id: getID[i],
                    p_estimate_return_date: estimateDate,
                    p_delivery_address: getDeliveryAddress[i],
                    p_contact_name: getContactName[i],
                    p_contact_phone_no: getContactPhoneNo[i],
                    p_remark: getRemark[i]
                })
            );

            i++;
        }


        //#region web service
        this.dalservice.Update(this.listassetreplacementdetailData, this.APIControllerAssetReplacementDetail, this.APIRouteForUpdate)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);

                    if (parse.result === 1) {
                        this.showNotification('bottom', 'right', 'success');
                        $('#datatableAssetDetail').DataTable().ajax.reload();
                    } else {
                        this.swalPopUpMsg(parse.data);
                    }
                },
                error => {
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data);
                });
        //#endregion web service
    }
    //#endregion button save list

    //#region new asset Lookup
    btnLookupNewAsset(id: any, asset_type_code: any, asset_no: any) {
        this.tempAssetNo = asset_no;
        $('#datatableLookupNewAsset').DataTable().clear().destroy();
        $('#datatableLookupNewAsset').DataTable({
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
                    'p_asset_status': 'REPLACEMENT'
                });

                this.dalservice.GetrowsAms(dtParameters, this.APIControllerLookupNewAsset, this.APIRouteForLookupAssetReplcement).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupNewAsset = parse.data;

                    if (parse.data != null) {
                        this.lookupNewAsset.numberIndex = dtParameters.start;
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

        this.idAssetDetail = id;
    }

    btnSelectRowNewAsset(code: String, item_name: String, plat_no: String, chassis_no: String, engine_no: String) {

        let tempFixedAsset = [];
        tempFixedAsset = [{
            'p_code': code,
            'p_rental_reff_no': this.tempAssetNo,
            'p_rental_status': 'RESERVED'
        }];

        this.listassetdetailData = [];

        var i = 0;

        var getID = $('[name="p_id_detail"]')
            .map(function () { return $(this).val(); }).get();

        while (i < getID.length) {

            if (getID[i] == this.idAssetDetail) {

                this.listassetdetailData.push({
                    p_id: getID[i],
                    p_new_fa_code: code,
                    p_new_fa_name: item_name,
                    p_new_fa_ref_no_01: plat_no,
                    p_new_fa_ref_no_02: chassis_no,
                    p_new_fa_ref_no_03: engine_no,
                });
            }
            i++;
        }
        this.dalservice.UpdateAms(tempFixedAsset, this.APIControllerLookupNewAsset, this.APIRouteForUpdateRentalStatus)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                        //#region web service
                        this.dalservice.Update(this.listassetdetailData, this.APIControllerAssetReplacementDetail, this.APIRouteForUpdateNewAsset)
                            .subscribe(
                                res => {
                                    const parse = JSON.parse(res);
                                    if (parse.result === 1) {
                                        $('#datatableAssetDetail').DataTable().ajax.reload();
                                    } else {
                                        this.swalPopUpMsg(parse.data);
                                    }
                                },
                                error => {
                                    const parse = JSON.parse(error);
                                    this.swalPopUpMsg(parse.data);
                                });
                        this.tempAssetNo = undefined;
                        $('#lookupModalNewAsset').modal('hide');
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
        //#endregion web service
        $('#lookupModalNewAsset').modal('hide');
    }
    //#endregion new asset Lookup

    //#region button Update replacement type
    changeReplacementType(id: String, replacementtype: any) {

        this.dataTamp = [{
            'p_id': id,
            'p_replacement_type': replacementtype.target.value
        }];


        // call web service
        this.dalservice.Update(this.dataTamp, this.APIControllerAssetReplacementDetail, this.APIRouteForUpdateReplacementType)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);

                    if (parse.result === 1) {

                        if (replacementtype.target.value === 'TEMPORARY') {
                            this.isDate = true
                        }
                        else {
                            this.isDate = false
                        }
                        $('#datatableAssetDetail').DataTable().ajax.reload();
                    } else {

                        this.swalPopUpMsg(parse.data);
                    }
                },
                error => {
                    this.showSpinner = false;
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data);
                });
    }
    //#endregion button Update Replacement Type

    //#region btnLookupReason
    btnLookupReason(id: any) {
        // this.callGetrow();
        $('#datatableLookupReason').DataTable().clear().destroy();
        $('#datatableLookupReason').DataTable({
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
                    'p_general_code': 'RPLRS'
                });
                this.dalservice.Getrows(dtParameters, this.APIControllerSysGeneralSubcode, this.APIRouteForLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupReason = parse.data;
                    if (parse.data != null) {
                        this.lookupReason.numberIndex = dtParameters.start;
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
        this.idAssetDetail = id;
    }

    btnSelectRowReason(code: String) {

        this.listassetdetailData = [];

        var i = 0;

        var getID = $('[name="p_id_detail"]')
            .map(function () { return $(this).val(); }).get();

        while (i < getID.length) {

            if (getID[i] == this.idAssetDetail) {

                this.listassetdetailData.push({
                    p_id: getID[i],
                    p_reason_code: code
                });

            }
            i++;
        }

        //#region web service
        this.dalservice.Update(this.listassetdetailData, this.APIControllerAssetReplacementDetail, this.APIRouteForUpdateReason)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                        $('#datatableAssetDetail').DataTable().ajax.reload();
                    } else {
                        this.swalPopUpMsg(parse.data);
                    }
                },
                error => {
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data);
                });
        //#endregion web service
        $('#lookupModalReason').modal('hide');
    }
    //#endregion btnLookupReason

    //#region lookup AssetMultiple
    btnLookupAssetMultiple() {
        $('#datatableLookupAssetMultiple').DataTable().clear().destroy();
        $('#datatableLookupAssetMultiple').DataTable({
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
                    'p_agreement_no': this.agreementno,
                    'p_replacement_code': this.param
                    // 'p_array_data': JSON.stringify(parse.data)
                });

                this.dalservice.Getrows(dtParameters, this.APIControllerAgreementAsset, this.APIRouteForLookuptReplacementDetail).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupAssetMultiple = parse.data;
                    if (parse.data != null) {
                        this.lookupAssetMultiple.numberIndex = dtParameters.start;
                    }

                    // if use checkAll use this
                    $('#checkallLookup').prop('checked', false);
                    // end checkall

                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 4] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }
    //#endregion lookup AssetMultiple

    //#region btnSelectRowOldAsset
    btnSelectRowOldAsset(asset_no: String) {

        this.dataTamp = [{
            'p_replacement_code': this.param,
            'p_old_asset_no': asset_no
        }];

        this.dalservice.Insert(this.dataTamp, this.APIControllerAssetReplacementDetail, this.APIRouteForInsert)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);

                    if (parse.result === 1) {
                        this.showSpinner = false;
                        this.showNotification('bottom', 'right', 'success');
                        $('#datatableAssetDetail').DataTable().ajax.reload();
                        $('#datatableLookupAssetMultiple').DataTable().ajax.reload(null, false);
                    } else {
                        this.isBreak = true;
                        this.showSpinner = false;
                        $('#datatableAssetDetail').DataTable().ajax.reload();
                        $('#datatableLookupAssetMultiple').DataTable().ajax.reload(null, false);
                        this.swalPopUpMsg(parse.data);
                    }
                },
                error => {
                    this.isBreak = true;
                    this.showSpinner = false;
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data);
                });

    }
    //#endregion btnSelectRowOldAsset

    //#region btnSelectAllLookup()
    btnSelectAllLookup() {
        this.checkedLookup = [];
        for (let i = 0; i < this.lookupAssetMultiple.length; i++) {
            if (this.lookupAssetMultiple[i].selectedLookup) {
                this.checkedLookup.push(this.lookupAssetMultiple[i].asset_no);
            }
        }

        // jika tidak di checklist
        if (this.checkedLookup.length === 0) {
            swal({
                title: this._listdialogconf,
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-danger'
            }).catch(swal.noop)
            return
        } else {
            this.showSpinner = true;
        }

        this.dataTamp = [];
        for (let J = 0; J < this.checkedLookup.length; J++) {
            const codeData = this.checkedLookup[J];

            this.dataTamp = [{
                'p_replacement_code': this.param,
                'p_old_asset_no': codeData
            }];


            this.dalservice.Insert(this.dataTamp, this.APIControllerAssetReplacementDetail, this.APIRouteForInsert)
                .subscribe(
                    res => {
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            if (J + 1 === this.checkedLookup.length) {
                                this.showSpinner = false;
                                this.showNotification('bottom', 'right', 'success');
                                $('#datatableAssetDetail').DataTable().ajax.reload();
                                $('#datatableLookupAssetMultiple').DataTable().ajax.reload(null, false);
                            }
                        } else {
                            this.isBreak = true;
                            this.showSpinner = false;
                            $('#datatableAssetDetail').DataTable().ajax.reload();
                            $('#datatableLookupAssetMultiple').DataTable().ajax.reload(null, false);
                            this.swalPopUpMsg(parse.data);
                        }
                    },
                    error => {
                        this.isBreak = true;
                        this.showSpinner = false;
                        const parse = JSON.parse(error);
                        this.swalPopUpMsg(parse.data);

                    })
        }
        this.showSpinner = true;
    }

    selectAllLookup() {
        for (let i = 0; i < this.lookupAssetMultiple.length; i++) {
            this.lookupAssetMultiple[i].selectedLookup = this.selectedAllLookup;
        }
    }

    checkIfAllLookupSelected() {
        this.selectedAllLookup = this.lookupAssetMultiple.every(function (item: any) {
            return item.selectedLookup === true;
        })
    }
    //#endregion btnSelectAllLookup()

    //#region btnDeleteAll()
    btnDeleteAll() {
        this.isBreak = false;
        this.checkedList = [];
        for (let i = 0; i < this.listassetdetail.length; i++) {
            if (this.listassetdetail[i].selected) {
                this.checkedList.push(this.listassetdetail[i].id);
            }
        }

        // jika tidak di checklist
        if (this.checkedList.length === 0) {
            swal({
                title: this._listdialogconf,
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-danger'
            }).catch(swal.noop)
            return
        }

        swal({
            title: 'Are you sure?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            confirmButtonText: this._deleteconf,
            buttonsStyling: false
        }).then((result) => {
            this.showSpinner = true;
            if (result.value) {
                this.dataTamp = [];
                for (let J = 0; J < this.checkedList.length; J += 1) {
                    const codeData = this.checkedList[J];

                    this.dataTamp = [{
                        'p_id': codeData,
                    }];


                    this.dalservice.Delete(this.dataTamp, this.APIControllerAssetReplacementDetail, this.APIRouteForDelete)
                        .subscribe(
                            res => {
                                const parse = JSON.parse(res);
                                if (parse.result === 1) {
                                    if (J + 1 === this.checkedList.length) {
                                        this.showSpinner = false;
                                        $('#datatableAssetDetail').DataTable().ajax.reload();
                                        this.showNotification('bottom', 'right', 'success');
                                    }
                                } else {
                                    this.isBreak = true;
                                    this.showSpinner = false;
                                    $('#datatableAssetDetail').DataTable().ajax.reload();
                                    this.swalPopUpMsg(parse.data);
                                }
                            },
                            error => {
                                this.isBreak = true;
                                this.showSpinner = false;
                                const parse = JSON.parse(error);
                                this.swalPopUpMsg(parse.data);
                            });
                    if (this.isBreak) {
                        break;
                    }
                }
            } else {
                this.showSpinner = false;
            }
        });
    }

    selectAll() {
        for (let i = 0; i < this.listassetdetail.length; i++) {
            this.listassetdetail[i].selected = this.selectedAll;
        }
    }

    checkIfAllTableSelected() {
        this.selectedAll = this.listassetdetail.every(function (item: any) {
            return item.selected === true;
        })
    }
    //#endregion btnDeleteAll()

    //#region getrow data
    //  callGetDataAsset() {

    //     this.dataTamp = [{
    //         'action': 'getResponse'
    //     }];
    //     this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForGetDataAsset)
    //         .subscribe(
    //             res => {
    //                 const parse = JSON.parse(res);
    //                 const parsedata = this.getrowNgb(parse.data[0]);
    //                     this.newfacode = parsedata.new_fa_code;

    //                 this.showSpinner = false;
    //             },
    //             error => {
    //                 console.log('There was an error while Retrieving Data(API) !!!' + error);
    //             });
    // }
    //#endregion getrow data

    //#region  btnClearFixedAsset
    btnClearFixedAsset(assetNo: String, fa_code: String) {
        let tempFixedAsset = [];
        tempFixedAsset = [{
            'p_code': fa_code
        }]

        this.listassetdetailData = [];

        var i = 0;

        var getID = $('[name="p_id_detail"]')
            .map(function () { return $(this).val(); }).get();

        while (i < getID.length) {

            this.listassetdetailData.push({
                p_id: getID[i],
                p_new_fa_code: '',
                p_new_fa_name: ''
            });
            i++;
        }

        this.dalservice.UpdateAms(tempFixedAsset, this.APIControllerLookupNewAsset, this.APIRouteForUpdateRentalStatus)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                        // call web service
                        this.dalservice.Update(this.listassetdetailData, this.APIControllerAssetReplacementDetail, this.APIRouteForUpdateNewAsset)
                            .subscribe(
                                res => {
                                    const parse = JSON.parse(res);
                                    if (parse.result === 1) {
                                        this.showSpinner = false;
                                        $('#datatableAssetDetail').DataTable().ajax.reload();
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
        $('#lookupModalNewAsset').modal('hide');
    }
    //#endregion  btnClearFixedAsset
}
