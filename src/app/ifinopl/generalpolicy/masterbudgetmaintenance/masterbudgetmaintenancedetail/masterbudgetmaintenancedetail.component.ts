import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { load } from '@angular/core/src/render3/instructions';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './masterbudgetmaintenancedetail.component.html'
})

export class MasterbudgetmaintenancedetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public budgetMaintenanceData: any = [];
  public budgetMaintenanceDataCopy: any = [];
  public listbudgetdetail: any = [];
  public lookupClass: any = [];
  public lookupClassCopy: any = [];
  public lookupGllink: any = [];
  public isReadOnly: Boolean = false;
  public dataTamp: any = [];
  public dataTampPush: any = [];
  public setStyle: any = [];
  public companyCode: String;

  private APIController: String = 'MasterBudgetMaintenance';
  private APIControllerMasterItem: String = 'MasterItem';
  private APIControllerSysGlobalParam: String = 'SysGlobalParam';


  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForInsertCopy: String = 'INSERTCOPY';

  private RoleAccessCode = 'R00024040000001A'; // role access 

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
    this.model.location = 'CITY'
    this.callGetrowGlobalParam();
    this.wizard();
    if (this.param != null) {
      this.isReadOnly = true;
      $('#tabGroupService .nav-link').addClass('active');
      this.groupservicewiz();
      // call web service
      this.callGetrow();
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

  //#region lookup class
  btnLookupUnit() {
    $('#datatableLookupClass').DataTable().clear().destroy();
    $('#datatableLookupClass').DataTable({
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
          'default': ''
        });

        this.dalservice.GetrowsBam(dtParameters, this.APIControllerMasterItem, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupClass = parse.data;
          if (parse.data != null) {
            this.lookupClass.numberIndex = dtParameters.start;
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
        infoEmpty: '<p style="color:red;">No Data Available !</p>'
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowUnit(code: String, description: String) {
    this.model.unit_code = code;
    this.model.unit_description = description;
    $('#lookupModalUnit').modal('hide');
  }
  //#endregion lookup class

  //#region getrow data
  callGetrow() {

    this.dataTamp = [{
      'p_code': this.param
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          // checkbox active
          if (parsedata.is_active === '1') {
            parsedata.is_active = true;
          } else {
            parsedata.is_active = false;
          }
          // end checkbox active 

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

  //#region  form submit
  onFormSubmit(budgetreplacementdetaildetailForm: NgForm, isValid: boolean) {
    // validation form submit
    if (!isValid) {
      swal({
        allowOutsideClick: false,
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

    this.budgetMaintenanceData = budgetreplacementdetaildetailForm;

    if (this.budgetMaintenanceData.p_is_active == null) {
      this.budgetMaintenanceData.p_is_active = false;
    }

    const usersJson: any[] = Array.of(this.JSToNumberFloats(this.budgetMaintenanceData));

    if (this.param != null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.callGetrow();
              this.showNotification('bottom', 'right', 'success');
              this.showSpinner = false;
            } else {
              this.showSpinner = false;
              this.swalPopUpMsg(parse.data);
            }
          },
          error => {
            this.showSpinner = false;
            const parse = JSON.parse(error);
            this.swalPopUpMsg(parse.data)
          });
    } else {
      // call web service
      this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showSpinner = false;
              this.showNotification('bottom', 'right', 'success');
              this.route.navigate(['/generalpolicy/subbudgetmaintenancelist/budgetmaintenancedetail', parse.code]);
            } else {
              this.showSpinner = false;
              this.swalPopUpMsg(parse.data);
            }
          },
          error => {
            this.showSpinner = false;
            const parse = JSON.parse(error);
            this.swalPopUpMsg(parse.data)
          });
    }
  }
  //#endregion form submit

  //#region button back
  btnBack() {
    this.route.navigate(['/generalpolicy/subbudgetmaintenancelist']);
    $('#datatablebudgetmaintenance').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region getrow data
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
  //#endregion getrow data

  //groupservice wiz
  groupservicewiz() {
    this.route.navigate(['/generalpolicy/subbudgetmaintenancelist/budgetmaintenancedetail/' + this.param + '/masterbudgetmaintenancegrouplistwiz/', this.param], { skipLocationChange: true });
  }
  //servicewiz wiz
  servicewiz() {
    this.route.navigate(['/generalpolicy/subbudgetmaintenancelist/budgetmaintenancedetail/' + this.param + '/masterbudgetmaintenancegroupservicelistwiz/', this.param], { skipLocationChange: true });
  }

  // (+) Ari 2024-01-24 ket : enhancement
  //simulationwiz wiz
  simulationwiz() {
    this.route.navigate(['/generalpolicy/subbudgetmaintenancelist/budgetmaintenancedetail/' + this.param + '/masterbudgetmaintenancesimulationlistwiz/', this.param], { skipLocationChange: true });
  }
  //#region lookup Copy Unit
  btnLookupUnitCopy() {
    $('#datatableLookupClassCopy').DataTable().clear().destroy();
    $('#datatableLookupClassCopy').DataTable({
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
          'default': ''
        });

        this.dalservice.GetrowsBam(dtParameters, this.APIControllerMasterItem, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupClassCopy = parse.data;
          if (parse.data != null) {
            this.lookupClassCopy.numberIndex = dtParameters.start;
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
        infoEmpty: '<p style="color:red;">No Data Available !</p>'
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }
  //#endregion lookup Copy Unit

  btnSelectRowUnitCopy(code: String, description: String) {
    this.model.unit_code_copy = code;
    this.model.unit_description_copy = description;
    $('#lookupModalUnitCopy').modal('hide');
  }


  //#region  form submit
  onFormSubmitCopy(budgetreplacementdetaildetailcopyForm: NgForm, isValid: boolean) {
    // validation form submit
    if (!isValid) {
      swal({
        allowOutsideClick: false,
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

    this.budgetMaintenanceData = budgetreplacementdetaildetailcopyForm;

    const usersJson: any[] = Array.of(this.JSToNumberFloats(this.budgetMaintenanceData));

    // call web service
    this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsertCopy)
      .subscribe(
        res => {
          const parse = JSON.parse(res);

          if (parse.result === 1) {
            this.showSpinner = false;
            this.showNotification('bottom', 'right', 'success');
            // this.route.navigate(['/generalpolicy/subbudgetmaintenancelist/budgetmaintenancedetail', parse.code]);
            // this.callGetrowCopy(parse.code);
            // this.groupservicewizCopy(parse.code);
            $('#lookupModalCopyBudget').modal('hide');
          } else {
            this.showSpinner = false;
            this.swalPopUpMsg(parse.data);
          }
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data)
        });
  }
  //#endregion form submit

  callGetrowCopy(param) {

    this.dataTamp = [{
      'p_code': param
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          // checkbox active
          if (parsedata.is_active === '1') {
            parsedata.is_active = true;
          } else {
            parsedata.is_active = false;
          }
          // end checkbox active 

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

  //groupservice wiz
  groupservicewizCopy(param) {
    this.route.navigate(['/generalpolicy/subbudgetmaintenancelist/budgetmaintenancedetail/' + param + '/masterbudgetmaintenancegrouplistwiz/', param], { skipLocationChange: true });
  }

  //#region button back copy
  // btnBackCopy() {

  // }
  //#endregion button back copy
}