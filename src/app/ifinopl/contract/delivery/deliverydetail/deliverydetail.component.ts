import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import swal from 'sweetalert2';
import { DALService } from '../../../../../DALservice.service';
import { NgForm } from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './deliverydetail.component.html'
})

export class DeliverydetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public deliverydetailData: any = [];
  public lookupemployee: any = [];
  private dataTamp: any = [];
  private dataTampReturn: any = [];
  private dataTampPost: any = [];
  private base64textString: string;
  public tempFile: any;
  public tempFileMemo: any;
  private tamps = new Array();
  public tampDocumentCode: String;
  private tempFileSize: any;
  public tampHidden: Boolean;
  public tampHiddenMemo: Boolean;
  public tampPrint: Boolean;
  public setStyle: any = [];

  //controller
  private APIController: String = 'Realization';
  private APIControllerSysEmployee = 'SysEmployeeMain';
  private APIControllerSysGlobalparam: String = 'SysGlobalparam';

  //route
  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForUpdate: String = 'Update';
  private APIRouteForPost: String = 'ExecSpForPost';
  private APIRouteForPostWithNote: String = 'ExecSpForPostWithNote';
  private APIRouteForCancel: String = 'ExecSpForCancel';
  private APIRouteForDownloadMailMerge: String = 'MailMergeFile';
  private APIRouteForUpload: String = '';
  private APIRouteForUploadFile: String = 'Upload';
  private APIRouteForUploadFileMemo: String = 'UploadFileMemo';
  private APIRouteForPriviewFile: String = 'Priview';
  private APIRouteForDeleteFile: String = 'Deletefile';
  private APIRouteForDeleteFileMemo: String = 'DeleteFileMemo';
  private APIRouteForProceed: String = 'ExecSpForProceed';
  private APIRouteForReturn: String = 'ExecSpForReturn';
  private APIRouteForProceedtoLegal: String = 'ExecSpForProceedtoLegal'

  private RoleAccessCode = 'R00020670000000A'; // role access 

  // report
  private APIControllerReprint: String = 'Report';
  private APIControllerGetReprint: String = 'Report';
  private APIRouteForDownload: String = 'GetReport';

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
    this.tampHidden = false;
    this.callGetrow();
    this.callGetrowGlobalParam();
    this.wizard();
    this.AssetList();
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
      'p_code': this.param,
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          // mapper dbtoui
          Object.assign(this.model, parsedata);
          // end mapper dbtoui
          if (parsedata.file_path === '' || parsedata.file_path == null) {
            this.tampHidden = true;
          } else {

            this.tampHidden = false;
          }

          if (parsedata.file_memo === '' || parsedata.file_path_memo == null) {
            this.tampHiddenMemo = true;
          } else {

            this.tampHiddenMemo = false;
          }

          if (parsedata.status === 'HOLD' || parsedata.status === 'CANCEL') {
            this.tampPrint = true;
          } else {

            this.tampPrint = false;
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

  //#region btnPost
  btnPost(code: any) {
    this.dataTampPost = []
    let i = 0;

    const getResult = $('[name="p_result"]')
      .map(function () { return $(this).val(); }).get();

    while (i < getResult.length) {
      this.dataTampPost.push({
        'p_code': code,
        'p_result': getResult[i],
        'action': 'default'
      });
      i++;
    }

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
        this.dalservice.ExecSp(this.dataTampPost, this.APIController, this.APIRouteForPost)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showSpinner = false;
                this.showNotification('bottom', 'right', 'success');
                this.callGetrow();
                this.redirectTo('/contract/subdeliverylist/deliverydetail/' + this.param)
              } else {
                this.showSpinner = false;
                this.swalPopUpMsg(parse.data);
              }
            },
            error => {
              this.showSpinner = false;
              const parse = JSON.parse(error);
              this.swalPopUpMsg(parse.data)
            });
      } else {
        this.showSpinner = false;
      }
    });
  }
  //#endregion btnPost

  //#region btnPostWithNote
  btnPostWithNote(code: any) {
    this.dataTampPost = []
    let i = 0;

    const getResult = $('[name="p_result"]')
      .map(function () { return $(this).val(); }).get();

    const getExpDate = $('[name="p_exp_date"]')
  .map(function () {
    const val = $(this).val();
    const parts = val.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`; 
    }
    return val; 
  }).get();


    while (i < getResult.length) {
      this.dataTampPost.push({
        'p_code': code,
        'p_result': getResult[i],
        'p_exp_date': getExpDate[i],
        'action': 'default'
      });
      i++;
    }

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
        this.dalservice.ExecSp(this.dataTampPost, this.APIController, this.APIRouteForPostWithNote)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showSpinner = false;
                this.showNotification('bottom', 'right', 'success');
                this.callGetrow();
                this.redirectTo('/contract/subdeliverylist/deliverydetail/' + this.param)
              } else {
                this.showSpinner = false;
                this.swalPopUpMsg(parse.data);
              }
            },
            error => {
              this.showSpinner = false;
              const parse = JSON.parse(error);
              this.swalPopUpMsg(parse.data)
            });
      } else {
        this.showSpinner = false;
      }
    });
  }
  //#endregion btnPostWithNote

  //#region btnCancel
  btnCancel(code: any) {

    this.dataTamp = [{
      'p_code': code,
      'action': 'default'
    }];

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
        this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForCancel)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showSpinner = false;
                this.showNotification('bottom', 'right', 'success');
                this.callGetrow();
                this.redirectTo('/contract/subdeliverylist/deliverydetail/' + this.param)
              } else {
                this.showSpinner = false;
                this.swalPopUpMsg(parse.data);
              }
            },
            error => {
              this.showSpinner = false;
              const parse = JSON.parse(error);
              this.swalPopUpMsg(parse.data)
            });
      } else {
        this.showSpinner = false;
      }
    });
  }
  //#endregion btnCancel

  //#region button back
  btnBack() {
    this.route.navigate(['/contract/subdeliverylist']);
    $('#datatableDeliverylist').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region  form submit
  onFormSubmit(deliverydetailForm: NgForm, isValid: boolean) {
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

    this.deliverydetailData = this.JSToNumberFloats(deliverydetailForm);
    const usersJson: any[] = Array.of(this.deliverydetailData);
    console.log(usersJson);

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

  //#region lookup Employee
  btnLookupModalEmployee() {
    $('#datatableEmployee').DataTable().clear().destroy();
    $('#datatableEmployee').DataTable({
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

        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysEmployee, this.APIRouteForLookup).subscribe(resp => {
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
        }, err => console.log('There was an error while retrieving Data(API)' + err));
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

  btnSelectRowModule(code: String, name: String) {
    this.model.delivery_pic_code = code;
    this.model.delivery_pic_name = name;
    $('#lookupModalEmployee').modal('hide');
  }
  //#endregion lookup Employee

  //#region btnPrint 
  btnPrint() {
    this.showSpinner = true;

    let filename = "rpt_perjanjian_pelaksanaan"

    const dataParamMailMerge = [{
      "p_folder_name": "Realization",
      "p_file_name": filename,
      "p_user_id": this.userId,
      "p_reff_no": this.param,
      "p_code": this.param
    }];

    const rptParam = {
      p_user_id: this.userId,
      p_application_no: this.model.application_no,
      p_code: this.param,
      p_print_option: 'PDF'
    }

    const dataParam = {
      TableName: 'RPT_PERJANJIAN_PELAKSANAAN',
      SpName: 'xsp_rpt_perjanjian_pelaksanaan',
      reportparameters: rptParam
    };

    // param tambahan untuk getrow dynamic
    this.dataTamp = [{
      'p_file_name': 'tes1'
      , 'p_user_id': this.userId
    }];
    // end param tambahan untuk getrow dynamic
    this.dalservice.ReportFile(dataParam, this.APIControllerReprint, this.APIRouteForDownload).subscribe(res => {
      this.showSpinner = false;
      this.dalservice.DownloadFileWithParam(dataParamMailMerge, this.APIController, this.APIRouteForDownloadMailMerge).subscribe(res => {

        var contentDisposition = res.headers.get('content-disposition');

        var filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();

        const blob = new Blob([res.body], { type: 'application/msword' });
        const url = window.URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        this.callGetrow();
        // this.showNotification('bottom', 'right', 'success');
        this.showSpinner = false;
      }, err => {
        this.showSpinner = false;
        const parse = JSON.parse(err);
        this.swalPopUpMsg(parse.data);
      });
      this.callGetrow();
      this.printRptNonCore(res);
    }, err => {
      this.showSpinner = false;
      const parse = JSON.parse(err);
      this.swalPopUpMsg(parse.data);
    });

  }
  //#endregion btnPrint

  //#region btnReprint
  btnReprint() {
    this.showSpinner = true;

    const rptParam = {
      p_user_id: this.userId,
      p_application_no: this.model.application_no,
      p_code: this.param,
      p_print_option: 'PDF'
    }

    const dataParam = {
      TableName: 'RPT_PERJANJIAN_PELAKSANAAN_REPRINT',
      SpName: 'xsp_rpt_perjanjian_pelaksanaan_reprint',
      // ReportName: 'rpt_perjanjian_pelaksanaan_reprint.rpt',
      reportparameters: rptParam
    };

    // param tambahan untuk getrow dynamic
    this.dataTamp = [{
      'p_file_name': 'tes1'
      , 'p_user_id': this.userId
    }];
    // end param tambahan untuk getrow dynamic

    this.dalservice.ReportFile(dataParam, this.APIControllerReprint, this.APIControllerGetReprint).subscribe(res => {
      this.showSpinner = false;
      this.callGetrow();
      this.printRptNonCore(res);
    }, err => {
      this.showSpinner = false;
      const parse = JSON.parse(err);
      this.swalPopUpMsg(parse.data);
    });
  }
  //#endregion btnReprint

  //#region button select image
  onUpload(event: any, id: string, type: string) {
    const files = event.target.files;
    const file = files[0];

    if (!file) return;

    if (this.CheckFileSize(file.size, this.tempFileSize)) {
      this.swalPopUpMsg('V;File size must be less or equal to ' + this.tempFileSize + ' MB');
      this.callGetrow();
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const binaryString = e.target.result;
      this.handleFile(binaryString, type, file.name);
    };

    reader.readAsBinaryString(file); // or use readAsArrayBuffer if you want typed array
    if (type === 'memo') {
      this.tempFileMemo = files[0].name;
    } else {
      this.tempFile = files[0].name;
    }
    this.tampDocumentCode = id;
  }
  //#endregion

  //#region convert to base64
  handleFile(binaryString: string, type: string, fileName: string) {
    this.tamps = [];
    this.showSpinner = true;

    this.base64textString = btoa(binaryString); // convert to base64 string

    this.tamps.push({
      p_header: 'REALIZATION',
      p_module: 'IFINOPL',
      p_child: this.param,
      p_code: this.param,
      p_file_paths: this.param,
      p_file_name: fileName,
      p_base64: this.base64textString
    });

    this.APIRouteForUpload = (type === 'memo') ? this.APIRouteForUploadFileMemo : this.APIRouteForUploadFile;

    this.dalservice.UploadFile(this.tamps, this.APIController, this.APIRouteForUpload)
      .subscribe(
        res => {
          this.tamps = [];
          const parses = JSON.parse(res);
          this.showSpinner = false;

          if (parses.result === 1) {
            this.callGetrow();
             this.showNotification('bottom', 'right', 'success');
          } else {
            this.swalPopUpMsg(parses.message);
          }
        },
        error => {
          this.tamps = [];
          this.showSpinner = false;

          const parses = JSON.parse(error);
          this.swalPopUpMsg(parses.message);
          this.callGetrow();
        });
  }
  //#endregion

  //#region button delete image
  deleteImage(file_name: any, row2, type: String = '') {
    this.showSpinner = true;
    const usersJson: any[] = Array.of();

    usersJson.push({
      p_code: this.param,
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
        if (type === 'memo') {
          this.APIRouteForUpload = this.APIRouteForDeleteFileMemo
        } else {
          this.APIRouteForUpload = this.APIRouteForDeleteFile
        }
        this.dalservice.DeleteFile(usersJson, this.APIController, this.APIRouteForUpload)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showSpinner = false;
                $('#fileControl').val(undefined);
                this.callGetrow();
                this.tempFile = undefined;
                this.showNotification('bottom', 'right', 'success');
                this.tamps = []
                this.callGetrow();
                this.redirectTo('/contract/subdeliverylist/deliverydetail/' + this.param)
                
              } else {
                this.showSpinner = false;
                this.swalPopUpMsg(parse.message);
                this.tamps = []
              }
              this.callGetrow();
            },
            error => {
              this.showSpinner = false;
              const parse = JSON.parse(error);
              this.swalPopUpMsg(parse.message);
              this.tamps = []
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

  //#region btnProceed
  btnProceed(code: any) {
    this.dataTamp = [{
      'p_code': code,
      'action': 'default'
    }];
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
        this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForProceed)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showNotification('bottom', 'right', 'success');
                this.callGetrow();
                this.redirectTo('/contract/subdeliverylist/deliverydetail/' + this.param)
                this.showSpinner = false;
              } else {
                this.showSpinner = false;
                this.swalPopUpMsg(parse.data);
              }
            },
            error => {
              this.showSpinner = false;
              const parse = JSON.parse(error);
              this.swalPopUpMsg(parse.data)
            });
      } else {
        this.showSpinner = false;
      }
    });
  }
  //#endregion btnProceed

  //#region btnProceedtoLegal
  btnProceedtoLegal(code: any) {
    this.dataTamp = [{
      'p_code': code,
      'action': 'default'
    }];
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
        this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForProceedtoLegal)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showNotification('bottom', 'right', 'success');
                this.callGetrow();
                this.redirectTo('/contract/subdeliverylist/deliverydetail/' + this.param)
                this.showSpinner = false;
              } else {
                this.showSpinner = false;
                this.swalPopUpMsg(parse.data);
              }
            },
            error => {
              this.showSpinner = false;
              const parse = JSON.parse(error);
              this.swalPopUpMsg(parse.data)
            });
      } else {
        this.showSpinner = false;
      }
    });
  }
  //#endregion btnProceedtoLegal

  //#region btnReturn
  btnReturn(code: any) {

    this.dataTampReturn = []

    let i = 0;

    const getResult = $('[name="p_result"]')
      .map(function () { return $(this).val(); }).get();

    while (i < getResult.length) {
      this.dataTampReturn.push({
        'p_code': code,
        'p_status': this.model.status,
        'p_result': getResult[i],
        'action': 'default'
      });
      i++;
    }

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
        this.dalservice.ExecSp(this.dataTampReturn, this.APIController, this.APIRouteForReturn)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showNotification('bottom', 'right', 'success');
                this.callGetrow();
                this.redirectTo('/contract/subdeliverylist/deliverydetail/' + this.param)
                this.showSpinner = false;
              } else {
                this.showSpinner = false;
                this.swalPopUpMsg(parse.data);
              }
            },
            error => {
              this.showSpinner = false;
              const parse = JSON.parse(error);
              this.swalPopUpMsg(parse.data)
            });
      } else {
        this.showSpinner = false;
      }
    });
  }
  //#endregion btnReturn

  //#region List tabs
  AssetList() {
    this.route.navigate(['/contract/subdeliverylist/deliverydetail/' + this.param + '/deliverydetaillist', this.param], { skipLocationChange: true });
  }

  DocumentList() {
    this.route.navigate(['/contract/subdeliverylist/deliverydetail/' + this.param + '/documentlist', this.model.application_no], { skipLocationChange: true });
  }

  DocumentRealizationList() {
    this.route.navigate(['/contract/subdeliverylist/deliverydetail/' + this.param + '/documentrealizationlist', this.param], { skipLocationChange: true });
  }

  LogList() {
    this.route.navigate(['/contract/subdeliverylist/deliverydetail/' + this.param + '/loglist', this.model.application_no], { skipLocationChange: true });
  }
  //#endregion List tabs

  redirectTo(uri: string) {
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.route.navigate([uri]));
    $('#tabAssetList .nav-link').addClass('active');
  }
}