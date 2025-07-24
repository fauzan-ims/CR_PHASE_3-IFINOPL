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
  templateUrl: './shareholderdetail.component.html'
})

export class ShareholderdetailComponent extends BaseComponent implements OnInit {
  // get param from url

  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');
  type = this.getRouteparam.snapshot.paramMap.get('type');
  from = this.getRouteparam.snapshot.paramMap.get('from');
  page = this.getRouteparam.snapshot.paramMap.get('page');
  paramss = this.getRouteparam.snapshot.paramMap.get('id3');

  // variable
  public textonly = this._textonlyformat;
  public NpwpPattern = this._npwpformat;
  public plafond_status: String;
  public NumberOnlyPattern = this._numberonlyformat;
  public shareholderdetailData: any = [];
  public isReadOnly: Boolean = false;
  public lookupdatiii: any = [];
  public lookupposition: any = [];
  public lookupprovince: any = [];
  public lookupcity: any = [];
  public lookupzipcode: any = [];
  public lookupexistingclient: any = [];
  private genderCode: any;
  private dataTamp: any = [];
  public setStyle: any = [];

  //Controller
  private APIController: String = 'ClientRelation';
  private APIControllerMasterOjkReference: String = 'MasterOjkReference';
  private APIControllerClientMain: String = 'ClientMain';
  private APIControllerSysProvince: String = 'SysProvince';
  private APIControllerSysCity: String = 'SysCity';
  private APIControllerSysZipCode: String = 'SysZipCode';

  //route
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
    $("#npwp").attr('maxlength', '15');
    this.Delimiter(this._elementRef);
    this.plafond_status = $('#plafondStatus').val();
    if (this.paramss != null) {
      this.isReadOnly = true;

      // call web service
      this.callGetrow();
    } else {
      this.model.client_type = 'CORPORATE';
      this.model.relation_type = 'SHAREHOLDER';
      this.model.shareholder_type = 'PERSONAL';
      this.model.officer_signer_type = 'APPROVER';
      this.model.gender_code = 'M';
      this.showSpinner = false;
    }
  }

  //#region getrow data
  callGetrow() {

    this.dataTamp = [{
      'p_id': this.paramss
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];

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
          console.log('There was an error while Retrieving Data(API) !!!' + error);
        });
  }
  //#endregion getrow data

  //#region  form submit
  onFormSubmit(shareholderdetailForm: NgForm, isValid: boolean) {
    // validation form submit
    if (!isValid) {
      swal({
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

    this.shareholderdetailData = shareholderdetailForm;

    if (this.shareholderdetailData.p_is_officer == null) {
      this.shareholderdetailData.p_is_officer = false;
    }
    if (this.shareholderdetailData.p_gender_code == null) {
      this.shareholderdetailData.p_gender_code = this.genderCode;
    }
    this.shareholderdetailData = this.JSToNumberFloats(shareholderdetailForm);
    const usersJson: any[] = Array.of(this.shareholderdetailData);
    console.log(usersJson);
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
            this.swalPopUpMsg(parse.data);
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
              this.route.navigate(['/client/subclientpersonallist/clientpersonaldetail/' + this.param + '/' + this.params + '/' + this.type + '/' + this.from + '/' + this.page + '/shareholderdetail', this.param, this.params, this.type, this.from, this.page, parse.id], { skipLocationChange: true });
            } else {
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
    this.model.shareholder_type = event.target.value;
    this.model.shareholder_client_code = null;
    this.model.shareholder_client_name = null;
    this.model.relation_client_code = null;
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
    this.model.family_type_code = null;
    this.model.is_emergency_contact = null;
    this.model.phone_no = null;
    this.model.area_phone_no = null;
  }
  //#endregion  ClientType

  //#region button back
  btnBack() {
    this.route.navigate(['/client/subclientpersonallist/clientpersonaldetail/' + this.param + '/' + this.params + '/' + this.type + '/' + this.from + '/' + this.page + '/shareholderlist', this.param, this.params, this.type, this.from, this.page], { skipLocationChange: true });
  }
  //#endregion button back

  //#region npwp
  onKeydownNpwp(event: any) {

    let ctrlDown = false;

    if (event.keyCode == 17 || event.keyCode == 91) {
      ctrlDown = true;
    }

    if (!((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)
      || (ctrlDown && (event.keyCode == 86 || event.keyCode == 67 || event.keyCode == 65 || event.keyCode == 90))
      || event.keyCode == 8 || event.keyCode == 9
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
    this.model.relation_type = 'SHAREHOLDER';
  }
  //#endregion resetClientExisting

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

        this.dalservice.GetrowsBase(dtParameters, this.APIControllerMasterOjkReference, this.APIRouteForLookup).subscribe(resp => {
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
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 4] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowPosition(code: String, description: String, ojk_code: String) {
    this.model.officer_position_type_code = code;
    this.model.officer_position_type_name = description;
    this.model.officer_position_type_ojk_code = ojk_code;
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

  //#region DatiII Lookup
  btnLookupDatiII() {
    $('#datatableLookupDatiII').DataTable().clear().destroy();
    $('#datatableLookupDatiII').DataTable({
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
          'p_reference_type_code': 'DATIII'
        });

        this.dalservice.GetrowsBase(dtParameters, this.APIControllerMasterOjkReference, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupdatiii = parse.data;

          if (parse.data != null) {
            this.lookupdatiii.numberIndex = dtParameters.start;
          }

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
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

  btnSelectRowDatiII(code: String, description: String, ojk_code: String) {
    this.model.dati_ii_code = code;
    this.model.dati_ii_name = description;
    this.model.dati_ii_ojk_code = ojk_code;
    $('#lookupModalDatiII').modal('hide');
  }
  //#endregion DatiII lookup

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
    //       'p_client_type': this.model.shareholder_type,
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
    , reference_type_code: String
    , shareholder_pct: String
    , relation_gender_code: String
    , dati_ii_code: String
    , dati_ii_desc: String
  ) {
    this.model.relation_client_code = code;
    this.model.existing_client_name = client_name;
    this.model.full_name = full_name;
    this.genderCode = gender_code
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
    this.model.reference_type_code = reference_type_code;
    this.model.shareholder_pct = shareholder_pct;
    this.model.relation_gender_code = relation_gender_code;
    this.model.dati_ii_code = dati_ii_code;
    this.model.dati_ii_desc = dati_ii_desc;
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
  //#endregion
}
