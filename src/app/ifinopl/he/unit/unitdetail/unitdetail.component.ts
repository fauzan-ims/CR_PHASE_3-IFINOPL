import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';


@Component({
  selector: 'app-unitdetail',
  templateUrl: './unitdetail.component.html'
})
export class UnitdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public unitData: any = [];
  public isReadOnly: Boolean = false;
  public lookupCategory: any = [];
  public lookupSub: any = [];
  public lookupMerk: any = [];
  public lookupModel: any = [];
  public lookupType: any = [];
  private dataTamp: any = [];

  private APIController: String = 'MasterHeUnit';
  private APIControllerCategory: String = 'MasterHeCategory';
  private APIControllerSub: String = 'MasterHeSubcategory';
  private APIControllerMerk: String = 'MasterHeMerk';
  private APIControllerModel: String = 'MasterHeModel';
  private APIControllerType: String = 'MasterHeType';

  private APIRouteLookup: String = 'GetRowsForLookup';
  private APIRouteLookupUnit: String = 'GetRowsForLookupUnit';
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForInsert: String = 'INSERT';

  private RoleAccessCode = 'R00020120000000A'; // role access 

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = true;
  // end

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
    } else {
      this.showSpinner = false;
    }
  }

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
          'default': '',
          'p_he_model_code': this.model.he_model_code
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
    this.model.he_type_code = code;
    this.model.he_type_name = description;
    this.model.he_name = this.model.he_category_name + '-' + this.model.he_subcategory_name + '-' +
      this.model.he_merk_name + '-' + this.model.he_model_name + '-' + this.model.he_type_name;
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
          'p_he_merk_code': this.model.he_merk_code,
          'p_he_subcategory_code': this.model.he_subcategory_code
        });
        
        this.dalservice.Getrows(dtParameters, this.APIControllerModel, this.APIRouteLookupUnit).subscribe(resp => {
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
    this.model.he_model_code = code;
    this.model.he_model_name = description;
    this.model.he_type_name = undefined;
    this.model.he_type_code = undefined;
    this.model.he_name = this.model.he_category_name + '-' + this.model.he_subcategory_name + '-' +
      this.model.he_merk_name + '-' + this.model.he_model_name + '-' + this.model.he_type_name;
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
    this.model.he_merk_code = code;
    this.model.he_merk_name = description;
    this.model.he_model_name = undefined;
    this.model.he_type_name = undefined;
    this.model.he_model_code = undefined;
    this.model.he_type_code = undefined;
    this.model.he_name = this.model.he_category_name + '-' + this.model.he_subcategory_name + '-' +
      this.model.he_merk_name + '-' + this.model.he_model_name + '-' + this.model.he_type_name;
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
          'default': '',
          'p_he_category_code': this.model.he_category_code
        });
        
        this.dalservice.Getrows(dtParameters, this.APIControllerSub, this.APIRouteLookupUnit).subscribe(resp => {
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
    this.model.he_subcategory_code = code;
    this.model.he_subcategory_name = description;
    this.model.he_model_name = undefined;
    this.model.he_type_name = undefined;
    this.model.he_model_code = undefined;
    this.model.he_type_code = undefined;
    this.model.he_name = this.model.he_category_name + '-' + this.model.he_subcategory_name + '-' +
      this.model.he_merk_name + '-' + this.model.he_model_name + '-' + this.model.he_type_name;
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
    this.model.he_category_code = code;
    this.model.he_category_name = description;
    this.model.he_subcategory_name = undefined;
    this.model.he_model_name = undefined;
    this.model.he_type_name = undefined;
    this.model.he_subcategory_code = undefined;
    this.model.he_model_code = undefined;
    this.model.he_type_code = undefined;
    this.model.he_name = this.model.he_category_name + '-' + this.model.he_subcategory_name + '-' +
      this.model.he_merk_name + '-' + this.model.he_model_name + '-' + this.model.he_type_name;
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
  onFormSubmit(unitForm: NgForm, isValid: boolean) {
    // unit form submit
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

    this.unitData = unitForm;
    if (this.unitData.p_is_active == null) {
      this.unitData.p_is_active = false;
    }
    if (this.unitData.p_is_cbu == null) {
      this.unitData.p_is_cbu = false;
    }
    if (this.unitData.p_is_karoseri == null) {
      this.unitData.p_is_karoseri = false;
    }
    const usersJson: any[] = Array.of(this.unitData);
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
              this.route.navigate(['/he/subunitlist/unitdetail', parse.code]);
            } else {
              this.showSpinner = false;
              this.swalPopUpMsg(parse.data)
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
    this.route.navigate(['/he/subunitlist']);
    $('#datatableHeUnitList').DataTable().ajax.reload();
  }
  //#endregion button back
}