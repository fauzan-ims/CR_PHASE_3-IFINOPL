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
  templateUrl: './deliveryassetdetail.component.html'
})

export class DeliveryassetdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public isStatus: Boolean = false;
  public isProceed: Boolean = false;
  public isCancel: Boolean = false;
  public deliveryassetdetailData: any = [];
  public listapplicationasset: any = [];
  public lookupemployee: any = [];
  public lookupasset: any = [];
  public setStyle: any = [];
  private dataTamp: any = [];
  public tempFile: any;
  public tampHidden: Boolean = true;
  private tampDocumentCode: String;
  private tamps = new Array();
  private base64textString: string;

  private APIController: String = 'AssetDeliveryDetail';
  private APIControllerSysGlobalparam: String = 'SysGlobalparam';

  private APIRouteForUploadFile: String = 'Upload';
  private APIRouteForDeleteFile: String = 'Deletefile';
  private APIRouteForPriviewFile: String = 'Priview';
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForUpdate: String = 'Update';

  private RoleAccessCode = 'R00020670000000A'; // role access 

  // form 2 way binding
  model: any = {};

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
    this.callGetrowGlobalParam();
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

  //#region getrowglobalparam
  callGetrowGlobalParam() {
     
    this.dataTamp = [{
      'p_code': 'FUPS'
    }];
    

    this.dalservice.Getrow(this.dataTamp, this.APIControllerSysGlobalparam, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];

          // mapper dbtoui
          Object.assign(this.model, parsedata);
          // end mapper dbtoui

          this.showSpinner = false;
        },
        error => {
          console.log('There was an error while Retrieving Data(API) !!!' + error);
        });
  }
  //#endregion getrowglobalparam

  //#region getrow data
  callGetrow() {
     
    this.dataTamp = [{
      'p_id': this.params
    }];
    
    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          if (parsedata.file_path === '' || parsedata.file_path == null) {
            this.tampHidden = false;
          } else {
            this.tampHidden = true;
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

  //#region button back
  btnBack() {
    this.route.navigate(['/golive/subdeliverylist/deliverydetail', this.param]);
    $('#datatableApplicationAsset').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region  form submit
  onFormSubmit(deliveryassetdetailForm: NgForm, isValid: boolean) {
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

    this.deliveryassetdetailData = this.JSToNumberFloats(deliveryassetdetailForm);
    const usersJson: any[] = Array.of(this.deliveryassetdetailData);
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
  previewFile(row1, row2) {
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

  //#region button delete image
  deleteImage(file_name: any, paths: any) {
    this.showSpinner = true;
    const usersJson: any[] = Array.of();
    usersJson.push({
      'p_id': this.params,
      'p_file_name': file_name,
      'p_file_paths': paths
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
                this.callGetrow();
                $('#fileControl').val(undefined);
                this.tempFile = undefined;
                this.ngOnInit();
                this.showSpinner = false;
                this.showNotification('bottom', 'right', 'success');
              } else {
                $('#fileControl').val(undefined);
                this.tempFile = undefined;
                this.showSpinner = false;
                this.swalPopUpMsg(parse.message);
              }
              this.callGetrow();
              $('#fileControl').val(undefined);
              this.tempFile = undefined;
              this.ngOnInit();
            },
            error => {
              $('#fileControl').val(undefined);
              this.tempFile = undefined;
              this.showSpinner = false;
              const parse = JSON.parse(error);
              this.swalPopUpMsg(parse.message);
            });
      } else {
        $('#fileControl').val(undefined);
        this.tempFile = undefined;
        this.showSpinner = false;
      }
    });
  }
  //#endregion button delete image

  //#region button select image
  onUpload(event, code: String) {
    const files = event.target.files;
    const file = files[0];

    if (this.CheckFileSize(files[0].size, this.model.file_size)) {
      this.swalPopUpMsg('V;File size must be less or equal to ' + this.model.file_size + ' MB');
      $('#fileControl').val(undefined);
      this.tempFile = undefined;
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
      this.tampDocumentCode = code;
    }
  }
  //#endregion button select image

  //#region convert to base64
  handleFile(event) {
    this.showSpinner = true;
    const binaryString = event.target.result;
    this.base64textString = btoa(binaryString);

    this.tamps.push({
      p_module: 'IFINLOS',
      p_header: 'DELIVERY_ASSET',
      p_child: this.params,
      p_id: this.tampDocumentCode,
      p_file_paths: this.tampDocumentCode,
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
            $('#fileControl').val(undefined);
            this.tempFile = undefined;
          }
          this.callGetrow();
        },
        error => {
          this.showSpinner = false;
          this.tamps = new Array();
          const parses = JSON.parse(error);
          this.swalPopUpMsg(parses.message);
          this.callGetrow();
          $('#fileControl').val(undefined);
          this.tempFile = undefined;
        });
  }
  //#endregion convert to base64
}