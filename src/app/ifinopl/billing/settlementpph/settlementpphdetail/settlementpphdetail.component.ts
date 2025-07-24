import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-settlementpphdetail',
  templateUrl: './settlementpphdetail.component.html' // GetRowsForLookupForDocgroup
})
export class SettlementpphdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public generateinvoiceData: any = [];
  public listgenerateinvoicedetail: any = [];
  public lookupclient: any = [];
  public lookupagreement: any = [];
  public lookupasset: any = [];
  public lookupbranch: any = [];
  public setStyle: any = [];
  private tempFileSize: any;
  public isReadOnly: Boolean = false;
  public isRequired: any;
  public isBreak: Boolean = false;

  public tamps = new Array();
  public tampHidden: Boolean;
  public tempFile: any;

  private dataTamp: any = [];
  private tampDocumentCode: String;
  private base64textString: string;
  private APIController: String = 'Invoice';
  private APIControllerInvoicePph: String = 'InvoicePph';
  private APIControllerSysGlobalparam: String = 'SysGlobalparam';

  private APIRouteForGetRow: String = 'ExecSpForGetRowSettlementPphInvoice';

  private APIRouteForDeleteFile: String = 'Deletefile';
  private APIRouteForPriviewFile: String = 'Priview';
  private APIRouteForUploadFile: String = 'Upload';
  private APIRouteForProceed: String = 'ExecSpForProceed';

  private RoleAccessCode = 'R00020590000000A'; // role access 

  // checklist
  public selectedAllTable: any;
  public selectedAllLookup: any;

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
    private _elementRef: ElementRef
  ) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    if (this.param != null) {
      this.isReadOnly = true;
      this.callGetrowGlobalParam()
      // call web service
      this.callGetrow();
    } else {
      this.model.status = 'HOLD';
      this.model.billing_mode = 'NORMAL';
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
        'pointer-events': 'auto',
      }
    }

    return this.setStyle;
  }
  //#endregion 

  //#region getrow data
  callGetrow() {

    this.dataTamp = [{
      'p_invoice_no': this.param,
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          if (parsedata.file_path === '' || parsedata.file_path == null) {
            this.tampHidden = true;
          } else {
            this.tampHidden = false;
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

  //#region Type
  SettlementType(event: any) {
    this.model.settlement_type = event.target.value;
  }
  //#endregion Type

  //#region button select image
  onUpload(event, invoice_no: String) {
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
      this.tampDocumentCode = invoice_no;
    }
  }
  //#endregion button select image

  //#region button priview image
  priviewFile(row1, row2) {
    this.showSpinner = true;
    const usersJson: any[] = Array.of();

    usersJson.push({
      p_file_name: row1,
      p_file_paths: row2
    });

    this.dalservice.PriviewFile(usersJson, this.APIControllerInvoicePph, this.APIRouteForPriviewFile)
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

  //#region button delete image
  deleteImage(file_name: any, row2) {
    const usersJson: any[] = Array.of();

    usersJson.push({
      p_invoice_no: this.param,
      p_file_name: file_name,
      // p_branch_code: this.param,
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
        this.dalservice.DeleteFile(usersJson, this.APIControllerInvoicePph, this.APIRouteForDeleteFile)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showSpinner = false;
                this.callGetrow();
                this.tempFile = undefined;
                this.showNotification('bottom', 'right', 'success');
              } else {
                this.showSpinner = false;
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

  //#region convert to base64
  handleFile(event) {
    this.showSpinner = true;
    const binaryString = event.target.result;
    this.base64textString = btoa(binaryString);

    this.tamps.push({
      p_header: 'INVOICE_PPH_DOCUMENT',
      p_module: 'IFINOPL',
      p_child: this.param,
      p_invoice_no: this.param,
      p_file_paths: this.param,
      p_file_name: this.tempFile,
      p_base64: this.base64textString
    });
    this.dalservice.UploadFile(this.tamps, this.APIControllerInvoicePph, this.APIRouteForUploadFile)
      .subscribe(
        res => {
          this.tamps = new Array();
          const parses = JSON.parse(res);
          if (parses.result === 1) {
            this.showSpinner = false;
            this.callGetrow();
          } else {
            this.showSpinner = false;
            this.swalPopUpMsg(parses.message);
          }
        },
        error => {
          this.showSpinner = false;
          this.tamps = new Array();
          const parses = JSON.parse(error);
          this.swalPopUpMsg(parses.message);
        });
  }
  //#endregion convert to base64

  //#region button Proceed
  btnProceed() {
    // param tambahan untuk button Post dynamic
    this.dataTamp = [{
      'p_invoice_no': this.param,
      'action': ''
    }];
    // param tambahan untuk button Post dynamic

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
        this.dalservice.ExecSp(this.dataTamp, this.APIControllerInvoicePph, this.APIRouteForProceed)
          .subscribe(
            res => {
              this.showSpinner = false;
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.callGetrow();
                this.showNotification('bottom', 'right', 'success');
              } else {
                this.swalPopUpMsg(parse.data)
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

  //#region button back
  btnBack() {
    this.route.navigate(['/billing/subsettlementpphlist']);
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion button back

}
