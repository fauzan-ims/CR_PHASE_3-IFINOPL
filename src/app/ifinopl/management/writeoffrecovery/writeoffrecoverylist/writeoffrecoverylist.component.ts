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
  templateUrl: './writeoffrecoverylist.component.html'
})

export class WriteoffrecoverylistComponent extends BaseComponent implements OnInit {

  // #variable
  public branch_code: any = [];
  public branch_name: any = [];
  public recovery_status: any = [];
  public listworecovery: any = [];
  public lookupbranchfilter: any = [];
  public currencyrevaluationData: any = [];
  public isReadOnly: Boolean = false;
  public param: any = [];
  private APIControllerWriteOffRecovery: String = 'WriteOffRecovery';
  private APIControllerSysBranch: String = 'SysBranch';

  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteLookup: String = 'GetRowsForLookup';

  private RoleAccessCode = 'R00020900000000A';


  // #ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  // spinner
  showSpinner: Boolean = true;
  // end

  constructor(private dalservice: DALService,
    public route: Router,
    private _location: Location,
    private _elementRef: ElementRef) { super(); }

  ngOnInit() {
    // this.callGetRole(this.userId);
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.compoSide(this._location, this._elementRef, this.route);
    this.recovery_status = 'HOLD';
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
          'p_recovery_code': this.param,
          'p_branch_code': this.branch_code,
          'p_recovery_status': this.recovery_status
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerWriteOffRecovery, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listworecovery = parse.data;
          if (parse.data != null) {
            this.listworecovery.numberIndex = dtParameters.start;
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

          this.showSpinner = false;
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 8] }], // for disabled coloumn
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
    this.route.navigate(['/management/subwriteoffrecoverylist/writeoffrecoverydetail']);
  }
  //#endregion button add

  //#region button edit
  btnEdit(codeEdit: string) {
    this.route.navigate(['/management/subwriteoffrecoverylist/writeoffrecoverydetail', codeEdit]);
  }
  //#endregion button edit

  //#region ddl Status
  PageStatus(event: any) {
    this.recovery_status = event.target.value;
    $('#datatableWriteOffRecovery').DataTable().ajax.reload();
  }
  //#endregion ddl Status

  //#region lookup filter
  btnLookupBranchfilter() {
    $('#datatableLookupBranchfilter').DataTable().clear().destroy();
    $('#datatableLookupBranchfilter').DataTable({
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
          'p_cre_by': this.uid
        });
        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBranch, this.APIRouteLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupbranchfilter = parse.data;
          if (parse.data != null) {
            this.lookupbranchfilter.numberIndex = dtParameters.start;
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
    // } , 1000);
  }

  btnSelectRowBranchfilter(branch_code: String, branch_name: String) {
    this.branch_code = branch_code;
    this.branch_name = branch_name;
    $('#lookupModalBranchfilter').modal('hide');
    $('#datatableWriteOffRecovery').DataTable().ajax.reload();
  }
  //#endregion lookup filter

  //#region resteBranch
  resteBranch() {
    this.branch_code = undefined;
    this.branch_name = undefined;
    $('#datatableWriteOffRecovery').DataTable().ajax.reload();
  }
  //#endregion resteBranch
}

