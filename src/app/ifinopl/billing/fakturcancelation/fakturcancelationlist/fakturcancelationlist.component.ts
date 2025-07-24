import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { Location } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'app-fakturcancelationlist',
  templateUrl: './fakturcancelationlist.component.html',
})

export class FakturcancelationlistComponent extends BaseComponent implements OnInit {
  // variable
  public listfakturcancelation: any = [];
  public lookupsysbranch: any = [];
  public branch_name: String;
  public branch_code: String;
  public tampStatus: String;
  public tampGenerate: String;
  public pageType: String;
  public pageStatus: Boolean;
  private tampGetrows: String;
  private APIController: String = 'FakturCancelation';
  private APIControllerSysBranch: String = 'SysBranch';
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private RoleAccessCode = 'R00020840000000A'; // role access 

  // spinner
  showSpinner: Boolean = false;
  // end

  // ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  constructor(private dalservice: DALService,
    public getRouteparam: ActivatedRoute,
    public route: Router,
    private _location: Location,
    private _elementRef: ElementRef,
  ) { super(); }

  ngOnInit() {
    this.compoSide(this._location, this._elementRef, this.route);
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.tampStatus = 'HOLD';
    this.loadData();
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
          'p_branch_code': this.branch_code,
          'p_status': this.tampStatus,
        })
        
        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(fakturcancelationresp => {
          const fakturcancelationParse = JSON.parse(fakturcancelationresp)
          this.listfakturcancelation = fakturcancelationParse.data;
          if (fakturcancelationParse.data != null) {
            this.listfakturcancelation.numberIndex = dtParameters.start;
          }
          callback({
            draw: fakturcancelationParse.draw,
            recordsTotal: fakturcancelationParse.recordsTotal,
            recordsFiltered: fakturcancelationParse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 7] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }

  }
  //#endregion load all data

  //#region Status
  Status(event) {
    this.tampStatus = event.target.value;
    $('#datatableFakturCancelationList').DataTable().ajax.reload();
  }
  //#endregion ttatus

  //#region button add
  btnAdd() {
    this.route.navigate(['/billing/subfakturcancelationlist/fakturcancelationdetail']);
  }
  //#endregion button add

  //#region button edit
  btnEdit(codeEdit: String) {
    this.route.navigate(['/billing/subfakturcancelationlist/fakturcancelationdetail', codeEdit]);
  }
  //#endregion button edit

  //#region SysBranch
  btnLookupSysBranch() {
    $('#datatableLookupSysBranch').DataTable().clear().destroy();
    $('#datatableLookupSysBranch').DataTable({
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
          'p_cre_by': this.uid
        });
        
        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBranch, this.APIRouteForLookup).subscribe(sysbranchresp => {
          const sysbranchparse = JSON.parse(sysbranchresp);
          this.lookupsysbranch = sysbranchparse.data;
          if (sysbranchparse.data != null) {
            this.lookupsysbranch.numberIndex = dtParameters.start;
          }
          callback({
            draw: sysbranchparse.draw,
            recordsTotal: sysbranchparse.recordsTotal,
            recordsFiltered: sysbranchparse.recordsFiltered,
            data: []
          })
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

  btnClearLookupBranch() {
    this.branch_code = '';
    this.branch_name = '';
    $('#datatableFakturCancelationList').DataTable().ajax.reload();
}

  btnSelectRowSysBranch(code: String, name: String) {
    this.branch_code = code;
    this.branch_name = name;
    $('#datatableFakturCancelationList').DataTable().ajax.reload();
    $('#lookupModalSysBranch').modal('hide');
  }
  //#endregion SysBranch
}