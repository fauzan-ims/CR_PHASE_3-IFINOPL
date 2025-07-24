import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../base.component';
import { DALService } from '../../../../../../DALservice.service';
import swal from 'sweetalert2';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './contractmaturitydetaillist.component.html'
})

export class ContractmaturitydetaillistComponent extends BaseComponent implements OnInit {
  // get param from url
  maturityDetailId = this.getRouteparam.snapshot.paramMap.get('maturityDetailId');
  maturityCode = this.getRouteparam.snapshot.paramMap.get('maturityCode');

  // variable
  public listapplicationasset: any = [];
  public tempFile: any;
  public isStatus: Boolean = false;
  private dataTamp: any = [];

  private APIController: String = 'MaturityAmortizationHistory';
  private APIControllerMaturityDetail: String = 'MaturityDetail';

  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForGetRows: String = 'GetRows';

  private RoleAccessCode = 'R00020730000000A'; // role access 

  // spinner
  showSpinner: Boolean = false;
  // end

  // form 2 way binding
  model: any = {};
  dataTampPush: any[];
  // ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  constructor(private dalservice: DALService,
    public getRouteparam: ActivatedRoute,
    public route: Router,
    private _elementRef: ElementRef
  ) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.callGetrow();
    this.loadData();
  }

  //#region getrow data
  callGetrow() {
    this.dataTamp = [];
     
    this.dataTamp = [{
      'p_id': this.maturityDetailId
    }];
    
    
    this.dalservice.Getrow(this.dataTamp, this.APIControllerMaturityDetail, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);
          
          if (parsedata.amort_type_code === 'UPL') {
            this.isStatus = true;
          }
          // mapper dbtoui
          Object.assign(this.model, parsedata);
          // end mapper dbtoui
          this.showSpinner = false;
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
  }
  //#endregion getrow data

  //#region load all data
  loadData() {
    this.dtOptions = {
      'pageLength': 500,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false
      ajax: (dtParameters: any, callback) => {
        
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_id': this.maturityDetailId
        })
        
        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listapplicationasset = parse.data;
          if (parse.data != null) {
            this.listapplicationasset.numberIndex = dtParameters.start;
          }
          
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [1, 2, 3, 4, 5, 6, 7] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }

  }
  //#endregion load all data

  btnBack() {
    this.route.navigate(['/maintenance/subcontractmaturitylist/contractmaturitydetail', this.maturityCode]);
    $('#datatableApplicationAsset').DataTable().ajax.reload();
  }

}