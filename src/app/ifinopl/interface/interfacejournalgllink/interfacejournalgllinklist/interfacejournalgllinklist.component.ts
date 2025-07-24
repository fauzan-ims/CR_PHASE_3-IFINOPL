import { OnInit, ViewChild, Component, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { Location } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './interfacejournalgllinklist.component.html'
})
// tslint:disable-next-line:class-name
export class interfacejournalgllinklistComponent extends BaseComponent implements OnInit {
  // variable
  public listjournaltransaction: any = [];
  public lookupBranch: any = [];
  public branchName: String;
  private branchCode: String;
  public tampStatus: String;

  // API Controller
  private APIController: String = 'JournalGlLink';
  private APIRouteForGetRowsForInterfaceJournalGLlink: String = 'GetRowsForInterfaceJournalGLlink';
  private APIControllerSysBranch: String = 'SysBranch';

  // API Function
  private APIRouteLookup: String = 'GetRowsForLookup';
  private RoleAccessCode = 'R00023680000001A'; // role access  

  // spinner
  showSpinner: Boolean = false;
  // end

  // ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  constructor(private dalservice: DALService,
    public route: Router,
    private _location: Location,
    private _elementRef: ElementRef) { super(); }

  ngOnInit() {
    this.compoSide(this._location, this._elementRef, this.route);
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.tampStatus = 'ALL';
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
        // param tambahan untuk getrows dynamic
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_branch_code': this.branchCode,
          'p_transaction_status': this.tampStatus
        });

        console.log(dtParameters.paramTamp);

        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRowsForInterfaceJournalGLlink).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listjournaltransaction = parse.data;
          if (parse.data != null) {
            this.listjournaltransaction.numberIndex = dtParameters.start;
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
      columnDefs: [{ orderable: false, targets: [0, 1, 9] }],
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion load all data

  //#region ddl master module
  PageStatus(event: any) {
    this.tampStatus = event.target.value;
    $('#datatableInterfaceJournalGlLinkList').DataTable().ajax.reload();
  }
  //#endregion ddl master module

  //#region button edit
  btnEdit(id: string, codeEdit: string) {
    this.route.navigate(['/interface/subinterfacejournalgllinklist/interfacejournalgllinkdetail', id, codeEdit]);
  }
  //#endregion button edit

  //#region Lookup Branch
  btnLookupbranch() {
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
        // param tambahan untuk getrows dynamic
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_cre_by': this.uid
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBranch, this.APIRouteLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupBranch = parse.data;
          if (parse.data != null) {
            this.lookupBranch.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 4] }],
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowLookupBranch(branch_code: String, branch_name: String) {
    this.branchCode = branch_code;
    this.branchName = branch_name;
    $('#lookupModalbranch').modal('hide');
    $('#datatableInterfaceJournalGlLinkList').DataTable().ajax.reload();
  }

  //#region resteBranch
  resteBranch() {
    this.branchCode = undefined;
    this.branchName = undefined;
    $('#datatableInterfaceJournalGlLinkList').DataTable().ajax.reload();
  }
  //#endregion resteBranch
  //#endregion Lookup Branch 
}
