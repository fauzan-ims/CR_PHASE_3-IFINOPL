import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
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
  templateUrl: './spdeliverysettlementdetail.component.html'
})

export class SpdeliverysettlementdetailComponent extends BaseComponent implements OnInit {

  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public spdeliverysettlementData: any = [];
  public settlementData: any = [];
  public tempFile: any;
  public received_date: any;
  public received_remarks: any;
  public tampHidden: Boolean;
  public branchCode: any = [];
  public lookupbranch: any = [];
  public lookupAgreement: any = [];
  public lookupbranchname: any = [];
  public received_status: any = [];
  public NumberOnlyPattern = this._numberonlyformat;
  public listspdeliverysettlementdetail: any = [];
  public listspdeliverysettlement: any = [];
  public isReadOnly: Boolean = false;
  public spdeliveryData: any = [];
  public lookupDeliveryCourier: any = [];
  public lookupDeliverycollector: any = [];
  private dataTamp: any = [];
  public isSuccess: Boolean = false;
  private rolecode: any = [];
  private setStyle: any = [];
  private dataRoleTamp: any = [];
  private base64textString: string;
  private tampDocumentCode: String;
  private tamps = new Array();


  private APIController: String = 'WarningLetterDelivery';
  private APIControllerWarningLetterDeliveryDetail: String = 'WarningLetterDeliveryDetail';
  private APIControllerSysGlobalparam: String = 'SysGlobalparam';

  private APIRouteForPriviewFile: String = 'Priview';
  private APIRouteForUploadFile: String = 'Upload';
  private APIRouteForDeleteFile: String = 'Deletefile';
  private APIRouteForUpdate: String = 'Update';
  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteLookupSysBranch: String = 'GetRowsLookupSysBranch';
  private APIControllerMasterCollector: String = 'MasterCollector';
  private APIControllerSysgeneralsubcode: String = 'SysGeneralSubcode';
  private APIRouteForGetRows: String = 'GetRowsForSettlement';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForSettlement: String = 'ExecSpForSettlement';
  public idDetailList: string;
  public readOnlyListDetail: string;

  private RoleAccessCode = 'R00021030000000A';

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = true;
  // end

  // datatable
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  checkedList: any;
  selectedAll: any;
  selectedAllTable: any;

  constructor(private dalservice: DALService,
    public getRouteparam: ActivatedRoute,
    public route: Router,
    private _elementRef: ElementRef, private datePipe: DatePipe
  ) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);

    if (this.param != null) {
      this.isReadOnly = true;

      // call web service
      this.callGetrow();
      this.callGetrowDoc();
      this.loadData();
    } else {
      this.showSpinner = false;
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

        this.dalservice.Getrows(dtParameters, this.APIControllerWarningLetterDeliveryDetail, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listspdeliverysettlementdetail = parse.data;

          if (parse.data != null) {
            this.listspdeliverysettlementdetail.numberIndex = dtParameters.start;
          }


          // if use checkAll use this
          $('#checkall').prop('checked', false);
          // end checkall

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });

        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, targets: [1, 4, 5, 6, 7] }], // for disabled coloumn
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

          this.showSpinner = false;
        },
        error => {
          console.log('There was an error while Retrieving Data(API) !!!' + error);
        });
  }
  //#endregion getrow data

  //#region getrow data
  callGetrowDoc() {

    this.dataTamp = [{
      'p_code': 'FUPS'
    }];


    this.dalservice.Getrow(this.dataTamp, this.APIControllerSysGlobalparam, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];
          parsedata.code = this.param;
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

  //#region btnSettlement
  btnSettlement(code: string) {
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
      if (result.value) {
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForSettlement)
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
        this.showSpinner = false;
      }
    })
  }
  //#end region btnSettlement


  //#region  form submit
  onFormSubmit(spdeliverysettlementForm: NgForm, isValid: boolean) {
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
    this.spdeliverysettlementData = this.JSToNumberFloats(spdeliverysettlementForm);
    this.spdeliverysettlementData.p_generate_type = 'MANUAL';
    const usersJson: any[] = Array.of(this.spdeliverysettlementData);
    if (this.param != null) {
      this.spdeliverysettlementData.p_code = this.param;
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
    }
  }
  //#endregion form submit

  //#region button back
  btnBack() {
    this.route.navigate(['/collection/subspdeliverysettlementlist']);
    $('#v').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region button select image
  onUpload(event, code: String) {
    const files = event.target.files;
    const file = files[0];

    if (this.CheckFileSize(files[0].size, this.model.value)) {
      this.swalPopUpMsg('V;File size must be less or equal to ' + this.model.value + ' MB');
      $('#datatableSpDeliverySettlementDetail').DataTable().ajax.reload(); //ganti dengan nama datatable jika ini di list
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
      p_header: 'SP_DELIVERY_SETTLEMENT',
      p_module: 'IFINOPL',
      p_child: this.param,
      p_id: this.tampDocumentCode,
      p_file_paths: this.tampDocumentCode,
      p_file_name: this.tempFile,
      p_base64: this.base64textString,

    });
    console.log(this.tamps);


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
          $('#datatableSpDeliverySettlementDetail').DataTable().ajax.reload();
        },
        error => {
          this.showSpinner = false;
          this.tamps = new Array();
          // tslint:disable-next-line:no-shadowed-variable
          const parses = JSON.parse(error);
          this.swalPopUpMsg(parses.message);
          $('#datatableSpDeliverySettlementDetail').DataTable().ajax.reload();
        });
  }
  //#endregion convert to base64

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
  deleteImage(code: String, paths: any, file_name: any) {
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
              $('#datatableSpDeliverySettlementDetail').DataTable().ajax.reload();
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
  //#region lookup branch
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

        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteLookupSysBranch).subscribe(resp => {
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
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [1, 4] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
    // } , 1000);
  }

  btnSelectRowBranch(branch_code: String, branch_name: String) {
    this.model.branch_code = branch_code;
    this.model.branch_name = branch_name;
    $('#lookupModalSysBranch').modal('hide');
  }
  //#endregion lookup branch

  //#region lookup DeliveryCourier
  btnLookupDeliveryCourier() {
    $('#datatableLookupDeliveryCourier').DataTable().clear().destroy();
    $('#datatableLookupDeliveryCourier').DataTable({
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

        this.dalservice.Getrows(dtParameters, this.APIControllerSysgeneralsubcode, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupDeliveryCourier = parse.data;
          if (parse.data != null) {
            this.lookupDeliveryCourier.numberIndex = dtParameters.start;
          }


          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [1, 4] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
    // } , 1000);
  }

  btnSelectRowDeliveryCourier(delivery_courier_code: String, description: String) {
    this.model.delivery_courier_code = delivery_courier_code;
    this.model.description = description;
    this.model.delivery_collector_code = '';
    this.model.collector_name = '';
    $('#lookupModalDeliveryCourier').modal('hide');
  }
  //#endregion lookup DeliveryCourier

  //#region lookup Deliverycollector
  btnLookupDeliverycollector() {
    $('#datatableLookupDeliveryCourier').DataTable().clear().destroy();
    $('#datatableLookupDeliveryCourier').DataTable({
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

        this.dalservice.Getrows(dtParameters, this.APIControllerMasterCollector, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupDeliverycollector = parse.data;
          if (parse.data != null) {
            this.lookupDeliverycollector.numberIndex = dtParameters.start;
          }


          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [1, 4] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
    // } , 1000);
  }
  btnSelectRowDeliverycollector(delivery_collector_code: String, collector_name: String) {
    this.model.delivery_collector_code = delivery_collector_code;
    this.model.collector_name = collector_name;
    this.model.delivery_courier_code = '';
    this.model.description = '';
    $('#lookupModalDeliverycollector').modal('hide');
  }
  //#endregion lookup DeliveryCollector

  //#region ddl ReceivedStatus
  ReceivedStatus(status: any, id: any) {

    this.idDetailList = id;

    this.readOnlyListDetail = status.target.value;

    this.listspdeliverysettlement = [];

    var i = 0;

    const getID = $('[name="p_id"]')
      .map(function () { return $(this).val(); }).get();

    const getStatus = $('[name="p_received_status"]')
      .map(function () { return $(this).val(); }).get();

    const getReceived = $('[name="p_received_by"]')
      .map(function () { return $(this).val(); }).get();

    const getDate = $('[name="p_received_date"]')
      .map(function () { return $(this).val(); }).get();

    const getRemarks = $('[name="p_received_remarks"]')
      .map(function () { return $(this).val(); }).get();

    while (i < getID.length) {

      while (i < getStatus.length) {

        while (i < getReceived.length) {

          while (i < getDate.length) {

            while (i < getRemarks.length) {

              if (getID[i] == this.idDetailList) {
                if (getDate[i] === '') {
                  getDate[i] = undefined;
                }
                if (getRemarks[i] === '') {
                  getRemarks[i] = undefined;
                }
                if (getReceived[i] === '') {
                  getReceived[i] = undefined;
                }

                this.listspdeliverysettlement = [{
                  p_id: getID[i],
                  p_received_status: getStatus[i],
                  p_received_by: getReceived[i],
                  p_received_date: this.dateFormatList(getDate[i]),
                  p_received_remarks: getRemarks[i],
                }];

                //#region web service
                this.dalservice.Update(this.listspdeliverysettlement, this.APIControllerWarningLetterDeliveryDetail, this.APIRouteForUpdate)
                  .subscribe(
                    res => {
                      const parse = JSON.parse(res);
                      if (parse.result === 1) {
                        $('#datatableSpDeliverySettlementDetail').DataTable().ajax.reload();
                      } else {
                      }
                    },
                    error => {
                      const parse = JSON.parse(error);
                    });
                //#endregion web service
              }

              i++;
            }
            i++;
          }
          i++;
        }
        i++;
      }
      i++;
    }

  }
  //#endregion ddl ReceivedStatus

  //#region button save in list
  btnSaveList() {

    this.listspdeliverysettlement = [];

    let i = 0;
    let index = 0;

    const getID = $('[name="p_id"]')
      .map(function () { return $(this).val(); }).get();

    const getStatus = $('[name="p_received_status"]')
      .map(function () { return $(this).val(); }).get();

    const getReceived = $('[name="p_received_by"]')
      .map(function () { return $(this).val(); }).get();

    const getDate = $('[name="p_received_date"]')
      .map(function () { return $(this).val(); }).get();

    const getRemarks = $('[name="p_received_remarks"]')
      .map(function () { return $(this).val(); }).get();

    while (i < getID.length) {

      while (i < getStatus.length) {

        while (i < getReceived.length) {

          while (i < getDate.length) {

            while (i < getRemarks.length) {

              if (getStatus[i] === 'NOT DELIVERED') {
                getDate[i] = undefined;
                getReceived[i] = undefined;
              } else {
                if (getDate[i] === '' || getRemarks[i] === '' || getReceived[i] === '') {
                  swal({
                    title: 'Warning',
                    text: 'Please Fill a Mandatory Field',
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-warning',
                    type: 'warning'
                  }).catch(swal.noop)
                  return;
                }
              }

              this.listspdeliverysettlement = [{
                p_id: getID[i],
                p_received_status: getStatus[i],
                p_received_by: getReceived[i],
                p_received_date: this.dateFormatList(getDate[i]),
                p_received_remarks: getRemarks[i],
                // p_file_name: getFileName[i],
                // p_paths: getpaths[i],
                //p_base64: this.tamps[i].base64
              }];

              this.showSpinner = true;
              //#region web service

              this.dalservice.Update(this.listspdeliverysettlement, this.APIControllerWarningLetterDeliveryDetail, this.APIRouteForUpdate)
                .subscribe(
                  res => {
                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                      index += 1;
                      if (index === getID.length) {
                        this.showSpinner = false;
                        index += 1;
                        this.showNotification('bottom', 'right', 'success');
                        $('#datatableSpDeliverySettlementDetail').DataTable().ajax.reload();
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
              //#endregion web service
              i++;
            }
            i++;
          }
          i++;
        }
        i++;
      }
      i++;
    }

  }
  dateFomatList(arg0: any) {
    throw new Error('Method not implemented.');
  }
  //#endregion button save in list

}
