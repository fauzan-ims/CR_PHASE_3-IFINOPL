import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { DatePipe } from '@angular/common';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './chargeswaivedetail.component.html'
})

export class ChargeswaivedetailComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');

    // variable
    public NumberOnlyPattern = this._numberonlyformat;
    public chargeswaivedData: any = [];
    public listwaivedetail: any = [];
    public listwaivedetaildata: any = [];
    public lookupbranch: any = [];
    public lookupagreement: any = [];
    public lookupapproval: any = [];
    public lookupagreementobligation: any = [];
    public isReadOnly: Boolean = false;
    public isButton: Boolean = false;
    private dataTamps: any = [];
    private dataTamp: any = [];
    private setStyle: any = [];

    private APIController: String = 'WaivedObligation';
    private APIControllerAgreementObligation: String = 'AgreementObligation';
    private APIControllerWaivedObligationDetail: String = 'WaivedObligationDetail';
    private APIControllerAgreementMain: String = 'AgreementMain';
    private APIControllerSysBranch: String = 'SysBranch';
    private APIControllerApprovalSchedule: String = 'ApprovalSchedule';
    private APIRouteForLookup: String = 'GetRowsForLookup';
    private APIRouteForLookupAgreementObligation: String = 'GetRowsForLookupObligation';

    private APIRouteForGetRows: String = 'GetRows';
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForUpdate: String = 'Update';
    private APIRouteForInsert: String = 'Insert';
    private APIRouteForDelete: String = 'Delete';
    private APIRouteForProceed: String = 'ExecSpForGetProceed';
    private APIRouteForApprove: String = 'ExecSpForGetApprove';
    private APIRouteForCancel: String = 'ExecSpForGetCancel';
    private APIRouteForRevert: String = 'ExecSpForGetRevert';

    // report
    private APIControllerReport: String = 'Report';
    private APIRouteForDownloadReport: String = 'getReport';

    private RoleAccessCode = 'R00022310000000A';

    // checklist
    public selectedAllLookup: any;
    public selectedAllTable: any;
    private checkedLookup: any = [];
    private checkedList: any = [];

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
        private _elementRef: ElementRef, private datePipe: DatePipe
    ) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        if (this.param != null) {
            this.isReadOnly = true;

            // call web service
            this.callGetrow();
            this.loadData();
            this.showSpinner = false;
        } else {
            this.model.waived_status = 'HOLD';
            this.showSpinner = false;
        }
    }

    //#region  set datepicker
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
    //#endregion  set datepicker

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

                    if (parsedata.waived_status !== 'HOLD') {
                        this.isButton = true;
                    } else {
                        this.isButton = false;
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
                    'p_waived_obligation_code': this.param,
                })


                // tslint:disable-next-line:max-line-length
                this.dalservice.Getrows(dtParameters, this.APIControllerWaivedObligationDetail, this.APIRouteForGetRows).subscribe(resp => {
                    const parse = JSON.parse(resp)
                    this.listwaivedetail = parse.data;

                    if (parse.data != null) {
                        this.listwaivedetail.numberIndex = dtParameters.start;
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

    //#region form submit
    onFormSubmit(chargeswaivedForm: NgForm, isValid: boolean) {

        // validation form submit
        if (!isValid) {
            swal({
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

        //this.chargeswaivedData = chargeswaivedForm;
        this.chargeswaivedData = this.JSToNumberFloats(chargeswaivedForm);

        this.chargeswaivedData.p_obligation_amount = 0;
        this.chargeswaivedData.p_waived_amount = 0;

        const usersJson: any[] = Array.of(this.chargeswaivedData);
        if (this.param != null) {
            // call web service
            this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
                .subscribe(
                    res => {
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            this.showNotification('bottom', 'right', 'success');
                            this.callGetrow()
                            this.showSpinner = false;
                        } else {
                            this.swalPopUpMsg(parse.data);
                            this.showSpinner = false;
                        }
                    },
                    error => {
                        this.showSpinner = false;
                        const parse = JSON.parse(error);
                        this.swalPopUpMsg(parse.data);
                    });
        } else {
            // call web service
            this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
                .subscribe(
                    res => {
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            this.showNotification('bottom', 'right', 'success')
                            this.route.navigate(['/management/subchargeswaivelist/chargeswaivedetail', parse.code]);
                            this.showSpinner = false;
                        } else {
                            this.swalPopUpMsg(parse.data)
                            this.showSpinner = false;
                        }
                    },
                    error => {
                        this.showSpinner = false;
                        const parse = JSON.parse(error);
                        this.swalPopUpMsg(parse.data);
                    });
        }
    }
    //#endregion form submit

    //#region List button back
    btnBack() {
        this.route.navigate(['/management/subchargeswaivelist']);
        $('#datatableChargesWaive').DataTable().ajax.reload();
    }
    //#endregion List button back

    //#region button Proceed
    btnProceed() {

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
    btnApprove() {

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
                this.dalservice.ExecSp(this.dataTamps, this.APIController, this.APIRouteForApprove)
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
    //#endregion button Approve

    //#region btnRevert
    btnRevert() {

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
                this.dalservice.ExecSp(this.dataTamps, this.APIController, this.APIRouteForRevert)
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
    //#endregion button btnRevert

    //#region btnCancel
    btnCancel() {

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
                this.dalservice.ExecSp(this.dataTamps, this.APIController, this.APIRouteForCancel)
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
    //#endregion btnCancel

    //#region button save list
    btnSaveList() {

        this.listwaivedetaildata = [];

        var i = 0;

        var getID = $('[name="p_id"]')
            .map(function () { return $(this).val(); }).get();

        var getAmount = $('[name="p_waived_amount_detail"]')
            .map(function () { return $(this).val(); }).get();


        while (i < getID.length) {

            while (i < getAmount.length) {

                this.listwaivedetaildata.push(
                    this.JSToNumberFloats({
                        p_id: getID[i],
                        p_waived_obligation_code: this.param,
                        p_waived_amount: getAmount[i],
                    })
                );
                i++;
            }

            i++;
        }

        //#region web service

        this.dalservice.Update(this.listwaivedetaildata, this.APIControllerWaivedObligationDetail, this.APIRouteForUpdate)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);

                    if (parse.result === 1) {
                        this.showNotification('bottom', 'right', 'success');
                        $('#datatableChargesWaiveDetail').DataTable().ajax.reload();
                        this.callGetrow();
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

    //#region onBlur
    onBlur(event, i, type) {
        if (type === 'amount') {
            event = '' + event.target.value;
            event = event.trim();
            event = parseFloat(event).toFixed(2); // ganti jadi 6 kalo mau pct
            event = event.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
        } else {
            event = '' + event.target.value;
            event = event.trim();
            event = parseFloat(event).toFixed(6);
        }

        if (event === 'NaN') {
            event = 0;
            event = parseFloat(event).toFixed(2);
        }

        if (type === 'amount') {
            $('#waived_amount_detail' + i)
                .map(function () { return $(this).val(event); }).get();
        } else {
            $('#waived_amount_detail' + i)
                .map(function () { return $(this).val(event); }).get();
        }
    }
    //#endregion onBlur

    //#region onFocus
    onFocus(event, i, type) {
        event = '' + event.target.value;

        if (event != null) {
            event = event.replace(/[ ]*,[ ]*|[ ]+/g, '');
        }

        if (type === 'amount') {
            $('#waived_amount_detail' + i)
                .map(function () { return $(this).val(event); }).get();
        } else {
            $('#waived_amount_detail' + i)
                .map(function () { return $(this).val(event); }).get();
        }
    }
    //#endregion onFocus
    //#endregion button save list

    //#region lookup branch
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
        // } , 1000);
    }

    btnSelectRowBranch(branch_code: String, branch_name: String) {
        this.model.branch_code = branch_code;
        this.model.branch_name = branch_name;
        this.model.agreement_no = '';
        this.model.agreement_external_no = '';
        this.model.client_name = '';
        $('#lookupModalBranch').modal('hide');
    }
    //#endregion lookup branch

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
                    'p_branch_code': this.model.branch_code,
                    'p_agreement_status': 'GO LIVE'
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

    btnSelectRowAgreement(agreement_no: String, agreement_external_no: String, agreement_desc: string) {
        this.model.agreement_no = agreement_no;
        this.model.agreement_external_no = agreement_external_no;
        this.model.client_name = agreement_desc;
        $('#lookupModalAgreement').modal('hide');
    }
    //#endregion Agreement lookup

    //#region lookup AgreementObligation
    btnLookupAgreementObligation() {
        this.loadData();
        $('#datatableLookupAgreementObligation').DataTable().clear().destroy();
        $('#datatableLookupAgreementObligation').DataTable({
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
                    'p_agreement_no': this.model.agreement_no,
                    'p_waived_obligation_code': this.param
                });

                this.dalservice.Getrows(dtParameters, this.APIControllerAgreementObligation, this.APIRouteForLookupAgreementObligation).subscribe(resp => {
                    const parse = JSON.parse(resp);

                    // if use checkAll use this
                    $('#checkallLookup').prop('checked', false);
                    // end checkall

                    this.lookupagreementobligation = parse.data;
                    if (parse.data != null) {
                        this.lookupagreementobligation.numberIndex = dtParameters.start;
                    }
                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
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
        });
    }
    //#endregion lookup notification

    //#region btnPrint
    btnPrint(p_code: string) {
        this.showSpinner = true;

        const rptParam = {
            p_user_id: this.userId,
            p_waive_no: p_code,
            p_print_option: 'PDF'
        }

        const dataParam = {
            TableName: this.model.table_name,
            SpName: this.model.sp_name,
            reportparameters: rptParam
        };

        this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownloadReport).subscribe(res => {
            this.showSpinner = false;
            this.printRptNonCore(res);
        }, err => {
            this.showSpinner = false;
            const parse = JSON.parse(err);
            this.swalPopUpMsg(parse.data);
        });
    }
    //#endregion btnPrint
    
    //#region btnSelectAllLookup
    btnSelectAllLookup() {
        this.checkedLookup = [];
        for (let i = 0; i < this.lookupagreementobligation.length; i++) {
            if (this.lookupagreementobligation[i].selectedLookup) {
                this.checkedLookup.push({
                    'installment_no': this.lookupagreementobligation[i].installment_no,
                    'obligation_type': this.lookupagreementobligation[i].obligation_type,
                    'obligation_name': this.lookupagreementobligation[i].obligation_name,
                    'invoice_no': this.lookupagreementobligation[i].invoice_no,
                    'obligation_amount': this.lookupagreementobligation[i].obligation_amount
                });
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
        let th = this;
        var J = 0;
        (function loopAddChargesWaiveDetail() {
            if (J < th.checkedLookup.length) {
                th.dataTamp = [{
                    'p_waived_obligation_code': th.param,
                    'p_obligation_type': th.checkedLookup[J].obligation_type,
                    'p_obligation_name': th.checkedLookup[J].obligation_name,
                    'p_obligation_amount': th.checkedLookup[J].obligation_amount,
                    'p_installment_no': th.checkedLookup[J].installment_no,
                    'p_invoice_no': th.checkedLookup[J].invoice_no,
                    'p_waived_amount': 0
                }];

                th.dalservice.Insert(th.dataTamp, th.APIControllerWaivedObligationDetail, th.APIRouteForInsert)
                    .subscribe(
                        res => {
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                if (th.checkedLookup.length == J + 1) {
                                    th.showSpinner = false;
                                    th.showNotification('bottom', 'right', 'success');
                                    $('#datatableChargesWaiveDetail').DataTable().ajax.reload();
                                    $('#datatableLookupAgreementObligation').DataTable().ajax.reload(null, false);
                                    th.callGetrow();
                                } else {
                                    J++;
                                    loopAddChargesWaiveDetail();
                                }
                            } else {
                                th.showSpinner = false;
                                th.swalPopUpMsg(parse.data);
                            }
                        },
                        error => {
                            th.showSpinner = false;
                            const parse = JSON.parse(error);
                            th.swalPopUpMsg(parse.data);
                        });
            }
        })();
    }

    selectAllLookup() {
        for (let i = 0; i < this.lookupagreementobligation.length; i++) {
            this.lookupagreementobligation[i].selectedLookup = this.selectedAllLookup;
        }
    }

    checkIfAllLookupSelected() {
        this.selectedAllLookup = this.lookupagreementobligation.every(function (item: any) {
            return item.selectedLookup === true;
        })
    }
    //#endregion btnSelectAllLookup

    //#region btnDeleteAll
    btnDeleteAll() {
        this.checkedList = [];
        for (let i = 0; i < this.listwaivedetail.length; i++) {
            if (this.listwaivedetail[i].selectedTable) {
                this.checkedList.push(this.listwaivedetail[i].id);
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
                let th = this;
                var J = 0;
                (function loopDeleteChargesWaiveDetail() {
                    if (J < th.checkedList.length) {
                        th.dataTamp = [{
                            'p_id': th.checkedList[J]
                        }];

                        th.dalservice.Delete(th.dataTamp, th.APIControllerWaivedObligationDetail, th.APIRouteForDelete)
                            .subscribe(
                                res => {
                                    const parse = JSON.parse(res);
                                    if (parse.result === 1) {
                                        if (th.checkedList.length === J + 1) {
                                            th.showNotification('bottom', 'right', 'success');
                                            th.showSpinner = false;
                                            $('#datatableChargesWaiveDetail').DataTable().ajax.reload();
                                            th.callGetrow();
                                        } else {
                                            J++;
                                            loopDeleteChargesWaiveDetail();
                                        }
                                    } else {
                                        th.showSpinner = false;
                                        th.swalPopUpMsg(parse.data);
                                    }
                                },
                                error => {
                                    const parse = JSON.parse(error);
                                    th.showSpinner = false;
                                    th.swalPopUpMsg(parse.data);
                                });
                    }
                })();

            } else {
                this.showSpinner = false;
            }
        });
    }

    selectAllTable() {
        for (let i = 0; i < this.listwaivedetail.length; i++) {
            this.listwaivedetail[i].selectedTable = this.selectedAllTable;
        }
    }

    checkIfAllTableSelected() {
        this.selectedAllTable = this.listwaivedetail.every(function (item: any) {
            return item.selectedTable === true;
        })
    }
    //#endregion btnDeleteAll

    //#region approval Lookup
    btnViewApproval() {
        $('#datatableLookupApproval').DataTable().clear().destroy();
        $('#datatableLookupApproval').DataTable({
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
                    'p_reff_no': this.param
                });


                this.dalservice.GetrowsApv(dtParameters, this.APIControllerApprovalSchedule, this.APIRouteForLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupapproval = parse.data;
                    if (parse.data != null) {
                        this.lookupapproval.numberIndex = dtParameters.start;
                    }

                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
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
        });
    }
    //#endregion approval Lookup
}
