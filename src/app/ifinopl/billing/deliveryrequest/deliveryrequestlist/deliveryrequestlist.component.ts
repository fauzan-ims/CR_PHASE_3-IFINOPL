import { OnInit, ViewChild, Component, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-deliveryrequest',
  templateUrl: './deliveryrequestlist.component.html'
})
export class DeliveryRequestlistComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public listinvoice: any = [];
  public lookupSource: any = [];
  public lookupBatch: any = [];
  public lookupbranch: any = [];
  public is_active: String;
  private dataTamp: any = [];
  public branch_code: String = '';
  public branch_name: String = '';
  public client_no: String;
  public client_name: String;
  private dataTampProceed: any = [];
  public lookupclientname: any = [];

  // form 2 way binding
  model: any = {};

  //controller
  private APIController: String = 'Invoice';
  private APIControllerSysBranch: String = 'SysBranch';
  private APIControllerClientName: String = 'Invoice';

  //router
  private APIRouteForGetRowsSys: String = 'GetRowsForLookup';
  private APIRouteForGetRows: String = 'GetRowsForDeliveryRequest';
  private APIRouteForGetUnreject: String = 'ExecSpForUnreject';
  private APIRouteGetRowsClientNameLookup: String = 'GetRowsClientNameLookup';
  private APIRouteForProceed: String = 'ExecSpForProceed';

  private RoleAccessCode = 'R00020760000000A';

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
    this.loadData();
  }

  //#region ddl from date
  FromDate(event: any) {
    const [day, month, year] = event.singleDate.formatted.split('/');
    this.model.from_date = `${year}-${month}-${day}`;

    $('#datatabledeliveryrequest').DataTable().ajax.reload();
  }
  //#endregion ddl from date

  //#region ddl to date
  ToDate(event: any) {
    const [day, month, year] = event.singleDate.formatted.split('/');
    this.model.to_date = `${year}-${month}-${day}`;

    $('#datatabledeliveryrequest').DataTable().ajax.reload();
  }
  // #endregion ddl to date

  //#region button unreject
  btnUnreject() {
    this.checkedList = [];
    for (let i = 0; i < this.listinvoice.length; i++) {
      if (this.listinvoice[i].selected) {
        this.checkedList.push({ 'id': this.listinvoice[i].id });
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

    this.dataTamp = [];
    for (let J = 0; J < this.checkedList.length; J++) {

      this.dataTamp.push({
        'p_id': this.checkedList[J].id,
      });


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
          this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForGetUnreject)
            .subscribe(
              res => {
                const parse = JSON.parse(res);
                if (parse.result === 1) {

                  $('#datatabledeliveryrequest').DataTable().ajax.reload();
                  this.showNotification('bottom', 'right', 'success');
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
      });
    }
  }


  //#endregion button unreject

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
          'p_from_date': (this.model.from_date != null && this.model.from_date !== "undefined-undefined-") ? this.model.from_date : '',
          'p_to_date': (this.model.to_date != null && this.model.to_date !== "undefined-undefined-") ? this.model.to_date : '',
          'p_client_no': this.client_no
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
    $('#datatabledeliveryrequest').DataTable().ajax.reload();
  }

  btnClearLookupBranch() {
    this.branch_code = '';
    this.branch_name = '';
    $('#datatabledeliveryrequest').DataTable().ajax.reload();
  }
  //#endregion LookupSysBranch

  //#region btn proceed
  btnProceed() {
    this.dataTampProceed = [];
    this.checkedList = [];
    for (let i = 0; i < this.listinvoice.length; i++) {
      if (this.listinvoice[i].selected) {
        this.checkedList.push(this.listinvoice[i].invoice_no);
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
    this.dataTamp = [];
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
        (function loopDeliveryRequestProceed() {
          if (i < th.checkedList.length) {
            th.dataTampProceed = [{
              'p_invoice_no': th.checkedList[i],
              'action': ''
            }];

            th.dalservice.ExecSp(th.dataTampProceed, th.APIController, th.APIRouteForProceed)
              .subscribe(
                res => {
                  const parse = JSON.parse(res);
                  if (parse.result === 1) {
                    if (th.checkedList.length == i + 1) {
                      th.showNotification('bottom', 'right', 'success');
                      $('#datatabledeliveryrequest').DataTable().ajax.reload();
                      th.showSpinner = false;
                    } else {
                      i++;
                      loopDeliveryRequestProceed();
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
    // alert(this.listinvoice[0].deliver_code);
    for (let i = 0; i < this.listinvoice.length; i++) {
      if (this.listinvoice[i].deliver_code !== '1') {
        this.listinvoice[i].selected = this.selectedAll;
      }
    }
  }

  checkIfAllTableSelected() {
    this.selectedAll = this.listinvoice.every(function (item: any) {
      return item.selected === true;
    })
  }
  //#endregion btn proceed

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
    $('#datatabledeliveryrequest').DataTable().ajax.reload();
    $('#lookupModalClientName').modal('hide');
  }
  //#endregion btnLookupClientName

  //#region resteClientName
  resteClientName() {
    this.client_no = undefined;
    this.client_name = undefined;
    $('#datatabledeliveryrequest').DataTable().ajax.reload();
  }
  //#endregion resteClientName
}
