import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import { DALService } from '../../../../../../../DALservice.service';
import swal from 'sweetalert2';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './spamortizationmanuallist.component.html'
})

export class SpAmortizationManuallistComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public listdeskcolldetailamort: any = [];
  private dataTamp: any = [];
  public pageType: String;
  public pageType2: String;
  public clientNo: String;

  // private APIController: String = 'Invoice'; 
  private APIController: String = 'WarningLetterDelivery';
  private APIRouteForGetRows: String = 'GetRowsForAmortInvoice';
  private APIRouteForGetRow: String = 'GetRow';

  private RoleAccessCode = 'R00020990000000A';

  // form 2 way binding
  model: any = {};

  // ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  // spinner
  showSpinner: Boolean = true;
  // end

  constructor(private dalservice: DALService,
    public route: Router,
    public getRouteparam: ActivatedRoute,
    private _elementRef: ElementRef) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.callGetRow();
    this.loadData();
  }

  //#region CollectiongroupzipList load all data
  loadData() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      responsive: true,
      serverSide: true,
      processing: true,
      lengthChange: false, // hide lengthmenu
      paging: true,
      'lengthMenu': [
        [100]
      ],
      ajax: (dtParameters: any, callback) => {

        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_code': this.param,
          'default': 'action'
        });

        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listdeskcolldetailamort = parse.data;

          if (parse.data != null) {
            this.listdeskcolldetailamort.numberIndex = dtParameters.start;
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
      columnDefs: [{ orderable: false, width: '5%', targets: [1, 11] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion public serviceAddressList load all data

  callGetRow(){
    this.dataTamp = [{
      'p_code': this.param,
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          // mapper dbtoui
          Object.assign(this.model, parsedata);
          this.clientNo = this.model.client_no
          // end mapper dbtoui
          this.showSpinner = false;
        },
        error => {
          console.log('There was an error while Retrieving Data(API) !!!' + error);
        });
  }

  //#region button edit
  btnEdit(codeEdit: string) {
    this.route.navigate(['/collection/subspmanuallist/spmanualdetail/',this.param,'spamortizationdetail',this.param,codeEdit], { skipLocationChange: true });
  }
  //#endregion button edit

}

