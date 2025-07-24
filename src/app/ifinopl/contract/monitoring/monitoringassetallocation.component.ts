import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../base.component';
import { DALService } from '../../../../DALservice.service';
import { Location } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './monitoringassetallocation.component.html',
})

export class MonitoringassetallocationComponent extends BaseComponent implements OnInit {
  // variable
  public listmonitoringapplicationasset: any = [];
  public listposition: any = [];
  public lookupsysbranch: any = [];
  public lookupworkflow: any = [];
  public branch_name: String;
  public branch_code: String;
  public level_name: String;
  public tamplevelStatus: String;
  public pageType: String;
  public pageStatus: Boolean;
  public tampStatus: String;


  private APIController: String = 'ApplicationAsset';
  private APIControllerSysBranch: String = 'SysBranch';

  private APIRouteForGetRows: String = 'GetRowsForMonitoringAssetAllocation';
  private APIRouteForLookup: String = 'GetRowsForLookup';

  private RoleAccessCode = 'R00024540000001A'; // role access 

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
    this.tampStatus = 'AGREEMENT';
    this.loadData();
  }

  //#region ddl status
  PageStatus(event: any) {
    this.tampStatus = event.target.value;
    $('#datatableMonitoringApplicationAsset').DataTable().ajax.reload();
  }
  //#endregion ddl status

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
          'p_status': this.tampStatus
        })

        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listmonitoringapplicationasset = parse.data;
          if (parse.data != null) {
            this.listmonitoringapplicationasset.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }

  }
  //#endregion load all data 

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

        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBranch, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupsysbranch = parse.data;
          if (parse.data != null) {
            this.lookupsysbranch.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
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

  btnSelectRowSysBranch(code: String, name: String) {
    this.branch_code = code;
    this.branch_name = name;
    $('#datatableMonitoringApplicationAsset').DataTable().ajax.reload();
    $('#lookupModalSysBranch').modal('hide');
  }
  //#endregion SysBranch

  //#region resteBranch
  resteBranch() {
    this.branch_code = undefined;
    this.branch_name = undefined;
    $('#datatableMonitoringApplicationAsset').DataTable().ajax.reload();
  }
  //#endregion resteBranch
}