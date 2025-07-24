import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { BaseComponent } from '../../../../../../base.component';
import { DALService } from '../../../../../../DALservice.service';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './invoicedeliverydetaildetail.component.html'
})

export class InvoiceDeliveryDetaildetailComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');
    params = this.getRouteparam.snapshot.paramMap.get('id2');

    // variable
    public NumberOnlyPattern = this._numberonlyformat;
    public generalsubcodeData: any = [];
    public isReadOnly: Boolean = false;
    public isButton: Boolean = false;
    private rolecode: any = [];
    private dataTamp: any = [];
    public tampDeliveryName: any;
    private dataRoleTamp: any = [];
    private setStyle: any = [];
    private base64textString: string;
    public tempFile: any;
    private tamps = new Array();
    public tampDocumentCode: String;
    public tampHidden: Boolean;
    public status_header: any;
    private tempFileSize : any; 
    
    //controller
    private APIController: String = 'InvoiceDeliveryDetail';
    private APIControllerSysGlobalparam: String = 'SysGlobalparam';
    private APIControllerInvoiceDelivery: String = 'InoviceDelivery';

    //route
    private APIRouteForUploadFile: String = 'Upload';
    private APIRouteForDeleteFile: String = 'Deletefile';
    private APIRouteForPriviewFile: String = 'Priview';
    private APIRouteForGetRow: String = 'GETROW';
    private APIRouteForInsert: String = 'INSERT';
    private APIRouteForUpdate: String = 'UPDATE';
    private RoleAccessCode = 'R00020740000000A';

    // form 2 way binding
    model: any = {};
    model_upload: any = {};
    // spinner
    showSpinner: Boolean = true;
    // end

    constructor(private dalservice: DALService,
        public getRouteparam: ActivatedRoute,
        public route: Router,
        private _elementRef: ElementRef
    ) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        if (this.param != null && this.params != null) {
            this.isReadOnly = true;
         
            // call web service
            this.callGetrow();
            this.callGetrowHeader()
            this.callGetrowGlobalParam()
        } else {
            this.tampHidden = true;
           
            this.showSpinner = false;

        }
    }

    //#region ddl delivery status
    // DeliveryName(tamp: any) {
    //     this.tampDeliveryName = tamp.target.value;
    // }
    //#endregion delivery status 

    //#region changeCondition
    DeliveryName(event: any) {
        this.model.delivery_status = event.target.value;
    }
    //#endregion changeCondition  

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

    //#region getrow data
    callGetrow() {
        
        this.dataTamp = [{
            'p_id': this.params
        }]
        

        this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    const parsedata = this.getrowNgb(parse.data[0]);
                    this.status_header = parsedata.status;

                    if (parsedata.file_path === '' || parsedata.file_path == null) {
                        this.tampHidden = true;
                        this.callGetrowHeader()
                    } else {
                      
                        this.tampHidden = false;
                        this.callGetrowHeader()
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

    //#region getrow data
    callGetrowHeader() {
        
        this.dataTamp = [{
            'p_code': this.param
        }]
        

        this.dalservice.Getrow(this.dataTamp, this.APIControllerInvoiceDelivery, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    const parsedata = this.getrowNgb(parse.data[0]);

                    this.status_header = parsedata.status;
                    // checkbox active
                    if (parsedata.status === 'ON PROCESS') {
                        this.isReadOnly = false;
                        this.isButton = false;
                    } else {
                        this.isReadOnly = true;
                        this.isButton = true;
                    }
                    

                    // end checkbox active

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


    //#region form submit 
    onFormSubmit(invoicedeliverydetailForm: NgForm, isValid: boolean) {
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

        this.generalsubcodeData = this.JSToNumberFloats(invoicedeliverydetailForm);
        const usersJson: any[] = Array.of(this.generalsubcodeData);
        if (this.param != null && this.params != null) {
            // call web service
            this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
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
            // call web service
            this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
                .subscribe(
                    res => {
                        this.showSpinner = false;
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                            this.showNotification('bottom', 'right', 'success');
                            this.route.navigate(['/setting/subgeneralcodelist/generalsubcodedetail', this.param, this.generalsubcodeData.p_code]);
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

    //#region button back
    btnBack() {
        $('#datatables').DataTable().ajax.reload();
        this.route.navigate(['/billing/subdeliverylist/deliverydetail', this.param]);
    }
    //#endregion button back

    //#region getrow callGetrowGlobalParam
    callGetrowGlobalParam() {
        
        this.dataTamp = [{
            'p_code': 'FUPS'
        }];
        
        this.dalservice.Getrows(this.dataTamp, this.APIControllerSysGlobalparam, this.APIRouteForGetRow)
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
    //#endregion getrow callGetrowGlobalParam

    //#region convert to base64
    handleFile(event) {
        this.showSpinner = true;
        const binaryString = event.target.result;
        this.base64textString = btoa(binaryString);

        this.tamps.push({
            p_header: 'INVOICE_DELIVERY_DETAIL',
            p_module: 'IFINOPL',
            p_child: this.param,
            p_id: this.params,
            p_file_paths: this.param,
            p_file_name: this.tempFile,
            p_base64: this.base64textString
        });
        this.dalservice.UploadFile(this.tamps, this.APIController, this.APIRouteForUploadFile)
            .subscribe(
                res => {
                    this.tamps = new Array();
                    const parses = JSON.parse(res);
                    if (parses.result === 1) {
                        this.showSpinner = false;
                    } else {
                        this.showSpinner = false;
                        this.swalPopUpMsg(parses.message);
                    }
                    this.callGetrow();
                },
                error => {
                    this.showSpinner = false;
                    this.tamps = new Array();
                    const parses = JSON.parse(error);
                    this.swalPopUpMsg(parses.message);
                    this.callGetrow();
                });
    }
    //#endregion convert to base64

    //#region button select image
    onUpload(event, id: String) {
        const files = event.target.files;
        const file = files[0];

        if (this.CheckFileSize(files[0].size, this.tempFileSize)) {
            this.swalPopUpMsg('V;File size must be less or equal to ' + this.tempFileSize + ' MB');
            this.callGetrow();
        } else {
            if (event.target.files && event.target.files[0]) {
                const reader = new FileReader();

                reader.readAsDataURL(event.target.files[0]); // read file as data url

                reader.onload = (event) => {
                    reader.onload = this.handleFile.bind(this);
                    reader.readAsBinaryString(file);
                }
            }
            this.tempFile = files[0].name;
            this.tampDocumentCode = id;
        }
    }
    //#endregion button select image

    //#region button delete image
    deleteImage(file_name: any, row2) {
        const usersJson: any[] = Array.of();

        usersJson.push({
            p_id: this.params,
            p_file_name: file_name,
            p_branch_code: this.param,
            p_file_paths: row2
        });

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
                this.dalservice.DeleteFile(usersJson, this.APIController, this.APIRouteForDeleteFile)
                    .subscribe(
                        res => {
                            const parse = JSON.parse(res);
                            if (parse.result === 1) {
                                this.showSpinner = false;
                                this.callGetrow();
                                this.tempFile = undefined;
                                $('#fileControl').val(undefined);
                                this.showNotification('bottom', 'right', 'success');
                            } else {
                                this.showSpinner = false;
                                $('#fileControl').val(undefined);
                                this.swalPopUpMsg(parse.message);
                            }
                            this.callGetrow();
                        },
                        error => {
                            this.showSpinner = false;
                            const parse = JSON.parse(error);
                            this.swalPopUpMsg(parse.message);
                        });
            } else {
                this.showSpinner = false;
            }
        });
    }
    //#endregion button delete image

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
                            const newTab = window.open();
                            newTab.document.body.innerHTML = this.pngFile(parse.value.data);
                            this.showSpinner = false;
                        }
                        if (fileType === 'JPEG' || fileType === 'JPG') {
                            const newTab = window.open();
                            newTab.document.body.innerHTML = this.jpgFile(parse.value.data);
                            this.showSpinner = false;
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
}