import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { Location } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './sktsettlementlist.component.html'
})

export class SktsettlementlistComponent extends BaseComponent implements OnInit {
  // variable
  public listsettlementskt: any = [];
  public lookupSysBranch: any = [];
  public branchName: String;
  private branchCode: String;
  public tampStatus: String;
  private rolecode: any = [];
  private dataRoleTamp: any = [];

  private RoleAccessCode = 'R00023790000001A';

  private APIController: String = 'RepossessionLetter';
  private APIRouteLookupSysBranch: String = 'GetRowsForLookupSysBranch';
  private APIRouteForGetRows: String = 'GetRowsForSettlement';
  private APIRouteForGetRole: String = 'ExecSpForGetRole';
  private APIControllerSysBranch: String = 'sysbranch';
  private APIRouteForLookup: String = 'GetRowsForLookup';


  // checklist
  public selectedAllTable: any;

  // form 2 way binding
  model: any = {};

  // ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  constructor(private dalservice: DALService,
    public route: Router,
    private _location: Location,
    private _elementRef: ElementRef) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
 
    this.compoSide(this._location, this._elementRef, this.route);
    this.tampStatus = 'POST';
    this.loadData();
  }

  //#region ddl master module
  PageStatus(event: any) {
    this.tampStatus = event.target.value;
    $('#datatableSettlementTskList').DataTable().ajax.reload();
  }
  //#endregion ddl master module

  //#region SKTManual List load all data
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
          'p_letter_status': this.tampStatus,
          'p_is_remedial': '0'
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listsettlementskt = parse.data;
          if (parse.data != null) {
            this.listsettlementskt.numberIndex = dtParameters.start;
          }


          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });

        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [1, 8] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion SKTManual List load all data

  //#region SKTManual List button edit
  btnEdit(codeEdit: string) {
    this.route.navigate(['/collection/sublistsettlementsktifincoll/settlementsktdetailifincoll', codeEdit]);
  }
  //#endregion SKTManual List button edit

  //#region Branch
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
        // param tambahan untuk getrows dynamic
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'default': ''
        });
        // end param tambahan untuk getrows dynamic

        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBranch, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupSysBranch = parse.data;
          if (parse.data != null) {
            this.lookupSysBranch.numberIndex = dtParameters.start;
          }


          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          })
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [1, 4] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }
  btnSelectRowSysBranch(code: String, name: String) {
    this.branchCode = code;
    this.branchName = name;
    $('#datatableSettlementTskList').DataTable().ajax.reload();
    $('#lookupModalSysBranch').modal('hide');
  }

  btnClearBranch(){
    this.branchCode = '';
    this.branchName = '';
    $('#datatableSettlementTskList').DataTable().ajax.reload();
    $('#lookupModalSysBranch').modal('hide');
  }
  //#endregion branch

}
