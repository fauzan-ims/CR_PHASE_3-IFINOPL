import { OnInit, ViewChild, Component, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './spmanuallist.component.html'
})

export class SpmanuallistComponent extends BaseComponent implements OnInit {

  // #variable
  public branch_code: any = [];
  public branch_name: any = [];
  public account_no: any = [];
  public letter_status: any = [];
  public letter_type: any = [];
  public account_name: any = [];
  public listspmanual: any = [];
  public isReadOnly: Boolean = false;
  public lookupbranchcode: any = [];
  private RoleAccessCode = 'R00020990000000A';

  private APIControllerSPManual: String = 'WarningLetter';
  private APIRouteForGetRows: String = 'GetRows';
  private APIControllerSysBranch: String = 'sysbranch';
  private APIRouteForLookup: String = 'GetRowsForLookup';

  // form 2 way binding
  model: any = {};

  // #ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  checkedList: any;
  selectedAll: any;
  selectedAllTable: any;

  constructor(private dalservice: DALService,
    public route: Router,
    private _location: Location,
    private _elementRef: ElementRef) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);

    this.compoSide(this._location, this._elementRef, this.route);
    this.letter_status = 'REQUEST';
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
        // tambahan param untuk getrows dynamic
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_branch_code': this.branch_code,
          'p_letter_status': this.letter_status,
          'p_generate_type': 'MANUAL'
        });
        // end tambahan param untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIControllerSPManual, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listspmanual = parse.data;
          if (parse.data != null) {
            this.listspmanual.numberIndex = dtParameters.start;
          }

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });

        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [1, 10] }], // for disabled coloumn
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
    this.route.navigate(['/collection/subspmanuallist/spmanualdetail']);
  }
  //#endregion button add

  //#region button edit
  btnEdit(codeEdit: string) {
    this.route.navigate(['/collection/subspmanuallist/spmanualdetail', codeEdit]);
  }
  //#endregion button edit

  //#region ddl Status
  PageStatus(event: any) {
    this.letter_status = event.target.value;
    $('#datatableSpManualList').DataTable().ajax.reload();
  }
  //#endregion ddl Status

  //#region lookup branch
  btnLookupBranchcode() {
    $('#datatableLookupBranchcode').DataTable().clear().destroy();
    $('#datatableLookupBranchcode').DataTable({
      'pagingType': 'first_last_numbers',
      'pageLength': 5,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false

      ajax: (dtParameters: any, callback) => {
        // tambahan param untuk getrows dynamic
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'default': ''
        });
        // end tambahan param untuk getrows dynamic
        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBranch, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupbranchcode = parse.data;
          if (parse.data != null) {
            this.lookupbranchcode.numberIndex = dtParameters.start;
          }

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
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
    // } , 1000);
  }
  btnSelectRowBranchcode(branch_code: String, branch_name: String) {
    this.branch_code = branch_code;
    this.branch_name = branch_name;
    $('#lookupModalSysBranchcode').modal('hide');
    $('#datatableSpManualList').DataTable().ajax.reload();
  }

  btnClearBranch(){
    this.branch_code = '';
    this.branch_name = '';
    $('#lookupModalSysBranchcode').modal('hide');
    $('#datatableSpManualList').DataTable().ajax.reload();
  }
  //#endregion lookup branch
}
