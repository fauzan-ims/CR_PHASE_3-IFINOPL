import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { DataTableDirective } from 'angular-datatables';


@Component({
  selector: 'app-pricedetail',
  templateUrl: './pricedetail.component.html'
})
export class PricedetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public priceData: any = [];
  public listPrice: any = [];
  public isReadOnly: Boolean = false;
  public lookupCategory: any = [];
  public lookupSub: any = [];
  public lookupMerk: any = [];
  public lookupModel: any = [];
  public lookupType: any = [];
  public lookupUnit: any = [];
  public lookupBranch: any = [];
  private dataTamp: any = [];

  private APIController: String = 'MasterVehiclePricelist';
  private APIControllerSysBranch: String = 'SysBranch';
  private APIControllerDetail: String = 'MasterVehiclePricelistDetail';
  private APIControllerCategory: String = 'MasterVehicleCategory';
  private APIControllerSub: String = 'MasterVehicleSubcategory';
  private APIControllerMerk: String = 'MasterVehicleMerk';
  private APIControllerModel: String = 'MasterVehicleModel';
  private APIControllerType: String = 'MasterVehicleType';
  private APIControllerUnit: String = 'MasterVehicleUnit';

  private APIRouteLookup: String = 'GetRowsForLookup';
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForInsert: String = 'INSERT';

  private RoleAccessCode = 'R00020050000000A'; // role access 

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
    private _elementRef: ElementRef,
    private parserFormatter: NgbDateParserFormatter
  ) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    if (this.param != null) {
      this.isReadOnly = true;

      // call web service
      this.callGetrow();
      this.loadData();
    } else {
      this.model.condition = 'NEW';
      this.showSpinner = false;
      this.model.branch_code = 'ALL';
    }
  }

  //#region Branch
  btnLookupBranch() {
    $('#datatableLookupBranch').DataTable().clear().destroy();
    $('#datatableLookupBranch').DataTable({
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
        });
        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBranch, this.APIRouteLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupBranch = parse.data;
          if (parse.data != null) {
            this.lookupBranch.numberIndex = dtParameters.start;
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
  btnSelectRowBranch(code: String, name: String) {
    this.model.branch_code = code;
    this.model.branch_name = name;
    $('#lookupModalBranch').modal('hide');
    $('#datatableVehiclePriceDetail').DataTable().ajax.reload();
  }
  //#endregion branch

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
          'p_vehicle_pricelist_code': this.param,
          'p_branch_code': this.model.branch_code
        });
        

        this.dalservice.Getrows(dtParameters, this.APIControllerDetail, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listPrice = parse.data;
          if (parse.data != null) {
            this.listPrice.numberIndex = dtParameters.start;
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
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 6] }], // for disabled coloumn
      order: [[1, 'desc']],
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
    this.route.navigate(['/vehicle/subpricelist/pricelistdetail', this.param]);
  }
  //#endregion button add

  //#region button edit
  btnEdit(codeEdit: string) {
    this.route.navigate(['/vehicle/subpricelist/pricelistdetail', this.param, codeEdit]);
  }
  //#endregion button edit

  //#region Unit
  btnLookupUnit() {
    $('#datatableLookupUnit').DataTable().clear().destroy();
    $('#datatableLookupUnit').DataTable({
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
          'p_vehicle_category_code': this.model.vehicle_category_code,
          'p_vehicle_subcategory_code': this.model.vehicle_subcategory_code,
          'p_vehicle_merk_code': this.model.vehicle_merk_code,
          'p_vehicle_model_code': this.model.vehicle_model_code,
          'p_vehicle_type_code': this.model.vehicle_type_code
        });
        
        this.dalservice.Getrows(dtParameters, this.APIControllerUnit, this.APIRouteLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupUnit = parse.data;
          if (parse.data != null) {
            this.lookupUnit.numberIndex = dtParameters.start;
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

  // tslint:disable-next-line: max-line-length
  btnSelectRowUnit(code: String, description: String, vehicle_category_code: String, vehicle_subcategory_code: String, vehicle_merk_code: String, vehicle_model_code: String, vehicle_type_code: String, vehicle_category_desc: String, vehicle_subcategory_desc: String, vehicle_merk_desc: String, vehicle_model_desc: String, vehicle_type_desc: String) {
    this.model.vehicle_unit_code = code;
    this.model.vehicle_unit_name = description;
    this.model.vehicle_category_code = vehicle_category_code;
    this.model.vehicle_category_name = vehicle_category_desc;
    this.model.vehicle_subcategory_code = vehicle_subcategory_code;
    this.model.vehicle_subcategory_name = vehicle_subcategory_desc;
    this.model.vehicle_merk_code = vehicle_merk_code;
    this.model.vehicle_merk_name = vehicle_merk_desc;
    this.model.vehicle_model_code = vehicle_model_code;
    this.model.vehicle_model_name = vehicle_model_desc;
    this.model.vehicle_type_code = vehicle_type_code;
    this.model.vehicle_type_name = vehicle_type_desc;
    $('#lookupModalUnit').modal('hide');
  }
  //#endregion Unit 

  //#region Type
  btnLookupType() {
    $('#datatableLookupType').DataTable().clear().destroy();
    $('#datatableLookupType').DataTable({
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
          'p_vehicle_model_code': this.model.vehicle_model_code
        });
        
        this.dalservice.Getrows(dtParameters, this.APIControllerType, this.APIRouteLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupType = parse.data;
          if (parse.data != null) {
            this.lookupType.numberIndex = dtParameters.start;
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

  btnSelectRowType(code: String, description: String) {
    this.model.vehicle_type_code = code;
    this.model.vehicle_type_name = description;
    this.model.vehicle_unit_code = undefined;
    this.model.vehicle_unit_name = undefined;
    $('#lookupModalType').modal('hide');
  }
  //#endregion Type

  //#region Model
  btnLookupModel() {
    $('#datatableLookupModel').DataTable().clear().destroy();
    $('#datatableLookupModel').DataTable({
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
          'p_vehicle_subcategory_code': this.model.vehicle_subcategory_code,
          'p_vehicle_merk_code': this.model.vehicle_merk_code
        });
        
        this.dalservice.Getrows(dtParameters, this.APIControllerModel, this.APIRouteLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupModel = parse.data;
          if (parse.data != null) {
            this.lookupModel.numberIndex = dtParameters.start;
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

  btnSelectRowModel(code: String, description: String) {
    this.model.vehicle_model_code = code;
    this.model.vehicle_model_name = description;
    this.model.vehicle_type_name = undefined;
    this.model.vehicle_type_code = undefined;
    this.model.vehicle_unit_code = undefined;
    this.model.vehicle_unit_name = undefined;
    $('#lookupModalModel').modal('hide');
  }
  //#endregion Model

  //#region Merk
  btnLookupMerk() {
    $('#datatableLookupMerk').DataTable().clear().destroy();
    $('#datatableLookupMerk').DataTable({
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
          'default': ''
        });
        
        this.dalservice.Getrows(dtParameters, this.APIControllerMerk, this.APIRouteLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupMerk = parse.data;
          if (parse.data != null) {
            this.lookupMerk.numberIndex = dtParameters.start;
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

  btnSelectRowMerk(code: String, description: String) {
    this.model.vehicle_merk_code = code;
    this.model.vehicle_merk_name = description;
    this.model.vehicle_model_name = undefined;
    this.model.vehicle_type_name = undefined;
    this.model.vehicle_model_code = undefined;
    this.model.vehicle_type_code = undefined;
    this.model.vehicle_unit_code = undefined;
    this.model.vehicle_unit_name = undefined;
    $('#lookupModalMerk').modal('hide');
  }
  //#endregion Merk

  //#region Sub
  btnLookupSub() {
    $('#datatableLookupSub').DataTable().clear().destroy();
    $('#datatableLookupSub').DataTable({
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
          'p_vehicle_category_code': this.model.vehicle_category_code
        });
        
        this.dalservice.Getrows(dtParameters, this.APIControllerSub, this.APIRouteLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupSub = parse.data;
          if (parse.data != null) {
            this.lookupSub.numberIndex = dtParameters.start;
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

  btnSelectRowSub(code: String, description: String) {
    this.model.vehicle_subcategory_code = code;
    this.model.vehicle_subcategory_name = description;
    this.model.vehicle_model_name = undefined;
    this.model.vehicle_type_name = undefined;
    this.model.vehicle_model_code = undefined;
    this.model.vehicle_type_code = undefined;
    this.model.vehicle_unit_code = undefined;
    this.model.vehicle_unit_name = undefined;
    $('#lookupModalSub').modal('hide');
  }
  //#endregion Sub

  //#region Category
  btnLookupCategory() {
    $('#datatableLookupCategory').DataTable().clear().destroy();
    $('#datatableLookupCategory').DataTable({
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
          'default': ''
        });
        
        this.dalservice.Getrows(dtParameters, this.APIControllerCategory, this.APIRouteLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupCategory = parse.data;
          if (parse.data != null) {
            this.lookupCategory.numberIndex = dtParameters.start;
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

  btnSelectRowCategory(code: String, description: String) {
    this.model.vehicle_category_code = code;
    this.model.vehicle_category_name = description;
    this.model.vehicle_subcategory_name = undefined;
    this.model.vehicle_model_name = undefined;
    this.model.vehicle_type_name = undefined;
    this.model.vehicle_subcategory_code = undefined;
    this.model.vehicle_model_code = undefined;
    this.model.vehicle_type_code = undefined;
    this.model.vehicle_unit_code = undefined;
    this.model.vehicle_unit_name = undefined;
    $('#lookupModalCategory').modal('hide');
  }
  //#endregion Category

  //#region getrow data
  callGetrow() {
     
    this.dataTamp = [{
      'p_code': this.param,
    }];
    
    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];

          // checkbox is active
          if (parsedata.is_active === '1') {
            parsedata.is_active = true;
          } else {
            parsedata.is_active = false;
          }
          // end checkbox is active

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

  //#region form submit
  onFormSubmit(priceForm: NgForm, isValid: boolean) {
    // price form submit
    if (!isValid) {
      swal({
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

    this.priceData = priceForm;
    if (this.priceData.p_is_active == null) {
      this.priceData.p_is_active = false;
    }
    const usersJson: any[] = Array.of(this.priceData);
    if (this.param != null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showSpinner = false;
              this.showNotification('bottom', 'right', 'success');
              this.callGetrow();
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
    } else {
      // call web service
      this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showSpinner = false;
              this.showNotification('bottom', 'right', 'success');
              this.route.navigate(['/vehicle/subpricelist/pricedetail', parse.code]);
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
  }
  //#endregion form submit

  //#region button back
  btnBack() {
    this.route.navigate(['/vehicle/subpricelist']);
    $('#datatableVehiclePriceList').DataTable().ajax.reload();
  }
  //#endregion button back
}