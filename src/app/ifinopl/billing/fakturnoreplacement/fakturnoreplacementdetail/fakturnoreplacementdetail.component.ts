import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { BaseComponent } from '../../../../../base.component';
import { DataTableDirective } from 'angular-datatables';
import { DALService } from '../../../../../DALservice.service';
import { DatePipe } from '@angular/common';

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './fakturnoreplacementdetail.component.html'
})

export class FakturNoReplacementDetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public NumberOnlyPattern: string = this._numberonlyformat;
  public menuData: any = [];
  public listrole: any = [];
  public listmasterbook: any = [];
  public lookuprole: any = [];
  public lookupparent: any = [];
  public lookupborrower: any = [];
  public lookuplistbook: any = [];
  public lookupModalListBook: any = [];
  public isReadOnly: Boolean = false;
  private dataTamp: any = [];
  public tempFile: any;
  public templatename: any;
  public jumlahchar: any;
  private base64textString: string;
  private tempFileSize: any;
  public setStyle: any = [];
  // --------------------------------------------
  private tamps: any = [];
  public branch_code: String = '';
  public branch_name: String = '';
  public lookupbranch: any = [];
  // --------------------------------------------
  // report
  private APIControllerReport: String = 'Report';
  private APIRouteForDownload: String = 'getReport';



  //controller
  private APIControllerForBorrowTransactionInfo: String = 'FakturNoReplacement';
  private APIControllerForBookBorrowList: String = 'FakturNoReplacementDetail';
  private APIControllerInvoicePph: String = 'FakturNoReplacementDetail';
  private APIControllerSysBranch: String = 'SysBranch';


  //router
  private APIRouteForGetRowsSys: String = 'GetRowsForLookup';
  private APIRouteGetRows: String = 'GetRows';
  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForInsert: String = 'Insert';
  private APIRouteForUpdate: String = 'Update';
  private APIRouteForDelete: String = 'Delete';
  private APIRouteForPost: String = 'ExecSpForPost';
  private APIRouteForCancel: String = 'ExecSpForCancel';
  private APIRouteForReturn: String = 'ExecSpForReturn';
  private APIRouteForDeleteAll: String = 'ExecSpDeleteAllTable';
  private APIRouteForUpload: String = 'UploadDataExcelForCAT';
  private APIRouteForDeleteUploadData: String = 'DeleteUploadData';
  private APIRouteForUploadData: String = 'UploadDataInvoicePph';
  private APIRouteForUploadDataPost: String = 'ExecSpUploadData';
  private APIRouteForCekValidasi: String = 'DownloadExcelWithData';
  private APIRouteForExecSpMsgValidate: String = 'ExecSpMsgValidate';
  // ------------------------------------------------------------
  public tampHidden: Boolean = false;
  // public tampHidden: Boolean = true;
  // ------------------------------------------------------------


  //acces  
  private RoleAccessCode = 'R00024510000001A';

  // checklist
  public selectedAllTable: any;
  public selectedAllLookup: any;
  private checkedList: any = [];

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
    public getRouteparam: ActivatedRoute,
    public route: Router,
    private _elementRef: ElementRef,
    private datePipe: DatePipe,
  ) { super(); }

  //#region ngOnInit
  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    if (this.param != null) {
      this.isReadOnly = true;

      // call web service
      this.callGetrow();
      this.loadData();
    } else {
      this.showSpinner = false;
      this.model.status = 'HOLD';
      this.model.total_rent_amount = 0;
      this.model.total_late_charge_amount = 0;
      this.model.file_name = '';
    }
  }
  //#endregion ngOnInit

  //#region button borrow
  btnPost() {
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
        const dataTamp = [{
          'p_code': this.param
        }];
        this.dalservice.ExecSp(dataTamp, this.APIControllerForBorrowTransactionInfo, this.APIRouteForPost)
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
              const parse = JSON.parse(error);
              this.swalPopUpMsg(parse.data)
            });
      }
    });
  }
  //#endregion button borrow

  //#region button cancel
  btnCancel() {
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
        this.model.status = 'CANCEL';
        const dataTamp = [{
          'p_code': this.param
        }];
        this.dalservice.ExecSp(dataTamp, this.APIControllerForBorrowTransactionInfo, this.APIRouteForCancel)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showNotification('bottom', 'right', 'success');
                this.callGetrow();
                this.showSpinner = false;
              } else {
                this.swalPopUpMsg(parse.data);
              }
            },
            error => {
              const parse = JSON.parse(error);
              this.swalPopUpMsg(parse.data);
            });
      } else {
        this.showSpinner = false;
      }
    });
  }
  //#endregion button cancel
  //#region getrow
  callGetrow() {
    // param tambahan untuk getrow dynamic
    this.dataTamp = [{
      'p_code': this.param
    }];
    // end param tambahan untuk getrow dynamic

    this.dalservice.Getrow(this.dataTamp, this.APIControllerForBorrowTransactionInfo, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          // //  mapper total_rent_amount
          // let sum = 0;
          // for (let i = 0; i < parsedata.detail.length; i++) {
          //   sum += parsedata.detail[i].quantity * parsedata.detail[i].rent_amount;
          // }
          // parsedata.total_rent_amount = sum;
          // // end mapper

          // checkbox active
          if (parsedata.status !== 'HOLD') {
            this.isReadOnly = true;
          } else {
            this.isReadOnly = false;
          }
          // end checkbox active
          if (parsedata.file_name != "") {
            this.tampHidden = true;
          } else {
            this.tampHidden = false;
          }
          // mapper dbtoui
          Object.assign(this.model, parsedata);
          // end

          this.showSpinner = false;
        },
        error => {
          console.log('There was an error while Retrieving Data(API) !!!' + error);
        });
  }
  //#endregion getrow

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
        // param tambahan untuk getrows dynamic
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_faktur_no_replacement_code': this.param
        });
        // end param tambahan untuk getrows dynamic

        this.dalservice.Getrows(dtParameters, this.APIControllerForBookBorrowList, this.APIRouteGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listmasterbook = parse.data;

          if (parse.data != null) {
            this.listmasterbook.numberIndex = dtParameters.start;
          }
          // if use checkAll use this
          $('#checkalltable').prop('checked', false);
          // end checkall

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

  //#region form submit
  onFormSubmit(menuForm: NgForm, isValid: boolean) {
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

    // this.menuData = menuForm;
    // ini kalo pake tanggal
    this.menuData = this.JSToNumberFloats(menuForm);

    // this.menuData.realization_return_date = '2025-01-01';

    // if (this.menuData.p_borrow_date === '') {
    //   this.menuData.p_borrow_date = undefined;
    // }
    // if (this.menuData.estimate_return_date === '') {
    //   this.menuData.estimate_return_date = undefined;
    // }
    if (this.menuData.p_realization_return_date === "") {
      this.menuData.p_realization_return_date = undefined;
    }

    // if (this.menuData.p_is_active == null) {
    //   this.menuData.p_is_active = false
    // }
    const usersJson: any[] = Array.of(this.menuData);

    if (this.param != null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIControllerForBorrowTransactionInfo, this.APIRouteForUpdate)
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
            const parse = JSON.parse(error);
            this.swalPopUpMsg(parse.data);
          });
    } else {
      // call web service
      this.dalservice.Insert(usersJson, this.APIControllerForBorrowTransactionInfo, this.APIRouteForInsert)
        .subscribe(
          res => {
            this.showSpinner = false;
            const parse = JSON.parse(res);

            if (parse.result === 1) {
              this.showNotification('bottom', 'right', 'success');
              this.route.navigate(['/billing/subfakturnoreplacementlist/fakturnoreplacementdetail', parse.code]);
            } else {
              this.swalPopUpMsg(parse.data);
            }
          },
          error => {
            const parse = JSON.parse(error);
            this.swalPopUpMsg(parse.data);
          });
    }
  }
  //#endregion form submit

  //#region button back
  btnBack() {
    $('#datatableMenu').DataTable().ajax.reload();
    this.route.navigate(['/billing/subfakturnoreplacementlist']);
  }
  //#endregion button back

  //#region button delete list book
  btnDeleteListBook() {
    this.checkedList = [];
    for (let i = 0; i < this.listmasterbook.length; i++) {
      if (this.listmasterbook[i].selectedTable) {
        this.checkedList.push(this.listmasterbook[i].id);
      }
    }

    // jika tidak di checklist
    if (this.checkedList.length === 0) {
      swal({
        title: this._listdialogconf,
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-danger'
      }).catch(swal.noop)
      return
    }

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
        for (let J = 0; J < this.checkedList.length; J++) {
          const codeData = this.checkedList[J];
          // param tambahan untuk getrow dynamic
          this.dataTamp = [{
            'p_id': codeData
          }];
          // end param tambahan untuk getrow dynamic
          this.dalservice.Delete(this.dataTamp, this.APIControllerForBookBorrowList, this.APIRouteForDelete)
            .subscribe(
              ress => {
                this.showSpinner = false;
                const parse = JSON.parse(ress);
                if (parse.result === 1) {
                  this.showNotification('bottom', 'right', 'success');
                  $('#datatableMenudetail').DataTable().ajax.reload();
                } else {
                  this.swalPopUpMsg(parse.data);
                }
              },
              error => {
                const parse = JSON.parse(error);
                this.swalPopUpMsg(parse.data);
              });
        }
      } else {
        this.showSpinner = false;
      }
    });
  }
  selectAllTable() {
    for (let i = 0; i < this.listrole.length; i++) {
      this.listrole[i].selectedTable = this.selectedAllTable;
    }
  }

  checkIfAllTableSelected() {
    this.selectedAllTable = this.listrole.every(function (item: any) {
      return item.selectedTable === true;
    })
  }
  //#endregion checkbox all table

  //#region btnPrint
  btnPrint(p_code: string, rpt_code: string, report_name: string) {
    this.showSpinner = true;

    const rptParam = {
      p_user_id: this.userId,
      p_faktur_no_replacement_code: p_code,
      p_code: rpt_code,
      p_report_name: report_name,
      p_print_option: 'PDF'
    }

    const dataParam = {
      TableName: "RPT_TANDA_TERIMA",
      SpName: "xsp_rpt_tanda_terima",
      reportparameters: rptParam
    };

    this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
      this.showSpinner = false;
      this.printRptNonCore(res);
    }, err => {
      this.showSpinner = false;
      const parse = JSON.parse(err);
      this.swalPopUpMsg(parse.data);
    });
  }
  //#endregion btnPrint
  //#region LookupSysBranch
  btnLookupSysBranch() {
    $('#datatableLookupSysBranch').DataTable().clear().destroy();
    $('#datatableLookupSysBranch').DataTable({
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
          'default': ''
        });
        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBranch, this.APIRouteForGetRowsSys).subscribe(resp => {
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
          })
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      'lengthMenu': [
        [5, 25, 50, 100],
        [5, 25, 50, 100]
      ],
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 4] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '

      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowSysBranch(code: String, name: String) {
    this.model.branch_code = code;
    this.model.branch_name = name;
    $('#lookupModalBranch').modal('hide');
  }

  btnClearLookupBranch() {
    this.branch_code = '';
    this.branch_name = '';
    $('#datatableLookupSysBranch').DataTable().ajax.reload();
  }
  //#endregion LookupSysBranch

  //#region upload excel reader
  handleFile(event) {
    this.showSpinner = true;

    const binaryString = event.target.result;
    this.base64textString = btoa(binaryString);

    this.tamps.push({
      p_faktur_no_replacement_code: this.param,
      p_module: 'IFINOPL',
      p_header: 'INVOICE_PPH',
      p_child: '0000',
      filename: this.tempFile,
      base64: this.base64textString,
      action: ''
    });

  }

  // onUploadReader(event) {
  //   this.tamps = []
  //   const files = event.target.files;
  //   const file = files[0];
  //   if (this.CheckFileSize(files[0].size, this.tempFileSize)) {
  //     this.swalPopUpMsg('V;File size must be less or equal to ' + this.tempFileSize + ' MB');
  //     this.loadData();
  //   } else {
  //     if (event.target.files && event.target.files[0]) {
  //       const reader = new FileReader();
  //       reader.readAsDataURL(event.target.files[0]); // read file as data url
  //       // tslint:disable-next-line:no-shadowed-variable
  //       reader.onload = (event) => {
  //         reader.onload = this.handleFile.bind(this);
  //         reader.readAsBinaryString(file);
  //       }
  //     }
  //     this.tempFile = files[0].name;
  //     swal({
  //       title: 'Are you sure?',
  //       type: 'warning',
  //       showCancelButton: true,
  //       confirmButtonText: this._deleteconf,
  //       cancelButtonText: 'No',
  //       confirmButtonClass: 'btn btn-success',
  //       cancelButtonClass: 'btn btn-danger',
  //       buttonsStyling: false
  //     }).then((result) => {
  //       this.showSpinner = true;
  //       if (result.value) {
  //         this.dalservice.UploadFile(this.tamps, this.APIControllerInvoicePph, this.APIRouteForDeleteUploadData)
  //           .subscribe(
  //             res => {
  //               const parse = JSON.parse(res);
  //               if (parse.result === 1) {
  //                 this.dalservice.UploadFile(this.tamps, this.APIControllerInvoicePph, this.APIRouteForUploadData)
  //                   .subscribe(
  //                     res => {
  //                       const parse = JSON.parse(res);
  //                       if (parse.result === 1) {
  //                         this.dalservice.ExecSp(this.tamps, this.APIControllerInvoicePph, this.APIRouteForUploadDataPost)
  //                           .subscribe(
  //                             res => {
  //                               const parse = JSON.parse(res);
  //                               if (parse.result === 1) {
  //                                 $('#datatableSettlementPphList').DataTable().ajax.reload();
  //                                 this.showNotification('bottom', 'right', 'success');
  //                                 $('#fileControl').val(undefined);
  //                                 this.tempFile = '';
  //                                 this.showSpinner = false;
  //                               }
  //                               else {
  //                                 $('#fileControl').val(undefined);
  //                                 this.tempFile = '';
  //                                 this.swalPopUpMsg(parse.data);
  //                                 this.showSpinner = false;
  //                               }
  //                             }, error => {
  //                               const parse = JSON.parse(error);
  //                               this.swalPopUpMsg(parse.data);
  //                               $('#fileControl').val(undefined);
  //                               this.tempFile = '';
  //                               this.showSpinner = false;
  //                             });
  //                       }
  //                       else {
  //                         $('#fileControl').val(undefined);
  //                         this.tempFile = '';
  //                         this.swalPopUpMsg(parse.data);
  //                         this.showSpinner = false;
  //                       }
  //                     }, error => {
  //                       const parse = JSON.parse(error);
  //                       this.swalPopUpMsg(parse.data);
  //                       $('#fileControl').val(undefined);
  //                       this.tempFile = '';
  //                       this.showSpinner = false;
  //                     });
  //               }
  //               else {
  //                 $('#fileControl').val(undefined);
  //                 this.tempFile = '';
  //                 this.swalPopUpMsg(parse.data);
  //                 this.showSpinner = false;
  //               }
  //             }, error => {
  //               const parse = JSON.parse(error);
  //               this.swalPopUpMsg(parse.data);
  //               $('#fileControl').val(undefined);
  //               this.tempFile = '';
  //               this.showSpinner = false;
  //             });
  //         // this.dalservice.UploadFile(this.tamps, this.APIControllerInvoicePph, this.APIRouteForUploadDataFile)
  //         //   .subscribe(
  //         //     res => {
  //         //       const parse = JSON.parse(res);
  //         //       if (parse.result === 1) {
  //         //         $('#datatableSettlementPphList').DataTable().ajax.reload();
  //         //         this.showNotification('bottom', 'right', 'success');
  //         //         $('#fileControl').val(undefined);
  //         //         this.tempFile = '';
  //         //         this.showSpinner = false;
  //         //       }
  //         //       else {
  //         //         $('#fileControl').val(undefined);
  //         //         this.tempFile = '';
  //         //         this.swalPopUpMsg(parse.data);
  //         //         this.showSpinner = false;
  //         //       }
  //         //     }, error => {
  //         //       const parse = JSON.parse(error);
  //         //       this.swalPopUpMsg(parse.data);
  //         //       $('#fileControl').val(undefined);
  //         //       this.tempFile = '';
  //         //       this.showSpinner = false;
  //         //     });
  //       } else {
  //         this.showSpinner = false;
  //         $('#fileControl').val(undefined);
  //         this.tempFile = '';

  //       }
  //     })
  //   }

  // }
  //#endregion button select image

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
                                  this.dalservice.ExecSp(this.tamps, this.APIControllerInvoicePph, this.APIRouteForExecSpMsgValidate)
                                    .subscribe(
                                      res => {
                                        const parse = JSON.parse(res);
                                        if (parse.result === 1) {
                                          $('#datatableMenudetail').DataTable().ajax.reload();
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

  //#region getStyles
  getStyles(isTrue: Boolean) {
    if (isTrue) {
      this.setStyle = {
        'pointer-events': 'none',
      }
    } else {
      this.setStyle = {
        'pointer-events': 'unset',
      }
    }

    return this.setStyle;
  }
  //#endregion getStyles

  // //#region btnDownload
  // btnReportGlWithOpb(code: any) {
  //   swal({
  //     title: 'Are you sure?',
  //     type: 'warning',
  //     showCancelButton: true,
  //     confirmButtonClass: 'btn btn-success',
  //     cancelButtonClass: 'btn btn-danger',
  //     confirmButtonText: this._deleteconf,
  //     buttonsStyling: false
  //   }).then((result) => {
  //     this.showSpinner = true;
  //     if (result.value) {
  //       for (let J = 0; J < this.checkedList.length; J++) {
  //         const codeData = this.checkedList[J];
  //         // param tambahan untuk getrow dynamic

  //         this.dataTamp = [{
  //           'p_code': this.param
  //         }];
  //         this.showSpinner = true;
  //         this.dalservice.DownloadFileWithData(this.dataTamp, this.APIControllerForBookBorrowList, this.APIRouteForCekValidasi).subscribe(res => {

  //           this.showSpinner = false;
  //           var contentDisposition = res.headers.get('content-disposition');

  //           var filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();

  //           const blob = new Blob([res.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //           const url = window.URL.createObjectURL(blob);
  //           var link = document.createElement('a');
  //           link.href = url;
  //           link.download = filename;
  //           link.click();
  //         }, err => {
  //           this.showSpinner = false;
  //           const parse = JSON.parse(err);
  //           this.swalPopUpMsg(parse.data);
  //         });
  //       }
  //     } else {
  //       this.showSpinner = false;
  //     }
  //   });
  // }

  // // #endregion btnDownload

      //#region btnDownload
      btnReportGlWithOpb() {

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
            const dataParam: any = {
              p_code: this.param
            };
            this.dalservice.DownloadFileWithData(dataParam, this.APIControllerForBookBorrowList, this.APIRouteForCekValidasi).subscribe(res => {

              this.showSpinner = false;
              var contentDisposition = res.headers.get('content-disposition');

              var filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();

              const blob = new Blob([res.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              const url = window.URL.createObjectURL(blob);
              var link = document.createElement('a');
              link.href = url;
              link.download = filename;
              link.click();
            }, err => {
              this.showSpinner = false;
              const parse = JSON.parse(err);
              this.swalPopUpMsg(parse.data);
            });
          } else {
            this.showSpinner = false;
          }
        });

    }
    //#endregion btnDownload
}


