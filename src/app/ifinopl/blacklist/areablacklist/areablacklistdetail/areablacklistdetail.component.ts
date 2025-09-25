import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import swal from 'sweetalert2';
import { DALService } from '../../../../../DALservice.service';
import { NgForm } from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './areablacklistdetail.component.html'
})

export class AreablacklistdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public areablacklistData: any = [];
  public listarearegisterdanreleasedetail: any = [];
  public lookupZip: any = [];
  public isReadOnly: Boolean = false;
  public lookupGeneral: any = [];
  public lookupfee: any = [];
  public lookupcurrency: any = [];
  public tempFile: any;
  public tempTableLookupDB: any = [];
  public listTableLookupDB: any = [];
  private tampType: String;
  private dataTamp: any = [];
  private dataTampPush: any = [];
  private dataTampProvince: any = [];
  public setStyle: any = [];

  private APIController: String = 'AreaBlacklistTransaction';
  private APIControllerAreaBlacklist = 'AreaBlacklist';
  private APIControllerAreaBlacklistTransactionDetail: String = 'AreaBlacklistTransactionDetail';
  private APIControllerSysProvince: String = 'SysCity';
  private APIControllerGeneral: String = 'SysGeneralSubcode';

  private APIRouteForLookupProvincyCity: String = 'GetRowsLookupByProvinceCity';
  private APIRouteForGetrowLookup: String = 'GetRowForLookupDB';
  private APIRouteForLookup = 'GetRowsForLookup';
  private APIRouteForPost: String = 'ExecSpForPost';
  private APIRouteForCancel: String = 'ExecSpForCancel';
  private APIRouteForGetRows: String = 'GETROWS';
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForDelete: String = 'DELETE';

  private RoleAccessCode = 'R00013410000000A'; // role access 

  // checklist
  public selectedAllLookup: any;
  public selectedAll: any;
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
    this.datarowForLookupDB(); // datarowForExistMultipleLookup DB
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    // setTimeout(() => {
    //   this.TransactionLock(this.userId, this.param, '', this.dalservice);
    // }, 100);
    if (this.param != null) {

      // call web service
      this.loadData();
      this.callGetrow();
    } else {
      this.model.transaction_status = 'HOLD';
      this.model.transaction_type = 'REGISTER';
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

  //#region datarowForExistMultipleLookup DB
  datarowForLookupDB() {

    this.tempTableLookupDB.push({
      'p_area_blacklist_transaction_code': this.param,
      'action': 'getResponse'
    });

    this.dalservice.ExecSp(this.tempTableLookupDB, this.APIControllerAreaBlacklistTransactionDetail, this.APIRouteForGetrowLookup)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          this.listTableLookupDB = parse.data;
        },
        error => {
          const parse = JSON.parse(error);
        });

  }
  //#endregion datarowForExistMultipleLookup DB

  //#region transactionType
  transactionType(event) {
    this.tampType = event.target.value;
  }
  //#endregion transactionType

  //#region lookup Zip
  btnLookupZip() {
    this.datarowForLookupDB();
    $('#datatablelookupZip').DataTable().clear().destroy();
    $('#datatablelookupZip').DataTable({
      'pagingType': 'first_last_numbers',
      'pageLength': 5,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false
      ajax: (dtParameters: any, callback) => {
        // param tambahan untuk getrows dynamic
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_area_blacklist_transaction_code': this.param,
          'p_array_data': JSON.stringify(this.listTableLookupDB)
        });
        // end param tambahan untuk getrows dynamic
        // tslint:disable-next-line:max-line-length
        if (this.tampType === 'REGISTER') {
          console.log(dtParameters);

          // tslint:disable-next-line:max-line-length
          this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysProvince, this.APIRouteForLookupProvincyCity).subscribe(resp => {
            const parse = JSON.parse(resp);
            this.lookupZip = parse.data;
            if (parse.data != null) {
              this.lookupZip.numberIndex = dtParameters.start;
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
        } else {
          this.dalservice.Getrows(dtParameters, this.APIControllerAreaBlacklist, this.APIRouteForLookup).subscribe(resp => {
            const parse = JSON.parse(resp);
            this.lookupZip = parse.data;
            if (parse.data != null) {
              this.lookupZip.numberIndex = dtParameters.start;
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
        }
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
  //#endregion lookup Zip

  //#region btnSelectAllLookup
  btnSelectAllLookup() {
    this.checkedLookup = [];
    for (let i = 0; i < this.lookupZip.length; i++) {
      if (this.lookupZip[i].selectedLookup) {
        this.checkedLookup.push({
          'prov_code': this.lookupZip[i].province_code,
          'cit_code': this.lookupZip[i].city_code,
          'prov_name': this.lookupZip[i].province_name,
          'cit_name': this.lookupZip[i].city_name
        });
      }
    }

    // jika tidak di checklist
    if (this.checkedLookup.length === 0) {
      swal({
        title: 'Please Select at least one row!!',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-danger'
      }).catch(swal.noop)
      return
    } else {
      this.showSpinner = true;
    }

    this.dataTampProvince = [];
    let th = this;
    var J = 0;
    (function loopAddareablacklistprovince() {
      if (J < th.checkedLookup.length) {

        th.dataTampProvince = [{
          'p_area_blacklist_transaction_code': th.param,
          'p_province_code': th.checkedLookup[J].prov_code,
          'p_city_code': th.checkedLookup[J].cit_code,
          'p_province_name': th.checkedLookup[J].prov_name,
          'p_city_name': th.checkedLookup[J].cit_name
        }];

        th.dalservice.Insert(th.dataTampProvince, th.APIControllerAreaBlacklistTransactionDetail, th.APIRouteForInsert)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                if (th.checkedLookup.length == J + 1) {
                  th.datarowForLookupDB();
                  setTimeout(() => {
                    $('#datatableZipCodeList').DataTable().ajax.reload();
                    $('#datatablelookupZip').DataTable().ajax.reload();
                    th.showNotification('bottom', 'right', 'success');
                    th.showSpinner = false;
                  }, 200);
                } else {
                  J++;
                  loopAddareablacklistprovince();
                }
              } else {
                th.showSpinner = false;
                th.swalPopUpMsg(parse.data);
              }
            },
            error => {
              th.showSpinner = false;
              const parse = JSON.parse(error);
              th.swalPopUpMsg(parse.data);
            });
      }
    })();
  }
  selectAllLookup() {
    for (let i = 0; i < this.lookupZip.length; i++) {
      this.lookupZip[i].selectedLookup = this.selectedAllLookup;
    }
  }

  checkIfAllLookup() {
    this.selectedAllLookup = this.lookupZip.every(function (item: any) {
      return item.selectedLookup === true;
    })
  }
  //#endregion btnSelectAllLookup

  //#region General Lookup
  btnLookupGeneral() {
    $('#datatableLookupGeneral').DataTable().clear().destroy();
    $('#datatableLookupGeneral').DataTable({
      'pagingType': 'first_last_numbers',
      'pageLength': 5,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false
      ajax: (dtParameters: any, callback) => {
        // param tambahan untuk getrows dynamic
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_general_code': 'BLSRC'
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIControllerGeneral, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupGeneral = parse.data;
          if (parse.data != null) {
            this.lookupGeneral.numberIndex = dtParameters.start;
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

  btnSelectRowGeneral(code: String, description: string) {
    this.model.register_source = code;
    this.model.register_source_desc = description;
    $('#lookupModalGeneral').modal('hide');
  }
  //#endregion General lookup

  //#region button Post
  btnPost(code: string) {
    // param tambahan untuk getrole dynamic
    this.dataTampPush = [{
      'p_code': code,
      'action': 'default'
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
        // call web service
        this.dalservice.ExecSp(this.dataTampPush, this.APIController, this.APIRouteForPost)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showSpinner = false;
                this.isReadOnly = true;
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
        this.showSpinner = false;
      }
    })
  }
  //#endregion button Post

  //#region button btnCancel
  btnCancel(code: string) {
    // param tambahan untuk getrole dynamic
    this.dataTampPush = [{
      'p_code': code,
      'action': 'default'
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
        // call web service
        this.dalservice.ExecSp(this.dataTampPush, this.APIController, this.APIRouteForCancel)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showSpinner = false;
                this.isReadOnly = true;
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
        this.showSpinner = false;
      }
    })
  }
  //#endregion button btnCancel

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
        // param tambahan untuk getrows dynamic
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_area_blacklist_transaction_code': this.param
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIControllerAreaBlacklistTransactionDetail, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listarearegisterdanreleasedetail = parse.data;
          if (parse.data != null) {
            this.listarearegisterdanreleasedetail.numberIndex = dtParameters.start;
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
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1] }], // for disabled coloumn
      order: [[4, 'desc']],
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
    // param tambahan untuk getrow dynamic 
    this.dataTamp = [{
      'p_code': this.param
    }];
    // end param tambahan untuk getrow dynamic
    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          if (parsedata.transaction_status !== 'HOLD') {
            this.isReadOnly = true;
          }
          this.tampType = parsedata.transaction_type;

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
  onFormSubmit(arearegisterdanreleasedetailForm: NgForm, isValid: boolean) {
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

    this.areablacklistData = arearegisterdanreleasedetailForm;
    const usersJson: any[] = Array.of(this.areablacklistData);
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
              this.route.navigate(['/blacklist/subareblacklistlist/areablacklistdetail', parse.code]);
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

  //#region button back
  btnBack() {
    this.route.navigate(['/blacklist/subareblacklistlist']);
    $('#datatableAreablacklistList').DataTable().ajax.reload();
    // setTimeout(() => {
    //   this.TransactionLock(this.userId, '', '', this.dalservice);
    // }, 100);
  }
  //#endregion button back

  //#region checkbox all table
  btnDeleteAll() {
    this.checkedList = [];
    for (let i = 0; i < this.listarearegisterdanreleasedetail.length; i++) {
      if (this.listarearegisterdanreleasedetail[i].selected) {
        this.checkedList.push(this.listarearegisterdanreleasedetail[i].id);
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
          // param tambahan untuk getrow dynamic
          this.dataTampPush.push({
            'p_id': this.checkedList[J]
          });
          // end param tambahan untuk getrow dynamic
          this.dalservice.Delete(this.dataTampPush, this.APIControllerAreaBlacklistTransactionDetail, this.APIRouteForDelete)
            .subscribe(
              res => {
                const parse = JSON.parse(res);
                if (parse.result === 1) {
                  if (this.checkedList.length == J + 1) {
                    this.showSpinner = false;
                    this.showNotification('bottom', 'right', 'success');
                    $('#datatableZipCodeList').DataTable().ajax.reload();
                  }
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
      } else {
        this.showSpinner = false;
      }
    });
  }

  selectAllTable() {
    for (let i = 0; i < this.listarearegisterdanreleasedetail.length; i++) {
      this.listarearegisterdanreleasedetail[i].selected = this.selectedAll;
    }
  }

  checkIfAllTableSelected() {
    this.selectedAll = this.listarearegisterdanreleasedetail.every(function (item: any) {
      return item.selected === true;
    })
  }
  //#endregion checkbox all table
}