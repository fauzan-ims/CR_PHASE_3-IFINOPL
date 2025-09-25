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
  templateUrl: './inquiryamortizationlist.component.html'
})

export class InquiryAmortizationlistComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public listdeskcolldetailamort: any = [];
  public pageType: String;
  public pageType2: String;

  // private APIController: String = 'Invoice'; 
  private APIController: String = 'DeskcollInvoice';
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForGetRowsInquiryDeskcollInvoice: String = 'GetRowsInquiryDeskcollInvoice';

  private RoleAccessCode = 'R00024780000001A';

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
          'p_deskcoll_main_id': this.param,
          'p_id_task_main': this.param,
          'default': 'action'
        });

        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRowsInquiryDeskcollInvoice).subscribe(resp => {
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
      columnDefs: [{ orderable: false, width: '5%', targets: [1, 10] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion public serviceAddressList load all data

  //#region button edit
  btnEdit(codeEdit: any, invoice_no: any) {
    const idToUse = (codeEdit === 0 || codeEdit === null || codeEdit === undefined) ? invoice_no : codeEdit;
    this.route.navigate(['/inquiry/inquirydeskcolltaskdetailpast/' + this.param + '/inquiryamortizationdetail', this.param, idToUse], { skipLocationChange: true });
  }
  //#endregion button edit

}

