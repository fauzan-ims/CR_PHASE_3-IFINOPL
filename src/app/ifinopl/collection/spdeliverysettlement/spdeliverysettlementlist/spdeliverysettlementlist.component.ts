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
  templateUrl: './spdeliverysettlementlist.component.html'
})

export class SpdeliverysettlementlistComponent extends BaseComponent implements OnInit {
  // #variable
  public listspdeliverysettlement: any = [];
  public branch_code: any = [];
  public lookupBranch: any = [];
  public branchName: String;
  public delivery_status: String;
  public isReadOnly: Boolean = false;
  public lookupbranchcode: any = [];
  private branchCode: String;
  private RoleAccessCode = 'R00021030000000A';

  private APIControllerSPDelivery: String = 'WarningLetterDelivery';
  private APIRouteForGetRows: String = 'ExecSpForGetrowsSettlement';
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
    this.loadData();
    this.delivery_status = 'ON PROCESS';
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
          'p_delivery_status': this.delivery_status
        })
        // 

        this.dalservice.Getrows(dtParameters, this.APIControllerSPDelivery, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listspdeliverysettlement = parse.data;
          if (parse.data != null) {
            this.listspdeliverysettlement.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });

        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [1, 9] }], // for disabled coloumn
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
    this.route.navigate(['/collection/subspdeliverysettlementlist/spdeliverysettlementdetail']);
  }
  //#endregion button add

  //#region button edit
  btnEdit(codeEdit: string) {
    this.route.navigate(['/collection/subspdeliverysettlementlist/spdeliverysettlementdetail', codeEdit]);
  }
  //#endregion button edit

  //#region ddl Status
  PageStatus(event: any) {
    this.delivery_status = event.target.value;
    $('#datatableSpDeliverySettlementList').DataTable().ajax.reload();
  }
  //#endregion ddl Status

  //#region checkbox all table
  selectAllTable() {
    for (let i = 0; i < this.listspdeliverysettlement.length; i++) {
      this.listspdeliverysettlement[i].selectedTable = this.selectedAllTable;
    }
  }
  checkIfAllTableSelected() {
    this.selectedAllTable = this.listspdeliverysettlement.every(function (item: any) {
      return item.selectedTable === true;
    })
  }
  //#endregion checkbox all table

  //#region lookup branch
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
        
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'default': ''
        });
        
        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBranch, this.APIRouteForLookup).subscribe(resp => {
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
      columnDefs: [{ orderable: false, width: '5%', targets: [1, 4] }], // for disabled coloumn
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
    $('#lookupModalSysBranch').modal('hide');
    $('#datatableSpDeliverySettlementList').DataTable().ajax.reload();
  }

  btnClearBranch(){
    this.branchCode = '';
    this.branchName = '';
    $('#lookupModalSysBranch').modal('hide');
    $('#datatableSpDeliverySettlementList').DataTable().ajax.reload();
  }
  //#endregion branch lookup

}
