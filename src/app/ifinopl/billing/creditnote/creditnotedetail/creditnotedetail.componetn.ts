import { Component, OnInit, OnChanges, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
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
    templateUrl: './creditnotedetail.component.html'
})

export class CreditNotedetailComponent extends BaseComponent implements OnInit {
    // get param from url
    creditnotecode = this.getRouteparam.snapshot.paramMap.get('creditnotecode');

    // variable
    public NumberOnlyPattern = this._numberonlyformat;
    public listinvoicedetail: any = [];
    public isReadOnly: Boolean = false;
    public lookupsysbranch: any = [];
    public lookupemployee: any = [];
    public lookupinvoice: any = [];
    public listinvoice: any = [];
    public batchData: any = [];
    public Collateral: Boolean = false;
    public isPlafond: Boolean;
    public isPlafondrate: Boolean = false;
    public isStatus: Boolean = false;
    public isTenor: Boolean = false;
    public isButton: Boolean = false;
    public isReject: Boolean = false;
    public isUpload: Boolean = false;
    public isFirstDate: Boolean = true;
    private ValidationStatus: String = undefined;
    private dataTempCashierTransaction: any = [];
    private dataTempProcess: any = [];
    private dataTempValidation: any = [];
    private dataTamp: any = [];
    private setStyle: any = [];

    //controller
    private APIController: String = 'CreditNote';
    private APIControllerCreditNoteDetail: String = 'CreditNoteDetail';
    private APIControllerSysBranch: String = 'SysBranch';
    private APIControllerInvoice: String = 'Invoice';
    private APIControllerSysGeneralValidation: String = 'SysGeneralValidation';
    private APIControllerCashierReceivedRequest: String = 'CashierReceivedRequest';

    //router
    private APIRouteForLookup: String = 'GetRowsForLookup';
    private APIRouteForLookupInvoice: String = 'GetRowsLookupForCreditNote';
    private APIRouteForGetRows: String = 'GetRows';
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForUpdate: String = 'Update';
    private APIRouteForInsert: String = 'Insert';
    private APIRouteForProceed: String = 'ExecSpProceed';
    private APIRouteForCancel: String = 'ExecSpCancel';
    private APIRouteForReturn: String = 'ExecSpReturn';
    private APIRouteForGetApprove: String = 'ExecSpPost';
    private RoleAccessCode = 'R00020780000000A';

    // report
    private APIControllerReport: String = 'Report';
    private APIRouteForDownload: String = 'getReport';

    // form 2 way binding
    model: any = {};

    // spinner
    showSpinner: Boolean = true;
    // end

    //validation
    public EmailPattern: string = this._emailformat;

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
        this.Delimiter(this._elementRef);
        if (this.creditnotecode != null) {
            this.isReadOnly = true;
            // call web service
            this.callGetrow();
            this.loadData();
        } else {
            this.model.status = 'HOLD';
            this.showSpinner = false;
            this.model.method = 'INTERNAL'
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
                'pointer-events': 'pointer',
            }
        }

        return this.setStyle;
    }
    //#endregion  set datepicker

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
                    'p_code': this.creditnotecode
                });

                // tslint:disable-next-line:max-line-length
                this.dalservice.Getrows(dtParameters, this.APIControllerCreditNoteDetail, this.APIRouteForGetRows).subscribe(resp => {
                    const parse = JSON.parse(resp)

                    this.listinvoicedetail = parse.data;
                    if (parse.data != null) {
                        this.listinvoicedetail.numberIndex = dtParameters.start;
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

    //#region button Approve
    btnApprove(code: string) {
        this.ValidationStatus = undefined;
        // param tambahan untuk button Approve dynamic
        this.dataTempProcess = [{
            'p_code': code,
            'action': ''
        }];
        // param tambahan untuk button Approve dynamic

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
                this.showSpinner = true;

                this.dataTamp = [{
                    'p_group_code': 'CHASIER_REQUEST_STATUS',
                    'p_is_active': '1'
                }];
                this.dalservice.ExecSp(this.dataTamp, this.APIControllerSysGeneralValidation, this.APIRouteForGetRow)
                    .subscribe(
                        resGetApi => {
                            const parseGetApi = JSON.parse(resGetApi);
                            if (parseGetApi.data.length > 0) {
                                let th = this;
                                var i = 0;
                                (function loopValidation() {
                                    if (i < parseGetApi.data.length) {

                                        th.dataTempValidation = [{
                                            'p_doc_ref_code': th.model.invoice_no,
                                            'action': 'getResponse'
                                        }];

                                        th.dalservice.ExecSpAll(th.dataTempValidation, parseGetApi.data[i].api_name)
                                            .subscribe(
                                                resValidation => {
                                                    const parseValidation = JSON.parse(resValidation);
                                                    if (parseValidation.data[0].status !== '') {
                                                        th.ValidationStatus = parseValidation.data[0].msg;
                                                    }
                                                    if (parseGetApi.data.length == i + 1) {
                                                        if (th.ValidationStatus == undefined) {
                                                            th.dalservice.ExecSp(th.dataTempProcess, th.APIController, th.APIRouteForGetApprove)
                                                                .subscribe(
                                                                    res => {
                                                                        const parse = JSON.parse(res);
                                                                        if (parse.result === 1) {
                                                                            th.callGetrow();
                                                                            $('#reloadWiz').click();
                                                                            th.showNotification('bottom', 'right', 'success');
                                                                            th.showSpinner = false;
                                                                        } else {
                                                                            th.swalPopUpMsg(parse.data);
                                                                            th.showSpinner = false;
                                                                        }
                                                                    },
                                                                    error => {
                                                                        th.showSpinner = false;
                                                                        const parse = JSON.parse(error);
                                                                        th.swalPopUpMsg(parse.data);
                                                                    });
                                                        } else if (th.ValidationStatus !== undefined) {
                                                            th.showSpinner = false;
                                                            th.swalPopUpMsg(th.ValidationStatus);
                                                            th.ValidationStatus = undefined;
                                                        }
                                                    } else {
                                                        i++;
                                                        loopValidation();
                                                    }
                                                },
                                                error => {
                                                    th.showSpinner = false;
                                                    const parseValidation = JSON.parse(error);
                                                    th.swalPopUpMsg(parseValidation.data);
                                                    th.ValidationStatus = undefined;
                                                });
                                    }
                                })();

                            } else {
                                this.swalPopUpMsg('V; Please Setting Master SYS_GENERAL_VALIDATION')
                                this.showSpinner = false;
                            }
                        },
                        error => {
                            this.showSpinner = false;
                            const parseGetApi = JSON.parse(error);
                            this.swalPopUpMsg(parseGetApi.data)
                        });
            } else {
                this.showSpinner = false;
            }
        });
    }
    //#endregion button Approve

    //#region button print
    btnPrint() {
        this.showSpinner = true;
        const dataParam = {
            TableName: 'rpt_credit_note',
            SpName: 'xsp_rpt_credit_note',
            reportparameters: {
                p_user_id: this.userId,
                p_credit_no: this.creditnotecode,
                p_print_option: 'PDF'
            }
        };

        this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
            this.printRptNonCore(res);
            this.showSpinner = false;
        }, err => {
            this.showSpinner = false;
            const parse = JSON.parse(err);
            this.swalPopUpMsg(parse.data);
        });
    }
    //#endregion button print

    //#region button Proceed
    btnProceed(code: string) {

        this.dataTempProcess = [{
            'p_code': code,
        }];


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
                this.showSpinner = true;
                this.dalservice.ExecSp(this.dataTempProcess, this.APIController, this.APIRouteForProceed)
                    .subscribe(
                        res => {
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.callGetrow();
                                this.showNotification('bottom', 'right', 'success');
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
                this.showSpinner = false;
            }
        })
    }
    //#endregion button Proceed

    //#region button Cancel
    btnCancel(code: string) {
        // param tambahan untuk button Done dynamic
        this.dataTempProcess = [{
            'p_code': code,
        }];
        // param tambahan untuk button Done dynamic

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
                this.showSpinner = true;
                this.dalservice.ExecSp(this.dataTempProcess, this.APIController, this.APIRouteForCancel)
                    .subscribe(
                        res => {
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.callGetrow();
                                $('#reloadWiz').click();
                                this.showNotification('bottom', 'right', 'success');
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
                this.showSpinner = false;
            }
        })
    }
    //#endregion button Cancel

    //#region button Return
    btnReturn(code: string) {
        // param tambahan untuk button Done dynamic
        this.dataTempProcess = [{
            'p_code': code,
        }];
        // param tambahan untuk button Done dynamic

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
                this.showSpinner = true;
                this.dalservice.ExecSp(this.dataTempProcess, this.APIController, this.APIRouteForReturn)
                    .subscribe(
                        res => {
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.callGetrow();
                                $('#reloadWiz').click();
                                this.showNotification('bottom', 'right', 'success');
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
                this.showSpinner = false;
            }
        })
    }
    //#endregion button Return

    //#region form submit
    onFormSubmit(creditNoteForm: NgForm, isValid: boolean) {
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

        this.batchData = this.JSToNumberFloats(creditNoteForm);
        console.log(this.batchData);

        const usersJson: any[] = Array.of(this.batchData);

        if (this.creditnotecode != null) {
            // call web service
            this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
                .subscribe(
                    res => {
                        const creditnoteparse = JSON.parse(res);
                        if (creditnoteparse.result === 1) {
                            this.callGetrow();
                            this.showNotification('bottom', 'right', 'success');
                            $('#datatableCreditNoteDetail').DataTable().ajax.reload();
                            this.showSpinner = false;
                        } else {
                            $('#datatableCreditNoteDetail').DataTable().ajax.reload();
                            this.swalPopUpMsg(creditnoteparse.data);
                            this.showSpinner = false;
                        }
                    },
                    error => {
                        $('#datatableCreditNoteDetail').DataTable().ajax.reload();
                        const creditnoteparse = JSON.parse(error);
                        this.swalPopUpMsg(creditnoteparse.data);
                        this.showSpinner = false;
                    });
        } else {
            // call web service
            this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
                .subscribe(
                    res => {
                        const creditnoteparse = JSON.parse(res);
                        console.log(creditnoteparse);

                        if (creditnoteparse.result === 1) {
                            this.showNotification('bottom', 'right', 'success');
                            this.route.navigate(['/billing/subcreditnotelist/creditnotedetail', creditnoteparse.code]);
                            this.showSpinner = false;
                            $('#datatableCreditNoteDetail').DataTable().ajax.reload();
                        } else {
                            $('#datatableCreditNoteDetail').DataTable().ajax.reload();
                            this.swalPopUpMsg(creditnoteparse.data);
                            this.showSpinner = false;
                        }
                    },
                    error => {
                        $('#datatableCreditNoteDetail').DataTable().ajax.reload();
                        const creditnoteparse = JSON.parse(error);
                        this.swalPopUpMsg(creditnoteparse.data);
                        this.showSpinner = false;
                    });
        }
    }

    //#endregion form submit

    //#region getrow data
    callGetrow() {

        this.dataTamp = [{
            'p_code': this.creditnotecode,
        }];



        this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const creditnoteparse = JSON.parse(res);
                    const creditnoteparsedata = this.getrowNgb(creditnoteparse.data[0]);

                    if (creditnoteparsedata.status !== 'HOLD') {
                        this.isButton = true;
                    } else {
                        this.isButton = false;
                    }

                    // mapper dbtoui
                    Object.assign(this.model, creditnoteparsedata);
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
        this.route.navigate(['/billing/subcreditnotelist']);
        $('#datatablecreditnote').DataTable().ajax.reload();
    }
    //#endregion button back

    //#region SysBranch Lookup
    btnLookupSysBranch() {
        $('#datatableLookupSysBranch').DataTable().clear().destroy();
        $('#datatableLookupSysBranch').DataTable({
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
                    'default': ''
                });

                this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBranch, this.APIRouteForLookup).subscribe(resp => {
                    const Branchparse = JSON.parse(resp);
                    this.lookupsysbranch = Branchparse.data;
                    if (Branchparse.data != null) {
                        this.lookupsysbranch.numberIndex = dtParameters.start;
                    }
                    callback({
                        draw: Branchparse.draw,
                        recordsTotal: Branchparse.recordsTotal,
                        recordsFiltered: Branchparse.recordsFiltered,
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

    btnSelectRowSysBranch(code: String, description: String) {
        this.model.branch_code = code;
        this.model.branch_name = description;
        $('#lookupModalSysBranch').modal('hide');
    }
    //#endregion SysBranch lookup

    //#region Invoice Lookup
    btnLookupInvoice() {
        $('#datatableLookupInvoice').DataTable().clear().destroy();
        $('#datatableLookupInvoice').DataTable({
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
                    'default': ''
                });

                this.dalservice.Getrows(dtParameters, this.APIControllerInvoice, this.APIRouteForLookupInvoice).subscribe(resp => {
                    const LookupInvoiceparse = JSON.parse(resp);
                    this.lookupinvoice = LookupInvoiceparse.data;
                    if (LookupInvoiceparse.data != null) {
                        this.lookupinvoice.numberIndex = dtParameters.start;
                    }
                    callback({
                        draw: LookupInvoiceparse.draw,
                        recordsTotal: LookupInvoiceparse.recordsTotal,
                        recordsFiltered: LookupInvoiceparse.recordsFiltered,
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

    btnSelectRowInvoice(
        code: String
        , invoice_external_no: String
        , invoice_name: String
        , currency_code: String
        , billing_amount: String
        , ppn_pct: String
        , pph_pct: String
        , ppn_amount: String
        , pph_amount: String
        , discount_amount: String
        , total_amount: string
    ) {
        this.model.invoice_no = code;
        this.model.invoice_external_no = invoice_external_no;
        this.model.invoice_name = invoice_name;
        this.model.currency_code = currency_code;
        this.model.billing_amount = billing_amount;
        this.model.ppn_amount = ppn_amount;
        this.model.pph_amount = pph_amount;
        this.model.discount_amount = discount_amount;
        this.model.total_amount = total_amount;
        this.model.ppn_pct = ppn_pct//((this.model.ppn_amount / (this.model.billing_amount - this.model.discount_amount)) * 100)
        this.model.pph_pct = pph_pct//((this.model.pph_amount / (this.model.billing_amount - this.model.discount_amount)) * 100)
        $('#lookupModalInvoice').modal('hide');
    }

    //#endregion Invoice lookup

    //#region onBlur
    onBlur(event, i, type) {
        if (type === 'adjustment_amount') {
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

        if (type === 'adjustment_amount') {
            $('#adjustment_amount' + i)
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

        if (type === 'adjustment_amount') {
            $('#adjustment_amount' + i)
                .map(function () { return $(this).val(event); }).get();
        }
    }
    //#endregion onFocus

    //#region button save in list 
    btnSaveList() {
        this.showSpinner = true;
        this.listinvoicedetail = [];

        let i = 0;

        const getId = $('[name="p_id"]')
            .map(function () { return $(this).val(); }).get();

        const getAdjustmentAmount = $('[name="p_adjustment_amount"]')
            .map(function () { return $(this).val(); }).get();

        while (i < getId.length) {

            while (i < getAdjustmentAmount.length) {
                this.listinvoicedetail.push(this.JSToNumberFloats({
                    p_id: getId[i],
                    p_adjustment_amount: getAdjustmentAmount[i],
                    p_credit_note_code: this.creditnotecode,
                    p_invoice_no: this.model.invoice_no
                }));
                i++;
            }
            i++;
        }

        //#region web service
        this.dalservice.Update(this.listinvoicedetail, this.APIControllerCreditNoteDetail, this.APIRouteForUpdate)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                        this.callGetrow();
                        this.showNotification('bottom', 'right', 'success');
                        $('#datatableCreditNoteDetail').DataTable().ajax.reload();
                        this.showSpinner = false;
                    } else {
                        $('#datatableCreditNoteDetail').DataTable().ajax.reload();
                        this.swalPopUpMsg(parse.data);
                        this.showSpinner = false;
                    }
                },
                error => {
                    this.showSpinner = false;
                    $('#datatableCreditNoteDetail').DataTable().ajax.reload();
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data);
                });
        //#endregion web service
    }
    //#endregion button save in list 

    //#region changeAdjusmentAmount
    changeAdjusmentAmount(event: any, id: any) {
        this.showSpinner = true;
        this.listinvoicedetail = [];

        this.listinvoicedetail.push(this.JSToNumberFloats({
            p_id: id,
            p_adjustment_amount: event.target.value,
            p_credit_note_code: this.creditnotecode,
            p_invoice_no: this.model.invoice_no
        }));

        //#region web service
        this.dalservice.Update(this.listinvoicedetail, this.APIControllerCreditNoteDetail, this.APIRouteForUpdate)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                        this.callGetrow();
                        $('#datatableCreditNoteDetail').DataTable().ajax.reload();
                        this.showNotification('bottom', 'right', 'success');
                        this.showSpinner = false;
                    } else {
                        $('#datatableCreditNoteDetail').DataTable().ajax.reload();
                        this.swalPopUpMsg(parse.data);
                        this.showSpinner = false;
                    }
                },
                error => {
                    this.showSpinner = false;
                    $('#datatableCreditNoteDetail').DataTable().ajax.reload();
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data);
                });
        //#endregion web service
    }
    //#endregion changeAdjusmentAmount
}
