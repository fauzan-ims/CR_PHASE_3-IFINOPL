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
  templateUrl: './parametertransactionlist.component.html'
})

export class ParametertransactionlistComponent extends BaseComponent implements OnInit {
  // variable
  public listparametertransaction: any = [];
  public isReadOnly: Boolean = false;
  private APIController: String = 'SysGeneralSubcode';
  private APIRouteForGetRows: String = 'GetRows';
  private RoleAccessCode = 'R00020860000000A'; // role access 

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
          'p_general_code': 'PLPRO'
        });
        

        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(parametertransactionresp => {
          const parseparametertransaction = JSON.parse(parametertransactionresp)
          this.listparametertransaction = parseparametertransaction.data;
          if (parseparametertransaction.data != null) {
            this.listparametertransaction.numberIndex = dtParameters.start;
          }
          callback({
            draw: parseparametertransaction.draw,
            recordsTotal: parseparametertransaction.recordsTotal,
            recordsFiltered: parseparametertransaction.recordsFiltered,
            data: []
          });
          this.showSpinner = false;
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 4] }], // for disabled coloumn
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
    this.route.navigate(['/setting/submastertransactionparameterlist/parametertransactiondetail', codeEdit]);
  }
  //#endregion button edit
}
