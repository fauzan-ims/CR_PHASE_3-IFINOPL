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
    templateUrl: './invoicedeliverydetail.component.html'
})

export class InvoiceDeliverydetailComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');

    // variable
    public NumberOnlyPattern = this._numberonlyformat;
    public isReadOnly: Boolean = false;
    public lookupsysbranch: any = [];
    public lookupemployee: any = [];
    public invoicedeliverydetail: any = [];
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
    private dataRoleTamp: any = [];
    private dataTamp: any = [];
    private setStyle: any = [];
    private base64textString: string;
    public tamps = new Array();
    public tempFile: any;
    private tempFileSize: any;
    public lookupreason: any = [];

    //controller
    private APIController: String = 'InoviceDelivery';
    private APIControllerDetail: String = 'InvoiceDeliveryDetail';
    private APIControllerSysBranch: String = 'SysBranch';
    private APIControllerEmployee: String = 'SysEmployeeMain';
    private APIControllerSysGlobalparam: String = 'SysGlobalparam';
    private APIControllerSysGeneralSubcode: String = 'SysGeneralSubcode';

    //router
    private APIRouteForGetRows: String = 'GetRows';
    private APIRouteForLookup: String = 'GetRowsForLookup';
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForUpdate: String = 'Update';
    private APIRouteForInsert: String = 'Insert';
    private APIRouteForProceed: String = 'ExecSpProceed';
    private APIRouteForCancel: String = 'ExecSpCancel';
    private APIRouteForGetDone: String = 'ExecSpDone';
    private APIRouteForGetReturn: String = 'ExecSpReturn';
    private RoleAccessCode = 'R00020740000000A';
    private APIRouteForDelete: String = 'Delete';
    private APIRouteForPost: String = 'ExcPostDeliveryDetail';
    private APIRouteForDownload: String = 'DownloadFileWithData';
    private APIRouteForUploadDataFile: String = 'UploadDataExcel';

    // report
    private APIControllerReport: String = 'Report';
    private APIRouteForDownloadReport: String = 'getReport';


    // form 2 way binding
    model: any = {};
    public selectedAll: any;
    public checkedList: any = [];
    private dataTampPush: any = [];

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
        if (this.param != null) {
            this.isReadOnly = true;
            // call web service
            this.callGetrow();
            this.loadData();
            this.callGetrowGlobalParam()
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
                'pointer-events': 'auto',
            }
        }

        return this.setStyle;
    }
    //#endregion  set datepicker

    //#region getrow data
    callGetrowGlobalParam() {

        this.dataTamp = [{
            'p_code': 'FUPS'
        }];

        this.dalservice.Getrow(this.dataTamp, this.APIControllerSysGlobalparam, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    const parsedata = parse.data[0];

                    this.tempFileSize = parsedata.file_size;

                    this.showSpinner = false;
                },
                error => {
                    console.log('There was an error while Retrieving Data(API) !!!' + error);
                });
    }
    //#endregion getrow data

    //#region button Approve
    btnDone(code: string) {
        // param tambahan untuk button Approve dynamic
        this.dataRoleTamp = [{
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
            this.showSpinner = true;
            if (result.value) {
                // call web service
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForGetDone)
                    .subscribe(
                        res => {
                            this.showSpinner = false;
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.callGetrow();
                                $('#reloadWiz').click();
                                this.showNotification('bottom', 'right', 'success');
                            } else {
                                this.swalPopUpMsg(parse.data);
                            }
                        },
                        error => {
                            const parse = JSON.parse(error);
                            this.swalPopUpMsg(parse.data);
                        });
            } else {
                this.showSpinner = false;
            }
        });
    }
    //#endregion button Approve

    //#region button Proceed
    btnProceed(code: string) {
        // param tambahan untuk getrole dynamic
        this.dataRoleTamp = [{
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
            this.showSpinner = true;
            if (result.value) {
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForProceed)
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
        this.dataRoleTamp = [{
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
            this.showSpinner = true;
            if (result.value) {
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForCancel)
                    .subscribe(
                        res => {
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.callGetrow();
                                $('#reloadWiz').click();
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
                            this.swalPopUpMsg(parse.data);
                        });
            } else {
                this.showSpinner = false;
            }
        })
    }

    //#endregion button Cancel

    //#region form submit
    onFormSubmit(deliveryForm: NgForm, isValid: boolean) {
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

        this.batchData = this.JSToNumberFloats(deliveryForm);
        const usersJson: any[] = Array.of(this.batchData);

        if (this.param != null) {
            // call web service
            this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
                .subscribe(
                    res => {
                        this.showSpinner = false;
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            this.callGetrow();
                            this.showNotification('bottom', 'right', 'success');
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
            // call web service
            this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
                .subscribe(
                    res => {
                        this.showSpinner = false;
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            this.showNotification('bottom', 'right', 'success');
                            this.route.navigate(['/billing/subdeliverylist/deliverydetail', parse.code]);
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
    }

    //#endregion form submit

    //#region getrow data
    callGetrow() {

        this.dataTamp = [{
            'p_code': this.param,
        }];
        this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    const parsedata = this.getrowNgb(parse.data[0]);

                    // if (parsedata.status !== 'HOLD') {
                    //     this.isButton = true;
                    // } else {
                    //     this.isButton = false;
                    // }

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
        $('#datatable').DataTable().ajax.reload();
        this.route.navigate(['/billing/subdeliverylist']);
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
                    const parse = JSON.parse(resp);
                    this.lookupsysbranch = parse.data;
                    if (parse.data != null) {
                        this.lookupsysbranch.numberIndex = dtParameters.start;
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

    btnSelectRowSysBranch(code: String, description: String) {
        this.model.branch_code = code;
        this.model.branch_name = description;
        $('#lookupModalSysBranch').modal('hide');
    }
    //#endregion SysBranch lookup

    //#region Employee Lookup
    btnLookupEmployee() {
        $('#datatableLookupEmployee').DataTable().clear().destroy();
        $('#datatableLookupEmployee').DataTable({
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

                this.dalservice.GetrowsSys(dtParameters, this.APIControllerEmployee, this.APIRouteForLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupemployee = parse.data;
                    if (parse.data != null) {
                        this.lookupemployee.numberIndex = dtParameters.start;
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

    btnSelectRowEmployee(code: String, description: String) {
        this.model.employee_code = code;
        this.model.employee_name = description;
        $('#lookupModalEmployee').modal('hide');
    }
    //#endregion Employee lookup

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
                    'p_delivery_code': this.param
                });


                this.dalservice.Getrows(dtParameters, this.APIControllerDetail, this.APIRouteForGetRows).subscribe(resp => {
                    // if use checkAll use this
                    $('#checkall').prop('checked', false);
                    // end checkall
                    this.showSpinner = false;
                    const parse = JSON.parse(resp)
                    this.invoicedeliverydetail = parse.data;
                    this.invoicedeliverydetail.numberIndex = dtParameters.start;

                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, searchable: false, width: '5%', targets: [0, 1, 10] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        }
    }
    //#endregion load all data

    //#region button add
    btnAdd() {
        this.route.navigate(['/billing/subdeliverylist/deliverydetaildetail', this.param]);
    }
    //#endregion button add

    //#region button edit
    btnEdit(codeEdit: string) {
        this.route.navigate(['/billing/subdeliverylist/deliverydetaildetail', this.param, codeEdit]);
    }
    //#endregion button edit

    //#region button Approve
    btnReturn(code: string) {
        // param tambahan untuk button Approve dynamic
        this.dataRoleTamp = [{
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
            this.showSpinner = true;
            if (result.value) {
                // call web service
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForGetReturn)
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
        });
    }
    //#endregion button Approve

    //#region btn delete
    btnDeleteAll() {
        this.checkedList = [];
        for (let i = 0; i < this.invoicedeliverydetail.length; i++) {
            if (this.invoicedeliverydetail[i].selected) {
                this.checkedList.push(this.invoicedeliverydetail[i].id);
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
        this.dataTampPush = [];
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
                for (let J = 0; J < this.checkedList.length; J++) {

                    this.dataTampPush.push({
                        'p_id': this.checkedList[J]
                    });

                    console.log(this.dataTamp);


                    this.dalservice.Delete(this.dataTampPush, this.APIControllerDetail, this.APIRouteForDelete)
                        .subscribe(
                            res => {
                                this.showSpinner = false;
                                const parse = JSON.parse(res);
                                if (parse.result === 1) {
                                    if (this.checkedList.length == J + 1) {
                                        this.showSpinner = false;
                                        this.showNotification('bottom', 'right', 'success');
                                        $('#datatabledelivery').DataTable().ajax.reload();
                                    }
                                } else {
                                    this.swalPopUpMsg(parse.data);
                                }
                            },
                            error => {
                                this.showSpinner = false;
                                const parse = JSON.parse(error);
                                this.swalPopUpMsg(parse.data)
                            });
                }
            } else {
                this.showSpinner = false;
            }
        });
    }



    selectAllTable() {
        for (let i = 0; i < this.invoicedeliverydetail.length; i++) {
            if (this.invoicedeliverydetail[i].is_calculated !== '1') {
                this.invoicedeliverydetail[i].selected = this.selectedAll;
            }
        }
    }

    checkIfAllTableSelected() {
        this.selectedAll = this.invoicedeliverydetail.every(function (item: any) {
            return item.selected === true;
        })
    }
    //#endregion btn delete

    //#region btn post
    btnPost(code: string) {
        // param tambahan untuk button Done dynamic
        this.dataRoleTamp = [{
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
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIControllerDetail, this.APIRouteForPost)
                    .subscribe(
                        res => {
                            this.showSpinner = false;
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.callGetrow();
                                this.showNotification('bottom', 'right', 'success');
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
    //#endregion btn post

    //#region btnDownload
    btnDownload() {
        const dataParam = [
            {
                'p_code': this.param
            }
        ];

        this.showSpinner = true;
        this.dalservice.DownloadFileWithData(dataParam, this.APIControllerDetail, this.APIRouteForDownload).subscribe(res => {
            var contentDisposition = res.headers.get('content-disposition');
            var filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();
            const blob = new Blob([res.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            var link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            this.showSpinner = false;
        }, err => {
            this.showSpinner = false;
            const parse = JSON.parse(err);
            this.swalPopUpMsg(parse.data);
        });
    }
    //#endregion btnDownload 

    //#region upload excel reader
    handleFile(event) {
        this.tamps = []
        // this.tempFile = [];
        const binaryString = event.target.result;
        this.base64textString = btoa(binaryString);

        this.tamps.push({
            p_module: 'IFINOPL',
            p_header: 'INVOICE_PPH',
            p_child: '0000',
            filename: this.tempFile,
            base64: this.base64textString
        });

    }

    onUploadReader(event) {
        this.tamps = []
        const files = event.target.files;
        const file = files[0];
        if (this.CheckFileSize(files[0].size, this.tempFileSize)) {
            this.swalPopUpMsg('V;File size must be less or equal to ' + this.tempFileSize + ' MB');
            this.loadData();
        } else {
            if (event.target.files && event.target.files[0]) {
                const reader = new FileReader();
                reader.readAsDataURL(event.target.files[0]); // read file as data url
                // tslint:disable-next-line:no-shadowed-variable
                reader.onload = (event) => {
                    reader.onload = this.handleFile.bind(this);
                    reader.readAsBinaryString(file);
                }
            }
            this.tempFile = files[0].name;
            swal({
                title: 'Are you sure?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: this._deleteconf,
                cancelButtonText: 'No',
                confirmButtonClass: 'btn btn-success',
                cancelButtonClass: 'btn btn-danger',
                buttonsStyling: false
            }).then((result) => {
                this.showSpinner = true;
                if (result.value) {
                    this.dalservice.UploadFile(this.tamps, this.APIControllerDetail, this.APIRouteForUploadDataFile)
                        .subscribe(
                            res => {
                                this.showSpinner = false;
                                const parse = JSON.parse(res);
                                if (parse.result === 1) {
                                    $('#datatabledelivery').DataTable().ajax.reload();
                                    this.showNotification('bottom', 'right', 'success');
                                    $('#fileControl').val(undefined);
                                    this.tamps = [];
                                }
                                else {
                                    this.swalPopUpMsg(parse.data);
                                    $('#fileControl').val(undefined);
                                    this.tamps = [];
                                }
                            }, error => {
                                this.showSpinner = false;
                                const parse = JSON.parse(error);
                                this.swalPopUpMsg(parse.data);
                                $('#fileControl').val(undefined);
                                this.tamps = [];
                            });
                } else {

                    this.showSpinner = false;
                    $('#fileControl').val(undefined);
                    this.tamps = [];

                }
            })
        }
    }
    //#endregion button select image

    //#region Reason Lookup
    btnLookupReason() {
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
                    'p_general_code': 'INDR'
                });

                this.dalservice.Getrows(dtParameters, this.APIControllerSysGeneralSubcode, this.APIRouteForLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupreason = parse.data;
                    if (parse.data != null) {
                        this.lookupreason.numberIndex = dtParameters.start;
                    }
                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 3] }], // for disabled coloumn
            order: [[2, 'desc']],
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }

    btnSelectRowReason(code: String, description: String) {
        this.model.delivery_reason_code = code;
        this.model.delivery_reason_desc = description;
        $('#lookupModalReason').modal('hide');
    }
    //#endregion Reason lookup

    //#region changeResult
    changeResult(event) {
        this.model.delivery_result = event.target.value;
    }
    //#endregion changeResult

    //#region button print tanda terima
    btnPrintTandaTerima() {
        this.showSpinner = true;
        const dataParam = {
            TableName: 'RPT_INVOICE_DELIVERY',
            SpName: 'xsp_rpt_invoice_delivery',
            reportparameters: {
                p_user_id: this.userId,
                p_delivery_code: this.param,
                p_register_no: this.model.code,
                p_print_option: 'PDF'
            }
        };

        this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownloadReport).subscribe(res => {
            this.printRptNonCore(res);
            this.showSpinner = false;
        }, err => {
            this.showSpinner = false;
            const parse = JSON.parse(err);
            this.swalPopUpMsg(parse.data);
        });
    }
    //#endregion button print tanda terima

    onMethodChange(newValue: string) {
        // console.log('Method berubah:', newValue);
        this.model.method = newValue;
        console.log(this.model.method);
        
        // this.methodChanged = true; // bisa dipakai sebagai kondisi
    }
}
