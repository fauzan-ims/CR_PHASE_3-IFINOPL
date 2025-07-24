import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import { Location } from '@angular/common';
import { DALService } from '../../../../../../../DALservice.service';
import swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './masterbudgetmaintenancesimulationlist.component.html'
})

export class MasterbudgetmaintenancesimulationlistComponent extends BaseComponent implements OnInit {

  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public listmaintenancesimulation: any = [];
  public listdatamaintenancegroup: any = [];
  public lookupgroupservice: any = [];
  public dataTamp: any = [];
  public companyCode: String;
  public groupCode: String;
  public dataTampDelete: any = [];
  public budgetMaintenanceSimulation: any = [];
  public lookupMileageCategory: any = [];
  public UnitCode: String;
  public Year: String;
  public Location: String;

  //controller
  private APIController: String = 'MasterBudgetMaintenance';
  private APIControllerMasterMileageCategory: String = 'MasterMileageDetail';

  //route
  private APIRouteForSimulationGetRows: String = 'SimulationGetRows';
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForLookupMileageCategory: String = 'GetRowsForLookupMileage';

  // role access 
  private RoleAccessCode = 'R00024040000001A';

  // form 2 way binding
  model: any = {};
  public selectedAll: any;
  public checkedList: any = [];
  private dataTamps: any = [];

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
    this.callGetrow();
    this.loadData();
  }

  callGetrow() {

    this.dataTamp = [{
      'p_code': this.param
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];

          this.UnitCode = parsedata.unit_code
          this.Year = parsedata.year;
          this.Location = parsedata.location;
          this.model.periode = parsedata.default_period;
          this.model.unit_code = parsedata.unit_code;
          this.showSpinner = false;
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
  }

  Period(event) {
    this.model.periode = event.target.value;
  }

  Miles(event) {
    this.model.start_miles = event.target.value;
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
          'p_periode': this.model.periode,
          'p_start_miles': this.model.start_miles,
          'p_monthly_miles': this.model.monthly_miles,
          'p_unit_code': this.UnitCode,
          'p_year': this.Year,
          'p_location': this.Location
        });

        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForSimulationGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listmaintenancesimulation = parse.data;
          if (parse.data != null) {
            this.listmaintenancesimulation.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 2, 3] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion load all data

  //#region btnCalculate
  btnCalculate() {

    // param tambahan untuk getrole dynamic
    // swal({
    //   allowOutsideClick: false,
    //   title: 'Are you sure?',
    //   type: 'warning',
    //   showCancelButton: true,
    //   confirmButtonClass: 'btn btn-success',
    //   cancelButtonClass: 'btn btn-danger',
    //   confirmButtonText: 'Yes',
    //   buttonsStyling: false
    // }).then((result) => {
    //   if (result.value) {

    this.loadData();
    $('#datatableMaintenanceSimulation').DataTable().ajax.reload();
    // } else {
    this.showSpinner = false;
    // }
    // });
  }
  //#endregion btnCalculate

  //#region MileageCategory Lookup
  btnLookupMileageCategory() {
    this.callGetrow();
    $('#datatableLookupMileageCategory').DataTable().clear().destroy();
    $('#datatableLookupMileageCategory').DataTable({
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
          'p_item_code': this.model.unit_code,
          'default': ''
        });

        this.dalservice.GetrowsBam(dtParameters, this.APIControllerMasterMileageCategory, this.APIRouteForLookupMileageCategory).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupMileageCategory = parse.data;
          if (parse.data != null) {
            this.lookupMileageCategory.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 3] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowMileageCategory(mileage: any) {
    this.model.monthly_miles = mileage;
    $('#lookupModalMileageCategory').modal('hide');
  }
  //#endregion MileageCategory lookup
}
