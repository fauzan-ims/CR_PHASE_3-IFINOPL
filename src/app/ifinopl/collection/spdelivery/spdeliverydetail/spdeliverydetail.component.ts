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
  templateUrl: './spdeliverydetail.component.html'
})

export class SpdeliverydetailComponent extends BaseComponent implements OnInit {

  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable

  public spdeliveryData: any = [];
  public lookupbranch: any = [];
  public lookupDeliveryCourier: any = [];
  public lookupDeliverycollector: any = [];
  public lookupDeliveryAddress: any = [];
  public lookupAgreement: any = [];
  public lookupbranchname: any = [];
  public NumberOnlyPattern = this._numberonlyformat;
  public listspdeliverydetail: any = [];
  public isReadOnly: Boolean = false;
  public isButton: Boolean = false;
  public isBreak: Boolean = false;
  private dataPostTamp: any = [];
  private dataCancelTamp: any = [];
  private dataTamp: any = [];
  private setStyle: any = [];
  public pageType: String;

  private APIController: String = 'WarningLetterDelivery';
  private APIControllerSysemployeemain: String = 'SysEmployeeMain';
  private APIControllerSysgeneralsubcode: String = 'SysGeneralSubcode';
  private APIControllerWarningLetterDeliveryDetail: String = 'WarningLetterDeliveryDetail';

  private APIRouteForUpdate: String = 'Update';
  private APIRouteForDelete: String = 'Delete';
  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteLookupSysBranch: String = 'GetRowsLookupSysBranch';
  private APIRouteLookupDeliveryAddress: String = 'GetRowsForLookupDeliveryAddress';
  private APIRouteForPost: String = 'ExecSpForPost';
  private APIRouteForProceed: String = 'ExecSpForProceed';
  private APIRouteForCancel: String = 'ExecSpForCancel';
  private APIControllerMailMerge: String = 'WarningLetterDeliveryDetail';
  private APIRouteForDownloadMailMerge: String = '';

  private RoleAccessCode = 'R00021020000000A';

  // report
  private APIControllerReport: String = 'Report';
  private APIRouteForDownload: String = 'getReport';

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
    this.getRouteparam.url.subscribe(url => this.pageType = url[0].path);

    if (this.param != null) {
      this.isReadOnly = true;

      // call web service
      this.callGetrow();
      this.loadData();
      this.wizard();
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

        this.dalservice.Getrows(dtParameters, this.APIControllerWarningLetterDeliveryDetail, this.APIRouteForGetRows)
          .subscribe(resp => {
            const parse = JSON.parse(resp)
            this.listspdeliverydetail = parse.data;
            if (parse.data != null) {
              this.listspdeliverydetail.numberIndex = dtParameters.start;
            }

            // if use checkAll use this
            $('#checkallLookup').prop('checked', false);
            // end checkall

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
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 8] }], // for disabled coloumn
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

          setTimeout(() => {
            this.amortizationnwiz();
          }, 200);

          if (parsedata.delivery_status !== 'HOLD') {
            this.isButton = true;
          } else {
            this.isButton = false;
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

  //#region  form submit
  onFormSubmit(spdeliveryForm: NgForm, isValid: Boolean) {
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

    this.spdeliveryData = this.JSToNumberFloats(spdeliveryForm);
    this.spdeliveryData.p_generate_type = 'MANUAL';
    const usersJson: any[] = Array.of(this.spdeliveryData);
    if (this.param != null) {
      this.spdeliveryData.p_code = this.param;
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
    this.route.navigate(['/collection/subspdeliverylist']);
    $('#datatableSpDeliveryList').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region button Post
  btnPost(isValid: Boolean) {
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

    // param tambahan untuk getrole dynamic
    this.dataPostTamp = [{
      'p_code': this.param,
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
        this.dalservice.ExecSp(this.dataPostTamp, this.APIController, this.APIRouteForProceed)
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
  //#endregion button Post

  //#region button Cancel
  btnCancel(code: string) {
    // param tambahan untuk button Done dynamic
    this.dataCancelTamp = [{
      'p_code': code,
    }];
    // param tambahan untuk button Done dynamic

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
        this.dalservice.ExecSp(this.dataCancelTamp, this.APIController, this.APIRouteForCancel)
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
  //#endregion button cancel

  //#region button PrintSP
  btnPrintSP(letter_no: any) {
    this.showSpinner = true;

    const rptParam = {
      p_user_id: this.userId,
      p_letter_no: letter_no,
      p_code: this.model.report_code_sp,
      p_report_name: this.model.report_name_sp,
      p_print_option: 'PDF'
    }

    const dataParam = {
      TableName: this.model.table_name_sp,
      SpName: this.model.sp_name_sp,
      reportparameters: rptParam
    };

console.log(dataParam);

    this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
      this.showSpinner = false;
      this.printRptNonCore(res);
      this.showSpinner = false;
      $('#datatableSpDeliveryDetail').DataTable().ajax.reload();
    }, err => {
      this.showSpinner = false;
      const parse = JSON.parse(err);
      this.swalPopUpMsg(parse.data);
    });
  }
  //#endregion button PrintSP

  //#region button PrintSP2
  btnPrintSP2(letter_no: any) {
    this.showSpinner = true;

    const rptParam = {
      p_user_id: this.userId,
      p_letter_no: letter_no,
      p_code: this.model.report_code_sp2,
      p_report_name: this.model.report_name_sp2,
      p_print_option: 'PDF'
    }

    const dataParam = {
      TableName: this.model.table_name_sp2,
      SpName: this.model.sp_name_sp2,
      reportparameters: rptParam
    };


    this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
      this.showSpinner = false;
      this.printRptNonCore(res);
      this.showSpinner = false;
      $('#datatableSpDeliveryDetail').DataTable().ajax.reload();
    }, err => {
      this.showSpinner = false;
      const parse = JSON.parse(err);
      this.swalPopUpMsg(parse.data);
    });
  }
  //#endregion button PrintSP2

  //#region button PrintSP3
  btnPrintSP3(letter_no: any) {
    this.showSpinner = true;

    const rptParam = {
      p_user_id: this.userId,
      p_letter_no: letter_no,
      p_code: this.model.report_code_sp3,
      p_report_name: this.model.report_name_sp3,
      p_print_option: 'PDF'
    }

    const dataParam = {
      TableName: this.model.table_name_sp3,
      SpName: this.model.sp_name_sp3,
      reportparameters: rptParam
    };

    this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
      this.showSpinner = false;
      this.printRptNonCore(res);
      this.showSpinner = false;
      $('#datatableSpDeliveryDetail').DataTable().ajax.reload();
    }, err => {
      this.showSpinner = false;
      const parse = JSON.parse(err);
      this.swalPopUpMsg(parse.data);
    });
  }
  //#endregion button PrintSP3

  //#region btnPrint
  btnPrint(letterno: any) {
    this.showSpinner = true;

    const rptParam = {
      p_user_id: this.userId,
      p_letter_no: letterno,
      p_print_option: 'PDF',
      p_code: this.model.report_code
    }

    const dataParam = {
      TableName: this.model.table_name,
      SpName: this.model.sp_name,
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

  //#region btnMailMerge
  btnMailMerge(letterno: any, lettertype: any) {
    this.showSpinner = true;

    let filename = ""

    if (lettertype === "SP1") {
      this.APIRouteForDownloadMailMerge = 'MailMergeFile'
      filename = "SURAT_PERINGATAN_PERTAMA"
    }
    else if (lettertype === "SP2") {
      this.APIRouteForDownloadMailMerge = 'MailMergeFile2'
      filename = "SURAT_PERINGATAN_KEDUA"
    }
    else if (lettertype === "SP3") {
      this.APIRouteForDownloadMailMerge = 'MailMergeFile3'
      filename = "SURAT_PERINGATAN_TERAKHIR"
    }

    const dataParamMailMerge = [{
      "p_file_name": filename,
      "p_letter_no": letterno
    }];

    this.dalservice.DownloadFileWithParam(dataParamMailMerge, this.APIControllerMailMerge, this.APIRouteForDownloadMailMerge).subscribe(res => {

      this.showSpinner = false;
      var contentDisposition = res.headers.get('content-disposition');

      var filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();

      const blob = new Blob([res.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      this.showNotification('bottom', 'right', 'success');
      $('#datatableSpDeliveryDetail').DataTable().ajax.reload();
      // window.open(url);


    }, err => {
      this.showSpinner = false;
      const parse = JSON.parse(err);
      this.swalPopUpMsg(parse.data);
    });
  }
  //#endregion btnMailMerge

  //#region btnDeleteAll
  btnDeleteAll() {
    this.isBreak = false;
    this.checkedList = [];
    for (let i = 0; i < this.listspdeliverydetail.length; i++) {
      if (this.listspdeliverydetail[i].selected) {
        this.checkedList.push(this.listspdeliverydetail[i].id);
      }
    }

    // jika tidak di checklist
    if (this.checkedList.length === 0) {
      swal({
        title: 'No one selected',
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
      this.showSpinner = true;
      if (result.value) {

        for (let J = 0; J < this.checkedList.length; J++) {
          const code = this.checkedList[J];

          this.dataTamp = [{
            'p_id': code
          }];

          this.dalservice.Delete(this.dataTamp, this.APIControllerWarningLetterDeliveryDetail, this.APIRouteForDelete)
            .subscribe(
              res => {
                const parse = JSON.parse(res);
                if (parse.result === 1) {
                  if (J + 1 === this.checkedList.length) {
                    this.showNotification('bottom', 'right', 'success');
                    this.showSpinner = false;
                    $('#datatableSpDeliveryDetail').DataTable().ajax.reload();
                  }
                } else {
                  this.isBreak = true;
                  this.showSpinner = false;
                  $('#datatableSpDeliveryDetail').DataTable().ajax.reload();
                  this.swalPopUpMsg(parse.data);
                }
              },
              error => {
                this.isBreak = true;
                this.showSpinner = false;
                const parse = JSON.parse(error);
                this.swalPopUpMsg(parse.data);
              });
          if (this.isBreak) {
            break;
          }
        }

      } else {
        this.showSpinner = false;
      }
    });
  }


  selectAll() {
    for (let i = 0; i < this.listspdeliverydetail.length; i++) {
      this.listspdeliverydetail[i].selected = this.selectedAll;
    }
  }
  checkIfAllTableSelected() {
    this.selectedAll = this.listspdeliverydetail.every(function (item: any) {
      return item.selected === true;
    })
  }
  //#endregion btnDeleteAll

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
          'p_general_code': 'COURR'
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
    this.model.courier = description;
    this.model.delivery_collector_code = undefined;
    this.model.delivery_collector_name = undefined;
    $('#lookupModalDeliveryCourier').modal('hide');
  }
  //#endregion lookup DeliveryCourier

  //#region lookup Deliverycollector
  btnLookupDeliverycollector() {
    $('#datatableLookupDeliveryCollector').DataTable().clear().destroy();
    $('#datatableLookupDeliveryCollector').DataTable({
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

        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysemployeemain, this.APIRouteForLookup).subscribe(resp => {
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
  btnSelectRowDeliverycollector(delivery_collector_code: String, delivery_collector_name: String) {
    this.model.delivery_collector_code = delivery_collector_code;
    this.model.delivery_collector_name = delivery_collector_name;
    this.model.delivery_courier_code = undefined;
    this.model.description = undefined;
    $('#lookupModalDeliverycollector').modal('hide');
  }
  //#endregion lookup DeliveryCollector

  //#region button print somasi pemenuhan
  btnPrintSomasiPemenuhan(letter_no: any) {
    this.showSpinner = true;
    const dataParam = {
      TableName: 'RPT_SOMASI_PEMENUHAN_KEWAJIBAN',
      SpName: 'xsp_rpt_somasi_pemenuhan_kewajiban',
      reportparameters: {
        p_user_id: this.userId,
        p_delivery_no: this.model.code,
        p_letter_no: letter_no,
        p_print_option: 'PDF'
      }
    };

    this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
      this.printRptNonCore(res);
      $('#datatableSpDeliveryDetail').DataTable().ajax.reload();
      this.showSpinner = false;
    }, err => {
      this.showSpinner = false;
      const parse = JSON.parse(err);
      this.swalPopUpMsg(parse.data);
    });
  }

  //#end region button print somasi pemenuhan

  //#region amortizationnwiz
  amortizationnwiz() {
    this.route.navigate(['/collection/subspdeliverylist/spdeliverydetail/' + this.param + '/spamortizationlist', this.param], { skipLocationChange: true });
  }
  //#endregion amortizationnwiz

  //#region lookup Deliverycollector
  btnLookupDeliveryAddress() {
    $('#datatableLookupDeliveryAddress').DataTable().clear().destroy();
    $('#datatableLookupDeliveryAddress').DataTable({
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
          'p_code': this.param,
          'default': '',
        });

        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteLookupDeliveryAddress).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupDeliveryAddress = parse.data;
          if (parse.data != null) {
            this.lookupDeliveryAddress.numberIndex = dtParameters.start;
          }

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [1, 7] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
    // } , 1000);
  }
  btnSelectRowDeliveryAddress(delivery_address: String, delivery_to_name: String, client_phone_no:String, client_npwp:String, client_email:String) {
    this.model.delivery_address = delivery_address;
    this.model.delivery_to_name = delivery_to_name;
    this.model.client_phone_no = client_phone_no;
    this.model.client_npwp = client_npwp;
    this.model.client_email = client_email;
    $('#lookupModalDeliveryAddress').modal('hide');
  }
  //#endregion lookup DeliveryCollector

}