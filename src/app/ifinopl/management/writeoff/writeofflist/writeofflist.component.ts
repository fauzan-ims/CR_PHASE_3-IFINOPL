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
  templateUrl: './writeofflist.component.html'
})

export class WriteofflistComponent extends BaseComponent implements OnInit {
  // variable
  public listwriteoff: any = [];
  public branchCode: any = [];
  public branchName: any = [];
  public lookupSysBranch: any = [];
  public wo_status: String;
  private APIControllerWriteOffMain: String = 'WriteOffMain';
  private APIControllerSysBranch: String = 'SysBranch';
  private APIRouteLookup: String = 'GetRowsForLookup';
  private APIRouteForGetRows: String = 'GETROWS';
  private RoleAccessCode = 'R00020890000000A';

  // spinner
  showSpinner: Boolean = true;
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
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.compoSide(this._location, this._elementRef, this.route);
    this.wo_status = 'HOLD';
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
          'p_branch_code': this.branchCode,
          'p_wo_status': this.wo_status
        });


        this.dalservice.Getrows(dtParameters, this.APIControllerWriteOffMain, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listwriteoff = parse.data;
          if (parse.data != null) {
            this.listwriteoff.numberIndex = dtParameters.start;
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

  //#region button add
  btnAdd() {
    this.route.navigate(['/management/subwriteofflist/writeoffdetail']);
  }
  //#endregion button add

  //#region button edit
  btnEdit(codeEdit: string) {
    this.route.navigate(['/management/subwriteofflist/writeoffdetail', codeEdit]);
  }
  //#endregion button edit

  //#region ddl Status
  PageStatus(event: any) {
    this.wo_status = event.target.value;
    $('#datatableWriteOff').DataTable().ajax.reload();
  }
  //#endregion ddl Status

  //#region Branch Name
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

        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBranch, this.APIRouteLookup).subscribe(resp => {
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
    this.branchCode = code;
    this.branchName = name;
    $('#lookupModalSysBranch').modal('hide');
    $('#datatableWriteOff').DataTable().ajax.reload();
  }
  //#endregion branch

  //#region resteBranch
  resteBranch() {
    this.branchCode = undefined;
    this.branchName = undefined;
    $('#datatableWriteOff').DataTable().ajax.reload();
  }
  //#endregion resteBranch
}


