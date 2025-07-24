import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import swal from 'sweetalert2';
import { DALService } from '../../../../../DALservice.service';
import { Location } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './clientpersonallist.component.html'
})

export class ClientpersonallistComponent extends BaseComponent implements OnInit {
  // variable
  public listclientpersonal: any = [];
  public tampType: String;
  private disabledRow: any; 
  private APIController: String;
  private APIControllerClientPersonal: String = 'ClientPersonalInfo';
  private APIControllerClientCorporate: String = 'ClientCorporateInfo';
  private APIRouteForGetRows: String = 'GetRows'; 
  private RoleAccessCode = 'R00022550000010A';

  // ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  constructor(private dalservice: DALService, public route: Router,
    public getRouteparam: ActivatedRoute,
    private _location: Location,
    private _elementRef: ElementRef) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.tampType = 'CORPORATE';
    if (this.tampType === 'PERSONAL') {
      this.APIController = this.APIControllerClientPersonal;
      this.disabledRow = 8;
    } else {
      this.APIController = this.APIControllerClientCorporate;
      this.disabledRow = 7;
    }
    this.compoSide(this._location, this._elementRef, this.route);
    this.loadData();
  }

  //#region ddl clientType
  clientType(event: any) {
    this.tampType = event.target.value;
    if (this.tampType === 'PERSONAL') {
      this.APIController = this.APIControllerClientPersonal;
      this.disabledRow = 8;
    } else {
      this.APIController = this.APIControllerClientCorporate;
      this.disabledRow = 7;
    }
    $('#datatableClientPersonalList').DataTable().ajax.reload();
  }
  //#endregion ddl clientType

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
        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listclientpersonal = parse.data;
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [this.disabledRow] }], // for disabled coloumn
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
    this.route.navigate(['/client/clientmatchingdetail']);
  }
  //#endregion button add

  //#region button add
  btnAdd2() {
    this.route.navigate(['/client/clientmatchingcustomerdetail']);
  }
  //#endregion button add

  //#region button edit
  btnEdit(codeEdit: string) {
    this.route.navigate(['/client/subclientpersonallist/clientpersonaldetail', codeEdit, this.tampType, 'list']);
  }
  //#endregion button edit

}
