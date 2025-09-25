import { OnInit, ViewChild, Component, ElementRef, SecurityContext } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../../../base.component';
import { DALService } from '../../../../../../../../../DALservice.service';
import swal from 'sweetalert2';
import * as CryptoJS from "crypto-js";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './doclist.component.html'
})

export class ApprovaldoclistComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  pageType = this.getRouteparam.snapshot.paramMap.get('page');

  // variable
  public listdoc: any = [];
  public docData: any = [];
  public tempFile: any;
  public listdataDoc: any = [];
  public listID: any = [];
  public listExpDate: any = [];
  private tampDocumentCode: String;
  private dataTamp: any = [];
  private dataTampDelete: any = [];
  private dataTamps: any = [];
  private base64textString: string;
  private tamps = new Array();
  private tempFileSize: any;
  public valid: String;
  public levelStatus: String;
  public isDisable: any;
  public isSign: any;
  private dataTempThirdParty: any = [];
  public tempURL: any;
  private DocumentIframe: any;
  private tempClientNo: any;
  private tempApplicationExternalNo: any;
  private tempLiteDmsUser: any;
  private tempLiteDmsRole: any;
  private tempLiteDmsOption: any;

  private APIController: String = 'ApplicationDoc';
  private APIControllerApplication: String = 'ApplicationMain';
  private APIControllerSysGlobalparam: String = 'SysGlobalparam';

  private APIRouteForDelete: String = 'Delete';
  private APIRouteForGetThirddParty: String = 'ExecSpForGetThirddParty';
  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForUpdate: String = 'Update';
  private APIRouteForUploadFile: String = 'Upload';
  private APIRouteForDeleteFile: String = 'Deletefile';
  private APIRouteForPriviewFile: String = 'Priview';
  private APIRouteForGenerate: String = 'ExecSpForGenerate';
  private APIRouteForGetRowsForDelete: String = 'ExecSpForGetRowsForDelete';
  private APIRouteForUpdateIsValid: String = 'ExecSpForUpdateIsValid';

  private RoleAccessCode = 'R00020690000010A'; // role access 

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = true;
  // end

  // ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  constructor(private dalservice: DALService,
    public route: Router,
    public getRouteparam: ActivatedRoute,
    private _elementRef: ElementRef,
    private domSanitizer: DomSanitizer) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.callGetrow();
    this.loadData();
    this.callGetrowParams();
    this.callGlobalParamForThirdPartyLiteDMS();
  }

  //#region getrow data
  callGetrow() {

    this.dataTamp = [{
      'p_application_no': this.param
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIControllerApplication, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          this.levelStatus = parsedata.level_code;
          this.tempClientNo = parsedata.client_no;
          this.tempApplicationExternalNo = parsedata.application_external_no;
          this.isSign = parsedata.is_sign;
          if (this.levelStatus !== 'A_CREDIAN') {
            this.isDisable = true
          } else {
            this.isDisable = false
          }
          this.showSpinner = false;
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
  }
  //#endregion getrow data

  //#region getrow data
  callGetrowParams() {

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

  //#region load all data
  loadData() {
    this.dtOptions = {
      'pagingType': 'first_last_numbers',
      'pageLength': 100,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false
      ajax: (dtParameters: any, callback) => {

        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_application_no': this.param
        });

        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);

          for (let i = 0; i < parse.data.length; i++) {
            // checkbox
            if (parse.data[i].is_valid === '1') {
              parse.data[i].is_valid = true;
            } else {
              parse.data[i].is_valid = false;
            }
            // end checkbox

          }

          this.listdoc = parse.data;

          if (parse.data != null) {
            this.listdoc.numberIndex = dtParameters.start;
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
    }
  }
  //#endregion load all data

  //#region button save in list
  saveList() {

    this.showSpinner = true;
    this.listdataDoc = [];

    let i = 0;

    const getID = $('[name="p_id"]')
      .map(function () { return $(this).val(); }).get();

    const getExpDate = $('[name="p_expired_date"]')
      .map(function () { return $(this).val(); }).get();

    const getPromiseDate = $('[name="p_promise_date"]')
      .map(function () { return $(this).val(); }).get();


    while (i < getID.length) {

      while (i < getExpDate.length) {

        while (i < getPromiseDate.length) {
          if (getExpDate[i] === '') {
            getExpDate[i] = undefined;
          }
          if (getPromiseDate[i] === '') {
            getPromiseDate[i] = undefined;
          }
          this.listdataDoc.push(this.JSToNumberFloats({
            p_id: getID[i],
            p_expired_date: this.dateFormatList(getExpDate[i]),
            p_promise_date: this.dateFormatList(getPromiseDate[i])
          }));

          i++;
        }

        i++;
      }

      i++;
    }

    //#region web service
    this.dalservice.Update(this.listdataDoc, this.APIController, this.APIRouteForUpdate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.showSpinner = false;
            $('#applicationDetail').click();
            this.showNotification('bottom', 'right', 'success');
            $('#datatableApplicationDocument').DataTable().ajax.reload();
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
    //#endregion web service

  }
  //#endregion button save in list

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

  //#region button delete image
  deleteImage(code: String, file_name: any, paths: any) {
    this.showSpinner = true;
    const usersJson: any[] = Array.of();
    usersJson.push({
      'p_id': code,
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
                this.showSpinner = false;

                this.showNotification('bottom', 'right', 'success');
              } else {
                this.showSpinner = false;
                this.swalPopUpMsg(parse.message);
              }
              $('#applicationDetail').click();
              $('#datatableApplicationDocument').DataTable().ajax.reload();
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

  //#region button select image
  onUpload(event, code: String) {
    const files = event.target.files;
    const file = files[0];

    if (this.CheckFileSize(files[0].size, this.tempFileSize)) {
      this.swalPopUpMsg('V;File size must be less or equal to ' + this.tempFileSize + ' MB');
      $('#datatableApplicationDocument').DataTable().ajax.reload();
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
      p_header: 'APPLICATION_DOCUMENT',
      p_child: this.param,
      p_id: this.tampDocumentCode,
      p_file_paths: this.tampDocumentCode,
      p_file_name: this.tempFile,
      p_base64: this.base64textString
    });

    this.dalservice.UploadFile(this.tamps, this.APIController, this.APIRouteForUploadFile)
      .subscribe(
        // tslint:disable-next-line:no-shadowed-variable
        res => {
          this.tamps = new Array();
          // tslint:disable-next-line:no-shadowed-variable
          const parses = JSON.parse(res);
          if (parses.result === 1) {
            this.showSpinner = false;
          } else {
            this.showSpinner = false;
            this.swalPopUpMsg(parses.message);
          }
          $('#applicationDetail').click();
          $('#datatableApplicationDocument').DataTable().ajax.reload();
        },
        error => {
          this.showSpinner = false;
          this.tamps = new Array();
          // tslint:disable-next-line:no-shadowed-variable
          const parses = JSON.parse(error);
          this.swalPopUpMsg(parses.message);
          $('#applicationDetail').click();
          $('#datatableApplicationDocument').DataTable().ajax.reload();
        });
  }
  //#endregion convert to base64

  //#region button Refresh
  btnRefresh() {

    this.showSpinner = true;
    this.dataTamp = [{
      'p_application_no': this.param,
      'action': 'default'
    }];
    this.dataTamps = [{
      'p_application_no': this.param,
      'action': 'getResponse'
    }];


    // call web service
    this.dalservice.ExecSp(this.dataTamps, this.APIController, this.APIRouteForGetRowsForDelete)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            if (parse.data.length > 0) {
              this.dataTampDelete = [];
              for (let J = 0; J < parse.data.length; J++) {

                this.dataTampDelete = [{
                  'p_id': parse.data[J].id,
                  'p_application_no': this.param
                }];
                const usersJson: any[] = Array.of();
                usersJson.push({
                  'p_id': parse.data[J].id,
                  'p_file_paths': parse.data[J].paths
                });

                if (parse.data[J].paths !== '') {
                  this.dalservice.DeleteFile(usersJson, this.APIController, this.APIRouteForDeleteFile)
                    .subscribe(
                      res => {
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                          this.dalservice.Delete(this.dataTampDelete, this.APIController, this.APIRouteForDelete)
                            .subscribe(
                              res => {
                                const parses = JSON.parse(res);
                                if (parses.result === 1) {
                                  this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForGenerate)
                                    .subscribe(
                                      res => {
                                        const parse = JSON.parse(res);
                                        if (parse.result === 1) {
                                          this.showSpinner = false;
                                          $('#applicationDetail').click();
                                          this.showNotification('bottom', 'right', 'success');
                                          $('#datatableApplicationDocument').DataTable().ajax.reload();
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
                                  this.swalPopUpMsg(parses.data);
                                }
                              },
                              error => {
                                this.showSpinner = false;
                                const parse = JSON.parse(error);
                                this.swalPopUpMsg(parse.data);
                              });
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
                  this.dalservice.Delete(this.dataTampDelete, this.APIController, this.APIRouteForDelete)
                    .subscribe(
                      res => {
                        const parses = JSON.parse(res);
                        if (parses.result === 1) {
                          $('#applicationDetail').click();
                          this.showSpinner = false;
                          this.showNotification('bottom', 'right', 'success');
                          $('#datatableApplicationDocument').DataTable().ajax.reload();
                        } else {
                          this.showSpinner = false;
                          this.swalPopUpMsg(parses.data);
                        }
                      },
                      error => {
                        this.showSpinner = false;
                        const parse = JSON.parse(error);
                        this.swalPopUpMsg(parse.data);
                      });
                }
              }
            } else {
              this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForGenerate)
                .subscribe(
                  res => {
                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                      this.showSpinner = false;
                      $('#applicationDetail').click();
                      this.showNotification('bottom', 'right', 'success');
                      $('#datatableApplicationDocument').DataTable().ajax.reload();
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
            }
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
  }
  //#endregion button Refresh

  //#region isValid
  isValid(event: any, remark: any, id: any) {
    this.showSpinner = true;

    if (event.target.checked === true) {
      this.valid = 'T'
    } else {
      this.valid = 'F'
    }

    this.dataTamp = [{
      'p_id': id,
      'p_application_no': this.param,
      'p_remarks': remark,
      'p_is_valid': this.valid,
      'action': 'default'
    }];

    this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForUpdateIsValid)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.showSpinner = false;
            this.showNotification('bottom', 'right', 'success');
            $('#datatableApplicationDocument').DataTable().ajax.reload();
          } else {
            this.showSpinner = false;
            this.swalPopUpMsg(parse.data);
            $('#datatableApplicationDocument').DataTable().ajax.reload();
          }
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data)
        });
  }
  //#endregion isValid

  //#region isValid
  saveRemarks(event: any, isValid: any, id: any) {
    this.showSpinner = true;

    this.dataTamp = [{
      'p_id': id,
      'p_application_no': this.param,
      'p_remarks': event.target.value,
      'p_is_valid': isValid,
      'action': 'default'
    }];

    this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForUpdateIsValid)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.showSpinner = false;
            this.showNotification('bottom', 'right', 'success');
            $('#datatableApplicationDocument').DataTable().ajax.reload();
          } else {
            this.showSpinner = false;
            this.swalPopUpMsg(parse.data);
            $('#datatableApplicationDocument').DataTable().ajax.reload();
          }
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data)
        });
  }
  //#endregion isValid

  //#region GlobalParam for Thirdparty
  callGlobalParamForThirdPartyLiteDMS() {

    this.dataTempThirdParty = [{
      'p_type': "CLIENT_IFRAME",
      'action': "getResponse"
    }];

    this.dalservice.ExecSp(this.dataTempThirdParty, this.APIControllerSysGlobalparam, this.APIRouteForGetThirddParty)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data);

          for (let i = 0; i < parsedata.length; i++) {
            if (parsedata[i].code === 'ENIFR03') {
              this.DocumentIframe = parsedata[i].value
            }
            else if (parsedata[i].code === 'ENIFR04') {
              this.tempLiteDmsUser = parsedata[i].value
            }
            else if (parsedata[i].code === 'ENIFR05') {
              this.tempLiteDmsRole = parsedata[i].value
            }
            else if (parsedata[i].code === 'ENIFR07') {
              this.tempLiteDmsOption = parsedata[i].value
            }
          }
          this.showSpinner = false;
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
  }
  //#endregion GlobalParam for Thirdparty

  //#region iframe lite dms
  btnOpenLD() {
    this.encryptUsingAES256();
  }

  encryptUsingAES256() {
    let tempEncrypted: any = "";
    let request: any = {};
    let MetadataParent: any = [];
    let MetadataObject: any = [];
    let Option: any = [];

    MetadataParent = [
      {
        label: "No Customer",
        value: this.tempClientNo
      }
    ]
    MetadataObject = [
      {
        label: "No Application",
        value: this.tempApplicationExternalNo
      }
    ]
    Option = [
      {
        "label": "OverideSecurity",
        "value": this.tempLiteDmsOption
      }
    ]

    request = {
      "User": this.tempLiteDmsUser,
      "Role": this.tempLiteDmsRole,
      "ViewCode": "ConfinsIfin",
      "MetadataParent": MetadataParent,
      "MetadataObject": MetadataObject,
      "Option": Option
    }

    let _key = CryptoJS.enc.Utf8.parse("A2IVRJSTDHTP1CJV");
    let _iv = CryptoJS.enc.Utf8.parse("V56E7QYOGREMAIII");
    let encrypted = CryptoJS.AES.encrypt("js=" + JSON.stringify(request) + "&cftsv=" + this.sysDate, _key, {
      keySize: 128,
      iv: _iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    tempEncrypted = encrypted.toString();
    // const iframe = $('#iframeLiteDMS');
    // this.tempURL = this.domSanitizer.sanitize(SecurityContext.RESOURCE_URL, this.domSanitizer.bypassSecurityTrustResourceUrl(this.DocumentIframe + encodeURIComponent(tempEncrypted.toString())))

    // setTimeout(() => {
    //   iframe.attr('src', this.tempURL);
    //   this.showSpinner = false;
    // }, 300);
    window.open(this.DocumentIframe + encodeURIComponent(tempEncrypted.toString()))
  }
  //#endregion iframe lite dms
}
