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
  templateUrl: './familydetail.component.html'
})

export class FamilydetailComponent extends BaseComponent implements OnInit {
  // get param from url

  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');
  type = this.getRouteparam.snapshot.paramMap.get('type');
  from = this.getRouteparam.snapshot.paramMap.get('from');
  page = this.getRouteparam.snapshot.paramMap.get('page');
  paramss = this.getRouteparam.snapshot.paramMap.get('id3');

  // variable
  public textonly = this._textonlyformat
  public NumberOnlyPattern = this._numberonlyformat
  public plafond_status: String;
  public plafondStatus: Boolean;
  public familydetailData: any = [];
  public lookupfamilytype: any = [];
  public lookupprovince: any = [];
  public lookupcity: any = [];
  public lookupgender: any = [];
  public lookupzipcode: any = [];
  public lookupexistingclient: any = [];
  public isReadOnly: Boolean = false;
  public setStyle: any = [];
  private rolecode: any = [];
  private dataRoleTamp: any = [];
  private dataTamp: any = [];
  private APIController: String = 'ClientRelation';
  private APIControllerSysGeneralSubcode: String = 'SysGeneralSubcode';
  private APIControllerClientMain: String = 'ClientMain';
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
    this.plafond_status = $('#plafondStatus').val();

    if (this.plafond_status !== 'HOLD') {
      this.plafondStatus = true;
    } else {
      this.plafondStatus = false;
    }
    if (this.paramss != null) {
      this.isReadOnly = true;

      // call web service
      this.callGetrow();
    } else {
      this.model.client_type = 'PERSONAL';
      this.model.relation_type = 'FAMILY';
      this.showSpinner = false;
    }
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
          if (parsedata.is_emergency_contact === '1') {
            parsedata.is_emergency_contact = true;
          } else {
            parsedata.is_emergency_contact = false;
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

  //#region  form submit
  onFormSubmit(familydetailForm: NgForm, isValid: boolean) {
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
      this.showSpinner = true;
    }

    this.familydetailData = this.JSToNumberFloats(familydetailForm);
    if (this.familydetailData.p_is_emergency_contact == null) {
      this.familydetailData.p_is_emergency_contact = false;
    }
    const usersJson: any[] = Array.of(this.familydetailData);
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
              this.route.navigate(['/client/subclientpersonallist/clientpersonaldetail/' + this.param + '/' + this.params + '/' + this.type + '/' + this.from + '/' + this.page + '/familydetail', this.param, this.params, this.type, this.from, this.page, parse.id], { skipLocationChange: true });
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
    this.route.navigate(['/client/subclientpersonallist/clientpersonaldetail/' + this.param + '/' + this.params + '/' + this.type + '/' + this.from + '/' + this.page + '/familylist', this.param, this.params, this.type, this.from, this.page], { skipLocationChange: true });
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

  //#region resetClientExisting
  resetClientExisting() {
    this.model.relation_client_code = undefined;
    this.model.existing_client_name = undefined;
    this.model.full_name = undefined;
    this.model.gender_code = undefined;
    this.model.gender_desc = undefined;
    this.model.mother_maiden_name = undefined;
    this.model.place_of_birth = undefined;
    this.model.date_of_birth = undefined;
    this.model.province_code = undefined;
    this.model.province_name = undefined;
    this.model.city_code = undefined;
    this.model.city_name = undefined;
    this.model.zip_code = undefined;
    this.model.zip_code_code = undefined;
    this.model.zip_name = undefined;
    this.model.sub_district = undefined;
    this.model.village = undefined;
    this.model.address = undefined;
    this.model.rt = undefined;
    this.model.rw = undefined;
    this.model.area_mobile_no = undefined;
    this.model.mobile_no = undefined;
    this.model.id_no = undefined;
    this.model.npwp_no = undefined;
    this.model.family_type_code = undefined;
    this.model.is_emergency_contact = undefined;
    this.model.phone_no = undefined;
    this.model.area_phone_no = undefined;
    this.model.relation_type = undefined;
  }
  //#endregion resetClientExisting

  //#region Gender Lookup
  btnLookupGender() {
    $('#datatableLookupGender').DataTable().clear().destroy();
    $('#datatableLookupGender').DataTable({
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
          'p_general_code': 'GNDR'
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerSysGeneralSubcode, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupgender = parse.data;

          if (parse.data != null) {
            this.lookupgender.numberIndex = dtParameters.start;
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

  btnSelectRowGender(code: String, description: String) {
    this.model.gender_code = code;
    this.model.gender_desc = description;
    $('#lookupModalGender').modal('hide');
  }
  //#endregion Gender lookup

  //#region FamilyType Lookup
  btnLookupFamilyType() {
    $('#datatableLookupFamilyType').DataTable().clear().destroy();
    $('#datatableLookupFamilyType').DataTable({
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
          'p_general_code': 'FMLYT'
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerSysGeneralSubcode, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupfamilytype = parse.data;

          if (parse.data != null) {
            this.lookupfamilytype.numberIndex = dtParameters.start;
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

  btnSelectRowFamilyType(code: String, description: String) {
    this.model.family_type_code = code;
    this.model.family_type_desc = description;
    $('#lookupModalFamilyType').modal('hide');
  }
  //#endregion FamilyType lookup

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

  //#region Existing Client Lookup
  btnLookupExistingClient() {
    // $('#datatableLookupExistingClient').DataTable().clear().destroy();
    // $('#datatableLookupExistingClient').DataTable({
    //   'pagingType': 'first_last_numbers',
    //   'pageLength': 5,
    //   'processing': true,
    //   'serverSide': true,
    //   responsive: true,
    //   lengthChange: false, // hide lengthmenu
    //   searching: true, // jika ingin hilangin search box nya maka false
    //   ajax: (dtParameters: any, callback) => {

    //     dtParameters.paramTamp = [];
    //     dtParameters.paramTamp.push({
    //       'p_client_type': 'PERSONAL',
    //       'p_watchlist_status': 'CLEAR'
    //     });


    //     this.dalservice.GetrowsCms(dtParameters, this.APIControllerClientMain, this.APIRouteForLookup).subscribe(resp => {
    //       const parse = JSON.parse(resp);
    //       this.lookupexistingclient = parse.data;
    //       if (parse.data != null) {
    //         this.lookupexistingclient.numberIndex = dtParameters.start;
    //       }
    //       callback({
    //         draw: parse.draw,
    //         recordsTotal: parse.recordsTotal,
    //         recordsFiltered: parse.recordsFiltered,
    //         data: []
    //       });
    //     }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
    //   },
    //   columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 4] }], // for disabled coloumn
    //   language: {
    //     search: '_INPUT_',
    //     searchPlaceholder: 'Search records',
    //     infoEmpty: '<p style="color:red;" > No Data Available !</p> '
    //   },
    //   searchDelay: 800 // pake ini supaya gak bug search
    // });
  }
  btnSelectRowExistingClient(
    code: String
    , client_name: String
    , full_name: String
    , gender_code: String
    , gender_desc: String
    , mother_maiden_name: String
    , place_of_birth: String
    , date_of_birth: String
    , province_code: String
    , province_name: String
    , city_code: String
    , city_name: String
    , zip_code: String
    , zip_code_code: String
    , zip_name: String
    , sub_district: String
    , village: String
    , address: String
    , rt: String
    , rw: String
    , area_mobile_no: String
    , mobile_no: String
    , id_no: String
    , npwp_no: String
    , family_type_code: String
    , is_emergency_contact: String
    , phone_no: String
    , area_phone_no: String
    , relation_type: String
  ) {
    this.model.relation_client_code = code;
    this.model.existing_client_name = client_name;
    this.model.full_name = full_name;
    this.model.gender_code = gender_code;
    this.model.gender_desc = gender_desc;
    this.model.mother_maiden_name = mother_maiden_name;
    this.model.place_of_birth = place_of_birth;
    if (date_of_birth != null) {
      this.model.date_of_birth = this.dateFormater(date_of_birth);
    } else {
      this.model.date_of_birth = null;
    }
    this.model.province_code = province_code;
    this.model.province_name = province_name;
    this.model.city_code = city_code;
    this.model.city_name = city_name;
    this.model.zip_code = zip_code;
    this.model.zip_code_code = zip_code_code;
    this.model.zip_name = zip_name;
    this.model.sub_district = sub_district;
    this.model.village = village;
    this.model.address = address;
    this.model.rt = rt;
    this.model.rw = rw;
    this.model.area_mobile_no = area_mobile_no;
    this.model.mobile_no = mobile_no;
    this.model.id_no = id_no;
    this.model.npwp_no = npwp_no;
    this.model.family_type_code = family_type_code;
    this.model.is_emergency_contact = is_emergency_contact;
    this.model.phone_no = phone_no;
    this.model.area_phone_no = area_phone_no;
    $('#lookupModalExistingClient').modal('hide');
  }
  //#endregion Existing Client Lookup

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
