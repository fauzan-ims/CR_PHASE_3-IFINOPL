import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import { Location } from '@angular/common';
import { DALService } from '../../../../../../../DALservice.service';
import swal from 'sweetalert2';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './masterbudgetmaintenancegrouplist.component.html'
})

export class MasterbudgetmaintenancegrouplistComponent extends BaseComponent implements OnInit {

  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public listmaintenancegroup: any = [];
  public listdatamaintenancegroup: any = [];
  public lookupgroupservice: any = [];
  public dataTamp: any = [];
  public companyCode: String;
  public groupCode: String;
  public dataTampDelete: any = [];

  //controller
  private APIController: String = 'MasterBudgetMaintenanceGroup';
  private APIControllerGeneralSubCode: String = 'SysGeneralSubcode';
  private APIControllerSysGlobalParam: String = 'SysGlobalParam';

  //route
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForInsert: String = 'Insert';
  private APIRouteForDelete: String = 'Delete';
  private APIRouteForUpdate: String = 'Update';
  private APIRouteForGetData: String = 'ExecSpForGetData';
  private APIRouteForLookup: String = 'GetRowsForLookupBudgetMaintenance';

  // role access 
  private RoleAccessCode = 'R00024040000001A';

  // form 2 way binding
  model: any = {};
  public selectedAll: any;
  public checkedList: any = [];

  // checklist
  public selectedAllLookup: any;
  public selectedAllTable: any;
  private checkedLookup: any = [];

  // ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  constructor(private dalservice: DALService, public route: Router,
    public getRouteparam: ActivatedRoute,
    private _location: Location,
    private _elementRef: ElementRef) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.Delimiter(this._elementRef);
    this.loadData();
    this.callGetData();
    this.callGetrowGlobalParam();
  }

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
          'p_budget_maintenance_code': this.param,
          'default': '',
        });

        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listmaintenancegroup = parse.data;
          if (parse.data != null) {
            this.listmaintenancegroup.numberIndex = dtParameters.start;
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

  //#region button add
  btnAdd() {
    this.route.navigate(['/generalpolicy/subbudgetmaintenancelist/budgetmaintenancedetail']);
  }
  //#endregion button add

  //#region button edit
  btnEdit(codeEdit: string) {
    this.route.navigate(['/generalpolicy/subbudgetmaintenancelist/budgetmaintenancedetail', codeEdit]);
  }
  //#endregion button edit 

  //#region getrow data global param
  callGetrowGlobalParam() {

    this.dataTamp = [{
      'p_code': 'COMPCD'
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIControllerSysGlobalParam, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];

          this.companyCode = parsedata.value

          this.showSpinner = false;
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
  }
  //#endregion getrow data global param

  //#region lookup AgreementObligation
  btnLookupGroupService() {
    $('#datatableLookupGroupService').DataTable().clear().destroy();
    $('#datatableLookupGroupService').DataTable({
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
          'p_general_code': 'SRVGR',
          'p_company_code': this.companyCode,
          'p_array_data': JSON.stringify(this.groupCode),
        });

        this.dalservice.GetrowsBam(dtParameters, this.APIControllerGeneralSubCode, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);

          // if use checkAll use this
          $('#checkallLookup').prop('checked', false);
          // end checkall

          this.lookupgroupservice = parse.data;
          if (parse.data != null) {
            this.lookupgroupservice.numberIndex = dtParameters.start;
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
    });
  }
  //#endregion lookup notification

  //#region getrow data
  callGetData() {
    // param tambahan untuk getrow dynamic
    this.dataTamp = [{
      'p_budget_maintenance_code': this.param,
      'action': 'getResponse',
    }];
    // end param tambahan untuk getrow dynamic

    this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForGetData)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data;

          this.groupCode = parsedata

          this.showSpinner = false;
        },
        error => {
          console.log('There was an error while Retrieving Data(API)' + error);
        });
  }
  //#endregion getrow data

  //#region btnSelectAllLookup
  btnSelectAllLookup() {
    this.checkedLookup = [];
    for (let i = 0; i < this.lookupgroupservice.length; i++) {
      if (this.lookupgroupservice[i].selectedLookup) {
        this.checkedLookup.push({
          'group_code': this.lookupgroupservice[i].code,
          'group_description': this.lookupgroupservice[i].general_subcode_desc,
        });
      }
    }

    // jika tidak di checklist
    if (this.checkedLookup.length === 0) {
      swal({
        title: this._listdialogconf,
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-danger'
      }).catch(swal.noop)
      return
    } else {
      this.showSpinner = true;
    }

    this.dataTamp = [];
    let th = this;
    var J = 0;
    (function loopAddBudgetMaintenanceGroup() {
      if (J < th.checkedLookup.length) {
        th.dataTamp = [{
          'p_budget_maintenance_code': th.param,
          'p_group_code': th.checkedLookup[J].group_code,
          'p_group_description': th.checkedLookup[J].group_description,
          'p_probability_pct': 0
        }];

        th.dalservice.Insert(th.dataTamp, th.APIController, th.APIRouteForInsert)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                if (th.checkedLookup.length == J + 1) {
                  th.callGetData();
                  setTimeout(() => {
                    $('#datatableMaintenanceGroup').DataTable().ajax.reload();
                    $('#datatableLookupGroupService').DataTable().ajax.reload();
                    th.showNotification('bottom', 'right', 'success');
                    th.showSpinner = false;
                  }, 500);
                } else {
                  J++;
                  loopAddBudgetMaintenanceGroup();
                }
              } else {
                th.showSpinner = false;
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
  }

  selectAllLookup() {
    for (let i = 0; i < this.lookupgroupservice.length; i++) {
      this.lookupgroupservice[i].selectedLookup = this.selectedAllLookup;
    }
  }

  checkIfAllLookupSelected() {
    this.selectedAllLookup = this.lookupgroupservice.every(function (item: any) {
      return item.selectedLookup === true;
    })
  }
  //#endregion btnSelectAllLookup

  //#region btn delete
  btnDeleteAll() {
    this.checkedList = [];
    for (let i = 0; i < this.listmaintenancegroup.length; i++) {
      if (this.listmaintenancegroup[i].selected) {
        this.checkedList.push(this.listmaintenancegroup[i].code);
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
      this.showSpinner = true;
      if (result.value) {
        let th = this;
        var i = 0;
        (function loopVatPaymentDetailDelete() {
          if (i < th.checkedList.length) {
            th.dataTampDelete = [{
              'p_code': th.checkedList[i],
              'p_budget_maintenance_code': th.param,
              'action': ''
            }];
            th.dalservice.ExecSp(th.dataTampDelete, th.APIController, th.APIRouteForDelete)
              .subscribe(
                res => {
                  const parse = JSON.parse(res);
                  if (parse.result === 1) {
                    if (th.checkedList.length == i + 1) {
                      th.callGetData();
                      th.showNotification('bottom', 'right', 'success');
                      $('#datatableMaintenanceGroup').DataTable().ajax.reload();
                      th.showSpinner = false;
                    } else {
                      i++;
                      loopVatPaymentDetailDelete();
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
    for (let i = 0; i < this.listmaintenancegroup.length; i++) {
      if (this.listmaintenancegroup[i].is_calculated !== '1') {
        this.listmaintenancegroup[i].selected = this.selectedAll;
      }
    }
  }

  checkIfAllTableSelected() {
    this.selectedAll = this.listmaintenancegroup.every(function (item: any) {
      return item.selected === true;
    })
  }
  //#endregion btn delete

  //#region changeProbability
  changeProbability(event: any, code: String) {

    this.listdatamaintenancegroup = [];

    this.listdatamaintenancegroup.push(
      this.JSToNumberFloats({
        p_budget_maintenance_code: this.param,
        p_code: code,
        p_probability_pct: event.target.value,
      }));

    this.dalservice.Update(this.listdatamaintenancegroup, this.APIController, this.APIRouteForUpdate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            $('#datatableMaintenanceGroup').DataTable().ajax.reload(null, false);
          } else {
            this.swalPopUpMsg(parse.data)
          }
        },
        error => {
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data)
        });
  }
  //#endregion changeProbability

}
