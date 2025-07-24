import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-billingschemedetail',
  templateUrl: './billingschemedetail.component.html' // GetRowsForLookupForDocgroup
})
export class BillingschemedetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public billingschemeData: any = [];
  public listbillingschemedetail: any = [];
  public lookupclient: any = [];
  public lookupAgreementMultiple: any = [];
  public setStyle: any = [];

  public isReadOnly: Boolean = false;
  public isRequired: any;
  public isBreak: Boolean = false;
  public isDisabled: Boolean = false;

  public tamps = new Array();
  private dataTamp: any = [];
  private dataTampPush: any = [];

  private APIController: String = 'BillingScheme';
  private APIControllerDetail: String = 'BillingSchemeDetail';
  private APIControllerAgreementMain: String = 'AgreementMain';

  private APIRouteForGetRows: String = 'GETROWS';
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForDelete: String = 'DELETE';
  private APIRouteForLookup: String = 'GetRowsForLookupBillingScheme';
  private APIRouteForLookupDetail: String = 'GetRowsForLookupBillingSchemeDetail';
  private APIRouteForUpdateSatus: String = 'ExecSpForUpdateStatus';


  private RoleAccessCode = 'R00020530000000A'; // role access 

  // checklist
  public selectedAllTable: any;
  public selectedAllLookup: any;
  private checkedList: any = [];
  private checkedLookup: any = [];

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
    if (this.param != null) {
      this.isReadOnly = true;

      // call web service
      this.callGetrow();
      this.loadData();
    } else {
      this.model.status = 'NEW';
      this.model.billing_mode = 'BY DATE';
      this.showSpinner = false;
    }
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
          'p_scheme_code': this.param
        });

        // tslint:disable-next-line:max-line-length
        this.dalservice.Getrows(dtParameters, this.APIControllerDetail, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)

          this.listbillingschemedetail = parse.data;
          if (parse.data != null) {
            this.listbillingschemedetail.numberIndex = dtParameters.start;
          }

          // if use checkAll use this
          $('#checkalltable').prop('checked', false);
          // end checkall

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
  //#endregion load all data

  //#region getrow data
  callGetrow() {

    this.dataTamp = [{
      'p_code': this.param,
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          // checkbox active
          if (parsedata.is_active === '1') {
            parsedata.is_active = true;
          } else {
            parsedata.is_active = false;
          }

          if (parsedata.total_detail > 0) {
            this.isDisabled = true;
          } else {
            this.isDisabled = false;
          }
          // end checkbox active

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
  onFormSubmit(billingschemeForm: NgForm, isValid: boolean) {
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

    // this.billingschemeData = billingschemeForm;
    this.billingschemeData = this.JSToNumberFloats(billingschemeForm);

    if (this.billingschemeData.p_is_active == null) {
      this.billingschemeData.p_is_active = false;
    }
    const usersJson: any[] = Array.of(this.billingschemeData);

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
              this.route.navigate(['/billing/subbillingschemelist/billingschemedetail', parse.code]);
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

  //#region btnActive
  btnActive(code: string) {
    // param tambahan untuk getrole dynamic
    this.dataTamp = [{
      'p_code': code
    }];

    // param tambahan untuk getrole dynamic
    // call web service
    swal({
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: this._deleteconf,
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForUpdateSatus)
          .subscribe(
            res => {
              this.showSpinner = false;
              const parse = JSON.parse(res);
              console.log(parse);
              if (parse.result === 1) {
                this.showNotification('bottom', 'right', 'success');
                this.callGetrow();
              } else {
                this.swalPopUpMsg(parse.data)
              }
            },
            error => {
              this.showSpinner = false;
              const parse = JSON.parse(error);
              this.swalPopUpMsg(parse.data)
            });
      } else {
        this.showSpinner = false;
      }
    })
  }
  //#endregion btnActive

  //#region button back
  btnBack() {
    this.route.navigate(['/billing/subbillingschemelist']);
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region lookup AssetMultiple
  btnlookupAgreementMultiple() {
    this.loadData();
    $('#datatablelookupAgreementMultiple').DataTable().clear().destroy();
    $('#datatablelookupAgreementMultiple').DataTable({
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
          'p_scheme_code': this.param,
          'p_client_no': this.model.client_no,
          'p_array_data': JSON.stringify(this.listbillingschemedetail)
        });


        this.dalservice.Getrows(dtParameters, this.APIControllerAgreementMain, this.APIRouteForLookupDetail).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupAgreementMultiple = parse.data;
          if (parse.data != null) {
            this.lookupAgreementMultiple.numberIndex = dtParameters.start;
          }

          // if use checkAll use this
          $('#checkallLookup').prop('checked', false);
          // end checkall

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
    });
  }
  //#endregion lookup AssetMultiple

  //#region checkbox all lookup
  btnSelectAllLookup() {
    this.isBreak = false;
    this.checkedLookup = [];
    for (let i = 0; i < this.lookupAgreementMultiple.length; i++) {
      if (this.lookupAgreementMultiple[i].selectedLookup) {
        this.checkedLookup.push({
          'agreement_no': this.lookupAgreementMultiple[i].agreement_no,
          'asset_no': this.lookupAgreementMultiple[i].asset_no
        });
      }
    }


    // jika tidak di checklist
    if (this.checkedLookup.length === 0) {
      swal({
        title: this._listdialogconf,
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-danger'
      }).catch(swal.noop)
      return
    } else {
      this.showSpinner = true;
    }

    this.dataTamp = [];
    for (let J = 0; J < this.checkedLookup.length; J++) {
      const AgreementNo = this.checkedLookup[J].agreement_no;
      const AssetNo = this.checkedLookup[J].asset_no;

      this.dataTamp = [{
        'p_scheme_code': this.param,
        'p_agreement_no': AgreementNo,
        'p_asset_no': AssetNo
      }];

      this.dalservice.Insert(this.dataTamp, this.APIControllerDetail, this.APIRouteForInsert)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              if (J + 1 === this.checkedLookup.length) {
                this.showSpinner = false;
                this.showNotification('bottom', 'right', 'success');
                $('#dataBillingSchemeDetail').DataTable().ajax.reload();
                $('#datatablelookupAgreementMultiple').DataTable().ajax.reload(null, false);
                this.callGetrow();
              }
            } else {
              this.isBreak = true;
              this.showSpinner = false;
              this.swalPopUpMsg(parse.data);
              $('#dataBillingSchemeDetail').DataTable().ajax.reload();
              $('#datatablelookupAgreementMultiple').DataTable().ajax.reload();
              this.callGetrow();
            }
          },
          error => {
            this.isBreak = true;
            this.showSpinner = false;
            const parse = JSON.parse(error);
            this.swalPopUpMsg(parse.data);
            $('#dataBillingSchemeDetail').DataTable().ajax.reload();
            $('#datatableLookupAgreementMultiple').DataTable().ajax.reload();
            this.callGetrow();
          });
      if (this.isBreak) {
        break;
      }
    }
  }

  selectAllLookup() {
    for (let i = 0; i < this.lookupAgreementMultiple.length; i++) {
      this.lookupAgreementMultiple[i].selectedLookup = this.selectedAllLookup;
    }
  }

  checkIfAllLookupSelected() {
    this.selectedAllLookup = this.lookupAgreementMultiple.every(function (item: any) {
      return item.selectedLookup === true;
    })
  }
  //#endregion checkbox all table

  //#region Client Lookup
  btnLookupClient() {
    $('#datatableLookupClient').DataTable().clear().destroy();
    $('#datatableLookupClient').DataTable({
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

        this.dalservice.Getrows(dtParameters, this.APIControllerAgreementMain, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupclient = parse.data;
          if (parse.data != null) {
            this.lookupclient.numberIndex = dtParameters.start;
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

  btnSelectRowClient(client_no: String, client_name: String) {
    this.model.client_no = client_no;
    this.model.client_name = client_name;
    $('#lookupModalClient').modal('hide');
  }

  btnClearClient() {
    this.model.client_no = '';
    this.model.client_name = '';
    $('#datatable').DataTable().ajax.reload();
  }

  //#endregion Client lookup

  //#region checkbox all table
  btnDeleteAll() {
    this.checkedList = [];
    for (let i = 0; i < this.listbillingschemedetail.length; i++) {
      if (this.listbillingschemedetail[i].selected) {
        this.checkedList.push(this.listbillingschemedetail[i].id);
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
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: this._deleteconf,
      buttonsStyling: false
    }).then((result) => {
      this.showSpinner = true;
      if (result.value) {
        for (let J = 0; J < this.checkedList.length; J++) {

          this.dataTampPush.push({
            'p_id': this.checkedList[J]
          });

          this.dalservice.Delete(this.dataTampPush, this.APIControllerDetail, this.APIRouteForDelete)
            .subscribe(
              res => {
                const parse = JSON.parse(res);
                if (parse.result === 1) {
                  if (this.checkedList.length == J + 1) {
                    this.showSpinner = false;
                    this.showNotification('bottom', 'right', 'success');
                    $('#dataBillingSchemeDetail').DataTable().ajax.reload();
                    this.callGetrow();
                    this.showSpinner = false;
                  }
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
      } else {
        this.showSpinner = false;
      }
    });
  }

  selectAllTable() {
    for (let i = 0; i < this.listbillingschemedetail.length; i++) {
      this.listbillingschemedetail[i].selected = this.selectedAllTable;
    }
  }

  checkIfAllTableSelected() {
    this.selectedAllTable = this.listbillingschemedetail.every(function (item: any) {
      return item.selected === true;
    })
  }
  //#endregion checkbox all table
}
