import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-invoicedetail',
  templateUrl: './invoicedetail.component.html' // GetRowsForLookupForDocgroup
})
export class InvoicedetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public generateinvoiceData: any = [];
  public listinvoicedetail: any = [];
  public from_date: any = [];
  public to_date: any = [];
  public system_date = new Date();
  public invoiceDateData: any = [];
  public setStyle: any = [];

  public isReadOnly: Boolean = false;
  public isRequired: any;
  public isBreak: Boolean = false;

  public tamps = new Array();
  private dataTamp: any = [];
  public listinvoicedetaillist: any = [];
  private dataTampPush: any = [];
  private APIControllerSys: String = 'SysBranchBank'
  private APIRouteForGetRowBankDefault: String = 'GetRowForBank'
  private APIController: String = 'Invoice';
  private APIControllerDetail: String = 'InvoiceDetail';
  private APIRouteForGetRows: String = 'GETROWS';
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForSend: String = 'ExecSpForSend';
  private APIRouteForCancel: String = 'ExecSpForCancel';
  private APIRouteForUpdateDiscount: String = 'ExecSpForUpdateDiscount';
  private APIRouteForExecSpForUpdateNewDate: String = 'ExecSpForUpdateNewDate';

  // report
  private APIControllerReport: String = 'Report';
  private APIRouteForDownload: String = 'getReport';

  private RoleAccessCode = 'R00020710000000A'; // role access 

  // checklist
  public selectedAllTable: any;
  public selectedAllLookup: any;
  private checkedList: any = [];
  private checkedLookup: any = [];

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
    this.Delimiter(this._elementRef);
    if (this.param != null) {
      this.isReadOnly = true;

      // call web service
      this.callGetrow();
      this.loadData();
    } else {
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
          'p_invoice_no': this.param
        });

        // tslint:disable-next-line:max-line-length
        this.dalservice.Getrows(dtParameters, this.APIControllerDetail, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)

          this.listinvoicedetail = parse.data;
          if (parse.data != null) {
            this.listinvoicedetail.numberIndex = dtParameters.start;
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
    this.route.navigate(['/billing/subinvoicelist']);
    $('#datatableInvoiceList').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region button Cancel
  btnCancel(invoice_no: string) {
    // param tambahan untuk button Post dynamic
    this.dataTamp = [{
      'p_invoice_no': invoice_no,
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
        this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForCancel)
          .subscribe(
            res => {
              this.showSpinner = false;
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.callGetrow();
                this.showNotification('bottom', 'right', 'success');
                this.route.navigate(['/billing/subinvoicelist/invoicedetail/' + this.model.code]);
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
  //#endregion button Cancel

  //#region button Send
  btnPost(invoice_no: string) {
    // param tambahan untuk button Post dynamic
    this.dataTamp = [{
      'p_invoice_no': invoice_no,
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
        this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForSend)
          .subscribe(
            res => {
              this.showSpinner = false;
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.callGetrow();
                this.showNotification('bottom', 'right', 'success');
                this.route.navigate(['/billing/subinvoicelist/invoicedetail/' + this.model.code]);
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
  //#endregion button Send

  //#region btn print
  btnPrint(code: string) {
    this.showSpinner = true;
    this.dataTamp = [{
      'p_branch_code': this.model.branch_code
    }];
    this.dalservice.GetrowSys(this.dataTamp, this.APIControllerSys, this.APIRouteForGetRowBankDefault)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parseData = this.getrowNgb(parse.data[0]);

          const dataParam = {
            TableName: 'rpt_invoice',
            SpName: 'xsp_rpt_invoice',
            reportparameters: {
              p_user_id: this.userId,
              p_code: code,
              p_bank_name: parseData.bank_name,
              p_bank_account_name: parseData.bank_account_name,
              p_bank_account_no: parseData.bank_account_no,
              p_print_option: 'PDF'
            }
          };

          this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
            this.printRptNonCore(res);
            this.showSpinner = false;
          }, err => {
            this.showSpinner = false;
            const parse = JSON.parse(err);
            this.swalPopUpMsg(parse.data);
          });

        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });

  }
  btnPrintFaktur(code: string) {
    this.showSpinner = true;
    this.dataTamp = [{
      'p_branch_code': this.model.branch_code
    }];
    this.dalservice.GetrowSys(this.dataTamp, this.APIControllerSys, this.APIRouteForGetRowBankDefault)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parseData = this.getrowNgb(parse.data[0]);

          const dataParam = {
            TableName: 'rpt_invoice_faktur',
            SpName: 'xsp_rpt_invoice_faktur',
            reportparameters: {
              p_user_id: this.userId,
              p_code: code,
              p_bank_name: parseData.bank_name,
              p_bank_account_name: parseData.bank_account_name,
              p_bank_account_no: parseData.bank_account_no,
              p_print_option: 'PDF'
            }
          };

          this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
            this.printRptNonCore(res);
            this.showSpinner = false;
          }, err => {
            this.showSpinner = false;
            const parse = JSON.parse(err);
            this.swalPopUpMsg(parse.data);
          });

        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });

  }
  //#endregion btn print

  //#region button save in list
  btnSaveList() {
    this.listinvoicedetaillist = [];

    let i = 0;

    const getId = $('[name="p_id"]')
      .map(function () { return $(this).val(); }).get();

    const getDescription = $('[name="p_description"]')
      .map(function () { return $(this).val(); }).get();

    const getDiscount = $('[name="p_discount_amount"]')
      .map(function () { return $(this).val(); }).get();


    while (i < getId.length) {

      while (i < getDescription.length) {

        while (i < getDiscount.length) {
          this.listinvoicedetaillist.push(this.JSToNumberFloats({
            p_id: getId[i],
            p_discount_amount: getDiscount[i],
            p_description: getDescription[i],
            p_invoice_no: this.param,
          }));
          i++;
        }
        i++;
      }
      i++;
    }

    //#region web service
    this.dalservice.Update(this.listinvoicedetaillist, this.APIControllerDetail, this.APIRouteForUpdateDiscount)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.callGetrow();
            this.showSpinner = false;
            this.showNotification('bottom', 'right', 'success');
            $('#datatableInvoiceDetail').DataTable().ajax.reload();
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

  //#region button print kwitansi
  btnPrintKwitansi() {
    this.showSpinner = true;
    const dataParam = {
      TableName: 'RPT_INVOICE_KWITANSI',
      SpName: 'xsp_rpt_invoice_kwitansi',
      reportparameters: {
        p_user_id: this.userId,
        p_no_invoice: this.model.invoice_no,
        p_print_option: 'PDF'
      }
    };

    this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
      this.printRptNonCore(res);
      this.showSpinner = false;
    }, err => {
      this.showSpinner = false;
      const parse = JSON.parse(err);
      this.swalPopUpMsg(parse.data);
    });
  }

  //#endregion button print kwitansi

  //#region button print Invoice
  btnPrintInvoice() {
    this.showSpinner = true;
    const dataParam = {
      TableName: 'RPT_INVOICE_PENAGIHAN',
      SpName: 'xsp_rpt_invoice_penagihan',
      reportparameters: {
        p_user_id: this.userId,
        p_no_invoice: this.model.invoice_no,
        p_print_option: 'PDF'
      }
    };

    this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
      this.printRptNonCore(res);
      this.showSpinner = false;
    }, err => {
      this.showSpinner = false;
      const parse = JSON.parse(err);
      this.swalPopUpMsg(parse.data);
    });
  }
  //#endregion button print Invoice

  //#region button print pembatalan kontrak
  btnPrintInvoicePenalty() {
    this.showSpinner = true;
    const dataParam = {
      TableName: 'RPT_INVOICE_PEMBATALAN_KONTRAK',
      SpName: 'xsp_rpt_invoice_pembatalan_kontrak',
      reportparameters: {
        p_user_id: this.userId,
        p_no_invoice: this.model.invoice_no,
        p_print_option: 'PDF'
      }
    };

    this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
      this.printRptNonCore(res);
      this.showSpinner = false;
    }, err => {
      this.showSpinner = false;
      const parse = JSON.parse(err);
      this.swalPopUpMsg(parse.data);
    });
  }
  //#endregion button print pembatalan kontrak

  //#region button print Invoice
  onFormSubmit(invoiceDateForm: NgForm, isValid: boolean) {
    this.invoiceDateData = this.JSToNumberFloats(invoiceDateForm);
    // param tambahan 
    this.dataTamp = []
    this.dataTamp.push(this.JSToNumberFloats({
      'p_invoice_no': this.param,
      'p_new_invoice_date': this.invoiceDateData.p_new_invoice_date
    }));
    // param tambahan
    this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForExecSpForUpdateNewDate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);

          if (parse.result === 1) {
            this.showSpinner = false;
            this.callGetrow();
            this.showNotification('bottom', 'right', 'success');
            $('#lookupNewDateInvoice').modal('hide');
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
  //#endregion button print Invoice

  //#region button print keterlambatan
  btnPrintKeterlambatan() {
    this.showSpinner = true;
    const dataParam = {
      TableName: 'RPT_INVOICE_DENDA_KETERLAMBATAN',
      SpName: 'xsp_rpt_invoice_denda_keterlambatan',
      reportparameters: {
        p_user_id: this.userId,
        p_agreement_no: this.model.agreement_no,
        p_invoice_no: this.model.invoice_no,
        p_print_option: 'PDF'
      }
    };

    this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
      this.printRptNonCore(res);
      this.showSpinner = false;
    }, err => {
      this.showSpinner = false;
      const parse = JSON.parse(err);
      this.swalPopUpMsg(parse.data);
    });
  }
  //#endregion button print keterlambatan

  //#region button print btnPrintKeterlambatanPengembalianAsset
  btnPrintKeterlambatanPengembalianAsset() {
    this.showSpinner = true;
    const dataParam = {
      TableName: 'RPT_INVOICE_DENDA_KETERLAMBATAN_PENGEMBALIAN_ASSET',
      SpName: 'xsp_rpt_invoice_denda_keterlambatan_pengembalian_asset',
      reportparameters: {
        p_user_id: this.userId,
        p_agreement_no: this.model.agreement_no,
        p_invoice_no: this.model.invoice_no,
        p_print_option: 'PDF'
      }
    };

    this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
      this.printRptNonCore(res);
      this.showSpinner = false;
    }, err => {
      this.showSpinner = false;
      const parse = JSON.parse(err);
      this.swalPopUpMsg(parse.data);
    });
  }
  //#endregion button print btnPrintKeterlambatanPengembalianAsset
}



