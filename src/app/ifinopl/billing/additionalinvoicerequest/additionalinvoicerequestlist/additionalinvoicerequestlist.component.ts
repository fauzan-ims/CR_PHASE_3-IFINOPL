import { OnInit, ViewChild, Component, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-additionalinvoicerequest',
  templateUrl: './additionalinvoicerequestlist.component.html'
})
export class AdditionalinvoicerequestlistComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public listinvoice: any = [];
  public lookupbranch: any = [];
  public branch_code: String = '';
  public branch_name: String = '';
  public tampAdditionalInvoiceStatus: String = '';
  private dataTampCancel: any = [];
  private dataTampProceed: any = [];

  //controller
  private APIController: String = 'AdditionalInvoiceRequest';
  private APIControllerSysBranch: String = 'SysBranch';

  //router
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForGetRowsSys: String = 'GetRowsForLookup';
  private APIRouteForCancel: String = 'ExecSpForCancel';
  private APIRouteForProceed: String = 'ExecSpForProceed';

  private RoleAccessCode = 'R00024150000001A';

  // checklist
  public selectedAll: any;
  public checkedList: any = [];

  // spinner
  showSpinner: Boolean = false;
  // end

  // ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  lookupPlafond: any;

  constructor(private dalservice: DALService,
    public getRouteparam: ActivatedRoute,
    public route: Router,
    private _location: Location,
    private _elementRef: ElementRef) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.compoSide(this._location, this._elementRef, this.route);
    this.tampAdditionalInvoiceStatus = 'HOLD';
    this.loadData();
  }

  //#region AdditionalInvoiceStatus
  AdditionalInvoiceStatus(event: any) {
    this.tampAdditionalInvoiceStatus = event.target.value;
    $('#datatableadditionalinvoicerequest').DataTable().ajax.reload();
  }
  //#endregion AdditionalInvoiceStatus

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
          'p_invoice_status': this.tampAdditionalInvoiceStatus
        });

        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listinvoice = parse.data;
          if (parse.data != null) {
            this.showSpinner = false;
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
      columnDefs: [{ orderable: false, searchable: false, width: '5%', targets: [0, 1] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;">No Data Available !</p>'
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion load all data

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
      columnDefs: [{ orderable: false, width: '5%', targets: [4] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '

      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowBranch(code: String, name: String) {
    this.branch_code = code;
    this.branch_name = name;
    $('#lookupModalbranch').modal('hide');
    $('#datatableadditionalinvoicerequest').DataTable().ajax.reload();
  }

  btnClearLookupBranch() {
    this.branch_code = '';
    this.branch_name = '';
    $('#datatableadditionalinvoicerequest').DataTable().ajax.reload();
  }
  //#endregion LookupSysBranch

  //#region btn proceed
  btnProceed() {
    this.dataTampProceed = [];
    this.checkedList = [];
    for (let i = 0; i < this.listinvoice.length; i++) {
      if (this.listinvoice[i].selected) {
        this.checkedList.push(this.listinvoice[i].code);
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
      confirmButtonText: 'Yes',
      buttonsStyling: false
    }).then((result) => {
      this.showSpinner = true;
      if (result.value) {

        let th = this;
        var i = 0;
        (function loopAdditionalinvoicerequestProceed() {
          if (i < th.checkedList.length) {
            th.dataTampProceed = [{
              'p_code': th.checkedList[i],
              'action': ''
            }];

            th.dalservice.ExecSp(th.dataTampProceed, th.APIController, th.APIRouteForProceed)
              .subscribe(
                res => {
                  const parse = JSON.parse(res);
                  if (parse.result === 1) {
                    if (th.checkedList.length == i + 1) {
                      th.showNotification('bottom', 'right', 'success');
                      $('#datatableadditionalinvoicerequest').DataTable().ajax.reload();
                      th.showSpinner = false;
                    } else {
                      i++;
                      loopAdditionalinvoicerequestProceed();
                    }
                  } else {
                    th.swalPopUpMsg(parse.data);
                    th.showSpinner = false;
                  }
                },
                error => {
                  const parse = JSON.parse(error);
                  th.swalPopUpMsg(parse.data);
                  th.showSpinner = false;
                });
          }
        })();
      } else {
        this.showSpinner = false;
      }
    });
  }

  btnCancel() {
    this.dataTampCancel = [];
    this.checkedList = [];
    for (let i = 0; i < this.listinvoice.length; i++) {
      if (this.listinvoice[i].selected) {
        this.checkedList.push(this.listinvoice[i].code);
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
      confirmButtonText: 'Yes',
      buttonsStyling: false
    }).then((result) => {
      this.showSpinner = true;
      if (result.value) {

        let th = this;
        var i = 0;
        (function loopAdditionalinvoicerequestProceed() {
          if (i < th.checkedList.length) {
            th.dataTampCancel = [{
              'p_code': th.checkedList[i],
              'action': ''
            }];

            th.dalservice.ExecSp(th.dataTampCancel, th.APIController, th.APIRouteForCancel)
              .subscribe(
                res => {
                  const parse = JSON.parse(res);
                  if (parse.result === 1) {
                    if (th.checkedList.length == i + 1) {
                      th.showNotification('bottom', 'right', 'success');
                      $('#datatableadditionalinvoicerequest').DataTable().ajax.reload();
                      th.showSpinner = false;
                    } else {
                      i++;
                      loopAdditionalinvoicerequestProceed();
                    }
                  } else {
                    th.swalPopUpMsg(parse.data);
                    th.showSpinner = false;
                  }
                },
                error => {
                  const parse = JSON.parse(error);
                  th.swalPopUpMsg(parse.data);
                  th.showSpinner = false;
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
      this.listinvoice[i].selected = this.selectedAll;
    }
  }

  checkIfAllTableSelected() {
    this.selectedAll = this.listinvoice.every(function (item: any) {
      return item.selected === true;
    })
  }
  //#endregion btn proceed

}
