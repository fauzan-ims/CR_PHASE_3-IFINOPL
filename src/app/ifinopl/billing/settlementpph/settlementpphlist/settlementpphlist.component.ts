import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { Location } from '@angular/common';
import swal from 'sweetalert2';

@Component({
  moduleId: module.id,
  selector: 'app-settlementpphlist',
  templateUrl: './settlementpphlist.component.html',
})

export class SettlementpphlistComponent extends BaseComponent implements OnInit {
  // variable
  public listsettlementpph: any = [];
  public tampInvoiceStatus: String;
  public tampSettlementStatus: String;
  public tampSettlementType: String;
  public tempFile: any;
  private tampDocumentinvoiceno: String;
  private base64textString: string;
  private dataTampPush: any = [];
  public tamps = new Array();
  public tampHidden: Boolean;
  public selectedAll: any;
  public checkedList: any = [];
  public checkedListValidate: any = [];
  public pageType: String;
  public pageStatus: Boolean;
  private tempFileSize: any;
  private dataTamp: any = [];
  public tampoverdueDays: any;


  private APIController: String = 'Invoice';
  private APIControllerInvoicePph: String = 'InvoicePph';
  private APIControllerSysGlobalparam: String = 'SysGlobalparam';

  private APIRouteGetrowsForSettlementPphInvoice: String = 'ExecSpForGetrowsSettlementPphInvoice';
  private APIRouteForUploadFile: String = 'Upload';
  private APIRouteForPriviewFile: String = 'Priview';
  private APIRouteForDeleteFile: String = 'Deletefile';
  private APIRouteForProceed: String = 'ExecSpForProceed';
  private APIRouteForDownload: String = 'DownloadFileWithData';
  private APIRouteForDeleteUploadData: String = 'DeleteUploadData';
  private APIRouteForUploadData: String = 'UploadDataInvoicePph';
  private APIRouteForUploadDataPost: String = 'ExecSpUploadData';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForGetRow: String = 'GETROW';

  private RoleAccessCode = 'R00020590000000A'; // role access 

  // form 2 way binding
  model: any = {};

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
    private _location: Location,
    private _elementRef: ElementRef,
  ) { super(); }

  ngOnInit() {
    this.compoSide(this._location, this._elementRef, this.route);
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.tampInvoiceStatus = 'ALL';
    this.tampoverdueDays = 'ALL';
    this.tampSettlementStatus = 'HOLD';
    this.tampSettlementType = 'PKP';
    this.loadData();
    this.callGetrowGlobalParam()
    this.tampHidden = true;
    this.showSpinner = false;
  }

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

        let paramTamps = {};
        paramTamps = {
          'p_settlement_status': this.tampSettlementStatus,
          'p_settlement_type': this.tampSettlementType,
          'p_overdue_days': this.tampoverdueDays
        };
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push(this.JSToNumberFloats(paramTamps))

        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteGetrowsForSettlementPphInvoice).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listsettlementpph = parse.data;
          // if use checkAll use this
          $('#checkalltable').prop('checked', false);
          // end checkall
          if (parse.data != null) {
            this.listsettlementpph.numberIndex = dtParameters.start;
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

  //#region InvoiceStatus
  InvoiceStatus(event) {
    this.tampInvoiceStatus = event.target.value;
    $('#datatableSettlementPphList').DataTable().ajax.reload();
  }
  //#endregion InvoiceStatus

  overdueDays(event) {
    this.tampoverdueDays = event.target.value;
    $('#datatableSettlementPphList').DataTable().ajax.reload();
  }

  //#region SettlementStatus
  SettlementStatus(event) {
    this.tampSettlementStatus = event.target.value;
    $('#datatableSettlementPphList').DataTable().ajax.reload();
  }
  //#endregion SettlementStatus

  //#region SettlementType
  SettlementType(event) {
    this.tampSettlementType = event.target.value;
    $('#datatableSettlementPphList').DataTable().ajax.reload();
  }
  //#endregion SettlementType

  //#region button add
  btnAdd() {
    this.route.navigate(['/billing/subsettlementpphlist/settlementpphdetail']);
  }
  //#endregion button add

  //#region button edit
  btnEdit(codeEdit: String) {
    this.route.navigate(['/billing/subsettlementpphlist/settlementpphdetail', codeEdit]);
  }
  //#endregion button edit

  //#region Uploat image
  onUpload(event, invoice_no: String) {
    const files = event.target.files;
    const file = files[0];

    if (this.CheckFileSize(files[0].size, this.tempFileSize)) {
      this.swalPopUpMsg('V;File size must be less or equal to ' + this.tempFileSize + ' MB');
      this.loadData();
    } else {
      if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();

        reader.readAsDataURL(event.target.files[0]); // read file as data url

        reader.onload = (event) => {
          reader.onload = this.handleFileuploadImage.bind(this);
          reader.readAsBinaryString(file);
        }
      }
      this.tempFile = files[0].name;
      this.tampDocumentinvoiceno = invoice_no;
      this.showSpinner = false;
    }
  }
  //#endregion upload image

  //#region button delete image
  deleteImage(invoice_no, file_name, file_path) {
    const usersJson: any[] = Array.of();

    usersJson.push({
      p_invoice_no: invoice_no,
      p_file_paths: file_path,
      p_file_name: file_name,

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
                $('#datatableSettlementPphList').DataTable().ajax.reload();
                this.tempFile = undefined;
                this.showNotification('bottom', 'right', 'success');
                this.showSpinner = false;
              } else {
                this.showSpinner = false;
                this.swalPopUpMsg(parse.message);
              }
              this.loadData();
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
  handleFileuploadImage(event) {
    this.showSpinner = true;
    const binaryString = event.target.result;
    this.base64textString = btoa(binaryString);
    this.tamps.push({
      p_header: 'INVOICE_PPH',
      p_module: 'IFINOPL',
      p_child: this.tampDocumentinvoiceno,
      p_invoice_no: this.tampDocumentinvoiceno,
      p_file_paths: this.tampDocumentinvoiceno,
      p_file_name: this.tempFile,
      p_base64: this.base64textString
    });
    this.dalservice.UploadFile(this.tamps, this.APIControllerInvoicePph, this.APIRouteForUploadFile)
      .subscribe(
        res => {
          this.tamps = new Array();
          const parses = JSON.parse(res);
          if (parses.result === 1) {
            $('#datatableSettlementPphList').DataTable().ajax.reload();
            this.showSpinner = false;
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
          $('#datatableSettlementPphList').DataTable().ajax.reload();
        });
  }
  //#endregion convert to base64

  //#region button priview image
  priviewFile(file_name, file_path) {
    this.showSpinner = true;
    const usersJson: any[] = Array.of();

    usersJson.push({
      p_file_name: file_name,
      p_file_paths: file_path
    });

    this.dalservice.PriviewFile(usersJson, this.APIControllerInvoicePph, this.APIRouteForPriviewFile)
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

  //#region button Proceed
  btnProceed() {
    this.checkedList = [];
    this.checkedListValidate = [];
    for (let i = 0; i < this.listsettlementpph.length; i++) {
      this.checkedList.push(this.listsettlementpph[i].selected);
      if (this.listsettlementpph[i].selected) {
        this.checkedListValidate.push(this.listsettlementpph[i].invoice_no);
      }
    }

    // jika tidak di checklist
    if (this.checkedListValidate.length === 0) {
      swal({
        title: this._listdialogconf,
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-danger'
      }).catch(swal.noop)
      return
    }

    this.dataTampPush = [];
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
        var j = 0;
        var getInvoiceNo = $('[name="p_invoice_no"]')
          .map(function () { return $(this).val(); }).get();

        var getReffNo = $('[name="p_payment_reff_no"]')
          .map(function () { return $(this).val(); }).get();

        var getReffDate = $('[name="p_payment_reff_date"]')
          .map(function () { return $(this).val(); }).get();

        while (j < getReffNo.length) {

          while (j < getReffDate.length) {

            while (j < getInvoiceNo.length) {

              while (j < this.listsettlementpph.length) {

                if (this.checkedList[j]) {
                  if (getReffDate[j] === '') {
                    getReffDate[j] = undefined;
                  }

                  this.dataTampPush.push(this.JSToNumberFloats({
                    p_invoice_no: getInvoiceNo[j],
                    p_payment_reff_date: this.dateFormatList(getReffDate[j]),
                    p_payment_reff_no: getReffNo[j]
                  }));
                }

                j++;
              }
              j++;
            }
            j++;
          }
          j++
        }
        // }


        this.dalservice.ExecSp(this.dataTampPush, this.APIControllerInvoicePph, this.APIRouteForProceed)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                // if (this.checkedList.length == j + 1) {
                this.showSpinner = false;
                this.showNotification('bottom', 'right', 'success');
                $('#datatableSettlementPphList').DataTable().ajax.reload();
                // }
              } else {
                this.swalPopUpMsg(parse.data);
                this.showSpinner = false;
              }
            },
            error => {
              this.showSpinner = false;
              const parse = JSON.parse(error);
              this.swalPopUpMsg(parse.data)
            });
      }
    });
  }
  //#endregion button Proceed

  //#region button save list
  btnSave() {
    this.showSpinner = true;

    this.dataTampPush = [];

    var i = 0;

    var getID = $('[name="p_id"]')
      .map(function () { return $(this).val(); }).get();

    var getReffNo = $('[name="p_payment_reff_no"]')
      .map(function () { return $(this).val(); }).get();

    var getReffDate = $('[name="p_payment_reff_date"]')
      .map(function () { return $(this).val(); }).get();

    while (i < getID.length) {

      while (i < getReffDate.length) {

        while (i < getReffNo.length) {
          if (getReffDate[i] === '') {
            getReffDate[i] = undefined;
          }
          this.dataTampPush.push({
            p_id: getID[i],
            p_payment_reff_date: this.dateFormatList(getReffDate[i]),
            p_payment_reff_no: getReffNo[i]
          });
          i++;
        }
        i++;
      }
      i++;
    }

    //#region web service
    this.dalservice.Update(this.dataTampPush, this.APIControllerInvoicePph, this.APIRouteForUpdate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.showNotification('bottom', 'right', 'success');
            $('#datatableSettlementPphList').DataTable().ajax.reload();
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
    //#endregion web service
  }
  //#endregion button save list

  //#region btnDownload
  btnDownload() {
    const dataParam = [
      {
        'p_application_no': '',
        'p_overdue_days': this.tampoverdueDays
      }
    ];

    this.showSpinner = true;
    this.dalservice.DownloadFileWithData(dataParam, this.APIControllerInvoicePph, this.APIRouteForDownload).subscribe(res => {
      var contentDisposition = res.headers.get('content-disposition');
      var filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();
      const blob = new Blob([res.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      this.showSpinner = false;
    }, err => {
      this.showSpinner = false;
      const parse = JSON.parse(err);
      this.swalPopUpMsg(parse.data);
    });
  }
  //#endregion btnDownload 

  //#region upload excel reader
  handleFile(event) {
    this.showSpinner = true;

    const binaryString = event.target.result;
    this.base64textString = btoa(binaryString);

    this.tamps.push({
      p_module: 'IFINOPL',
      p_header: 'INVOICE_PPH',
      p_child: '0000',
      filename: this.tempFile,
      base64: this.base64textString,
      action: ''
    });

  }

  onUploadReader(event) {
    this.tamps = []
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
      this.tempFile = files[0].name;
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
        if (result.value) {
          this.dalservice.UploadFile(this.tamps, this.APIControllerInvoicePph, this.APIRouteForDeleteUploadData)
            .subscribe(
              res => {
                const parse = JSON.parse(res);
                if (parse.result === 1) {
                  this.dalservice.UploadFile(this.tamps, this.APIControllerInvoicePph, this.APIRouteForUploadData)
                    .subscribe(
                      res => {
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                          this.dalservice.ExecSp(this.tamps, this.APIControllerInvoicePph, this.APIRouteForUploadDataPost)
                            .subscribe(
                              res => {
                                const parse = JSON.parse(res);
                                if (parse.result === 1) {
                                  $('#datatableSettlementPphList').DataTable().ajax.reload();
                                  this.showNotification('bottom', 'right', 'success');
                                  $('#fileControl').val(undefined);
                                  this.tempFile = '';
                                  this.showSpinner = false;
                                }
                                else {
                                  $('#fileControl').val(undefined);
                                  this.tempFile = '';
                                  this.swalPopUpMsg(parse.data);
                                  this.showSpinner = false;
                                }
                              }, error => {
                                const parse = JSON.parse(error);
                                this.swalPopUpMsg(parse.data);
                                $('#fileControl').val(undefined);
                                this.tempFile = '';
                                this.showSpinner = false;
                              });
                        }
                        else {
                          $('#fileControl').val(undefined);
                          this.tempFile = '';
                          this.swalPopUpMsg(parse.data);
                          this.showSpinner = false;
                        }
                      }, error => {
                        const parse = JSON.parse(error);
                        this.swalPopUpMsg(parse.data);
                        $('#fileControl').val(undefined);
                        this.tempFile = '';
                        this.showSpinner = false;
                      });
                }
                else {
                  $('#fileControl').val(undefined);
                  this.tempFile = '';
                  this.swalPopUpMsg(parse.data);
                  this.showSpinner = false;
                }
              }, error => {
                const parse = JSON.parse(error);
                this.swalPopUpMsg(parse.data);
                $('#fileControl').val(undefined);
                this.tempFile = '';
                this.showSpinner = false;
              });
          // this.dalservice.UploadFile(this.tamps, this.APIControllerInvoicePph, this.APIRouteForUploadDataFile)
          //   .subscribe(
          //     res => {
          //       const parse = JSON.parse(res);
          //       if (parse.result === 1) {
          //         $('#datatableSettlementPphList').DataTable().ajax.reload();
          //         this.showNotification('bottom', 'right', 'success');
          //         $('#fileControl').val(undefined);
          //         this.tempFile = '';
          //         this.showSpinner = false;
          //       }
          //       else {
          //         $('#fileControl').val(undefined);
          //         this.tempFile = '';
          //         this.swalPopUpMsg(parse.data);
          //         this.showSpinner = false;
          //       }
          //     }, error => {
          //       const parse = JSON.parse(error);
          //       this.swalPopUpMsg(parse.data);
          //       $('#fileControl').val(undefined);
          //       this.tempFile = '';
          //       this.showSpinner = false;
          //     });
        } else {
          this.showSpinner = false;
          $('#fileControl').val(undefined);
          this.tempFile = '';

        }
      })
    }

  }
  //#endregion button select image

  //#region select
  selectAll() {
    for (let i = 0; i < this.listsettlementpph.length; i++) {
      if (this.listsettlementpph[i].is_calculated !== '1') {
        this.listsettlementpph[i].selected = this.selectedAll;
      }
    }
  }

  checkIfAllTableSelected() {
    this.selectedAll = this.listsettlementpph.every(function (item: any) {
      return item.selected === true;
    })
  }

  //#endregion select
}