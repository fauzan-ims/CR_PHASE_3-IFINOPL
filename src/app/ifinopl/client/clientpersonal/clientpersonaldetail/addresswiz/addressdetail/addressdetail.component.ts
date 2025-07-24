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
  templateUrl: './addressdetail.component.html'
})

export class AddressdetailComponent extends BaseComponent implements OnInit {
  // get param from url

  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');
  type = this.getRouteparam.snapshot.paramMap.get('type');
  from = this.getRouteparam.snapshot.paramMap.get('from');
  page = this.getRouteparam.snapshot.paramMap.get('page');
  paramss = this.getRouteparam.snapshot.paramMap.get('id3');

  // variable
  public plafond_status: String;
  public NumberOnlyPattern = this._numberonlyformat;
  public addressdetailData: any = [];
  public isReadOnly: Boolean = false;
  public lookupOwnership: any = [];
  public lookupprovince: any = [];
  public lookupcity: any = [];
  public lookupzipcode: any = [];
  private rolecode: any = [];
  private dataRoleTamp: any = [];
  private dataTamp: any = [];
  private APIController: String = 'ClientAddress';
  private APIControllerGeneral: String = 'SysGeneralSubcode';
  private APIControllerSysProvince: String = 'SysProvince';
  private APIControllerSysCity: String = 'SysCity';
  private APIControllerSysZipCode: String = 'SysZipCode';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForLookupByProvinceCode: String = 'GetRowsLookupByProvinceCode';
  private APIRouteForLookupByCityCode: String = 'GetRowsLookupByCityCode';
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForUpdate: String = 'UPDATE';
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
    this.plafond_status = $('#plafondStatus').val();
    if (this.paramss != null) {
      this.isReadOnly = true;

      // call web service
      this.callGetrow();
    } else {
      this.showSpinner = false;
    }
  }

  //#region getrow data
  callGetrow() {
     
    this.dataTamp = [{
      'p_code': this.paramss
    }];
    
    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];

          // checkbox
          if (parsedata.is_legal === '1') {
            parsedata.is_legal = true;
          } else {
            parsedata.is_legal = false;
          }
          if (parsedata.is_collection === '1') {
            parsedata.is_collection = true;
          } else {
            parsedata.is_collection = false;
          }
          if (parsedata.is_mailing === '1') {
            parsedata.is_mailing = true;
          } else {
            parsedata.is_mailing = false;
          }
          if (parsedata.is_residence === '1') {
            parsedata.is_residence = true;
          } else {
            parsedata.is_residence = false;
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
  onFormSubmit(addressdetailForm: NgForm, isValid: boolean) {
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

    this.addressdetailData = addressdetailForm;
    if (this.addressdetailData.p_is_legal == null) {
      this.addressdetailData.p_is_legal = false;
    }
    if (this.addressdetailData.p_is_collection == null) {
      this.addressdetailData.p_is_collection = false;
    }
    if (this.addressdetailData.p_is_mailing == null) {
      this.addressdetailData.p_is_mailing = false;
    }
    if (this.addressdetailData.p_is_residence == null) {
      this.addressdetailData.p_is_residence = false;
    }
    const usersJson: any[] = Array.of(this.addressdetailData);
    if (this.paramss != null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              $('#clientDetail').click();
              this.callGetrow();
              this.showNotification('bottom', 'right', 'success');
              this.showSpinner = false;
            } else {
              this.swalPopUpMsg(parse.data);
              this.showSpinner = false;
            }
          },
          error => {
            const parse = JSON.parse(error);
            this.swalPopUpMsg(parse.data);
            this.showSpinner = false;
          });
    } else {
      // call web service
      this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              $('#clientDetail').click();
              this.showNotification('bottom', 'right', 'success');
              this.route.navigate(['/client/subclientpersonallist/clientpersonaldetail/' + this.param + '/' + this.params + '/' + this.type + '/' + this.from + '/' + this.page + '/addressdetail', this.param, this.params, this.type, this.from, this.page, parse.code], { skipLocationChange: true });
              this.showSpinner = false;
            } else {
              this.swalPopUpMsg(parse.data);
              this.showSpinner = false;
            }
          },
          error => {
            const parse = JSON.parse(error);
            this.swalPopUpMsg(parse.data);
            this.showSpinner = false;
          });
    }
  }
  //#endregion form submit

  //#region button back
  btnBack() {
    this.route.navigate(['/client/subclientpersonallist/clientpersonaldetail/' + this.param + '/' + this.params + '/' + this.type + '/' + this.from + '/' + this.page + '/addresslist', this.param, this.params, this.type, this.from, this.page], { skipLocationChange: true });
    $('#datatableClientAddress').DataTable().ajax.reload();
  }
  //#endregion button back

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

  //#region Ownership
  btnLookupOwnership() {
    $('#datatableLookupOwnership').DataTable().clear().destroy();
    $('#datatableLookupOwnership').DataTable({
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
          'p_general_code': 'ADDOWN'
        });
        
        this.dalservice.Getrows(dtParameters, this.APIControllerGeneral, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupOwnership = parse.data;

          if (parse.data != null) {
            this.lookupOwnership.numberIndex = dtParameters.start;
          }

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          })
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      'lengthMenu': [
        [5, 25, 50, 100],
        [5, 25, 50, 100]
      ],
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 3] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;">No Data Available !</p>'
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowOwnership(code: String, description: String) {
    this.model.ownership_code = code;
    this.model.ownership_desc = description;
    $('#lookupModalOwnership').modal('hide');
  }
  //#endregion Ownership

}
