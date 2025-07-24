import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';


@Component({
  selector: 'app-budgetcostdetail',
  templateUrl: './budgetcostdetail.component.html'
})
export class BudgetcostdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public budgetcostData: any = [];
  public isReadOnly: Boolean = false;
  public dataTamp: any = [];
  public setStyle: any = [];
  public companyCode: String;
  public lookupClass: any = [];
  public lookupItem: any = [];

  private APIController: String = 'MasterBudgetcost';
  private APIControllerSysGlobalParam: String = 'SysGlobalParam';
  private APIControllerSysGeneralSubCode: String = 'SysGeneralSubCode';
  private APIControllerMasterItem: String = 'MasterItem';

  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForLookupAsset: String = 'GetRowsForLookupAsset';


  private RoleAccessCode = 'R00020200000000A'; // role access 

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
    this.callGetrowGlobalParam();
    if (this.param !== null) {
      this.isReadOnly = true;

      // call web service
      this.callGetrow();
    } else {
      this.model.cost_type = 'FIXED';
      this.model.bill_periode = 'MONTHLY';
      this.showSpinner = false;
    }
  }


  //#region getrow data
  callGetrowGlobalParam() {

    this.dataTamp = [{
      'p_code': 'COMPCD'
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIControllerSysGlobalParam, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

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
  btnLookupClass() {
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
          'p_general_code': 'CLSTY',
          'p_company_code': this.companyCode,
          'default': ''
        });

        this.dalservice.GetrowsBam(dtParameters, this.APIControllerSysGeneralSubCode, this.APIRouteForLookup).subscribe(resp => {
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

  btnSelectRowClass(code: String, general_subcode_desc: String) {
    this.model.class_code = code;
    this.model.class_description = general_subcode_desc;
    $('#lookupModalClass').modal('hide');
  }
  //#endregion lookup class

  //#region lookup item
  btnLookupItem() {
    $('#datatableLookupItem').DataTable().clear().destroy();
    $('#datatableLookupItem').DataTable({
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

        this.dalservice.GetrowsBam(dtParameters, this.APIControllerMasterItem, this.APIRouteForLookupAsset).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupItem = parse.data;
          if (parse.data != null) {
            this.lookupItem.numberIndex = dtParameters.start;
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

  btnSelectRowItem(code: String, description: String) {
    this.model.item_code = code;
    this.model.item_description = description;
    $('#lookupModalItem').modal('hide');
  }
  //#endregion lookup item

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

          // checkbox
          if (parsedata.is_active === '1') {
            parsedata.is_active = true;
          } else {
            parsedata.is_active = false;
          }
          if (parsedata.is_subject_to_purchase === '1') {
            parsedata.is_subject_to_purchase = true;
          } else {
            parsedata.is_subject_to_purchase = false;
          }
          // end checkbox

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
  onFormSubmit(budgetcostForm: NgForm, isValid: boolean) {
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

    this.budgetcostData = budgetcostForm;
    if (this.budgetcostData.p_is_active == null) {
      this.budgetcostData.p_is_active = false;
    }
    if (this.budgetcostData.p_is_subject_to_purchase == null) {
      this.budgetcostData.p_is_subject_to_purchase = false;
    }
    const usersJson: any[] = Array.of(this.budgetcostData);
    if (this.param != null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showSpinner = false;
              this.callGetrow();
              this.showNotification('bottom', 'right', 'success');
            } else {
              this.showSpinner = false;
              this.swalPopUpMsg(parse.data)
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
              this.route.navigate(['/generalpolicy/subbudgetcostlist/budgetcostdetail', parse.code]);
            } else {
              this.showSpinner = false;
              this.swalPopUpMsg(parse.data)
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

  //#region  changeSubjectToPurchase
  changeSubjectToPurchase(event: any) {
    this.model.is_subject_to_purchase = event.target.checked
  }
  //#endregion changeSubjectToPurchase

  //#region button back
  btnBack() {
    this.route.navigate(['/generalpolicy/subbudgetcostlist']);
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion button back
}
