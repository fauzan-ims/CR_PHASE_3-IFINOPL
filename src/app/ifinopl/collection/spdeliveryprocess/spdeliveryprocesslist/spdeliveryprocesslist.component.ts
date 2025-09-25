import { OnInit, ViewChild, Component, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './spdeliveryprocesslist.component.html'
})

export class SpdeliveryprocesslistComponent extends BaseComponent implements OnInit {

  // #variable
  public branch_code: any = [];
  public branch_name: any = [];
  public letter_status: any = [];
  public account_no: any = [];
  public account_name: any = [];
  public listspdeliveryrequest: any = [];
  public isReadOnly: Boolean = false;
  public isBreak: Boolean = false;
  public lookupbranchcode: any = [];
  public letter_type: any = [];
  private dataTamp: any = [];
  private RoleAccessCode = 'R00021040000000A';

  private APIControllerSPDeliveryRequest: String = 'WarningLetter';
  private APIRouteForGetRows: String = 'ExecSpForDeliveryRequestGetrows';
  private APIRouteForProcess: String = 'ExecSpForDeliveryPost';
  private APIControllerSysBranch: String = 'sysbranch';
  private APIRouteForLookup: String = 'GetRowsForLookup';

  // form 2 way binding
  model: any = {};

  // checklist
  public selectedAll: any;
  public checkedList: any = [];

  // #ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  selectedAllTable: any;
  showSpinner: boolean;

  constructor(private dalservice: DALService,
    public route: Router,
    private _location: Location,
    private _elementRef: ElementRef) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);

    this.compoSide(this._location, this._elementRef, this.route);
    this.letter_type = 'SP1';
    this.loadData();
  }

  //#region ddl Type
  PageType(event: any) {
    this.letter_type = event.target.value;
    $('#datatableProcessList').DataTable().ajax.reload();
  }
  //#endregion ddl Type

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
        // tambahan param untuk getrows dynamic
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_branch_code': this.branch_code,
          'p_letter_status': 'ON PROCESS',
          'p_letter_type': this.letter_type,
        });
        this.dalservice.Getrows(dtParameters, this.APIControllerSPDeliveryRequest, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listspdeliveryrequest = parse.data;
          if (parse.data != null) {
            this.listspdeliveryrequest.numberIndex = dtParameters.start;
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

  //#region button proceed
  btnProcess() {
    this.isBreak = false;
    this.checkedList = [];
    for (let i = 0; i < this.listspdeliveryrequest.length; i++) {
      if (this.listspdeliveryrequest[i].selected) {
        this.checkedList.push(this.listspdeliveryrequest[i].code);
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

        this.dataTamp = []
        let th = this;
        var J = 0;
        (function loopProceed() {
          if (J < th.checkedList.length) {

            th.dataTamp = [{
              'p_code': th.checkedList[J],
            }];

            th.dalservice.ExecSp(th.dataTamp, th.APIControllerSPDeliveryRequest, th.APIRouteForProcess)
              .subscribe(
                res => {
                  const parse = JSON.parse(res);
                  if (parse.result === 1) {
                    if (th.checkedList.length == J + 1) {
                      th.showSpinner = false;
                      $('#datatableProcessList').DataTable().ajax.reload();
                      th.showNotification('bottom', 'right', 'success');
                    } else {
                      J++;
                      loopProceed();
                    }
                  } else {
                    th.showSpinner = false;
                    $('#datatableProcessList').DataTable().ajax.reload();
                    th.swalPopUpMsg(parse.data);
                  }
                },
                error => {
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
    for (let i = 0; i < this.listspdeliveryrequest.length; i++) {
      this.listspdeliveryrequest[i].selected = this.selectedAll;
    }
  }

  checkIfAllTableSelected() {
    this.selectedAll = this.listspdeliveryrequest.every(function (item: any) {
      return item.selected === true;
    })
  }
  //#endregion Proceed

  //#region lookup branch
  btnLookupBranchcode() {
    $('#datatableLookupBranchcode').DataTable().clear().destroy();
    $('#datatableLookupBranchcode').DataTable({
      'pagingType': 'first_last_numbers',
      'pageLength': 5,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false

      ajax: (dtParameters: any, callback) => {
        // tambahan param untuk getrows dynamic
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'default': ''
        });
        // end tambahan param untuk getrows dynamic
        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBranch, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupbranchcode = parse.data;
          if (parse.data != null) {
            this.lookupbranchcode.numberIndex = dtParameters.start;
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
  btnSelectRowBranchcode(branch_code: String, branch_name: String) {
    this.branch_code = branch_code;
    this.branch_name = branch_name;
    $('#lookupModalSysBranchcode').modal('hide');
    $('#datatableProcessList').DataTable().ajax.reload();
  }

  btnClearBranch() {
    this.branch_code = '';
    this.branch_name = '';
    $('#lookupModalSysBranchcode').modal('hide');
    $('#datatableProcessList').DataTable().ajax.reload();
  }
  //#endregion lookup branch

}
