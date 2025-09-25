import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { Location } from '@angular/common';
import { DALService } from '../../../../../DALservice.service';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './areablacklistlist.component.html'
})

export class AreablacklistlistComponent extends BaseComponent implements OnInit {
  // variable
  public listarearegisterdanrelease: any = [];
  public tampStatus: String;

  private APIController: String = 'AreaBlacklistTransaction';

  private APIRouteForGetRows: String = 'GetRows';

  private RoleAccessCode = 'R00024070000001A'; // role access 

  // ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  constructor(private dalservice: DALService, public route: Router,
    public getRouteparam: ActivatedRoute,
    private _location: Location,
    private _elementRef: ElementRef) { super(); }

  ngOnInit() {
    this.compoSide(this._location, this._elementRef, this.route);
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.tampStatus = 'HOLD';
    this.loadData();
    // setTimeout(() => {
    //   this.TransactionLock(this.userId, '', '', this.dalservice);
    // }, 100);
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
          'p_transaction_status': this.tampStatus
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listarearegisterdanrelease = parse.data;
          if (parse.data != null) {
            this.listarearegisterdanrelease.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 8] }], // for disabled coloumn
      order:[[6, 'desc']], 
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion load all data

  //#region ddl PageStatus
  PageStatus(event: any) {
    this.tampStatus = event.target.value;
    $('#datatableAreablacklistList').DataTable().ajax.reload();
  }
  //#endregion ddl PageStatus

  //#region button add
  btnAdd() {
    this.route.navigate(['/blacklist/subareblacklistlist/areablacklistdetail']);
  }
  //#endregion button add

  //#region button edit
  btnEdit(codeEdit: string) {
    this.route.navigate(['/blacklist/subareblacklistlist/areablacklistdetail', codeEdit]);
  }
  //#endregion button edit
}