import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../../../../../base.component';
import { DALService } from '../../../../../../../../../../../DALservice.service';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './guarantordetail.component.html'
})

export class ObjectInfoGuarantordetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');
  pageType = this.getRouteparam.snapshot.paramMap.get('page');

  // variable
  public textonly = this._textonlyformat;
  public NpwpPattern = this._npwpformat;
  public NumberOnlyPattern = this._numberonlyformat;
  public guarantordetailData: any = [];
  public isReadOnly: Boolean = false;
  public lookupposition: any = [];
  public lookupprovince: any = [];
  public lookupcity: any = [];
  public lookupzipcode: any = [];
  public lookupexistingclient: any = [];
  public setStyle: any = [];
  private genderCode: any;
  private branch: String;
  private dataTamp: any = [];

  private APIController: String = 'ApplicationGuarantor';
  private APIControllerMasterOjkReference: String = 'MasterOjkReference';
  private APIControllerClientMain: String = 'ClientMain';
  private APIControllerSysProvince: String = 'SysProvince';
  private APIControllerSysCity: String = 'SysCity';
  private APIControllerSysZipCode: String = 'SysZipCode';
  private APIControllerApplicationMain: String = 'ApplicationMain';

  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForLookupByProvinceCode: String = 'GetRowsLookupByProvinceCode';
  private APIRouteForLookupByCityCode: String = 'GetRowsLookupByCityCode';

  private RoleAccessCode = 'R00022400000000A'; // role access 

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
    $("#npwpNo").attr('maxlength', '15');
    
    this.Delimiter(this._elementRef);
    this.callGetrowApplication();
    if (this.params != null) {
      this.isReadOnly = true;

      // call web service
      this.callGetrow();
    } else {
      this.model.client_type = 'CORPORATE';
      this.model.guarantor_client_type = 'PERSONAL';
      this.model.officer_signer_type = 'APPROVER';
      this.model.gender_code = 'L';
      this.showSpinner = false;
    }
  }

  //#region npwp
  onKeydownNpwp(event: any) {

    let ctrlDown = false;

    if (event.keyCode == 17 || event.keyCode == 91) {
      ctrlDown = true;
    }

    if (!((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)
      || (ctrlDown && (event.keyCode == 86 || event.keyCode == 67 || event.keyCode == 65 || event.keyCode == 90))
      || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 46
      || (event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 38 || event.keyCode == 40)
    )) {

      return false;
    }

  }

  onPasteNpwp(event: any) {

    if (!event.originalEvent.clipboardData.getData('Text').match(/^[0-9,.-]*$/)) {
      event.preventDefault();
    }

  }

  onFokusNpwp(event: any) {
    let valEvent: any;
    valEvent = '' + event.target.value;

    if (valEvent != null) {
      this.model.npwp_no = valEvent.replace(/[^0-9]/g, '');
    }

  }

  onChangeNpwp(event: any) {

    let valEvent: any;

    valEvent = '' + event.target.value;
    var x = valEvent.split('');

    if (x.length == 15) {
      var tt = x[0] + x[1] + '.';
      var dd = tt + x[2] + x[3] + x[4] + '.';
      var ee = dd + x[5] + x[6] + x[7] + '.';
      var ff = ee + x[8] + '-';
      var gg = ff + x[9] + x[10] + x[11] + '.';
      var hh = gg + x[12] + x[13] + x[14];

      this.model.npwp_no = hh;
    }

  }
  //#endregion npwp

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

  //#region getrow data
  callGetrowApplication() {

    this.dataTamp = [{
      'p_application_no': this.param
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIControllerApplicationMain, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          this.branch = parsedata.branch_code;
          this.showSpinner = false;
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
  }
  //#endregion getrow data

  //#region getrow data
  callGetrow() {

    this.dataTamp = [{
      'p_id': this.params
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          this.genderCode = parsedata.gender_code;

          // checkbox
          if (parsedata.is_officer === '1') {
            parsedata.is_officer = true;
          } else {
            parsedata.is_officer = false;
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
  onFormSubmit(guarantordetailForm: NgForm, isValid: boolean) {
    // validation form submit
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

    this.guarantordetailData = guarantordetailForm;
    if (this.guarantordetailData.p_gender_code == null) {
      this.guarantordetailData.p_gender_code = this.genderCode;
    }
    this.guarantordetailData = this.JSToNumberFloats(guarantordetailForm);
    const usersJson: any[] = Array.of(this.guarantordetailData);
    if (this.params != null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showSpinner = false;
              $('#clientDetail').click();
              this.callGetrow();
              this.showNotification('bottom', 'right', 'success');
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
              $('#clientDetail').click();
              this.showNotification('bottom', 'right', 'success');
              this.route.navigate(['/inquiry/subapplicationmainlist/applicationmaindetail/' + this.param + '/legaldetail/' + this.param + '/' + this.branch + '/guarantordetail/', this.param, parse.id], { skipLocationChange: true });
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

  //#region  isOfficer
  isOfficer(event) {
    this.model.is_officer = event.target.checked;
  }
  //#endregion isOfficer

  //#region  ClientType
  clientType(event: any) {
    if (event.target.value === 'PERSONAL') {
      this.model.gender_code = 'M';
    } else {
      this.model.gender_code = 'B';
    }
    this.model.guarantor_client_code = null;
    this.model.guarantor_client_name = null;
    this.model.relation_client_code = null;
    this.model.guarantor_client_code = null;
    this.model.existing_client_name = null;
    this.model.full_name = null;
    this.model.mother_maiden_name = null;
    this.model.place_of_birth = null;
    this.model.date_of_birth = null;
    this.model.province_code = null;
    this.model.province_name = null;
    this.model.city_code = null;
    this.model.city_name = null;
    this.model.zip_code = null;
    this.model.zip_code_code = null;
    this.model.zip_name = null;
    this.model.sub_district = null;
    this.model.village = null;
    this.model.address = null;
    this.model.rt = null;
    this.model.rw = null;
    this.model.area_mobile_no = null;
    this.model.mobile_no = null;
    this.model.id_no = null;
    this.model.npwp_no = null;
  }
  //#endregion  ClientType

  //#region resetClientExisting
  resetClientExisting() {
    if (this.model.guarantor_client_type === 'PERSONAL') {
      this.model.gender_code = 'M';
    } else {
      this.model.gender_code = 'B';
    }
    this.model.relation_client_code = null;
    this.model.guarantor_client_code = null;
    this.model.existing_client_name = null;
    this.model.full_name = null;
    this.model.mother_maiden_name = null;
    this.model.place_of_birth = null;
    this.model.date_of_birth = null;
    this.model.province_code = null;
    this.model.province_name = null;
    this.model.city_code = null;
    this.model.city_name = null;
    this.model.zip_code = null;
    this.model.zip_code_code = null;
    this.model.zip_name = null;
    this.model.sub_district = null;
    this.model.village = null;
    this.model.address = null;
    this.model.rt = null;
    this.model.rw = null;
    this.model.area_mobile_no = null;
    this.model.mobile_no = null;
    this.model.id_no = null;
    this.model.npwp_no = null;
  }
  //#endregion resetClientExisting

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
    //       'p_client_type': this.model.guarantor_client_type,
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
  ) {
    this.model.relation_client_code = code;
    this.model.existing_client_name = client_name;
    this.model.full_name = full_name;
    this.genderCode = gender_code;
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
    $('#lookupModalExistingClient').modal('hide');
  }
  //#endregion Existing Client Lookup

  //#region button back
  btnBack() {
    this.route.navigate(['/objectinfoapplication/objectinfoapplicationmain/' + this.param + '/' + this.pageType + '/legaldetail/' + this.param + '/' + this.branch + '/' + 'banberjalan' + '/guarantorlist/', this.param, 'banberjalan'], { skipLocationChange: true });
    $('#datatableApplicationGuarantor').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region Position Lookup
  btnLookupPosition() {
    $('#datatableLookupPosition').DataTable().clear().destroy();
    $('#datatableLookupPosition').DataTable({
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
          'p_reference_type_code': 'KDJBTN'
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerMasterOjkReference, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupposition = parse.data;
          if (parse.data != null) {
            this.lookupposition.numberIndex = dtParameters.start;
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

  btnSelectRowPosition(code: String, description: String) {
    this.model.officer_position_type_code = code;
    this.model.officer_position_type_desc = description;
    $('#lookupModalPosition').modal('hide');
  }
  //#endregion Position lookup

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
    this.model.city_code = null;
    this.model.city_name = null;
    this.model.zip_code = null;
    this.model.zip_name = null;
    this.model.zip_code_code = null;
    this.model.sub_district = null;
    this.model.village = null;
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
    this.model.zip_code = null;
    this.model.zip_name = null;
    this.model.zip_code_code = null;
    this.model.sub_district = null;
    this.model.village = null;
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
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 5] }], // for disabled coloumn
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
    this.model.zip_name = zip_name;
    this.model.zip_code_code = zip_code_code;
    this.model.sub_district = sub_district;
    this.model.village = village;
    $('#lookupModalZipCode').modal('hide');
  }
  //#endregion zip code lookup
}