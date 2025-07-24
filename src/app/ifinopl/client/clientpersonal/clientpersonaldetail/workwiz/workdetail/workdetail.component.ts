import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import { DALService } from '../../../../../../../DALservice.service';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './workdetail.component.html'
})

export class WorkdetailComponent extends BaseComponent implements OnInit {
  // get param from url

  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');
  type = this.getRouteparam.snapshot.paramMap.get('type');
  from = this.getRouteparam.snapshot.paramMap.get('from');
  page = this.getRouteparam.snapshot.paramMap.get('page');
  paramss = this.getRouteparam.snapshot.paramMap.get('id3');

  // variable
  public plafond_status: String;
  public plafondStatus: Boolean;
  public NumberOnlyPattern = this._numberonlyformat;
  public workdetailData: any = [];
  public isReadOnly: Boolean = false;
  public lookupprovince: any = [];
  public lookupcity: any = [];
  public lookupzipcode: any = [];
  public lookupworktype: any = [];
  public lookupbusinessline: any = [];
  public lookupsubbusinessline: any = [];
  public setStyle: any = [];
  private rolecode: any = [];
  private dataRoleTamp: any = [];
  private dataTamp: any = [];
  private APIController: String = 'ClientPersonalWork';
  private APIControllerSysGeneralSubcodeDetail: String = 'SysGeneralSubcodeDetail';
  private APIControllerSysGeneralSubcode: String = 'SysGeneralSubcode';
  private APIControllerSysProvince: String = 'SysProvince';
  private APIControllerSysCity: String = 'SysCity';
  private APIControllerSysZipCode: String = 'SysZipCode';
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForLookupByProvinceCode: String = 'GetRowsLookupByProvinceCode';
  private APIRouteForLookupByCityCode: String = 'GetRowsLookupByCityCode';
  private APIRouteForGetRole: String = 'ExecSpForGetRole';
  private RoleAccessCode = 'R00022550000010A';

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = false;
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
    // call web service
    this.plafond_status = $('#plafondStatus').val();
    if (this.plafond_status !== 'HOLD') {
      this.plafondStatus = true;
    } else {
      this.plafondStatus = false;
    }
    this.callGetrow();
  }

  //#region getStyles2
  getStyles2(isTrue: Boolean) {

    if (isTrue) {
      this.setStyle = {
        'pointer-events': 'none',
      }
    } else {
      this.setStyle = {
        'cursor': 'pointer',
      }
    }

    return this.setStyle;
  }
  //#endregion getStyles2

  //#region getrow data
  callGetrow() {

    this.dataTamp = [{
      'p_id': this.paramss
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          // checkbox
          if (parsedata.is_latest === '1') {
            parsedata.is_latest = true;
          } else {
            parsedata.is_latest = false;
          }
          // end checkbox

          // mapper dbtoui
          Object.assign(this.model, parsedata);
          // end mapper dbtoui

          this.showSpinner = false;
        },
        error => {
          console.log('There was an error while Retrieving Data(API) !!!' + error);
        });
  }
  //#endregion getrow data

  //#region form submit
  onFormSubmit(workdetailForm: NgForm, isValid: boolean) {
    // validation form submit
    if (!isValid) {
      swal({
        allowOutsideClick: false,
        title: 'Warning!',
        text: 'Please Fill a Mandatory Field OR Format Is Invalid!!',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-warning',
        type: 'warning'
      }).catch(swal.noop)
      return;
    } else {
      this.showSpinner = false;
    }

    this.workdetailData = this.JSToNumberFloats(workdetailForm);
    if (this.workdetailData.p_is_latest == null) {
      this.workdetailData.p_is_latest = false;
    }
    const usersJson: any[] = Array.of(this.workdetailData);
    if (this.paramss != null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
        .subscribe(
          res => {
            this.showSpinner = false;
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              $('#clientDetail').click();
              this.callGetrow();
              this.showNotification('bottom', 'right', 'success');
            } else {
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
            this.showSpinner = false;
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              $('#clientDetail').click();
              this.showNotification('bottom', 'right', 'success');
              this.route.navigate(['/client/subclientpersonallist/clientpersonaldetail/' + this.param + '/' + this.params + '/' + this.type + '/' + this.from + '/' + this.page + '/workdetail', this.param, this.params, this.type, this.from, this.page, parse.id], { skipLocationChange: true });
            } else {
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
    this.route.navigate(['/client/subclientpersonallist/clientpersonaldetail/' + this.param + '/' + this.params + '/' + this.type + '/' + this.from + '/' + this.page + '/worklist', this.param, this.params, this.type, this.from, this.page], { skipLocationChange: true });
  }
  //#endregion button back

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

  //#region WorkType Lookup
  btnLookupWorkType() {
    $('#datatableLookupWorkType').DataTable().clear().destroy();
    $('#datatableLookupWorkType').DataTable({
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
          'p_general_code': 'JOB'
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerSysGeneralSubcode, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupworktype = parse.data;

          if (parse.data != null) {
            this.lookupworktype.numberIndex = dtParameters.start;
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

  btnSelectRowWorkType(code: String, description: String) {
    this.model.work_type_code = code;
    this.model.work_type_desc = description;
    $('#lookupModalWorkType').modal('hide');
  }
  //#endregion WorkType lookup

  //#region isLatest
  isLatest(event) {
    this.model.is_latest = event.target.checked;
  }
  //#endregion isLatest

  //#region Lookup Province
  btnLookupProvince() {
    $('#datatableLookupProvince').DataTable().clear().destroy();
    $('#datatableLookupProvince').DataTable({
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

        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysProvince, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupprovince = parse.data;

          if (parse.data != null) {
            this.lookupprovince.numberIndex = dtParameters.start;
          }

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, targets: [0, 1, 4] }],
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowLookupProvince(province_code: String, province_name: string) {
    this.model.province_code = province_code;
    this.model.province_name = province_name;
    this.model.city_code = undefined;
    this.model.city_name = undefined;
    this.model.zip_code = undefined;
    this.model.zip_code_code = undefined;
    this.model.zip_name = undefined;
    this.model.sub_district = undefined;
    this.model.village = undefined;
    $('#lookupModalProvince').modal('hide');
  }
  //#endregion Lookup Province

  //#region Lookup City
  btnLookupCity() {
    $('#datatableLookupCity').DataTable().clear().destroy();
    $('#datatableLookupCity').DataTable({
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
          'p_province_code': this.model.province_code
        });


        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysCity, this.APIRouteForLookupByProvinceCode).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupcity = parse.data;

          if (parse.data != null) {
            this.lookupcity.numberIndex = dtParameters.start;
          }

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, targets: [0, 1, 4] }],
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowLookupCity(city_code: String, city_name: string) {
    this.model.city_code = city_code;
    this.model.city_name = city_name;
    this.model.zip_code = undefined;
    this.model.zip_code_code = undefined;
    this.model.zip_name = undefined;
    this.model.sub_district = undefined;
    this.model.village = undefined;
    $('#lookupModalCity').modal('hide');
  }
  //#endregion Lookup City

  //#region zip code lookup
  btnLookupZipCode() {
    $('#datatableLookupZipCode').DataTable().clear().destroy();
    $('#datatableLookupZipCode').DataTable({
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
          'p_city_code': this.model.city_code
        });

        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysZipCode, this.APIRouteForLookupByCityCode).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupzipcode = parse.data;

          if (parse.data != null) {
            this.lookupzipcode.numberIndex = dtParameters.start;
          }

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [5] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowLookupZipCode(zip_code: String, zip_code_code: String, zip_name: String, sub_district: string, village: string) {
    this.model.zip_code = zip_code;
    this.model.zip_code_code = zip_code_code;
    this.model.zip_name = zip_name;
    this.model.sub_district = sub_district;
    this.model.village = village;
    $('#lookupModalZipCode').modal('hide');
  }
  //#endregion zip code lookup

  //#region BusinessLine Lookup
  btnLookupBusinessLine() {
    $('#datatableLookupBusinessLine').DataTable().clear().destroy();
    $('#datatableLookupBusinessLine').DataTable({
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
          'p_general_code': 'CRPBSN'
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerSysGeneralSubcode, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupbusinessline = parse.data;

          if (parse.data != null) {
            this.lookupbusinessline.numberIndex = dtParameters.start;
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

  btnSelectRowBusinessLine(code: String, description: String) {
    this.model.company_business_line = code;
    this.model.business_line_desc = description;
    this.model.company_sub_business_line = undefined;
    this.model.sub_business_line_desc = undefined;
    $('#lookupModalBusinessLine').modal('hide');
  }
  //#endregion BusinessLine lookup

  //#region SubBusinessLine Lookup
  btnLookupSubBusinessLine() {
    $('#datatableLookupSubBusinessLine').DataTable().clear().destroy();
    $('#datatableLookupSubBusinessLine').DataTable({
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
          'p_general_subcode_code': this.model.company_business_line
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerSysGeneralSubcodeDetail, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupsubbusinessline = parse.data;

          if (parse.data != null) {
            this.lookupsubbusinessline.numberIndex = dtParameters.start;
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

  btnSelectRowSubBusinessLine(code: String, description: String) {
    this.model.company_sub_business_line = code;
    this.model.sub_business_line_desc = description;
    $('#lookupModalSubBusinessLine').modal('hide');
  }
  //#endregion SubBusinessLine lookup

  //#region resetProvince
  resetProvince() {
    this.model.province_code = undefined;
    this.model.province_name = undefined;
    this.model.city_code = undefined;
    this.model.city_name = undefined;
    this.model.zip_code = undefined;
    this.model.zip_code_code = undefined;
    this.model.zip_name = undefined;
    this.model.sub_district = undefined;
    this.model.village = undefined;
  }
  //#endregion resetProvince

  //#region resetCity
  resetCity() {
    this.model.city_code = undefined;
    this.model.city_name = undefined;
    this.model.zip_code = undefined;
    this.model.zip_code_code = undefined;
    this.model.zip_name = undefined;
    this.model.sub_district = undefined;
    this.model.village = undefined;

  }
  //#endregion resetCity

  //#region resetZipCode
  resetZipCode() {
    this.model.zip_code = undefined;
    this.model.zip_code_code = undefined;
    this.model.zip_name = undefined;
    this.model.sub_district = undefined;
    this.model.village = undefined;
  }
  //#endregion resetZipCode
}
