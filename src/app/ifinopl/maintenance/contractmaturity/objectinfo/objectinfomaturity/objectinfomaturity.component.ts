import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../base.component';
import swal from 'sweetalert2';
import { DALService } from '../../../../../../DALservice.service';
import { NgForm } from '@angular/forms';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './objectinfomaturity.component.html'
})

export class objectinfomaturityComponent extends BaseComponent implements OnInit {
    // get param from url
    maturityCode = this.getRouteparam.snapshot.paramMap.get('maturityCode');

    // variable
    public NumberOnlyPattern = this._numberonlyformat;
    public isStatus: Boolean = false;
    public isProceed: Boolean = false;
    public isCancel: Boolean = false;
    public contractmaturitydetailData: any = [];
    public listapplicationasset: any = [];
    public lookupemployee: any = [];
    public lookupasset: any = [];
    public setStyle: any = [];
    private dataTamp: any = [];
    public listmaturitydetailData: any = [];
    public tampHidden: Boolean;
    public tempFile: any;
    public tampDocumentCode: String;
    public lookupapproval: any = [];

    //Controller
    private APIController: String = 'Maturity';
    private APIControllerMaturityDetail: String = 'MaturityDetail';

    //Route
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForGetRows: String = 'GetRows';
    private APIRouteForPriviewFile: String = 'Priview';
    private APIRouteForUpdate: String = 'Update';

    private RoleAccessCode = 'R00020730000000A'; // role access 

    // form 2 way binding
    model: any = {};
    model_upload: any = {};

    // spinner
    showSpinner: Boolean = false;
    // end

    // checklist
    public selectedAll: any;
    private checkedList: any = [];

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
        // call web service
        this.callGetrow();
        this.loadData();
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
                    'p_code': this.maturityCode,
                    'p_pickup_date': this.model.pickup_date
                })

                this.dalservice.Getrows(dtParameters, this.APIControllerMaturityDetail, this.APIRouteForGetRows).subscribe(resp => {
                    const parse = JSON.parse(resp)
                    this.listapplicationasset = parse.data;
                    if (parse.data != null) {
                        this.listapplicationasset.numberIndex = dtParameters.start;
                    }

                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 7] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        }

    }
    //#endregion load all data

    //#region getrow data
    callGetrow() {
        this.dataTamp = [{
            'p_code': this.maturityCode
        }];
        this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    const parsedata = this.getrowNgb(parse.data[0]);
                    if (parsedata.file_paths === '' || parsedata.file_paths == null) {
                        this.tampHidden = true;
                    } else {
                        this.tampHidden = false;
                    }
                    $('#datatableApplicationAsset').DataTable().ajax.reload();

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
    onFormSubmit(contractmaturitydetailForm: NgForm, isValid: boolean) {
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

        this.contractmaturitydetailData = this.JSToNumberFloats(contractmaturitydetailForm);
        const usersJson: any[] = Array.of(this.contractmaturitydetailData);

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
                        this.callGetrow();
                        this.swalPopUpMsg(parse.data);
                        this.showSpinner = false;
                    }
                },
                error => {
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data);
                    this.showSpinner = false;
                });
    }
    //#endregion form submit

    //#region button priview image
    priviewFile(row1, row2) {
        this.showSpinner = true;
        const usersJson: any[] = Array.of();

        usersJson.push({
            p_file_name: row1,
            p_file_paths: row2
        });

        this.dalservice.PriviewFile(usersJson, this.APIController, this.APIRouteForPriviewFile)
            .subscribe(
                (res) => {
                    const parse = JSON.parse(res);
                    if (parse.value.filename !== '') {
                        const fileType = parse.value.filename.split('.').pop();
                        if (fileType === 'PNG') {
                            this.downloadFile(parse.value.data, parse.value.filename, fileType);
                            // const newTab = window.open();
                            // newTab.document.body.innerHTML = this.pngFile(parse.value.data);
                            // this.showSpinner = false;
                        }
                        if (fileType === 'JPEG' || fileType === 'JPG') {
                            this.downloadFile(parse.value.data, parse.value.filename, fileType);
                            // const newTab = window.open();
                            // newTab.document.body.innerHTML = this.jpgFile(parse.value.data);
                            // this.showSpinner = false;
                        }
                        if (fileType === 'PDF') {
                            this.downloadFile(parse.value.data, parse.value.filename, 'pdf');
                            // const newTab = window.open();
                            // newTab.document.body.innerHTML = this.pdfFile(parse.value.data);
                            // this.showSpinner = false;
                        }
                        if (fileType === 'DOCX' || fileType === 'DOC') {
                            this.downloadFile(parse.value.data, parse.value.filename, 'msword');
                        }
                        if (fileType === 'XLSX') {
                            this.downloadFile(parse.value.data, parse.value.filename, 'vnd.ms-excel');
                        }
                        if (fileType === 'PPTX') {
                            this.downloadFile(parse.value.data, parse.value.filename, 'vnd.ms-powerpoint');
                        }
                        if (fileType === 'TXT') {
                            this.downloadFile(parse.value.data, parse.value.filename, 'txt');
                        }
                        if (fileType === 'ODT' || fileType === 'ODS' || fileType === 'ODP') {
                            this.downloadFile(parse.value.data, parse.value.filename, 'vnd.oasis.opendocument');
                        }
                        if (fileType === 'ZIP') {
                            this.downloadFile(parse.value.data, parse.value.filename, 'zip');
                        }
                        if (fileType === '7Z') {
                            this.downloadFile(parse.value.data, parse.value.filename, 'x-7z-compressed');
                        }
                        if (fileType === 'RAR') {
                            this.downloadFile(parse.value.data, parse.value.filename, 'vnd.rar');
                        }
                    }
                }
            );
    }

    downloadFile(base64: string, fileName: string, extention: string) {
        var temp = 'data:application/' + extention + ';base64,'
            + encodeURIComponent(base64);
        var download = document.createElement('a');
        download.href = temp;
        download.download = fileName;
        document.body.appendChild(download);
        download.click();
        document.body.removeChild(download);
        this.showSpinner = false;
    }

    //#endregion button priview image

    //#region button edit
    btnEdit(codeEdit: String) {
        this.route.navigate(['/objectinfomaturity/objectinfomaturitydetail', this.maturityCode, codeEdit]);
    }
    //#endregion button edit
}