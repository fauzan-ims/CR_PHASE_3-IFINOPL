import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import swal from 'sweetalert2';

@Component({
    selector: 'app-uploadinterfacedetail',
    templateUrl: './uploadinterfacedetail.component.html'
})

export class UploadInterfacedetailComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');
    paramController = this.getRouteparam.snapshot.paramMap.get('controller');
    paramRoute = this.getRouteparam.snapshot.paramMap.get('route');

    // form 2 way binding
    model: any = {};

    // checklist
    public selectedAll: any;
    public checkedList: any = [];

    // spinner
    showSpinner: Boolean = false;
    // end

    // variable
    public listUploadInterfaceDetail: any;
    public listUploadInterfaceHeader: any = [];
    public lookupuploaderrorlog: any = [];
    public tempFile: any;
    public IsRowCount: boolean;
    private base64textString: string;
    private tamps = new Array();
    private dataTamp: any = [];
    public description: any = [];
    public templatename: any = [];
    public tablename: any = [];
    public sppostname: any = [];
    public tampStatus: String;
    private tempFileSize: any;

    //controller
    private APIController: String = 'MasterUploadTable';
    private APIControllerUploadErrorLog: String = 'UploadErrorLog';
    private APIControllerSysGlobalparam: String = 'SysGlobalparam';

    //route
    private APIRouteForPost: String = 'ExecSpForPost';
    private APIRouteForCancelUploadDynamic: String = 'ExecSpForCancelUploadDynamic';
    private APIRouteForGetRow: String = 'Getrow';
    private APIRouteForGetRows: String = 'GetRowsForUploadInterfaceDetail';
    private APIRouteForLookupUploadErrorLog: String = 'GetRowsForLookup';
    private APIRouteForUploadDataFile: String = 'UploadDataExcel';
    private APIRouteForDownload: String = 'DownloadFile';
    public downloadData: any = [];
    public empty: any = [];
    private RoleAccessCode = 'R00002610000262A';

    // ini buat datatables
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    // dtColoumn: DataTables.Settings = {};

    // public dtColoumn: any = {};

    constructor(private dalservice: DALService,
        public getRouteparam: ActivatedRoute,
        public route: Router,
        private _elementRef: ElementRef
    ) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        this.tampStatus = 'ALL';
        this.callGetrow();
        this.loadData();
        this.callGetrowGlobalParam();

    }

    //#region ddl master module
    PageStatus(event: any) {
        this.tampStatus = event.target.value;
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion ddl master module

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

    //#region getrow data
    callGetrow() {

        this.dataTamp = [{
            'p_code': this.param,
        }];


        this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    const parsedata = parse.data[0];

                    this.description = parsedata.header_name_upload_list;
                    this.templatename = parsedata.template_name
                    this.tablename = parsedata.tabel_name

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
            // order: [],
            'lengthMenu': [
                [10, 25, 50, 100],
                [10, 25, 50, 100]
            ],
            ajax: (dtParameters: any, callback) => {

                dtParameters.paramTamp = [];
                dtParameters.paramTamp.push({
                    'p_code_table': this.param,
                    'p_status': this.tampStatus
                })


                this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {

                    const parse = JSON.parse(resp)
                    this.empty = parse.data.length;

                    if (parse.data.length > 0) {

                        const toLowerCaseHeader = Object.keys(parse.data[0]);

                        // delete toLowerCaseHeader['primary_key'];

                        const getLowerCase = toLowerCaseHeader.map(low => low.toLowerCase());

                        // if(getLowerCase.length > 0)
                        // {
                        //     this.IsRowCount = true;
                        // }
                        // else
                        // {
                        //     this.IsRowCount = false;
                        // }

                        for (let io = 0; io < getLowerCase.length; io++) {
                            const element = getLowerCase[io];
                            const dataHead = element.replace('_', ' ');
                            // console.log();
                            this.listUploadInterfaceHeader.push(dataHead);


                        }

                        // this.listUploadInterfaceHeader.shift();
                        this.listUploadInterfaceHeader.splice(-1);

                        let dataTampDet = [];

                        for (let o = 0; o < parse.data.length; o++) {

                            const element = parse.data[o];
                            delete element['rowcount'];
                            // delete element['primarY_KEY'];
                            const value = Object.keys(element).map(k => element[k]);

                            dataTampDet.push(value);

                        }

                        this.listUploadInterfaceDetail = dataTampDet;

                    }
                    else {
                        this.listUploadInterfaceDetail = null;
                    }

                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, targets: [0], visible: false, }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        }



    }
    //#endregion load all data

    //#region btnDownload
    btnDownload() {
        this.showSpinner = true;

        this.dataTamp = [];


        this.dataTamp = [{
            'p_template_name': this.templatename,
        }];


        this.dalservice.DownloadFileWithParam(this.dataTamp, this.APIController, this.APIRouteForDownload).subscribe(res => {

            this.showSpinner = false;
            var contentDisposition = res.headers.get('content-disposition');

            var filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();

            const blob = new Blob([res.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            var link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            // window.open(url);

        }, err => {
            this.showSpinner = false;
            const parse = JSON.parse(err);
            this.swalPopUpMsg(parse.data);
        });
    }
    // #endregion btnDownload

    //#region button back
    btnBack() {
        this.route.navigate(['/upload/subuploadinterfacelist/subuploadinterfacelist']);
    }
    //#endregion button back

    //#region btnPost
    btnPost() {

        this.showSpinner = true;
        // param tambahan untuk getrole dynamic
        this.dataTamp = [{
            'p_code_table': this.param
            // 'action': ''
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
                            this.showSpinner = false;
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showNotification('bottom', 'right', 'success');
                                this.route.navigate(['/upload/uploadinterfacedetail', this.param]);
                                $('#datatable').DataTable().ajax.reload();
                                //this.route.navigate(['/interface/subuploadinterfacelist']);
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
    //#endregion btnPost

    //#region upload excel reader
    handleFile(event) {
        const binaryString = event.target.result;
        this.base64textString = btoa(binaryString);
        this.tamps.push({
            filename: this.tempFile,
            base64: this.base64textString,
            p_code: this.param
        });
    }

    onUploadReader(event) {

        this.deleteAll();

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
            this.tempFile = files[0].name.toUpperCase();

            if (this.templatename != this.tempFile) {
                this.tempFile = '';
                swal({
                    title: 'Warning',
                    text: 'Invalid Template Name',
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-danger',
                    type: 'warning'
                }).catch(swal.noop)
                return;
            } else {
                this.showSpinner = true;
            }

            // this.tampDocumentCode = code;
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
                console.log(this.tempFile)
                if (result.value) {
                    this.dalservice.UploadFile(this.tamps, this.APIController, this.APIRouteForUploadDataFile)
                        .subscribe(
                            res => {
                                this.showSpinner = false;
                                const parse = JSON.parse(res);
                                if (parse.result === 1) {

                                    // $('#fileControl').val('');
                                    // this.tempFile = '';
                                    // this.templatename = '';

                                    this.tamps = [];
                                    this.showNotification('bottom', 'right', 'success');
                                    window.location.reload();
                                    // $('#datatable').DataTable().ajax.reload();
                                    this.tempFile = '';

                                } else {
                                    this.swalPopUpMsg(parse.data);
                                    $('#fileControl').val('');
                                    window.location.reload();
                                    // $('#datatable').DataTable().ajax.reload();
                                    this.tempFile = '';
                                }
                            }, error => {
                                this.showSpinner = false;
                                const parse = JSON.parse(error);
                                this.swalPopUpMsg(parse.data);
                                $('#fileControl').val('');
                                this.tempFile = '';
                            });
                } else {
                    this.showSpinner = false;
                    $('#fileControl').val('');
                    $('#datatable').DataTable().ajax.reload();
                    this.tempFile = '';
                }
            })
        }
    }
    //#endregion button select image

    //#region delete all upload
    deleteAll() {
        //this.showSpinner = true;

        // param tambahan untuk getrole dynamic
        this.dataTamp = [{
            // 'default': '',
            'p_code': this.param
        }];
        // param tambahan untuk getrole dynamic
        this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForCancelUploadDynamic)
            .subscribe(
                res => {
                    this.showSpinner = false;
                    // console.log(res);

                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                        //this.showNotification('bottom', 'right', 'success');
                        //this.route.navigate(['/interface/subpaymentrequestlist']);
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
    //#endregion delete all upload

    //#region LookupErroLog
    btnLookupUploadErrorLog(primary_key: any) {

        $('#datatableLookupUploadErrorLog').DataTable().clear().destroy();
        $('#datatableLookupUploadErrorLog').DataTable({
            'pagingType': 'simple_numbers',
            'pageLength': 5,
            'processing': true,
            'serverSide': true,
            responsive: true,
            lengthChange: false, // hide lengthmenu
            searching: true, // jika ingin hilangin search box nya maka false

            ajax: (dtParameters: any, callback) => {
                dtParameters.paramTamp = [];
                dtParameters.paramTamp.push({
                    'p_tabel_name': this.tablename,
                    'p_primary_column_name': primary_key
                });

                this.dalservice.Getrows(dtParameters, this.APIControllerUploadErrorLog, this.APIRouteForLookupUploadErrorLog).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupuploaderrorlog = parse.data;

                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    })
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            'lengthMenu': [
                [5, 25, 50, 100],
                [5, 25, 50, 100]
            ],
            columnDefs: [{ orderable: false, width: '5%', targets: [0] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '

            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }

    // ngAfterViewInit(){
    //     this.loadData();
    // }

    // ngAfterViewInit(){
    //     // var table = $('#datatable').DataTable();
    //     $('table tr td:first-child').hide();
    //     // $('#datatable')Agre.;

    // }

}
