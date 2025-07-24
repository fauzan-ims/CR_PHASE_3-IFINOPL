import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../../../base.component';
import { DALService } from '../../../../../../../../../DALservice.service';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './surveyrequestdetail.component.html'
})

export class SurveyrequestdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');
  pageType = this.getRouteparam.snapshot.paramMap.get('page');

  // variable
  public surveyrequestdetailData: any = [];
  public NumberOnlyPattern = this._numberonlyformat;
  public isReadOnly: Boolean = false;
  public isStatus: Boolean = false;
  public isProceed: Boolean = false;
  public isCancel: Boolean = false;
  public lookupcharges: any = [];
  private dataTamp: any = [];
  public setStyle: any = [];
  public code: String;
  private dataTampPlan: any = [];
  public listrencanapengadaan: any = [];
  public listplan: any = [];
  public listtopcustomerlease: any = [];
  public listtopcustomer: any = [];
  public listotherlease: any = [];
  public listdoc: any = [];
  public listdocument: any = [];
  public listbankdetails: any = [];
  public listbankdetail: any = [];
  public listproject: any = [];
  public listprojectlessee: any = [];
  public listother: any = [];
  public dataTampPush: any = [];
  private base64textString: string;
  public tempFile: any;
  private tempFileSize: any;
  private tamps = new Array();
  public tampDocumentCode: String;
  public bankId: String;

  // checklist
  public selectedAllPlan: any;
  public selectedAllCustomer: any;
  public selectedAllOther: any;
  public selectedAllProject: any;
  public selectedAll: any;
  public selectedAlld: any;
  public selectedAllBankDetail: any;
  public selectedAllDoc: any;
  private checkedList: any = [];

  //controller
  private APIController: String = 'ApplicationSurvey';
  private APIControllerApplicationSurveyPlan: String = 'ApplicationSurveyPlan';
  private APIControllerApplicationSurveyCustomer: String = 'ApplicationSurveyCustomer';
  private APIControllerApplicationSurveyOther: String = 'ApplicationSurveyOtherLease';
  private APIControllerApplicationSurveyDocument: String = 'ApplicationSurveyDocument';
  private APIControllerApplicationSurveyBank: String = 'ApplicationSurveyBank';
  private APIControllerApplicationSurveyBankDetail: String = 'ApplicationSurveyBankDetail';
  private APIControllerApplicationSurveyProject: String = 'ApplicationSurveyProject';
  private APIControllerSysGlobalparam: String = 'SysGlobalparam';

  //route
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForDelete: String = 'DELETE';
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForUploadFile: String = 'Upload';
  private APIRouteForDeleteFile: String = 'Deletefile';
  private APIRouteForPriviewFile: String = 'Priview';

  
  // report
  private APIControllerReport: String = 'Report';
  private APIRouteForDownload: String = 'getReport';
  
  private RoleAccessCode = 'R00019900000000A'; // role access 

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = true;
  // end

  // datatable
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtOptionsPlan: DataTables.Settings = {};
  dtOptionsCustomer: DataTables.Settings = {};
  dtOptionsOther: DataTables.Settings = {};
  dtOptionsDoc: DataTables.Settings = {};
  dtOptionsBankDetail: DataTables.Settings = {};
  dtOptionsProject: DataTables.Settings = {};

  constructor(private dalservice: DALService,
    public getRouteparam: ActivatedRoute,
    public route: Router,
    private _elementRef: ElementRef
  ) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.Delimiter(this._elementRef);
    // call web service

    this.loadDataBankDetail();
    this.loadDataCustomer();
    this.loadDataDoc();
    this.loadDataPlan();
    this.loadDataOther();
    this.loadDataProject();

    this.callGetrowGlobalParam();
    this.callGetrow();
    this.callGetrowBank();
    this.showSpinner = false;
    this.model.application_type = 'RO'
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

  //#region getrow data
  callGetrow() {

    this.dataTamp = [{
      'p_application_no': this.param
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);

          const parsedata = this.getrowNgb(parse.data[0]);

          this.code = parsedata.code

          // mapper dbtoui
          Object.assign(this.model, parsedata);
          // end mapper dbtoui
          this.callGetrowBank()
          $('#datatableDocument').DataTable().ajax.reload();
          $('#datatableTopCustomerLease').DataTable().ajax.reload();
          $('#datatableRencanaPengadaan').DataTable().ajax.reload();
          $('#datatableOtherLease').DataTable().ajax.reload();
          $('#datatableBankDetail').DataTable().ajax.reload();
          $('#datatableProject').DataTable().ajax.reload();
          this.showSpinner = false;
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
  }
  //#endregion getrow data

  //#region getrow data bank
  callGetrowBank() {

    this.dataTamp = [{
      'p_application_survey_code': this.code
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIControllerApplicationSurveyBank, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);

          const parsedata = this.getrowNgb(parse.data[0]);

          this.bankId = parsedata.id

          $('#datatableBankDetail').DataTable().ajax.reload();

          this.showSpinner = false;
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
  }
  //#endregion getrow data bank

  //#region  form submit
  onFormSubmit(surveyrequestdetailForm: NgForm, isValid: boolean) {
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

    this.surveyrequestdetailData = this.JSToNumberFloats(surveyrequestdetailForm);

    const usersJson: any[] = Array.of(this.surveyrequestdetailData);

    if (this.code != null) {

      this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showSpinner = false;
              $('#applicationDetail').click();
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
            this.swalPopUpMsg(parse.data)
          });
    } else {

      this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showSpinner = false;
              $('#applicationDetail').click();
              this.showNotification('bottom', 'right', 'success');
              this.route.navigate(['/application/subapplicationmainlist/applicationmaindetail/' + this.param + '/surveydetail/' + this.param + '/surveyrequestdetail/', this.param, parse.code], { skipLocationChange: true });
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

  //#region btnAddPlan
  btnAddPlan() {
    this.showSpinner = true
    // param tambahan untuk getrole dynamic
    this.dataTampPlan = [this.JSToNumberFloats({
      'p_application_survey_code': this.code,
      'p_description': '',
      'p_ni_amount': 0,
      'p_total_ni_amount': 0,
    })];

    // param tambahan untuk getrole dynamic
    this.dalservice.Insert(this.dataTampPlan, this.APIControllerApplicationSurveyPlan, this.APIRouteForInsert)
      .subscribe(
        res => {
          this.showSpinner = false;
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            $('#datatableRencanaPengadaan').DataTable().ajax.reload();
            this.showNotification('bottom', 'right', 'success');
            this.showSpinner = false
          } else {
            this.swalPopUpMsg(parse.data);
            this.showSpinner = false
          }
        },
        error => {
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
          this.showSpinner = false
        });
  }
  //#endregion btnAddPlan

  //#region load all data plan
  loadDataPlan() {
    this.dtOptionsPlan = {
      'pagingType': 'first_last_numbers',
      'pageLength': 10,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: false, // jika ingin hilangin search box nya maka false
      ajax: (dtParameters: any, callback) => {

        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_application_survey_code': this.code
        })

        this.dalservice.Getrows(dtParameters, this.APIControllerApplicationSurveyPlan, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listrencanapengadaan = parse.data;

          if (parse.data != null) {
            this.listrencanapengadaan.numberIndex = dtParameters.start;
          }

          // if use checkallPlan use this
          $('#checkallPlan').prop('checked', false);
          // end checkallPlan

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }

  }
  //#endregion load all data plan

  //#region changePlan
  changePlan() {
    this.btnSaveListPlan();
  }
  //#endregion changePlan

  //#region checkbox all table plan
  btnDeleteAllPlan() {
    this.checkedList = [];
    for (let i = 0; i < this.listrencanapengadaan.length; i++) {
      if (this.listrencanapengadaan[i].selectedPlan) {
        this.checkedList.push(this.listrencanapengadaan[i].id);
      }
    }

    // jika tidak di checklist
    if (this.checkedList.length === 0) {
      swal({
        title: this._listdialogconf,
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-danger'
      }).catch(swal.noop)
      return
    }
    this.dataTampPush = [];
    swal({
      allowOutsideClick: false,
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Yes',
      buttonsStyling: false
    }).then((result) => {
      this.showSpinner = true;
      if (result.value) {
        for (let J = 0; J < this.checkedList.length; J++) {

          this.dataTampPush.push({
            'p_id': this.checkedList[J],
            'p_application_survey_code': this.code
          });

          this.dalservice.Delete(this.dataTampPush, this.APIControllerApplicationSurveyPlan, this.APIRouteForDelete)
            .subscribe(
              res => {
                const parse = JSON.parse(res);
                if (parse.result === 1) {
                  if (this.checkedList.length == J + 1) {
                    this.showSpinner = false;
                    this.showNotification('bottom', 'right', 'success');
                    $('#datatableRencanaPengadaan').DataTable().ajax.reload();
                    //(+) Ari 2024-03-05 ket : reload data
                    $('#datatableRencanaPengadaan').DataTable().ajax.reload();
                    this.callGetrow();
                  }
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
      } else {
        this.showSpinner = false;
      }
    });
  }

  selectAllTablePlan() {
    for (let i = 0; i < this.listrencanapengadaan.length; i++) {
      this.listrencanapengadaan[i].selectedPlan = this.selectedAllPlan;
    }
  }

  checkIfAllTableSelectedPlan() {
    this.selectedAllPlan = this.listrencanapengadaan.every(function (item: any) {
      return item.selectedPlan === true;
    })
  }
  //#endregion checkbox all table plan

  //#region button save list
  btnSaveListPlan() {

    this.listplan = [];

    var i = 0;

    var getID = $('[name="p_id_plan"]')
      .map(function () { return $(this).val(); }).get();

    var getDescription = $('[name="p_description"]')
      .map(function () { return $(this).val(); }).get();

    var getNiAmount = $('[name="p_ni_amount"]')
      .map(function () { return $(this).val(); }).get();

    while (i < getID.length) {

      while (i < getDescription.length) {

        while (i < getNiAmount.length) {

          this.listplan.push(
            this.JSToNumberFloats({
              p_id: getID[i],
              p_application_survey_code: this.code,
              p_ni_amount: getNiAmount[i],
              p_description: getDescription[i],
            })
          );
          i++
        }
        i++;
      }
      i++;
    }

    //#region web service

    this.dalservice.Update(this.listplan, this.APIControllerApplicationSurveyPlan, this.APIRouteForUpdate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);

          if (parse.result === 1) {
            // this.showNotification('bottom', 'right', 'success');
            $('#datatableRencanaPengadaan').DataTable().ajax.reload();
            this.callGetrow();
          } else {
            this.swalPopUpMsg(parse.data);
          }
        },
        error => {
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);

        });
    //#endregion web service

  }
  //#endregion button save list

  //#region btnAddCustomer
  btnAddCustomer() {
    this.showSpinner = true
    // param tambahan untuk getrole dynamic
    this.dataTampPlan = [this.JSToNumberFloats({
      'p_application_survey_code': this.code,
    })];

    // param tambahan untuk getrole dynamic
    this.dalservice.Insert(this.dataTampPlan, this.APIControllerApplicationSurveyCustomer, this.APIRouteForInsert)
      .subscribe(
        res => {
          this.showSpinner = false;
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            $('#datatableTopCustomerLease').DataTable().ajax.reload();
            this.showNotification('bottom', 'right', 'success');
            this.showSpinner = false
          } else {
            this.swalPopUpMsg(parse.data);
            this.showSpinner = false
          }
        },
        error => {
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
          this.showSpinner = false
        });
  }
  //#endregion btnAddCustomer

  //#region load all data customer
  loadDataCustomer() {
    this.dtOptionsCustomer = {
      'pagingType': 'first_last_numbers',
      'pageLength': 10,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false
      ajax: (dtParameters: any, callback) => {

        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_application_survey_code': this.code
        })

        this.dalservice.Getrows(dtParameters, this.APIControllerApplicationSurveyCustomer, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listtopcustomerlease = parse.data;

          if (parse.data != null) {
            this.listtopcustomerlease.numberIndex = dtParameters.start;
          }

          // if use checkallCustomer use this
          $('#checkallCustomer').prop('checked', false);
          // end checkallCustomer

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }

  }
  //#endregion load all data customer

  //#region button save list
  btnSaveListCustomer() {

    this.listtopcustomer = [];

    var i = 0;

    var getID = $('[name="p_id_customer"]')
      .map(function () { return $(this).val(); }).get();

    var getName = $('[name="p_name_customer"]')
      .map(function () { return $(this).val(); }).get();

    var getBusiness = $('[name="p_business_customer"]')
      .map(function () { return $(this).val(); }).get();

    var getBusinessLocation = $('[name="p_business_location_customer"]')
      .map(function () { return $(this).val(); }).get();

    var getUnit = $('[name="p_unit"]')
      .map(function () { return $(this).val(); }).get();

    var getAdditionalInfo = $('[name="p_additional_info_customer"]')
      .map(function () { return $(this).val(); }).get();

    while (i < getID.length) {

      while (i < getName.length) {

        while (i < getBusiness.length) {

          while (i < getBusinessLocation.length) {

            while (i < getUnit.length) {

              while (i < getAdditionalInfo.length) {

                this.listtopcustomer.push(
                  this.JSToNumberFloats({
                    p_id: getID[i],
                    p_application_survey_code: this.code,
                    p_name: getName[i],
                    p_business: getBusiness[i],
                    p_business_location: getBusinessLocation[i],
                    p_unit: getUnit[i],
                    p_additional_info: getAdditionalInfo[i],
                  })
                );
                i++
              }
              i++
            }
            i++
          }
          i++
        }
        i++;
      }
      i++;
    }

    this.dalservice.Update(this.listtopcustomer, this.APIControllerApplicationSurveyCustomer, this.APIRouteForUpdate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);

          if (parse.result === 1) {
            // this.showNotification('bottom', 'right', 'success');
            $('#datatableTopCustomerLease').DataTable().ajax.reload();
            this.callGetrow();
          } else {
            this.swalPopUpMsg(parse.data);
          }
        },
        error => {
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);

        });
  }
  //#endregion button save list

  //#region changeCustomer
  changeCustomer() {
    this.btnSaveListCustomer();
  }
  //#endregion changeCustomer

  //#region checkbox all table customer
  btnDeleteAllCustomer() {
    this.checkedList = [];
    for (let i = 0; i < this.listtopcustomerlease.length; i++) {
      if (this.listtopcustomerlease[i].selectedCustomer) {
        this.checkedList.push(this.listtopcustomerlease[i].id);
      }
    }

    // jika tidak di checklist
    if (this.checkedList.length === 0) {
      swal({
        title: this._listdialogconf,
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-danger'
      }).catch(swal.noop)
      return
    }
    this.dataTampPush = [];
    swal({
      allowOutsideClick: false,
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Yes',
      buttonsStyling: false
    }).then((result) => {
      this.showSpinner = true;
      if (result.value) {
        for (let J = 0; J < this.checkedList.length; J++) {

          this.dataTampPush.push({
            'p_id': this.checkedList[J],
            'p_application_survey_code': this.code
          });

          this.dalservice.Delete(this.dataTampPush, this.APIControllerApplicationSurveyCustomer, this.APIRouteForDelete)
            .subscribe(
              res => {
                const parse = JSON.parse(res);
                if (parse.result === 1) {
                  if (this.checkedList.length == J + 1) {
                    this.showSpinner = false;
                    this.showNotification('bottom', 'right', 'success');
                    $('#datatableTopCustomerLease').DataTable().ajax.reload();
                  }
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
      } else {
        this.showSpinner = false;
      }
    });
  }

  selectAllTableCustomer() {
    for (let i = 0; i < this.listtopcustomerlease.length; i++) {
      this.listtopcustomerlease[i].selectedCustomer = this.selectedAllCustomer;
    }
  }

  checkIfAllTableSelectedCustomer() {
    this.selectedAllCustomer = this.listtopcustomerlease.every(function (item: any) {
      return item.selectedCustomer === true;
    })
  }
  //#endregion checkbox all table customer

  //#region btnAddOther
  btnAddOther() {
    this.showSpinner = true
    // param tambahan untuk getrole dynamic
    this.dataTampPlan = [this.JSToNumberFloats({
      'p_application_survey_code': this.code,
    })];

    // param tambahan untuk getrole dynamic
    this.dalservice.Insert(this.dataTampPlan, this.APIControllerApplicationSurveyOther, this.APIRouteForInsert)
      .subscribe(
        res => {
          this.showSpinner = false;
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            $('#datatableOtherLease').DataTable().ajax.reload();
            this.showNotification('bottom', 'right', 'success');
            this.showSpinner = false
          } else {
            this.swalPopUpMsg(parse.data);
            this.showSpinner = false
          }
        },
        error => {
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
          this.showSpinner = false
        });
  }
  //#endregion btnAddOther

  //#region load all data other
  loadDataOther() {
    this.dtOptionsOther = {
      'pagingType': 'first_last_numbers',
      'pageLength': 10,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false
      ajax: (dtParameters: any, callback) => {

        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_application_survey_code': this.code
        })

        this.dalservice.Getrows(dtParameters, this.APIControllerApplicationSurveyOther, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listotherlease = parse.data;

          if (parse.data != null) {
            this.listotherlease.numberIndex = dtParameters.start;
          }

          // if use checkallOther use this
          $('#checkallOther').prop('checked', false);
          // end checkallOther

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }

  }
  //#endregion load all data other

  //#region button save list other
  btnSaveListOther() {

    this.listother = [];

    var i = 0;

    var getID = $('[name="p_id_other"]')
      .map(function () { return $(this).val(); }).get();

    var getRentalCompany = $('[name="p_rental_company"]')
      .map(function () { return $(this).val(); }).get();

    var getOsPeriode = $('[name="p_jenis_kendaraan"]')
      .map(function () { return $(this).val(); }).get();

    var getBusinessLocation = $('[name="p_os_periode"]')
      .map(function () { return $(this).val(); }).get();

    var getUnit = $('[name="p_unit_other"]')
      .map(function () { return $(this).val(); }).get();

    var getNilaiPinjaman = $('[name="p_nilai_pinjaman"]')
      .map(function () { return $(this).val(); }).get();

    while (i < getID.length) {

      while (i < getRentalCompany.length) {

        while (i < getOsPeriode.length) {

          while (i < getBusinessLocation.length) {

            while (i < getUnit.length) {

              while (i < getNilaiPinjaman.length) {

                this.listother.push(
                  this.JSToNumberFloats({
                    p_id: getID[i],
                    p_application_survey_code: this.code,
                    p_rental_company: getRentalCompany[i],
                    p_jenis_kendaraan: getOsPeriode[i],
                    p_os_periode: getBusinessLocation[i],
                    p_unit: getUnit[i],
                    p_nilai_pinjaman: getNilaiPinjaman[i],
                  })
                );
                i++
              }
              i++
            }
            i++
          }
          i++
        }
        i++;
      }
      i++;
    }

    this.dalservice.Update(this.listother, this.APIControllerApplicationSurveyOther, this.APIRouteForUpdate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);

          if (parse.result === 1) {
            // this.showNotification('bottom', 'right', 'success');
            $('#datatableOtherLease').DataTable().ajax.reload();
            this.callGetrow();
          } else {
            this.swalPopUpMsg(parse.data);
          }
        },
        error => {
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);

        });
  }
  //#endregion button save list other

  //#region otherListChange
  otherListChange() {
    this.btnSaveListOther();
  }
  //#endregion otherListChange

  //#region checkbox all table other
  btnDeleteAllOther() {
    this.checkedList = [];
    for (let i = 0; i < this.listotherlease.length; i++) {
      if (this.listotherlease[i].selectedOther) {
        this.checkedList.push(this.listotherlease[i].id);
      }
    }

    // jika tidak di checklist
    if (this.checkedList.length === 0) {
      swal({
        title: this._listdialogconf,
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-danger'
      }).catch(swal.noop)
      return
    }
    this.dataTampPush = [];
    swal({
      allowOutsideClick: false,
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Yes',
      buttonsStyling: false
    }).then((result) => {
      this.showSpinner = true;
      if (result.value) {
        for (let J = 0; J < this.checkedList.length; J++) {

          this.dataTampPush.push({
            'p_id': this.checkedList[J],
            'p_application_survey_code': this.code
          });

          this.dalservice.Delete(this.dataTampPush, this.APIControllerApplicationSurveyOther, this.APIRouteForDelete)
            .subscribe(
              res => {
                const parse = JSON.parse(res);
                if (parse.result === 1) {
                  if (this.checkedList.length == J + 1) {
                    this.showSpinner = false;
                    this.showNotification('bottom', 'right', 'success');
                    $('#datatableOtherLease').DataTable().ajax.reload();
                  }
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
      } else {
        this.showSpinner = false;
      }
    });
  }

  selectAllTableOther() {
    for (let i = 0; i < this.listotherlease.length; i++) {
      this.listotherlease[i].selectedOther = this.selectedAllOther;
    }
  }

  checkIfAllTableSelectedOther() {
    this.selectedAllOther = this.listotherlease.every(function (item: any) {
      return item.selectedOther === true;
    })
  }
  //#endregion checkbox all table other

  //#region btnAddDocument
  btnAddDocument() {
    this.showSpinner = true
    // param tambahan untuk getrole dynamic
    this.dataTampPlan = [this.JSToNumberFloats({
      'p_application_survey_code': this.code,
    })];

    // param tambahan untuk getrole dynamic
    this.dalservice.Insert(this.dataTampPlan, this.APIControllerApplicationSurveyDocument, this.APIRouteForInsert)
      .subscribe(
        res => {
          this.showSpinner = false;
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            $('#datatableDocument').DataTable().ajax.reload();
            this.showNotification('bottom', 'right', 'success');
            this.showSpinner = false
          } else {
            this.swalPopUpMsg(parse.data);
            this.showSpinner = false
          }
        },
        error => {
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
          this.showSpinner = false
        });
  }
  //#endregion btnAddDocument

  //#region load all data document
  loadDataDoc() {
    this.dtOptionsDoc = {
      'pagingType': 'first_last_numbers',
      'pageLength': 10,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false
      ajax: (dtParameters: any, callback) => {

        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_application_survey_code': this.code
        })

        this.dalservice.Getrows(dtParameters, this.APIControllerApplicationSurveyDocument, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listdoc = parse.data;

          if (parse.data != null) {
            this.listdoc.numberIndex = dtParameters.start;
          }

          // if use checkallDoc use this
          $('#checkallDoc').prop('checked', false);
          // end checkallDoc

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }

  }
  //#endregion load all data document

  //#region getrow callGetrowGlobalParam
  callGetrowGlobalParam() {

    this.dataTamp = [{
      'p_code': 'FUPS'
    }];

    this.dalservice.Getrows(this.dataTamp, this.APIControllerSysGlobalparam, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];

          this.tempFileSize = parsedata.file_size;

          this.showSpinner = false;
        },
        error => {
          console.log('There was an error while Retrieving Data(API) !!!' + error);
        });
  }
  //#endregion getrow callGetrowGlobalParam

  //#region convert to base64
  handleFile(event) {
    this.showSpinner = true;
    const binaryString = event.target.result;
    this.base64textString = btoa(binaryString);

    this.tamps.push({
      p_header: 'APPLICATION_SURVEY_DOCUMENT',
      p_module: 'IFINOPL',
      p_child: this.param,
      p_id: this.tampDocumentCode,
      p_file_paths: this.param,
      p_file_name: this.tempFile,
      p_base64: this.base64textString
    });
    this.dalservice.UploadFile(this.tamps, this.APIControllerApplicationSurveyDocument, this.APIRouteForUploadFile)
      .subscribe(
        res => {
          this.tamps = new Array();
          const parses = JSON.parse(res);
          if (parses.result === 1) {
            this.showSpinner = false;
          } else {
            this.showSpinner = false;
            this.swalPopUpMsg(parses.message);
          }
          this.callGetrow();
        },
        error => {
          this.showSpinner = false;
          this.tamps = new Array();
          const parses = JSON.parse(error);
          this.swalPopUpMsg(parses.message);
          this.callGetrow();
        });
  }
  //#endregion convert to base64

  //#region button select image
  onUpload(event, id: any) {
    const files = event.target.files;
    const file = files[0];

    if (this.CheckFileSize(files[0].size, this.tempFileSize)) {
      this.swalPopUpMsg('V;File size must be less or equal to ' + this.tempFileSize + ' MB');
      this.callGetrow();
    } else {
      if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();

        reader.readAsDataURL(event.target.files[0]); // read file as data url

        reader.onload = (event) => {
          reader.onload = this.handleFile.bind(this);
          reader.readAsBinaryString(file);
        }
      }
      this.tempFile = files[0].name;
      this.tampDocumentCode = id;
    }
  }
  //#endregion button select image

  //#region button delete image
  deleteImage(id: any, file_name: any, row2) {
    const usersJson: any[] = Array.of();

    usersJson.push({
      p_id: id,
      p_file_name: file_name,
      p_branch_code: this.param,
      p_file_paths: row2
    });

    swal({
      allowOutsideClick: false,
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Yes',
      buttonsStyling: false
    }).then((result) => {
      this.showSpinner = true;
      if (result.value) {
        this.dalservice.DeleteFile(usersJson, this.APIControllerApplicationSurveyDocument, this.APIRouteForDeleteFile)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showSpinner = false;
                this.callGetrow();
                this.tempFile = undefined;
                $('#fileControl').val(undefined);
                this.showNotification('bottom', 'right', 'success');
              } else {
                this.showSpinner = false;
                $('#fileControl').val(undefined);
                this.swalPopUpMsg(parse.message);
              }
              this.callGetrow();
            },
            error => {
              this.showSpinner = false;
              const parse = JSON.parse(error);
              this.swalPopUpMsg(parse.message);
            });
      } else {
        this.showSpinner = false;
      }
    });
  }
  //#endregion button delete image

  //#region button priview image
  previewFile(row1, row2) {
    this.showSpinner = true;
    const usersJson: any[] = Array.of();

    usersJson.push({
      p_file_name: row1,
      p_file_paths: row2
    });

    this.dalservice.PriviewFile(usersJson, this.APIControllerApplicationSurveyDocument, this.APIRouteForPriviewFile)
      .subscribe(
        (res) => {
          const parse = JSON.parse(res);
          if (parse.value.filename !== '') {
            const fileType = parse.value.filename.split('.').pop();
            if (fileType === 'PNG') {
              this.downloadFile(parse.value.data, parse.value.filename, fileType);
              // const newTab = window.open();
              // newTab.document.body.innerHTML = this.pngFile(parse.value.data);
              // this.showSpinner = false;
            }
            if (fileType === 'JPEG' || fileType === 'JPG') {
              this.downloadFile(parse.value.data, parse.value.filename, fileType);
              // const newTab = window.open();
              // newTab.document.body.innerHTML = this.jpgFile(parse.value.data);
              // this.showSpinner = false;
            }
            if (fileType === 'PDF') {
              this.downloadFile(parse.value.data, parse.value.filename, 'pdf');
              // const newTab = window.open();
              // newTab.document.body.innerHTML = this.pdfFile(parse.value.data);
              // this.showSpinner = false;
            }
            if (fileType === 'DOCX' || fileType === 'DOC') {
              this.downloadFile(parse.value.data, parse.value.filename, 'msword');
            }
            if (fileType === 'XLSX') {
              this.downloadFile(parse.value.data, parse.value.filename, 'vnd.ms-excel');
            }
            if (fileType === 'PPTX') {
              this.downloadFile(parse.value.data, parse.value.filename, 'vnd.ms-powerpoint');
            }
            if (fileType === 'TXT') {
              this.downloadFile(parse.value.data, parse.value.filename, 'txt');
            }
            if (fileType === 'ODT' || fileType === 'ODS' || fileType === 'ODP') {
              this.downloadFile(parse.value.data, parse.value.filename, 'vnd.oasis.opendocument');
            }
            if (fileType === 'ZIP') {
              this.downloadFile(parse.value.data, parse.value.filename, 'zip');
            }
            if (fileType === '7Z') {
              this.downloadFile(parse.value.data, parse.value.filename, 'x-7z-compressed');
            }
            if (fileType === 'RAR') {
              this.downloadFile(parse.value.data, parse.value.filename, 'vnd.rar');
            }
          }
        }
      );
  }

  downloadFile(base64: string, fileName: string, extention: string) {
    var temp = 'data:application/' + extention + ';base64,'
      + encodeURIComponent(base64);
    var download = document.createElement('a');
    download.href = temp;
    download.download = fileName;
    document.body.appendChild(download);
    download.click();
    document.body.removeChild(download);
    this.showSpinner = false;
  }

  //#endregion button priview image

  //#region button save list document
  btnSaveListDocument() {

    this.listdocument = [];

    var i = 0;

    var getID = $('[name="p_id_doc"]')
      .map(function () { return $(this).val(); }).get();

    var getLocation = $('[name="p_location"]')
      .map(function () { return $(this).val(); }).get();

    var getRemark = $('[name="p_remark"]')
      .map(function () { return $(this).val(); }).get();

    while (i < getID.length) {

      while (i < getLocation.length) {

        while (i < getRemark.length) {

          this.listdocument.push(
            this.JSToNumberFloats({
              p_id: getID[i],
              p_application_survey_code: this.code,
              p_location: getLocation[i],
              p_remark: getRemark[i],
            })
          );
          i++
        }
        i++;
      }
      i++;
    }

    this.dalservice.Update(this.listdocument, this.APIControllerApplicationSurveyDocument, this.APIRouteForUpdate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);

          if (parse.result === 1) {
            $('#datatableDocument').DataTable().ajax.reload();
            this.callGetrow();
          } else {
            this.swalPopUpMsg(parse.data);
          }
        },
        error => {
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);

        });
  }
  //#endregion button save list document

  //#region documenChange
  documenChange() {
    this.btnSaveListDocument();
  }
  //#endregion documenChange

  //#region checkbox all table document
  btnDeleteAllDocument() {
    this.checkedList = [];
    for (let i = 0; i < this.listdoc.length; i++) {
      if (this.listdoc[i].selectedDoc) {
        this.checkedList.push(this.listdoc[i].id);
      }
    }

    // jika tidak di checklist
    if (this.checkedList.length === 0) {
      swal({
        title: this._listdialogconf,
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-danger'
      }).catch(swal.noop)
      return
    }
    this.dataTampPush = [];
    swal({
      allowOutsideClick: false,
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Yes',
      buttonsStyling: false
    }).then((result) => {
      this.showSpinner = true;
      if (result.value) {
        for (let J = 0; J < this.checkedList.length; J++) {

          this.dataTampPush.push({
            'p_id': this.checkedList[J],
            'p_application_survey_code': this.code
          });

          this.dalservice.Delete(this.dataTampPush, this.APIControllerApplicationSurveyDocument, this.APIRouteForDelete)
            .subscribe(
              res => {
                const parse = JSON.parse(res);
                if (parse.result === 1) {
                  if (this.checkedList.length == J + 1) {
                    this.showSpinner = false;
                    this.showNotification('bottom', 'right', 'success');
                    $('#datatableDocument').DataTable().ajax.reload();
                  }
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
      } else {
        this.showSpinner = false;
      }
    });
  }

  selectAllTableDoc() {
    for (let i = 0; i < this.listdoc.length; i++) {
      this.listdoc[i].selectedDoc = this.selectedAllDoc;
    }
  }

  checkIfAllTableSelectedDoc() {
    this.selectedAllDoc = this.listdoc.every(function (item: any) {
      return item.selectedDoc === true;
    })
  }
  //#endregion checkbox all table document

  //#region load all data bank detail
  loadDataBankDetail() {
    this.dtOptionsBankDetail = {
      'pagingType': 'first_last_numbers',
      'pageLength': 10,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: false, // jika ingin hilangin search box nya maka false
      ajax: (dtParameters: any, callback) => {

        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_application_survey_code': this.code,
          'p_application_survey_bank_id': this.bankId
        })

        this.dalservice.Getrows(dtParameters, this.APIControllerApplicationSurveyBankDetail, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listbankdetail = parse.data;

          if (parse.data != null) {
            this.listbankdetail.numberIndex = dtParameters.start;
          }

          // if use checkallBankDetail use this
          $('#checkallBankDetail').prop('checked', false);
          // end checkallBankDetail

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }

  }
  //#endregion load all data bank detail

  //#region btnAddBankDetail
  btnAddBankDetail() {
    this.showSpinner = true
    // param tambahan untuk getrole dynamic
    this.dataTampPlan = [this.JSToNumberFloats({
      'p_application_survey_bank_id': this.bankId,
    })];

    // param tambahan untuk getrole dynamic
    this.dalservice.Insert(this.dataTampPlan, this.APIControllerApplicationSurveyBankDetail, this.APIRouteForInsert)
      .subscribe(
        res => {
          this.showSpinner = false;
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            $('#datatableBankDetail').DataTable().ajax.reload();
            this.showNotification('bottom', 'right', 'success');
            this.showSpinner = false
          } else {
            this.swalPopUpMsg(parse.data);
            this.showSpinner = false
          }
        },
        error => {
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
          this.showSpinner = false
        });
  }
  //#endregion btnAddBankDetail

  //#region button save list bank detail
  btnSaveListBankDetail() {
    this.showSpinner = true
    this.listbankdetails = [];

    var i = 0;

    var getID = $('[name="p_id_bank_detail"]')
      .map(function () { return $(this).val(); }).get();

    var getCompany = $('[name="p_company"]')
      .map(function () { return $(this).val(); }).get();

    var getMonthYear = $('[name="p_monthly_amount"]')
      .map(function () { return $(this).val(); }).get();

    // (+) Ari 2023-09-20 ket : add month & year
    var getMonth = $('[name="p_mutation_month"]') 
    .map(function () { return $(this).val(); }).get();

    var getYear = $('[name="p_mutation_year"]')
    .map(function () { return $(this).val(); }).get();

    while (i < getID.length) {

      while (i < getCompany.length) {

        while (i < getMonthYear.length) {

          this.listbankdetails.push(
            this.JSToNumberFloats({
              p_id: getID[i],
              p_application_survey_bank_id: this.bankId,
              p_company: getCompany[i],
              p_monthly_amount: getMonthYear[i],
              // (+) Ari 2023-09-20 ket : add month & year
              p_mutation_month : getMonth[i], 
              p_mutation_year : getYear[i] 
            })
          );
          i++
        }
        i++;
      }
      i++;
    }

    this.dalservice.Update(this.listbankdetails, this.APIControllerApplicationSurveyBankDetail, this.APIRouteForUpdate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);

          if (parse.result === 1) {
            $('#datatableDocument').DataTable().ajax.reload();
            this.callGetrow();
            this.showSpinner = false
          } else {
            this.swalPopUpMsg(parse.data);
            this.showSpinner = false
          }
        },
        error => {
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
          this.showSpinner = false
        });
  }
  //#endregion button save list bank detail

  //#region bankDetail
  bankDetail() {
    this.btnSaveListBankDetail();
  }
  //#endregion bankDetail

  //#region checkbox all bank detail
  btnDeleteAllDetail() {
    this.checkedList = [];
    for (let i = 0; i < this.listbankdetail.length; i++) {
      if (this.listbankdetail[i].selectedBankDetail) {
        this.checkedList.push(this.listbankdetail[i].id);
      }
    }

    // jika tidak di checklist
    if (this.checkedList.length === 0) {
      swal({
        title: this._listdialogconf,
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-danger'
      }).catch(swal.noop)
      return
    }
    this.dataTampPush = [];
    swal({
      allowOutsideClick: false,
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Yes',
      buttonsStyling: false
    }).then((result) => {
      this.showSpinner = true;
      if (result.value) {
        for (let J = 0; J < this.checkedList.length; J++) {

          this.dataTampPush.push({
            'p_id': this.checkedList[J],
            'p_application_survey_bank_id': this.bankId
          });

          this.dalservice.Delete(this.dataTampPush, this.APIControllerApplicationSurveyBankDetail, this.APIRouteForDelete)
            .subscribe(
              res => {
                const parse = JSON.parse(res);
                
                if (parse.result === 1) {
                  if (this.checkedList.length == J + 1) {
                    this.showSpinner = false;
                    this.showNotification('bottom', 'right', 'success');
                    $('#datatableBankDetail').DataTable().ajax.reload();
                    // (+) Ari 2024-03-05 ket : reload data
                    $('#datatableDocument').DataTable().ajax.reload();
                   this.callGetrow();
                  }
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
      } else {
        this.showSpinner = false;
      }
    });
  }

  selectAllTableBankDetail() {
    for (let i = 0; i < this.listbankdetail.length; i++) {
      this.listbankdetail[i].selectedBankDetail = this.selectedAllBankDetail;
    }
  }

  checkIfAllTableSelectedBankDetail() {
    this.selectedAllBankDetail = this.listbankdetail.every(function (item: any) {
      return item.selectedBankDetail === true;
    })
  }
  //#endregion checkbox all bank detail

  //#region load all data project
  loadDataProject() {
    this.dtOptionsProject = {
      'pagingType': 'first_last_numbers',
      'pageLength': 10,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: false, // jika ingin hilangin search box nya maka false
      ajax: (dtParameters: any, callback) => {

        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_application_survey_code': this.code,
        })

        this.dalservice.Getrows(dtParameters, this.APIControllerApplicationSurveyProject, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listproject = parse.data;

          if (parse.data != null) {
            this.listproject.numberIndex = dtParameters.start;
          }

          // if use checkallProject use this
          $('#checkallProject').prop('checked', false);
          // end checkallProject

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }

  }
  //#endregion load all data project

  //#region btnAddProject
  btnAddProject() {
    this.showSpinner = true
    // param tambahan untuk getrole dynamic
    this.dataTampPlan = [this.JSToNumberFloats({
      'p_application_survey_code': this.code,
    })];

    // param tambahan untuk getrole dynamic
    this.dalservice.Insert(this.dataTampPlan, this.APIControllerApplicationSurveyProject, this.APIRouteForInsert)
      .subscribe(
        res => {
          this.showSpinner = false;
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            $('#datatableProject').DataTable().ajax.reload();
            this.showNotification('bottom', 'right', 'success');
            this.showSpinner = false
          } else {
            this.swalPopUpMsg(parse.data);
            this.showSpinner = false
          }
        },
        error => {
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
          this.showSpinner = false
        });
  }
  //#endregion btnAddProject

  //#region button save list project
  btnSaveListProject() {
    this.showSpinner = true
    this.listprojectlessee = [];

    var i = 0;

    var getID = $('[name="p_id_project"]')
      .map(function () { return $(this).val(); }).get();

    var getProjectName = $('[name="p_project_name"]')
      .map(function () { return $(this).val(); }).get();

    var getProjectOwner = $('[name="p_project_owner"]')
      .map(function () { return $(this).val(); }).get();

    var getMainkontraktor = $('[name="p_main_kontraktor"]')
      .map(function () { return $(this).val(); }).get();

    var getMainKompetitor = $('[name="p_main_kompetitor"]')
      .map(function () { return $(this).val(); }).get();

    var getSubKontraktor = $('[name="p_sub_kontraktor"]')
      .map(function () { return $(this).val(); }).get();

    var getSubKompetitor = $('[name="p_sub_kompetitor"]')
      .map(function () { return $(this).val(); }).get();

    var getSubSubKontraktor = $('[name="p_sub_sub_kontraktor"]')
      .map(function () { return $(this).val(); }).get();

    var getSubSubKompetitor = $('[name="p_sub_sub_kompetitor"]')
      .map(function () { return $(this).val(); }).get();

    while (i < getID.length) {

      while (i < getProjectName.length) {

        while (i < getProjectOwner.length) {

          while (i < getMainkontraktor.length) {

            while (i < getMainKompetitor.length) {

              while (i < getSubKontraktor.length) {

                while (i < getSubKompetitor.length) {

                  while (i < getSubSubKontraktor.length) {

                    while (i < getSubSubKompetitor.length) {

                      this.listprojectlessee.push(
                        this.JSToNumberFloats({
                          p_id: getID[i],
                          p_application_survey_code: this.code,
                          p_project_name: getProjectName[i],
                          p_project_owner: getProjectOwner[i],
                          p_main_kontraktor: getMainkontraktor[i],
                          p_sub_kontraktor: getSubKontraktor[i],
                          p_sub_sub_kontraktor: getSubSubKontraktor[i],
                          p_main_kompetitor: getMainKompetitor[i],
                          p_sub_kompetitor: getSubKompetitor[i],
                          p_sub_sub_kompetitor: getSubSubKompetitor[i],

                        })
                      );
                      i++;
                    }
                    i++;
                  }
                  i++;
                }
                i++;
              }
              i++;
            }
            i++;
          }
          i++;
        }
        i++;
      }
      i++;
    }

    this.dalservice.Update(this.listprojectlessee, this.APIControllerApplicationSurveyProject, this.APIRouteForUpdate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);

          if (parse.result === 1) {
            $('#datatableProject').DataTable().ajax.reload();
            this.callGetrow();
            this.showSpinner = false
          } else {
            this.swalPopUpMsg(parse.data);
            this.showSpinner = false
          }
        },
        error => {
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
          this.showSpinner = false
        });
  }
  //#endregion button save list project

  //#region projectLessee
  projectLessee() {
    this.btnSaveListProject();
  }
  //#endregion projectLessee

  //#region checkbox all table project
  btnDeleteAllProject() {
    this.checkedList = [];
    for (let i = 0; i < this.listproject.length; i++) {
      if (this.listproject[i].selectedProject) {
        this.checkedList.push(this.listproject[i].id);
      }
    }

    // jika tidak di checklist
    if (this.checkedList.length === 0) {
      swal({
        title: this._listdialogconf,
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-danger'
      }).catch(swal.noop)
      return
    }
    this.dataTampPush = [];
    swal({
      allowOutsideClick: false,
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Yes',
      buttonsStyling: false
    }).then((result) => {
      this.showSpinner = true;
      if (result.value) {
        for (let J = 0; J < this.checkedList.length; J++) {

          this.dataTampPush.push({
            'p_id': this.checkedList[J],
            'p_application_survey_code': this.code
          });

          this.dalservice.Delete(this.dataTampPush, this.APIControllerApplicationSurveyProject, this.APIRouteForDelete)
            .subscribe(
              res => {
                const parse = JSON.parse(res);
                if (parse.result === 1) {
                  if (this.checkedList.length == J + 1) {
                    this.showSpinner = false;
                    this.showNotification('bottom', 'right', 'success');
                    $('#datatableProject').DataTable().ajax.reload();
                  }
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
      } else {
        this.showSpinner = false;
      }
    });
  }

  selectAllTableProject() {
    for (let i = 0; i < this.listproject.length; i++) {
      this.listproject[i].selectedProject = this.selectedAllProject;
    }
  }

  checkIfAllTableSelectedProject() {
    this.selectedAllProject = this.listproject.every(function (item: any) {
      return item.selectedProject === true;
    })
  }
  //#endregion checkbox all table project

  //#region btn print
  btnPrint(p_code: string) {
    this.showSpinner = true;

    const rptParam = {
        p_user_id: this.userId,
        p_survey_request_no: p_code,
        p_print_option: 'PDF'
    }

    const dataParam = {
        TableName: 'RPT_SURVEY',
        SpName: 'xsp_rpt_survey',
        reportparameters: rptParam
    };

    this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
        this.showSpinner = false;
        this.printRptNonCore(res);
    }, err => {
        this.showSpinner = false;
        const parse = JSON.parse(err);
        this.swalPopUpMsg(parse.data);
    });
}
  //#endregion btn print

  //(+) Ari 2023-09-14 ket : jika RO (No Nedd) hidden section trade
  //#region changeConditionRO
    changeConditionRO(event: any) {
      this.model.category = event.target.value;
    }
   //#endregion changeConditionRO
}