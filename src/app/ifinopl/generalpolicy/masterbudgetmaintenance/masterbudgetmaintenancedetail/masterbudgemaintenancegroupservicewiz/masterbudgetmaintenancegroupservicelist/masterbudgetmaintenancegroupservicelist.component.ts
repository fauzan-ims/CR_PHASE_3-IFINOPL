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
  templateUrl: './masterbudgetmaintenancegroupservicelist.component.html'
})

export class MasterbudgetmaintenancegroupservicelistComponent extends BaseComponent implements OnInit {

  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public listmaintenancegroup: any = [];
  public companyCode: String;
  public groupCode: String;
  public serviceCode: String;
  public dataTamp: any = [];
  public dataTampDelete: any = [];
  public lookupservice: any = [];
  public listservice: any = [];

  //controller
  private APIController: String = 'MasterBudgetMaintenanceGroupService';
  private APIControllerMaintenanceGroup: String = 'MasterBudgetMaintenanceGroup';
  private APIControllerSysGlobalParam: String = 'SysGlobalParam';
  private APIControllerMasterService: String = 'MasterService';

  //route
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForInsert: String = 'Insert';
  private APIRouteForDelete: String = 'Delete';
  private APIRouteForUpdate: String = 'Update';
  private APIRouteForGetData: String = 'ExecSpForGetData';
  private APIRouteForLookup: String = 'GetRowsForLookupBudgetMaintenance';
  private APIRouteForUpdateUnitQTY: String = 'UpdateUnitQty';
  private APIRouteForUpdateUnitCost: String = 'UpdateUnitCost';
  private APIRouteForUpdateLaborCost: String = 'UpdateLaborCost';
  private APIRouteForUpdateReplacementCycle: String = 'UpdateReplacementCycle';
  private APIRouteForUpdateReplacementType: String = 'UpdateReplacementType';

  private RoleAccessCode = 'R00024040000001A'; // role access 

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
    this.loadData();
    this.callGetrowGlobalParam();
    this.callGetDataGroupCode();
    this.callGetDataServiceCode();
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
      // order: [[1, 'asc']],
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion load all data

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

  //#region getrow data group code
  callGetDataGroupCode() {
    this.dataTamp = [{
      'p_budget_maintenance_code': this.param,
      'action': 'getResponse',
    }];

    this.dalservice.ExecSp(this.dataTamp, this.APIControllerMaintenanceGroup, this.APIRouteForGetData)
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
  //#endregion getrow data group code

  //#region getrow data group code
  callGetDataServiceCode() {
    this.dataTamp = [{
      'p_budget_maintenance_code': this.param,
      'action': 'getResponse',
    }];

    this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForGetData)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data;

          this.serviceCode = parsedata

          this.showSpinner = false;
        },
        error => {
          console.log('There was an error while Retrieving Data(API)' + error);
        });
  }
  //#endregion getrow data group code

  //#region lookup AgreementObligation
  btnLookupService() {
    this.loadData();
    $('#datatableLookupService').DataTable().clear().destroy();
    $('#datatableLookupService').DataTable({
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
          'p_company_code': this.companyCode,
          'p_array_data_group_code': JSON.stringify(this.groupCode),
          'p_array_data_code': JSON.stringify(this.serviceCode),
        });

        this.dalservice.GetrowsBam(dtParameters, this.APIControllerMasterService, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);

          // if use checkAll use this
          $('#checkallLookup').prop('checked', false);
          // end checkall

          this.lookupservice = parse.data;
          if (parse.data != null) {
            this.lookupservice.numberIndex = dtParameters.start;
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

  //#region btnSelectAllLookup
  btnSelectAllLookup() {
    this.checkedLookup = [];
    for (let i = 0; i < this.lookupservice.length; i++) {
      if (this.lookupservice[i].selectedLookup) {
        this.checkedLookup.push({
          'code': this.lookupservice[i].code,
          'service_description': this.lookupservice[i].description_service,
          'group_code': this.lookupservice[i].group_code,
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
          'p_service_code': th.checkedLookup[J].code,
          'p_service_description': th.checkedLookup[J].service_description,
        }];

        th.dalservice.Insert(th.dataTamp, th.APIController, th.APIRouteForInsert)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                if (th.checkedLookup.length == J + 1) {
                  th.callGetDataGroupCode();
                  th.callGetDataServiceCode();
                  setTimeout(() => {
                    $('#datatableLookupService').DataTable().ajax.reload();
                    $('#datatableMaintenanceGroupService').DataTable().ajax.reload();
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
    for (let i = 0; i < this.lookupservice.length; i++) {
      this.lookupservice[i].selectedLookup = this.selectedAllLookup;
    }
  }

  checkIfAllLookupSelected() {
    this.selectedAllLookup = this.lookupservice.every(function (item: any) {
      return item.selectedLookup === true;
    })
  }
  //#endregion btnSelectAllLookup

  //#region changeUnitQty
  changeUnitQty(event: any, id: any, unit_cost: any, labor_cost: any) {

    this.listservice = [];

    this.listservice.push(
      this.JSToNumberFloats({
        p_budget_maintenance_code: this.param,
        p_id: id,
        p_unit_qty: event.target.value,
        p_unit_cost: unit_cost,
        p_labor_cost: labor_cost
      }));

    this.dalservice.Update(this.listservice, this.APIController, this.APIRouteForUpdateUnitQTY)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            $('#datatableMaintenanceGroupService').DataTable().ajax.reload(null, false);
          } else {
            this.swalPopUpMsg(parse.data)
          }
        },
        error => {
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data)
        });
  }
  //#endregion changeUnitQty

  //#region changeUnitCost
  changeUnitCost(event: any, id: any, unit_qty: any, labor_cost: any) {

    this.listservice = [];

    this.listservice.push(
      this.JSToNumberFloats({
        p_budget_maintenance_code: this.param,
        p_id: id,
        p_unit_cost: event.target.value,
        p_unit_qty: unit_qty,
        p_labor_cost: labor_cost

      }));

    this.dalservice.Update(this.listservice, this.APIController, this.APIRouteForUpdateUnitCost)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            $('#datatableMaintenanceGroupService').DataTable().ajax.reload(null, false);
          } else {
            this.swalPopUpMsg(parse.data)
          }
        },
        error => {
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data)
        });
  }
  //#endregion changeUnitCost

  //#region changeLaborCost
  changeLaborCost(event: any, id: any, unit_qty: any, unit_cost: any) {

    this.listservice = [];

    this.listservice.push(
      this.JSToNumberFloats({
        p_budget_maintenance_code: this.param,
        p_id: id,
        p_labor_cost: event.target.value,
        p_unit_qty: unit_qty,
        p_unit_cost: unit_cost
      }));

    this.dalservice.Update(this.listservice, this.APIController, this.APIRouteForUpdateLaborCost)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            $('#datatableMaintenanceGroupService').DataTable().ajax.reload(null, false);
          } else {
            this.swalPopUpMsg(parse.data)
          }
        },
        error => {
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data)
        });
  }
  //#endregion changeLaborCost

  //#region changeReplacementCycle
  changeReplacementCycle(event: any, id: any) {

    this.listservice = [];

    this.listservice.push(
      this.JSToNumberFloats({
        p_budget_maintenance_code: this.param,
        p_id: id,
        p_replacement_cycle: event.target.value
      }));

    this.dalservice.Update(this.listservice, this.APIController, this.APIRouteForUpdateReplacementCycle)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            // $('#datatableMaintenanceGroupService').DataTable().ajax.reload();
          } else {
            this.swalPopUpMsg(parse.data)
          }
        },
        error => {
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data)
        });
  }
  //#endregion changeReplacementCycle

  //#region chageReplacementType
  chageReplacementType(event: any, id: any) {

    this.listservice = [];

    this.listservice.push(
      this.JSToNumberFloats({
        p_budget_maintenance_code: this.param,
        p_id: id,
        p_replacement_type: event.target.value
      }));

    this.dalservice.Update(this.listservice, this.APIController, this.APIRouteForUpdateReplacementType)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            // $('#datatableMaintenanceGroupService').DataTable().ajax.reload();
          } else {
            this.swalPopUpMsg(parse.data)
          }
        },
        error => {
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data)
        });
  }
  //#endregion chageReplacementType

  //#region btn delete
  btnDeleteAll() {
    this.checkedList = [];
    for (let i = 0; i < this.listmaintenancegroup.length; i++) {
      if (this.listmaintenancegroup[i].selected) {
        this.checkedList.push(this.listmaintenancegroup[i].id);
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
              'p_id': th.checkedList[i],
              'p_budget_maintenance_code': th.param,
              'action': ''
            }];
            th.dalservice.ExecSp(th.dataTampDelete, th.APIController, th.APIRouteForDelete)
              .subscribe(
                res => {
                  const parse = JSON.parse(res);
                  if (parse.result === 1) {
                    if (th.checkedList.length == i + 1) {
                      th.callGetDataGroupCode();
                      th.callGetDataServiceCode();
                      th.showNotification('bottom', 'right', 'success');
                      $('#datatableMaintenanceGroupService').DataTable().ajax.reload();
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

}
