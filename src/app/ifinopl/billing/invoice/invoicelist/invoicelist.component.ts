import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './invoicelist.component.html',
})

export class InvoicelistComponent extends BaseComponent implements OnInit {
  // variable
  public listinvoice: any = [];
  public lookupsysbranch: any = [];
  public lookupclientname: any = [];
  public branch_name: String;
  public branch_code: String;
  public client_no: String;
  public client_name: String;
  public tampStatus: String;
  public tampGenerate: String;
  private dataTampProceed: any = [];
  private dataTamp: any = [];
  public checkedList: any = [];
  public selectedAll: any;
  private dataTampPush: any = [];
  // form 2 way binding
  model: any = {};

  public pageType: String;
  public pageStatus: Boolean;

  private APIController: String = 'Invoice';
  private APIControllerSysBranch: String = 'SysBranch';
  private APIControllerClientName: String = 'Invoice';

  private APIRouteInsertGroup: String = 'ExecSpInsertGroup';
  private APIRouteDeleteGroup: String = 'ExecSpDeleteGroup';
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteGetRowsClientNameLookup: String = 'GetRowsClientNameLookup';
  private APIRouteForSend: String = 'ExecSpForSend';
  private APIRouteForDownloadFileWithData: String = 'DownloadFileWithData';

  private RoleAccessCode = 'R00020710000000A'; // role access 

  // report
  private APIControllerReport: String = 'Report';
  private APIRouteForDownload: String = 'getReport';

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
    this.tampStatus = 'NEW';
    this.tampGenerate = 'ALL'
    this.loadData();
  }

  //#region ddl from date
  FromDate(event: any) {
    const [day, month, year] = event.singleDate.formatted.split('/');
    this.model.from_date = `${year}-${month}-${day}`;

    $('#datatableInvoiceList').DataTable().ajax.reload();
  }
  //#endregion ddl from date

  //#region ddl to date
  ToDate(event: any) {
    const [day, month, year] = event.singleDate.formatted.split('/');
    this.model.to_date = `${year}-${month}-${day}`;

    $('#datatableInvoiceList').DataTable().ajax.reload();
  }
  // #endregion ddl to date


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
          'p_branch_code': this.branch_code,
          'p_invoice_status': this.tampStatus,
          // 'p_from_date': (this.model.from_date != null && this.model.from_date.singleDate != null) ? this.model.from_date.singleDate.formatted : '',
          // 'p_to_date': (this.model.to_date != null && this.model.to_date.singleDate != null) ? this.model.to_date.singleDate.formatted : '',
          'p_from_date': (this.model.from_date != null && this.model.from_date !== "undefined-undefined-") ? this.model.from_date : '',
          'p_to_date': (this.model.to_date != null && this.model.to_date !== "undefined-undefined-") ? this.model.to_date : '',
          'p_client_no': this.client_no
        })

        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listinvoice = parse.data;
          if (parse.data != null) {
            this.listinvoice.numberIndex = dtParameters.start;
            // if use checkAll use this
            $('#checkall').prop('checked', false);
            // end checkall
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 12] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }

  }
  //#endregion load all data

  //#region Status
  Status(event) {
    this.tampStatus = event.target.value;
    $('#datatableInvoiceList').DataTable().ajax.reload();
  }
  //#endregion ttatus

  //#region button add
  btnAdd() {
    this.route.navigate(['/billing/subinvoicelist/invoicedetail']);
  }
  //#endregion button add

  //#region button edit
  btnEdit(codeEdit: String) {
    this.route.navigate(['/billing/subinvoicelist/invoicedetail', codeEdit]);
  }
  //#endregion button edit

  //#region SysBranch
  btnLookupSysBranch() {
    $('#datatableLookupSysBranch').DataTable().clear().destroy();
    $('#datatableLookupSysBranch').DataTable({
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
          'p_cre_by': this.uid
        });

        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBranch, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupsysbranch = parse.data;
          if (parse.data != null) {
            this.lookupsysbranch.numberIndex = dtParameters.start;

          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          })
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
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

  btnSelectRowSysBranch(code: String, name: String) {
    this.branch_code = code;
    this.branch_name = name;
    $('#datatableInvoiceList').DataTable().ajax.reload();
    $('#lookupModalSysBranch').modal('hide');
  }
  //#endregion SysBranch

  //#region resteBranch
  resteBranch() {
    this.branch_code = undefined;
    this.branch_name = undefined;
    $('#datatableInvoiceList').DataTable().ajax.reload();
  }
  //#endregion resteBranch

  //#region btnLookupClientName
  btnLookupClientName() {
    $('#datatableLookupClientName').DataTable().clear().destroy();
    $('#datatableLookupClientName').DataTable({
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
          'p_cre_by': this.uid,
          'p_branch_code': this.branch_code,
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerClientName, this.APIRouteGetRowsClientNameLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupclientname = parse.data;
          if (parse.data != null) {
            this.lookupclientname.numberIndex = dtParameters.start;

          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          })
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
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

  btnSelectRowClientName(client_no: String, client_name: String) {
    this.client_no = client_no;
    this.client_name = client_name;
    $('#datatableInvoiceList').DataTable().ajax.reload();
    $('#lookupModalClientName').modal('hide');
  }
  //#endregion btnLookupClientName

  //#region resteClientName
  resteClientName() {
    this.client_no = undefined;
    this.client_name = undefined;
    $('#datatableInvoiceList').DataTable().ajax.reload();
  }
  //#endregion resteClientName


  btnPrintInvoiceReview() {
    this.showSpinner = true;
    this.dataTamp = [{
      'p_user_id': this.userId,
      'action': ''
    }];
    this.dalservice.DownloadFileWithData(this.dataTamp, this.APIController, this.APIRouteForDownloadFileWithData).subscribe(res => {
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

  //#region btnPrint
  btnPrint() {
    this.dataTampProceed = [];
    this.checkedList = [];

    for (let i = 0; i < this.listinvoice.length; i++) {
      if (this.listinvoice[i].selected) {
        this.checkedList.push({
          'invoice_no': this.listinvoice[i].invoice_no,
          'user_id': this.userId
        })
      }
    }

    const dataParam = {
      TableName: 'RPT_INVOICE_PENAGIHAN_GROUP',
      SpName: 'xsp_rpt_invoice_penagihan_group',
      reportparameters: {
        p_user_id: this.userId,
        p_print_option: 'PDF'
      }
    };

    // param tambahan untuk getrole dynamic
    this.dataTampPush = [{
      'p_user_id': this.userId,
      'action': 'default'
    }];
    // param tambahan untuk getrole dynamic

    // jika tidak di checklist
    if (this.checkedList.length === 0) {
      swal({
        title: this._listdialogconf,
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-danger'
      }).catch(swal.noop)
      return
    }
    this.showSpinner = true;
    this.dalservice.ExecSp(this.dataTampPush, this.APIController, this.APIRouteDeleteGroup)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.dataTamp = [];
            let th = this;
            var i = 0;
            (function loopPrintInvoice() {
              if (i < th.checkedList.length) {
                const paramtxt = [
                  {
                    'p_user_id': th.checkedList[i].user_id,
                    'p_invoice_no': th.checkedList[i].invoice_no
                  }
                ];
                // call web service
                th.dalservice.ExecSp(paramtxt, th.APIController, th.APIRouteInsertGroup)
                  .subscribe(
                    res => {
                      const parse = JSON.parse(res);
                      if (parse.result === 1) {
                        //#region proceed file
                        if (th.checkedList.length == i + 1) {
                          th.dalservice.ReportFile(dataParam, th.APIControllerReport, th.APIRouteForDownload).subscribe(res => {
                            th.printRptNonCore(res);
                            th.showSpinner = false;
                            th.loadData();
                            th.showNotification('bottom', 'right', 'success');
                            $('#datatableInvoiceList').DataTable().ajax.reload();

                          }, err => {
                            th.showSpinner = false;
                            // const parse = JSON.parse(err);
                            // th.swalPopUpMsg(parse.data);
                          });
                        } else {
                          i++;
                          loopPrintInvoice();
                        }
                        //#endregion
                      } else {
                        th.showSpinner = false;
                      }
                    });
              }
            })();
          } else {
            this.showSpinner = false;
          }
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
  }
  //#endregion btnPrint 

  //#region btnPost
  btnPost() {
    this.dataTampProceed = [];
    this.checkedList = [];

    for (let i = 0; i < this.listinvoice.length; i++) {
      if (this.listinvoice[i].selected) {
        this.checkedList.push({
          'invoice_no': this.listinvoice[i].invoice_no
        })
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
        this.showSpinner = true;
        this.dataTamp = [];
        let th = this;
        var i = 0;
        (function loopPostInvoice() {
          if (i < th.checkedList.length) {
            const tempInvoicePost = [
              {
                'p_invoice_no': th.checkedList[i].invoice_no,
                'action': ''
              }
            ];

            // call web service
            th.dalservice.ExecSp(tempInvoicePost, th.APIController, th.APIRouteForSend)
              .subscribe(
                res => {
                  const parse = JSON.parse(res);
                  if (parse.result === 1) {
                    if (th.checkedList.length == i + 1) {
                      th.showNotification('bottom', 'right', 'success');
                      $('#datatableInvoiceList').DataTable().ajax.reload();
                      th.showSpinner = false;
                    } else {
                      i++;
                      loopPostInvoice();
                    }
                  } else {
                    // tempInvoicePost = null;
                    $('#datatableInvoiceList').DataTable().ajax.reload();
                    th.swalPopUpMsg(parse.data)
                    th.showSpinner = false;
                  }
                },
                error => {
                  $('#datatableInvoiceList').DataTable().ajax.reload();
                  th.showSpinner = false;
                  const parse = JSON.parse(error);
                  th.swalPopUpMsg(parse.data);
                });
          }
        })();
      } else {
        this.showSpinner = false;
      }
    });
  }

  selectAllTable() {
    for (let i = 0; i < this.listinvoice.length; i++) {
      if (this.listinvoice[i].is_calculated !== '1') {
        this.listinvoice[i].selected = this.selectedAll;
      }
    }
  }

  checkIfAllTableSelected() {
    this.selectedAll = this.listinvoice.every(function (item: any) {
      return item.selected === true;
    })
  }
  //#endregion btnPost 


}