import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../../../base.component';
import { Location } from '@angular/common';
import { DALService } from '../../../../../../../../../DALservice.service';
import swal from 'sweetalert2';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './karoseriaccessorieslist.component.html'
})

export class KaroseriaccessorieslistApvComponent extends BaseComponent implements OnInit {

  // get param from url
  appNo = this.getRouteparam.snapshot.paramMap.get('id');
  assetNo = this.getRouteparam.snapshot.paramMap.get('id2');
  type = this.getRouteparam.snapshot.paramMap.get('id3');

  // variable
  public listkaroseriaccessories: any = [];
  public companyCode: String;
  public itemCode: String;
  public dataTamp: any = [];
  public dataTampDelete: any = [];
  public lookupservice: any = [];
  public listservice: any = [];

  //controller
  private APIController: String = 'ApplicationAssetDetail';
  private APIControllerSysGlobalParam: String = 'SysGlobalParam';
  private APIControllerMasterItem: String = 'MasterItem';

  //route
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForInsert: String = 'Insert';
  private APIRouteForDelete: String = 'Delete';
  private APIRouteForUpdate: String = 'Update';
  private APIRouteForGetData: String = 'ExecSpForGetData';
  private APIRouteForLookup: String = 'GetRowsForLookupKaroseriAccessories';

  private RoleAccessCode = 'R00020690000010A'; // role access 

  // form 2 way binding
  model: any = {};
  public selectedAll: any;
  public checkedList: any = [];

  // checklist
  public selectedAllLookup: any;
  public selectedAllTable: any;
  private checkedLookup: any = [];

  // ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  constructor(private dalservice: DALService, public route: Router,
    public getRouteparam: ActivatedRoute,
    private _location: Location,
    private _elementRef: ElementRef) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.loadData();
    this.callGetData()
    this.callGetrowGlobalParam();
  }

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
          'p_asset_no': this.assetNo,
          'p_type': this.type,
          'default': '',
        });

        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);

          this.listkaroseriaccessories = parse.data;

          if (parse.data != null) {
            this.listkaroseriaccessories.numberIndex = dtParameters.start;
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
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion load all data

  //#region getrow data global param
  callGetrowGlobalParam() {

    this.dataTamp = [{
      'p_code': 'COMPCD'
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIControllerSysGlobalParam, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];

          this.companyCode = parsedata.value

          this.showSpinner = false;
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
  }
  //#endregion getrow data global param

  //#region lookup AgreementObligation
  btnLookupKaroseriAccessories() {
    $('#datatableLookupService').DataTable().clear().destroy();
    $('#datatableLookupService').DataTable({
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
          'p_company_code': this.companyCode,
          'p_type': this.type,
          'p_array_data': JSON.stringify(this.itemCode),
        });

        this.dalservice.GetrowsBam(dtParameters, this.APIControllerMasterItem, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);

          // if use checkAll use this
          $('#checkallLookup').prop('checked', false);
          // end checkall

          this.lookupservice = parse.data;


          if (parse.data != null) {
            this.lookupservice.numberIndex = dtParameters.start;
          }
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
  //#endregion lookup notification

  //#region getrow data
  callGetData() {
    // param tambahan untuk getrow dynamic
    this.dataTamp = [{
      'p_asset_no': this.assetNo,
      'p_type': this.type,
      'action': 'getResponse',
    }];
    // end param tambahan untuk getrow dynamic

    this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForGetData)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data;

          this.itemCode = parsedata

          this.showSpinner = false;
        },
        error => {
          console.log('There was an error while Retrieving Data(API)' + error);
        });
  }
  //#endregion getrow data

  //#region btnSelectAllLookup
  btnSelectAllLookup() {
    this.checkedLookup = [];
    for (let i = 0; i < this.lookupservice.length; i++) {
      if (this.lookupservice[i].selectedLookup) {
        this.checkedLookup.push({
          'code': this.lookupservice[i].code,
          'description': this.lookupservice[i].description,
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
    let th = this;
    var J = 0;
    (function loopAddBudgetMaintenanceGroup() {
      if (J < th.checkedLookup.length) {
        th.dataTamp = [{
          'p_asset_no': th.assetNo,
          'p_code': th.checkedLookup[J].code,
          'p_type': th.type,
          'p_description': th.checkedLookup[J].description,
        }];

        th.dalservice.Insert(th.dataTamp, th.APIController, th.APIRouteForInsert)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                if (th.checkedLookup.length == J + 1) {
                  th.callGetData();
                  setTimeout(() => {
                    $('#datatableLookupService').DataTable().ajax.reload();
                    $('#datatableKaroseriAccessories').DataTable().ajax.reload();
                    th.showNotification('bottom', 'right', 'success');
                    th.showSpinner = false;
                  }, 200);
                } else {
                  J++;
                  loopAddBudgetMaintenanceGroup();
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
    for (let i = 0; i < this.lookupservice.length; i++) {
      this.lookupservice[i].selectedLookup = this.selectedAllLookup;
    }
  }

  checkIfAllLookupSelected() {
    this.selectedAllLookup = this.lookupservice.every(function (item: any) {
      return item.selectedLookup === true;
    })
  }
  //#endregion btnSelectAllLookup

  //#region changeAmount
  changeAmount(event: any, id: any) {

    this.listservice = [];

    this.listservice.push(
      this.JSToNumberFloats({
        p_application_no: this.appNo,
        p_asset_no: this.assetNo,
        p_id: id,
        p_type: this.type,
        p_amount: event.target.value,
      }));

    this.dalservice.Update(this.listservice, this.APIController, this.APIRouteForUpdate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            $('#datatableKaroseriAccessories').DataTable().ajax.reload();
          } else {
            this.swalPopUpMsg(parse.data)
          }
        },
        error => {
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data)
        });
  }
  //#endregion changeAmount

  //#region btn delete
  btnDeleteAll() {
    this.checkedList = [];
    for (let i = 0; i < this.listkaroseriaccessories.length; i++) {
      if (this.listkaroseriaccessories[i].selected) {
        this.checkedList.push(this.listkaroseriaccessories[i].id);
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
        let th = this;
        var i = 0;
        (function loopKaroseriAccesoriesDelete() {
          if (i < th.checkedList.length) {
            th.dataTampDelete = [{
              'p_id': th.checkedList[i],
              'p_asset_no': th.assetNo,
              'p_application_no': th.appNo,
              'action': ''
            }];
            th.dalservice.ExecSp(th.dataTampDelete, th.APIController, th.APIRouteForDelete)
              .subscribe(
                res => {
                  const parse = JSON.parse(res);
                  if (parse.result === 1) {
                    if (th.checkedList.length == i + 1) {
                      th.callGetData();
                      th.showNotification('bottom', 'right', 'success');
                      $('#datatableKaroseriAccessories').DataTable().ajax.reload();
                      th.showSpinner = false;
                    } else {
                      i++;
                      loopKaroseriAccesoriesDelete();
                    }
                  } else {
                    th.swalPopUpMsg(parse.data);
                    th.showSpinner = false;
                  }
                },
                error => {
                  const parse = JSON.parse(error);
                  th.swalPopUpMsg(parse.data);
                  th.showSpinner = false;
                });
          }
        })();
      } else {
        this.showSpinner = false;
      }
    });
  }

  selectAllTable() {
    for (let i = 0; i < this.listkaroseriaccessories.length; i++) {
      if (this.listkaroseriaccessories[i].is_calculated !== '1') {
        this.listkaroseriaccessories[i].selected = this.selectedAll;
      }
    }
  }

  checkIfAllTableSelected() {
    this.selectedAll = this.listkaroseriaccessories.every(function (item: any) {
      return item.selected === true;
    })
  }
  //#endregion btn delete

  //#region btn back
  btnBack() {
    this.route.navigate(['/application/banberjalanapplicationmain/applicationmaindetail/' + this.appNo + '/' + 'banberjalan' + '/assetlist/' + this.appNo + '/' + 'banberjalan' + '/assetdetail/', this.appNo, this.assetNo, 'banberjalan'], { skipLocationChange: true });
    $('#datatableBudgetList').DataTable().ajax.reload();
  }
  //#endregion btn back

}
