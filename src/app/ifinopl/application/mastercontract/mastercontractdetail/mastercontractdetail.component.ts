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
  templateUrl: './mastercontractdetail.component.html'
})

export class MastercontractdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public isApproval: Boolean = false;
  public isReadOnly: Boolean = false;
  private dataTamp: any = [];
  public setStyle: any = [];
  public tempFileMemo: any;
  public tampHiddenMemo: Boolean;
  public tampHidden: Boolean;
  public masterContractData: any = [];
  public id: any;
  private base64textString: string;
  private tamps = new Array();
  public tempFile: any;
  private tempFileSize: any;
  public tampDocumentCode: String;
  public lookupmaincontractno: any = [];
  public lookupMainContractTc: any = [];
  public contractStatus: String;
  public contractNo: String;
  public mainContractFileName: String;
  public mainContractFilePath: String;

  //conroller
  private APIController: String = 'ApplicationMain';
  private APIControllerApplicationExtention: String = 'ApplicationExtention';
  private APIControllerApplicationDoc: String = 'ApplicationDoc';
  private APIControllerSysGlobalparam: String = 'SysGlobalparam';
  private APIControllerMainContract: String = 'MainContract';
  private APIControllerMainContractTc: String = 'MainContractTc';

  //route
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForPost: String = 'ExecSpForPost';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForUploadFile: String = 'Upload';
  private APIRouteForDeleteFile: String = 'Deletefile';
  private APIRouteForPriviewFile: String = 'Priview';
  private APIRouteForUploadMemoFile: String = 'UploadMemo';
  private APIRouteForDeleteMemoFile: String = 'DeleteMemofile';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForExecSpForValidate: String = 'ExecSpForValidate';

  private RoleAccessCode = 'R00022360000000A'; // role access 

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
    this.isReadOnly = true;
    this.model.main_contract_status = 'NEW'
    this.model.is_standart = '1'

    this.wizard();
    // call web service
    this.callGetrowAppExtentio();
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

  //#region callGetrowGlobalParam
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
  //#endregion callGetrowGlobalParam

  //#region callGetrow
  callGetrow() {

    this.dataTamp = [{
      'p_application_no': this.param
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          if (parsedata.is_blacklist_area === '1') {
            parsedata.is_blacklist_area = true;
          } else {
            parsedata.is_blacklist_area = false;
          }

          if (parsedata.is_blacklist_job === '1') {
            parsedata.is_blacklist_job = true;
          } else {
            parsedata.is_blacklist_job = false;
          }

          if (parsedata.is_approval === '1') {
            this.isApproval = true;
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
  //#endregion callGetrow

  //#region callGetrowAppExtentio
  callGetrowAppExtentio() {

    this.dataTamp = [{
      'p_application_no': this.param
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIControllerApplicationExtention, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          this.id = parsedata.id

          this.contractStatus = parsedata.main_contract_status
          this.contractNo = parsedata.main_contract_no
          this.mainContractFileName = parsedata.main_contract_file_name
          this.mainContractFilePath = parsedata.main_contract_file_path

          if (this.contractNo === undefined || this.contractNo === '' || this.contractNo == null) {
            $('#tclist').remove();
            $('#chargeslist').remove();
            this.model.is_standart = '1'
          } else {
            setTimeout(() => {
              this.wizard();
              this.tcwiz();
            }, 200);
          }

          if (parsedata.main_contract_file_name === '' || parsedata.main_contract_file_path == null) {
            this.tampHidden = true;
          } else {
            this.tampHidden = false;
          }

          if (parsedata.memo_file_name === '' || parsedata.memo_file_path == null) {
            this.tampHiddenMemo = true;
          } else {

            this.tampHiddenMemo = false;
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

  reloadAppExtentio() {

    this.dataTamp = [{
      'p_application_no': this.param
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIControllerApplicationExtention, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          this.id = parsedata.id

          this.contractStatus = parsedata.main_contract_status
          this.contractNo = parsedata.main_contract_no
          this.mainContractFileName = parsedata.main_contract_file_name
          this.mainContractFilePath = parsedata.main_contract_file_path

          if (parsedata.main_contract_file_name === '' || parsedata.main_contract_file_path == null) {
            this.tampHidden = true;
          } else {
            this.tampHidden = false;
          }

          if (parsedata.memo_file_name === '' || parsedata.memo_file_path == null) {
            this.tampHiddenMemo = true;
          } else {
            this.tampHiddenMemo = false;
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
  //#endregion callGetrowAppExtentio

  redirectTo(uri: string) {
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.route.navigate([uri]));
    $('#tabMasterContractTC .nav-link').addClass('active');
  }

  //#region form submit 
  onFormSubmit(applicationextentionForm: NgForm, isValid: boolean) {
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

    this.masterContractData = this.JSToNumberFloats(applicationextentionForm);
    const usersJson: any[] = Array.of(this.masterContractData);
    if (this.model.main_contract_status === 'NEW') {
      swal({
        title: 'Are you sure to Generate New Main Contract No ?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        confirmButtonText: 'Yes',
        buttonsStyling: false
      }).then((result) => {
        this.showSpinner = true;
        if (result.value) {
          if (this.id != null) {
            // call web service
            this.dalservice.Update(usersJson, this.APIControllerApplicationExtention, this.APIRouteForUpdate)
              .subscribe(
                res => {
                  const parse = JSON.parse(res);
                  if (parse.result === 1) {
                    this.showNotification('bottom', 'right', 'success');
                    this.callGetrow();
                    this.callGetrowAppExtentio();
                    this.callGetrowGlobalParam();
                    this.redirectTo('/application/subapplicationtbodocumentlist/applicationtbodocumentdetail/' + this.param)
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
            // call web service
            this.dalservice.Insert(usersJson, this.APIControllerApplicationExtention, this.APIRouteForInsert)
              .subscribe(
                res => {
                  const parse = JSON.parse(res);
                  if (parse.result === 1) {
                    this.showNotification('bottom', 'right', 'success');
                    this.callGetrow();
                    this.callGetrowAppExtentio();
                    this.callGetrowGlobalParam();
                    this.redirectTo('/application/subapplicationtbodocumentlist/applicationtbodocumentdetail/' + this.param)
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
          }
        } else {
          this.showSpinner = false;
        }
      });
    } else {

      if (this.id != null) {
        // call web service
        this.dalservice.Update(usersJson, this.APIControllerApplicationExtention, this.APIRouteForUpdate)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showNotification('bottom', 'right', 'success');
                this.callGetrow();
                this.callGetrowAppExtentio();
                this.callGetrowGlobalParam();
                this.redirectTo('/application/subapplicationtbodocumentlist/applicationtbodocumentdetail/' + this.param)
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
        // call web service
        this.dalservice.Insert(usersJson, this.APIControllerApplicationExtention, this.APIRouteForInsert)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showNotification('bottom', 'right', 'success');
                this.callGetrow();
                this.callGetrowAppExtentio();
                this.callGetrowGlobalParam();
                this.redirectTo('/application/subapplicationtbodocumentlist/applicationtbodocumentdetail/' + this.param)
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
      }
    }

  }
  //#endregion form submit

  //#region button back
  btnBack() {
    this.route.navigate(['/application/subapplicationtbodocumentlist']);
    $('#datatableApplicationTboDocumentList').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region btnPost
  btnPost() {
    this.dataTamp = [{
      'p_application_no': this.param,
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
        this.dalservice.ExecSp(this.dataTamp, this.APIControllerApplicationDoc, this.APIRouteForPost)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showSpinner = false;
                this.showNotification('bottom', 'right', 'success');
                this.route.navigate(['/application/subapplicationtbodocumentlist']);
                $('#datatableApplicationTboDocumentList').DataTable().ajax.reload();
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

  //#region mainContractStatus
  mainContractStatus(event: any) {
    this.model.main_contract_status = event.target.value;

    if (this.contractStatus === 'NEW' && this.model.main_contract_status === 'EXISTING') {
      this.model.main_contract_no = undefined
      this.model.main_contract_file_name = undefined
      this.model.main_contract_file_path = undefined
      this.tampHidden = true;
    } else if (this.contractStatus === 'EXISTING' && this.model.main_contract_status === 'NEW') {
      this.model.main_contract_no = undefined
      this.model.main_contract_file_name = undefined
      this.model.main_contract_file_path = undefined
      this.tampHidden = true;
    }
    else {
      this.model.main_contract_no = this.contractNo
      this.model.main_contract_file_name = this.mainContractFileName
      this.model.main_contract_file_path = this.mainContractFilePath

      if (this.mainContractFileName === '' || this.mainContractFilePath == null) {
        this.tampHidden = true;
      } else {
        this.tampHidden = false;
      }
    }
  }
  //#endregion mainContractStatus

  //#region contractStandartStatus
  contractStandartStatus(event: any) {
    this.model.is_standart = event.target.value;
  }
  //#endregion contractStandartStatus

  //#region convert to base64
  handleFile(event) {
    this.showSpinner = true;
    const binaryString = event.target.result;
    this.base64textString = btoa(binaryString);

    this.tamps.push({
      p_header: 'APPLICATION_EXTENTION',
      p_module: 'IFINOPL',
      p_child: this.param,
      p_id: this.id,
      p_file_paths: this.param,
      p_file_name: this.tempFile,
      p_base64: this.base64textString,
      p_is_standart: this.model.is_standart
    });
    this.dalservice.UploadFile(this.tamps, this.APIControllerApplicationExtention, this.APIRouteForUploadFile)
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
          this.callGetrowAppExtentio();
          this.callGetrowGlobalParam();
        },
        error => {
          this.showSpinner = false;
          this.tamps = new Array();
          const parses = JSON.parse(error);
          this.swalPopUpMsg(parses.message);
          this.callGetrow();
          this.callGetrowAppExtentio();
          this.callGetrowGlobalParam();
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
      this.callGetrowAppExtentio();
      this.callGetrowGlobalParam();
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
      p_id: this.id,
      p_file_name: file_name,
      p_branch_code: this.param,
      p_file_paths: row2,
      p_is_standart: this.model.is_standart
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
        this.dalservice.DeleteFile(usersJson, this.APIControllerApplicationExtention, this.APIRouteForDeleteFile)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showSpinner = false;
                this.callGetrow();
                this.callGetrowAppExtentio();
                this.callGetrowGlobalParam();
                this.tempFile = undefined;
                $('#fileControl').val(undefined);
                this.showNotification('bottom', 'right', 'success');
              } else {
                this.showSpinner = false;
                $('#fileControl').val(undefined);
                this.swalPopUpMsg(parse.message);
              }
              this.callGetrow();
              this.callGetrowAppExtentio();
              this.callGetrowGlobalParam();
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

    this.dalservice.PriviewFile(usersJson, this.APIControllerApplicationExtention, this.APIRouteForPriviewFile)
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

  //#region MainContractNo
  btnLookupMainContractNo() {
    $('#datatableLookupMainContractNo').DataTable().clear().destroy();
    $('#datatableLookupMainContractNo').DataTable({
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
          'p_application_no': this.param,
          'p_client_no': this.model.client_no,
          'p_level_status': 'ALLOCATION'
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerMainContract, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupmaincontractno = parse.data;
          if (parse.data != null) {
            this.lookupmaincontractno.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          })
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

  btnSelectMainContract(code: String, remarks: String) {
    this.model.main_contract_no = code;
    this.model.remarks = remarks;
    $('#datatableLookupMainContractNo').DataTable().ajax.reload();
    $('#lookupModalMainContractNo').modal('hide');
  }
  //#endregion MainContractNo

  //#region MainContractTc
  btnLookupMainContractTc(main_contract_no: any) {
    $('#datatableLookupMainContractTc').DataTable().clear().destroy();
    $('#datatableLookupMainContractTc').DataTable({
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
          'p_main_contract_no': main_contract_no
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerMainContractTc, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupMainContractTc = parse.data;
          if (parse.data != null) {
            this.lookupMainContractTc.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          })
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }
  //#endregion MainContractTc

  //#region tab
  chargeswiz() {
    this.route.navigate(['/application/subapplicationtbodocumentlist/applicationtbodocumentdetail/' + this.param + '/chargeslist/', this.param], { skipLocationChange: true });
  }

  tcwiz() {
    this.route.navigate(['/application/subapplicationtbodocumentlist/applicationtbodocumentdetail/' + this.param + '/tclist/', this.param], { skipLocationChange: true });
  }

  documentwiz() {
    this.route.navigate(['/application/subapplicationtbodocumentlist/applicationtbodocumentdetail/' + this.param + '/documentlist/', this.param], { skipLocationChange: true });
  }
  //#endregion tab

  //#region validate
  validate() {
    this.showSpinner = true;
    // param tambahan 
    this.dataTamp = [{
      'p_id': this.model.id,
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
        // param tambahan
        this.dalservice.ExecSp(this.dataTamp, this.APIControllerApplicationExtention, this.APIRouteForExecSpForValidate)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.callGetrow();
                this.callGetrowAppExtentio();
                this.callGetrowGlobalParam();
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
  //#endregion validate

  //#region convert to base64
  handleFileMemo(event) {
    this.showSpinner = true;
    const binaryString = event.target.result;
    this.base64textString = btoa(binaryString);

    this.tamps.push({
      p_header: 'APPLICATION_EXTENTION',
      p_module: 'IFINOPL',
      p_child: this.param,
      p_id: this.id,
      p_file_paths: this.param,
      p_file_name: this.tempFileMemo,
      p_base64: this.base64textString,
      p_is_standart: this.model.is_standart
    });
    this.dalservice.UploadFile(this.tamps, this.APIControllerApplicationExtention, this.APIRouteForUploadMemoFile)
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
          this.callGetrowAppExtentio();
          this.callGetrow();
          this.callGetrowGlobalParam();
        },
        error => {
          this.showSpinner = false;
          this.tamps = new Array();
          const parses = JSON.parse(error);
          this.swalPopUpMsg(parses.message);
          this.callGetrowAppExtentio();
          this.callGetrow();
          this.callGetrowGlobalParam();
        });
  }
  //#endregion convert to base64

  //#region button select image
  onUploadMemo(event, id: String) {
    const files = event.target.files;
    const file = files[0];

    if (this.CheckFileSize(files[0].size, this.tempFileSize)) {
      this.swalPopUpMsg('V;File size must be less or equal to ' + this.tempFileSize + ' MB');
      this.callGetrowAppExtentio();
      this.callGetrow();
      this.callGetrowGlobalParam();
    } else {
      if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();

        reader.readAsDataURL(event.target.files[0]); // read file as data url

        reader.onload = (event) => {
          reader.onload = this.handleFileMemo.bind(this);
          reader.readAsBinaryString(file);
        }
      }
      this.tempFileMemo = files[0].name;
    }
  }
  //#endregion button select image

  //#region button delete image
  deleteFileMemo(file_name: any, row2) {
    const usersJson: any[] = Array.of();

    usersJson.push({
      p_id: this.id,
      p_file_name: file_name,
      p_branch_code: this.param,
      p_file_paths: row2,
      p_is_standart: this.model.is_standart
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
        this.dalservice.DeleteFile(usersJson, this.APIControllerApplicationExtention, this.APIRouteForDeleteMemoFile)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showSpinner = false;
                this.callGetrowAppExtentio();
                this.callGetrow();
                this.callGetrowGlobalParam();
                this.tempFileMemo = undefined;
                $('#fileControlMemo').val(undefined);
                this.showNotification('bottom', 'right', 'success');
              } else {
                this.showSpinner = false;
                $('#fileControlMemo').val(undefined);
                this.swalPopUpMsg(parse.message);
              }
              this.callGetrowAppExtentio();
              this.callGetrow();
              this.callGetrowGlobalParam();
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
  priviewFileMemo(row1, row2) {
    this.showSpinner = true;
    const usersJson: any[] = Array.of();

    usersJson.push({
      p_file_name: row1,
      p_file_paths: row2
    });

    this.dalservice.PriviewFile(usersJson, this.APIControllerApplicationExtention, this.APIRouteForPriviewFile)
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
  //#endregion button priview image

}