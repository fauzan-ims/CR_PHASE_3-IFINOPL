import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import swal from 'sweetalert2';

@Component({
    selector: 'app-priceupload',
    templateUrl: './priceupload.component.html'
})

export class PriceuploadComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');

    // variable
    public listUpload: any = [];
    public upload_result: String;
    public lookupbranch: any = [];
    public tempFile: any;
    public downloadData: any = [];
    private base64textString: string;
    private tamps = new Array();
    private dataTamp: any = [];

    private APIController: String = 'MasterVehiclePricelistUpload';

    private APIRouteForPost: String = 'ExecSpForPost';
    private APIRouteForCancel: String = 'ExecSpForCancel';
    private APIRouteForGetRows: String = 'GetRows';
    private APIRouteLookup: String = 'GetRowsLookupSysBranch';
    private APIRouteForUploadDataFile: String = 'UploadDataExcel';
    private APIRouteForDownload: String = 'DownloadFile';

    private RoleAccessCode = 'R00020050000000A'; // role access 

    // form 2 way binding
    model: any = {};

    // checklist
    public selectedAll: any;
    public checkedList: any = [];

    // spinner
    showSpinner: Boolean = false;
    // end

    // ini buat datatables
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
        this.model.branch_code = 'ALL';
        this.upload_result = 'OK';
        this.loadData();
    }

    //#region btnDownload
    btnDownload() {
        this.showSpinner = true;
        this.dalservice.DownloadFile(this.APIController, this.APIRouteForDownload).subscribe(res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
                this.showSpinner = false;
                var contentDisposition = res.headers.get('content-disposition');

                var filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();

                const blob = new Blob([res.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);
                var link = document.createElement('a');
                link.href = url;
                link.download = filename;
                link.click();
            } else {
                this.showSpinner = false;
                this.swalPopUpMsg(parse.data);
            }
        }, err => {
            this.showSpinner = false;
            const parse = JSON.parse(err);
            this.swalPopUpMsg(parse.data);
        });
    }
    // #endregion btnDownload

    //#region btnCancel
    btnCancel() {
        this.showSpinner = true;
        // param tambahan untuk getrole dynamic
        this.dataTamp = [{
            'default': '',
            'action': 'default'
        }];
        // param tambahan untuk getrole dynamic
        swal({
            allowOutsideClick: false,
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
                this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForCancel)
                    .subscribe(
                        res => {
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showSpinner = false;
                                this.showNotification('bottom', 'right', 'success');
                                this.route.navigate(['/vehicle/subpricelist']);
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
    //#endregion btnCancel

    //#region btnPost
    btnPost() {
        this.showSpinner = true;
        // param tambahan untuk getrole dynamic
        this.dataTamp = [{
            'default': '',
            'action': 'default'
        }];
        // param tambahan untuk getrole dynamic
        swal({
            allowOutsideClick: false,
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
                this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForPost)
                    .subscribe(
                        res => {
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showSpinner = false;
                                this.showNotification('bottom', 'right', 'success');
                                this.route.navigate(['/vehicle/subpricelist']);
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
    //#endregion btnPost

    //#region upload excel reader
    handleFile(event) {
        const binaryString = event.target.result;
        this.base64textString = btoa(binaryString);
        this.tamps.push({
            filename: this.tempFile,
            base64: this.base64textString
        });
    }

    onUploadReader(event) {
        const files = event.target.files;
        const file = files[0];
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
        // this.tampDocumentCode = code;
        swal({
            title: 'Are you sure?',
            text: 'You will not be able to revert this file!',
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
                this.dalservice.UploadFile(this.tamps, this.APIController, this.APIRouteForUploadDataFile)
                    .subscribe(
                        res => {
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showSpinner = false;
                                this.showNotification('bottom', 'right', 'success');
                                $('#fileControl').val('');
                                this.tempFile = undefined;
                            } else {
                                this.showSpinner = false;
                                this.swalPopUpMsg(parse.data);
                                $('#fileControl').val('');
                                this.tempFile = undefined;
                            }
                        }, error => {
                            this.showSpinner = false;
                            const parse = JSON.parse(error);
                            this.swalPopUpMsg(parse.data);
                            $('#fileControl').val('');
                            this.tempFile = undefined;
                        });
            } else {
                this.showSpinner = false;
                $('#fileControl').val('');
                this.tempFile = undefined;
            }
        })
    }
    //#endregion button select image

    //#region Branch
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
                    'default': ''
                });
                
                this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteLookup).subscribe(resp => {
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
    }

    btnSelectRowBranch(code: String, name: String) {
        this.model.branch_code = code;
        this.model.branch_name = name;
        $('#lookupModalBranch').modal('hide');
        $('#datatableVehiclePriceUploadList').DataTable().ajax.reload();
    }
    //#endregion branch

    //#region ddl Status
    PageUpload(event: any) {
        this.upload_result = event.target.value;
        $('#datatableVehiclePriceUploadList').DataTable().ajax.reload();
    }
    //#endregion ddl Status

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
                    'p_upload_result': this.upload_result,
                    'p_branch_code': this.model.branch_code
                })
                 
                this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
                    const parse = JSON.parse(resp)
                    this.listUpload = parse.data;
                    if (parse.data != null) {
                        this.listUpload.numberIndex = dtParameters.start;
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
        }

    }
    //#endregion load all data
}