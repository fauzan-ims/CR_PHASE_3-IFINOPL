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
  templateUrl: './budgetapprovallist.component.html',
})

export class BudgetapprovallistComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public listbudgetapproval: any = [];
  public tampbudgetapprovalStatus: any;

  private APIController: String = 'BudgetApproval';

  private APIRouteForGetRows: String = 'GetRows';

  private RoleAccessCode = 'R00021000000000A'; // role access 

  // ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  constructor(private dalservice: DALService,
    public getRouteparam: ActivatedRoute,
    public route: Router,
    private _location: Location,
    private _elementRef: ElementRef
  ) { super(); }

  ngOnInit() {
    this.compoSide(this._location, this._elementRef, this.route);
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.loadData();
    this.tampbudgetapprovalStatus = 'HOLD';
  }

  //#region budgetapprovalStatus
  budgetapprovalStatus(event) {
    this.tampbudgetapprovalStatus = event.target.value;
    $('#datatableBudgetapprovallist').DataTable().ajax.reload();
  }
  //#endregion budgetapprovalStatus

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
          'p_status': this.tampbudgetapprovalStatus
        })
        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listbudgetapproval = parse.data;
          if (parse.data != null) {
            this.listbudgetapproval.numberIndex = dtParameters.start;
          }

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
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

  //#region button edit
  btnEdit(codeEdit: string) {
    this.route.navigate(['/application/subbudgetapprovallist/budgetapprovaldetail', codeEdit]);
  }
  //#endregion button edit
}
