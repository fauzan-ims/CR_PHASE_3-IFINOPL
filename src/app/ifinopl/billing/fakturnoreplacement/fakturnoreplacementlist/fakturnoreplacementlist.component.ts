import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { Location } from '@angular/common';
import swal from 'sweetalert2';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './fakturnoreplacementlist.component.html'
})

export class FakturNoReplacementListComponent extends BaseComponent implements OnInit {
  // variable
  public listmasterbook: any = [];
  private dataTamp: any = [];
  private APIController: String = 'FakturNoReplacement';
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForDelete: String = 'Delete';
  private APIRouteForDownloadFileWithData: String = 'DownloadFileWithData';
  private RoleAccessCode = 'R00024510000001A';
  public tampStatus: any = 'ALL';
  public branch_code: String = '';
  public branch_name: String = '';
  public lookupbranch: any = [];
  private APIControllerSysBranch: String = 'SysBranch';
  private APIRouteForGetRowsSys: String = 'GetRowsForLookup';


  // ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  // checklist
  public selectedAllTable: any;
  private checkedList: any = [];

  // spinner
  showSpinner: Boolean = true;
  // end

  constructor(private dalservice: DALService,
    public route: Router,
    private _location: Location,
    private _elementRef: ElementRef) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.compoSide(this._location, this._elementRef, this.route);
    this.loadData();
    this.tampStatus = 'HOLD'
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
          'p_status': this.tampStatus,
          'p_branch_code': this.branch_code
        })
        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {

          const parse = JSON.parse(resp);

          // if use checkAll use this
          $('#checkalltable').prop('checked', false);
          // end checkall

          this.listmasterbook = parse.data;

          if (parse.data != null) {
            this.listmasterbook.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
          this.showSpinner = false;
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      // ! kalo mau ganti jumlah kolom, ganti juga yg di bawah ini
      columnDefs: [{ orderable: false, width: '5%', targets: [0,1, 7] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion load all data

  //#region button add
  btnAdd() {
    this.route.navigate(['/billing/subfakturnoreplacementlist/fakturnoreplacementdetail']);
  }
  //#endregion button add

  //#region button edit
  btnEdit(codeEdit: string) {
    this.route.navigate(['/billing/subfakturnoreplacementlist/fakturnoreplacementdetail', codeEdit]);
  }
  //#endregion button edit

  //#region checkbox all table
  btnDeleteAll() {
    this.checkedList = [];
    for (let i = 0; i < this.listmasterbook.length; i++) {
      if (this.listmasterbook[i].selectedTable) {
        this.checkedList.push(this.listmasterbook[i].code);
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
        for (let J = 0; J < this.checkedList.length; J++) {
          const codeData = this.checkedList[J];
          // param tambahan untuk getrow dynamic
          this.dataTamp = [{
            'p_code': codeData
          }];
          // end param tambahan untuk getrow dynamic
          this.dalservice.Delete(this.dataTamp, this.APIController, this.APIRouteForDelete)
            .subscribe(
              ress => {
                this.showSpinner = false;
                this.showNotification('bottom', 'right', 'success');
                $('#datatableMenu').DataTable().ajax.reload();
              },
              error => {
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
    for (let i = 0; i < this.listmasterbook.length; i++) {
      this.listmasterbook[i].selectedTable = this.selectedAllTable;
    }
  }

  checkIfAllTableSelected() {
    this.selectedAllTable = this.listmasterbook.every(function (item: any) {
      return item.selectedTable === true;
    })
  }
  //#endregion checkbox all table

  //#region tampStatus
  tampStatusFunc(event) {
    this.tampStatus = event.target.value;
    $('#datatableMenu').DataTable().ajax.reload();
  }
  //#endregion tampStatus

  //#region btnDownload
  btnReportGlWithOpb() {
    // this.checkedList = [];
    // for (let i = 0; i < this.listmasterbook.length; i++) {
    //   if (this.listmasterbook[i].selectedTable) {
    //     this.checkedList.push(this.listmasterbook[i].code);
    //   }
    // }

    // // jika tidak di checklist
    // if (this.checkedList.length === 0) {
    //   swal({
    //     title: this._listdialogconf,
    //     buttonsStyling: false,
    //     confirmButtonClass: 'btn btn-danger'
    //   }).catch(swal.noop)
    //   return
    // }

    // swal({
    //   title: 'Are you sure?',
    //   type: 'warning',
    //   showCancelButton: true,
    //   confirmButtonClass: 'btn btn-success',
    //   cancelButtonClass: 'btn btn-danger',
    //   confirmButtonText: this._deleteconf,
    //   buttonsStyling: false
    // }).then((result) => {
    //   this.showSpinner = true;
    //   if (result.value) {
    //     for (let J = 0; J < this.checkedList.length; J++) {
    //       const codeData = this.checkedList[J];
    //       // param tambahan untuk getrow dynamic

    const dataParam = [{
      'p_code': ''
    }];
    this.showSpinner = true;
    this.dalservice.DownloadFileWithData(dataParam, this.APIController, this.APIRouteForDownloadFileWithData).subscribe(res => {
      var contentDisposition = res.headers.get('content-disposition');      
      var filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();      
      const blob = new Blob([res.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      this.showSpinner = false;
    }, err => {
      this.showSpinner = false;
      const parse = JSON.parse(err);
      this.swalPopUpMsg(parse.data);
    });
    // }
    // } else {
    //   this.showSpinner = false;
    // }
    // });
  }

  // #endregion btnDownload

  //#region LookupSysBranch
  btnLookupbranch() {
    $('#datatableLookupSysBranch').DataTable().clear().destroy();
    $('#datatableLookupSysBranch').DataTable({
      'pagingType': 'simple_numbers',
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
        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBranch, this.APIRouteForGetRowsSys).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupbranch = parse.data;
          if (parse.data != null) {
            this.lookupbranch.numberIndex = dtParameters.start;
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
      columnDefs: [{ orderable: false, width: '5%', targets: [4] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '

      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowBranch(code: String, name: String) {
    this.branch_code = code;
    this.branch_name = name;
    $('#lookupModalbranch').modal('hide');
    $('#datatableMenu').DataTable().ajax.reload();
  }

  btnClearLookupBranch() {
    this.branch_code = '';
    this.branch_name = '';
    $('#datatableMenu').DataTable().ajax.reload();
  }
  //#endregion LookupSysBranch

  //#region resteBranch
  resteBranch() {
    this.branch_code = undefined;
    this.branch_name = undefined;
    $('#datatableMenu').DataTable().ajax.reload();
  }
  //#endregion resteBranch



}


