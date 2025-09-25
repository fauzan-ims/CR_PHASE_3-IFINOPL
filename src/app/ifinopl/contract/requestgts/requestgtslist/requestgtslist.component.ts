import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { Location } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './requestgtslist.component.html',
})

export class RequestgtslistComponent extends BaseComponent implements OnInit {
  // variable
  public listassetallocation: any = [];
  public listposition: any = [];
  public lookupworkflow: any = [];
  public lookupbranch: any = [];
  public level_name: String;
  public tamplevelStatus: String;
  public pageType: String;
  public pageStatus: Boolean;
  public lookupmarketing: any = [];
  public marketing_code: String;
  public marketing_name: String;

  private APIController: String = 'ApplicationMain';
  private APIControllerSysBranch: String = 'SysBranch';
  private APIControllerSysEmployeeMain: String = 'SysEmployeeMain';

  private APIRouteForGetRows: String = 'GetRowsForRequestGTS';
  private APIRouteForLookup: String = 'GetRowsForLookup';

  private RoleAccessCode = 'R00023940000001A'; // role access 

// form 2 way binding
model: any = {};

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
          'p_marketing_code': this.uid,
          'p_branch_code': this.model.branch_code
        })

        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listassetallocation = parse.data;
          if (parse.data != null) {
            this.listassetallocation.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 9] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }

  }
  //#endregion load all data 

  //#region button edit
  btnEdit(codeEdit: String) {
    this.route.navigate(['/contract/subrequestgtslist/requestgtsdetail', codeEdit]);
  }
  //#endregion button edit

//#region Branch
btnLookupBranch() {
  $('#datatableLookupBranch').DataTable().clear().destroy();
  $('#datatableLookupBranch').DataTable({
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

      this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBranch, this.APIRouteForLookup).subscribe(resp => {
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
    columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 4] }], // for disabled coloumn
    language: {
      search: '_INPUT_',
      searchPlaceholder: 'Search records',
      infoEmpty: '<p style="color:red;" > No Data Available !</p> '
    },
    searchDelay: 800 // pake ini supaya gak bug search
  });
}

btnSelectRowBranch(code: String, name: String) {
  this.model.branch_code = code;
  this.model.branch_name = name;
  $('#lookupModalBranch').modal('hide');
  $('#datatableRequestgts').DataTable().ajax.reload();
}
//#endregion branch

//#region resteBranch
resteBranch() {
  this.model.branch_code = undefined;
  this.model.branch_name = undefined;
  $('#datatableRequestgts').DataTable().ajax.reload();
}
//#endregion resteBranch

}