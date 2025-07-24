import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';

// call function from js shared
declare function headerPage(controller, route): any;
declare function hideButtonLink(idbutton): any;
declare function hideTabWizard(): any;

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './clientpersonaldetail.component.html'
})

export class ClientpersonaldetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');
  type = this.getRouteparam.snapshot.paramMap.get('type');
  from = this.getRouteparam.snapshot.paramMap.get('from');
  page = this.getRouteparam.snapshot.paramMap.get('page');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public WebsitePattern = this._websiteformat;
  public EmailPattern = this._emailformat;
  public textonly = this._textonlyformat;
  public clientpersonaldetailData: any = [];
  public lookupsalutationprefix: any = [];
  public lookupsalutationpostfix: any = [];
  public lookupgender: any = [];
  public lookupreligion: any = [];
  public lookupeducation: any = [];
  public lookupmartial: any = [];
  public lookupcorporatestatus: any = [];
  public lookupcorporatetype: any = [];
  public lookupbusinessline: any = [];
  public lookupsubbusinessline: any = [];
  public isReadOnly: Boolean = false;
  public isType: Boolean = false;
  public plafond_status: Boolean;
  public setStyle: any = [];
  public lookupgroup: any = [];
  private dataRoleTamp: any = [];
  private dataTamp: any = [];
  private APIController: String;
  private APIControllerClientMain: String = 'ClientMain';
  private APIControllerClientPersonal: String = 'ClientPersonalInfo';
  private APIControllerClientCorporate: String = 'ClientCorporateInfo';
  private APIControllerSysGeneralSubcode: String = 'SysGeneralSubcode';
  private APIControllerSysGeneralSubcodeDetail: String = 'SysGeneralSubcodeDetail';
  private APIControllerGroup: String = 'ClientGroup';
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForValidate: String = 'ExecSpForValidate';
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
    if (this.type === 'PERSONAL') {
      this.APIController = this.APIControllerClientPersonal;
      $('#corporateShareholder').remove();
      $('#corporateShareholder').remove();
      this.isType = false;
    } else {
      this.APIController = this.APIControllerClientCorporate;
      $('#personalFamily').remove();
      $('#personalWork').remove();
      this.isType = true;
    }

    if (this.param != null) {
      this.isReadOnly = true;

      setTimeout(() => {
        if (this.page === 'banberjalan' || this.page === 'plafondstatus' || this.page === 'applicationstatus') {
          this.model.plafond_status = 'banberjalan';
          this.plafond_status = true;
        } else {
          this.plafond_status = false;
        }
        setTimeout(() => {
          this.wizard();
          this.addresswiz();
        }, 200);
      }, 500);

      // call web service
      this.callGetrow();
    } else {
      this.model.client_type = 'PERSONAL';
      this.model.nationality_type_code = 'WNI';
      this.showSpinner = false;
    }
  }

  //#region getrow data
  callGetrow() {

    this.dataTamp = [{
      'p_client_code': this.param,
      'p_reff_no': this.params,
      'p_client_type': this.from
    }];


    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          if (parsedata.plafond_status !== 'HOLD' || this.page === 'banberjalan' || this.page === 'plafondstatus' || this.page === 'applicationstatus') {
            this.model.plafond_status = 'banberjalan';
            this.plafond_status = true;
          } else {
            this.plafond_status = false;
          }

          // checkbox
          if (parsedata.is_validate === '1') {
            parsedata.is_validate = true;
          } else {
            parsedata.is_validate = false;
          }
          if (parsedata.status_slik_checking === '1') {
            parsedata.status_slik_checking = true;
          } else {
            parsedata.status_slik_checking = false;
          }
          if (parsedata.status_dukcapil_checking === '1') {
            parsedata.status_dukcapil_checking = true;
          } else {
            parsedata.status_dukcapil_checking = false;
          }
          if (parsedata.is_red_flag === '1') {
            parsedata.is_red_flag = true;
          } else {
            parsedata.is_red_flag = false;
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

  //#region lookup reset
  resteSalutationPrefix() {
    this.model.salutation_prefix_desc = '';
    this.model.salutation_prefix_code = '';
  }

  resteSalutationPostfix() {
    this.model.salutation_postfix_desc = '';
    this.model.salutation_postfix_code = '';
  }
  //#endregion lookup reset

  //#region  form submit
  onFormSubmit(clientpersonaldetailForm: NgForm, isValid: boolean) {
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

    this.clientpersonaldetailData = this.JSToNumberFloats(clientpersonaldetailForm);
    const usersJson: any[] = Array.of(this.clientpersonaldetailData);
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
              this.swalPopUpMsg(parse.data);
              this.showSpinner = false;
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
              this.showNotification('bottom', 'right', 'success');
              this.route.navigate(['/client/subclientpersonallist/clientpersonaldetail', parse.code, this.type]);
              this.showSpinner = false;
            } else {
              this.swalPopUpMsg(parse.data);
              this.showSpinner = false;
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

  //#region button Validate
  btnValidate(code: string) {
    // param tambahan untuk getrole dynamic
    this.dataRoleTamp = [{
      'p_code': code,
      'action': ''
    }];
    // param tambahan untuk getrole dynamic

    swal({
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false
    }).then((result) => {
      this.showSpinner = true;
      if (result.value) {
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIControllerClientMain, this.APIRouteForValidate)
          .subscribe(
            res => {
              this.showSpinner = false;
              const parse = JSON.parse(res);
              if (parse.result === 1) {
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
        this.showSpinner = false;
      }
    })
    // call web service
  }
  //#endregion button Validate

  //#region button back
  btnBack() {
    this.showSpinner = true;
    if (this.model.plafond_status !== 'HOLD') {
      if (this.page === 'applicationstatus') {
        this.route.navigate(['/inquiry/inquiryapplicationmain/applicationmaindetail', this.params, 'applicationstatus']);
      } else if (this.page === 'banberjalan') {
        this.route.navigate(['/application/banberjalanapplicationmain/applicationmaindetail', this.params, 'banberjalan']);
      } else if (this.page === 'agreement'){
        this.route.navigate(['/inquiry/subagreementlist/agreementdetail', this.params]);
      }
    } else {
      if (this.from === 'APPLICATION') {
        this.route.navigate(['/application/subapplicationmainlist/applicationmaindetail', this.params]);
      } else if (this.from === 'APPLICATION_QC_VEHICLE') {
        this.route.navigate(['/application/subapplicationquickentryvehiclelist/applicationquickentryvehicledetail', this.params]);
      }
    }
    $('#datatableClientPersonalList').DataTable().ajax.reload();
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

  //#region Group Lookup
  btnLookupGroup() {
    // $('#datatableLookupGroup').DataTable().clear().destroy();
    // $('#datatableLookupGroup').DataTable({
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
    //       'default': ''
    //     });

    //     this.dalservice.GetrowsCms(dtParameters, this.APIControllerGroup, this.APIRouteForGetRows).subscribe(resp => {
    //       const parse = JSON.parse(resp);
    //       this.lookupgroup = parse.data;

    //       if (parse.data != null) {
    //         this.lookupgroup.numberIndex = dtParameters.start;
    //       }

    //       callback({
    //         draw: parse.draw,
    //         recordsTotal: parse.recordsTotal,
    //         recordsFiltered: parse.recordsFiltered,
    //         data: []
    //       });
    //     }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
    //   },
    //   columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 3] }], // for disabled coloumn
    //   language: {
    //     search: '_INPUT_',
    //     searchPlaceholder: 'Search records',
    //     infoEmpty: '<p style="color:red;" > No Data Available !</p> '
    //   },
    //   searchDelay: 800 // pake ini supaya gak bug search
    // });
  }

  btnSelectRowGroup(code: String, group_name: String) {
    this.model.client_group_code = code;
    this.model.client_group_name = group_name;
    $('#lookupModalGroup').modal('hide');
  }

  btnClearGroup() {
    this.model.client_group_code = '';
    this.model.client_group_name = '';
  }
  //#endregion Group lookup

  //#region SalutationPrefix Lookup
  btnLookupSalutationPrefix() {
    $('#datatableLookupSalutationPrefix').DataTable().clear().destroy();
    $('#datatableLookupSalutationPrefix').DataTable({
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
          'p_general_code': 'CSPFX'
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerSysGeneralSubcode, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupsalutationprefix = parse.data;

          if (parse.data != null) {
            this.lookupsalutationprefix.numberIndex = dtParameters.start;
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

  btnSelectRowSalutationPrefix(code: String, description: String) {
    this.model.salutation_prefix_code = code;
    this.model.salutation_prefix_desc = description;
    $('#lookupModalSalutationPrefix').modal('hide');
  }
  //#endregion SalutationPrefix lookup

  //#region SalutationPostfix Lookup
  btnLookupSalutationPostfix() {
    $('#datatableLookupSalutationPostfix').DataTable().clear().destroy();
    $('#datatableLookupSalutationPostfix').DataTable({
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
          'p_general_code': 'CSPPX'
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerSysGeneralSubcode, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupsalutationpostfix = parse.data;

          if (parse.data != null) {
            this.lookupsalutationpostfix.numberIndex = dtParameters.start;
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

  btnSelectRowSalutationPostfix(code: String, description: String) {
    this.model.salutation_postfix_code = code;
    this.model.salutation_postfix_desc = description;
    $('#lookupModalSalutationPostfix').modal('hide');
  }
  //#endregion SalutationPostfix lookup

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

  //#region Religion Lookup
  btnLookupReligion() {
    $('#datatableLookupReligion').DataTable().clear().destroy();
    $('#datatableLookupReligion').DataTable({
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
          'p_general_code': 'RLGION'
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerSysGeneralSubcode, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupreligion = parse.data;

          if (parse.data != null) {
            this.lookupreligion.numberIndex = dtParameters.start;
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

  btnSelectRowReligion(code: String, description: String) {
    this.model.religion_type_code = code;
    this.model.religion_type_desc = description;
    $('#lookupModalReligion').modal('hide');
  }
  //#endregion Religion lookup

  //#region Education Lookup
  btnLookupEducation() {
    $('#datatableLookupEducation').DataTable().clear().destroy();
    $('#datatableLookupEducation').DataTable({
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
          'p_general_code': 'EDTYP'
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerSysGeneralSubcode, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupeducation = parse.data;

          if (parse.data != null) {
            this.lookupeducation.numberIndex = dtParameters.start;
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

  btnSelectRowEducation(code: String, description: String) {
    this.model.education_type_code = code;
    this.model.education_type_desc = description;
    $('#lookupModalEducation').modal('hide');
  }

  resetEducation() {
    this.model.education_type_code = '';
    this.model.education_type_desc = '';
  }
  //#endregion Education lookup

  //#region Martial Lookup
  btnLookupMartial() {
    $('#datatableLookupMartial').DataTable().clear().destroy();
    $('#datatableLookupMartial').DataTable({
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
          'p_general_code': 'MRTYP'
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerSysGeneralSubcode, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupmartial = parse.data;

          if (parse.data != null) {
            this.lookupmartial.numberIndex = dtParameters.start;
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

  btnSelectRowMartial(code: String, description: String) {
    this.model.marriage_type_code = code;
    this.model.marriage_type_desc = description;
    $('#lookupModalMartial').modal('hide');
  }
  //#endregion Martial lookup

  //#region CorporateStatus Lookup
  btnLookupCorporateStatus() {
    $('#datatableLookupCorporateStatus').DataTable().clear().destroy();
    $('#datatableLookupCorporateStatus').DataTable({
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
          'p_general_code': 'CRPSTS'
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerSysGeneralSubcode, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupcorporatestatus = parse.data;

          if (parse.data != null) {
            this.lookupcorporatestatus.numberIndex = dtParameters.start;
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

  btnSelectRowCorporateStatus(code: String, description: String) {
    this.model.corporate_status_code = code;
    this.model.corporate_status_desc = description;
    $('#lookupModalCorporateStatus').modal('hide');
  }
  //#endregion CorporateStatus lookup

  //#region CorporateType Lookup
  btnLookupCorporateType() {
    $('#datatableLookupCorporateType').DataTable().clear().destroy();
    $('#datatableLookupCorporateType').DataTable({
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
          'p_general_code': 'CRPTYP'
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerSysGeneralSubcode, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupcorporatetype = parse.data;

          if (parse.data != null) {
            this.lookupcorporatetype.numberIndex = dtParameters.start;
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

  btnSelectRowCorporateType(code: String, description: String) {
    this.model.corporate_type_code = code;
    this.model.corporate_type_desc = description;
    $('#lookupModalCorporateType').modal('hide');
  }
  //#endregion CorporateType lookup

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
    this.model.business_line_code = code;
    this.model.business_line_desc = description;
    this.model.sub_business_line_code = '';
    this.model.sub_business_line_desc = '';
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
          'p_general_subcode_code': this.model.business_line_code
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
    this.model.sub_business_line_code = code;
    this.model.sub_business_line_desc = description;
    $('#lookupModalSubBusinessLine').modal('hide');
  }
  //#endregion SubBusinessLine lookup

  //#region List tabs
  addresswiz() {
    this.route.navigate(['/client/subclientpersonallist/clientpersonaldetail/' + this.param + '/' + this.params + '/' + this.type + '/' + this.from + '/' + this.page + '/addresslist', this.param, this.params, this.type, this.from, this.page], { skipLocationChange: true });
  }

  assetwiz() {
    this.route.navigate(['/client/subclientpersonallist/clientpersonaldetail/' + this.param + '/' + this.params + '/' + this.type + '/' + this.from + '/' + this.page + '/assetlist', this.param, this.params, this.type, this.from, this.page], { skipLocationChange: true });
  }

  clientbankwiz() {
    this.route.navigate(['/client/subclientpersonallist/clientpersonaldetail/' + this.param + '/' + this.params + '/' + this.type + '/' + this.from + '/' + this.page + '/clientbanklist', this.param, this.params, this.type, this.from, this.page], { skipLocationChange: true });
  }

  familywiz() {
    this.route.navigate(['/client/subclientpersonallist/clientpersonaldetail/' + this.param + '/' + this.params + '/' + this.type + '/' + this.from + '/' + this.page + '/familylist', this.param, this.params, this.type, this.from, this.page], { skipLocationChange: true });
  }

  workwiz() {
    this.route.navigate(['/client/subclientpersonallist/clientpersonaldetail/' + this.param + '/' + this.params + '/' + this.type + '/' + this.from + '/' + this.page + '/worklist', this.param, this.params, this.type, this.from, this.page], { skipLocationChange: true });
  }

  referencewiz() {
    this.route.navigate(['/client/subclientpersonallist/clientpersonaldetail/' + this.param + '/' + this.params + '/' + this.type + '/' + this.from + '/' + this.page + '/referencelist', this.param, this.params, this.type, this.from, this.page], { skipLocationChange: true });
  }

  clientkyc() {
    this.route.navigate(['/client/subclientpersonallist/clientpersonaldetail/' + this.param + '/' + this.params + '/' + this.type + '/' + this.from + '/' + this.page + '/clientkycdetail', this.param, this.params, this.type, this.from, this.page], { skipLocationChange: true });
  }

  shareholderwiz() {
    this.route.navigate(['/client/subclientpersonallist/clientpersonaldetail/' + this.param + '/' + this.params + '/' + this.type + '/' + this.from + '/' + this.page + '/shareholderlist', this.param, this.params, this.type, this.from, this.page], { skipLocationChange: true });
  }

  logwiz() {
    this.route.navigate(['/client/subclientpersonallist/clientpersonaldetail/' + this.param + '/' + this.params + '/' + this.type + '/' + this.from + '/' + this.page + '/loglist', this.param, this.params, this.type, this.from, this.page], { skipLocationChange: true });
  }

  documentswiz() {
    this.route.navigate(['/client/subclientpersonallist/clientpersonaldetail/' + this.param + '/' + this.params + '/' + this.type + '/' + this.from + '/' + this.page + '/documentdetail', this.param, this.type], { skipLocationChange: true });
  }

  sippwiz() {
    this.route.navigate(['/client/subclientpersonallist/clientpersonaldetail/' + this.param + '/' + this.params + '/' + this.type + '/' + this.from + '/' + this.page + '/sippdetail', this.param], { skipLocationChange: true });
  }

  slikswiz() {
    this.route.navigate(['/client/subclientpersonallist/clientpersonaldetail/' + this.param + '/' + this.params + '/' + this.type + '/' + this.from + '/' + this.page + '/slikdetail', this.param], { skipLocationChange: true });
  }

  notarialwiz() {
    this.route.navigate(['/client/subclientpersonallist/clientpersonaldetail/' + this.param + '/' + this.params + '/' + this.type + '/' + this.from + '/' + this.page + '/notariallist', this.param], { skipLocationChange: true });
  }

  slikfinancialwiz() {
    this.route.navigate(['/client/subclientpersonallist/clientpersonaldetail/' + this.param + '/' + this.params + '/' + this.type + '/' + this.from + '/' + this.page + '/slikfinanciallist', this.param], { skipLocationChange: true });
  }
  //#endregion List tabs
}
