import { OnInit, ViewChild, Component, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../../base.component';
import { DALService } from '../../../../../../../../DALservice.service';
import swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './changeduedateagreementassetamortizationlist.component.html'
})

export class ChangeduedateagreementassetamortizationlistComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');
  code = this.getRouteparam.snapshot.paramMap.get('id3');

  // variable
  public listchangeduedateagreementamortizationhistory: any = [];
  private dataTamp: any = [];
  private newDate: any;
  public due_date_change_code: any;
  public listLookupAsset: any = [];
  public asset_no: String;
  public asset_name: String;

  //controller
  private APIController: String = 'DueDateChangeAmortizationHistory';
  private APIControllerDueDateChangeMain: String = 'DueDateChangeMain';
  private APIControllerAgreementAsset: String = 'AgreementAsset';
  private APIControllerDueDateChangeDetail: String = 'DueDateChangeDetail';

  //rooute
  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteLookup: String = 'GetRowsForLookup';
  private RoleAccessCode = 'R00023870000001A'; // role access 

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = false;
  // end

  // ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  constructor(private dalservice: DALService,
    private _location: Location,
    public route: Router,
    public getRouteparam: ActivatedRoute,
    private _elementRef: ElementRef) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.loadData();
    this.compoSide('', this._elementRef, this.route);
    this.callGetrow();
  }

  //#region getrow data
  callGetrow() {
    // param tambahan untuk getrow dynamic
    this.dataTamp = [{
      'p_asset_no': this.params,
    }];
    // end param tambahan untuk getrow dynamic

    this.dalservice.Getrow(this.dataTamp, this.APIControllerAgreementAsset, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          // mapper dbtoui
          Object.assign(this.model, parsedata);
          // end mapper dbtoui

          this.showSpinner = false;
        },
        error => {
          console.log('There was an error while Retrieving Data(API) !!!' + error);
        });
  }
  //#endregion getrow data

  //#region load all data
  loadData() {
    this.dtOptions = {
      'pagingType': 'first_last_numbers',
      'pageLength': 500,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false
      ajax: (dtParameters: any, callback) => {
        // param tambahan untuk getrow dynamic
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_asset_no': this.params,
          'p_due_date_change_code': this.code
        });

        // end param tambahan untuk getrow dynamic
        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listchangeduedateagreementamortizationhistory = parse.data;
          if (parse.data != null) {
            this.listchangeduedateagreementamortizationhistory.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });

        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 2, 3, 4, 5, 6, 7] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion public serviceAddressList load all data

  //#region Branch Name
  btnLookupAsset() {
    $('#datatableLookAsset').DataTable().clear().destroy();
    $('#datatableLookAsset').DataTable({
      'pagingType': 'first_last_numbers',
      'pageLength': 5,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false
      ajax: (dtParameters: any, callback) => {
        // param tambahan untuk getrows dynamic
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_due_date_change_code': this.param
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIControllerDueDateChangeDetail, this.APIRouteLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listLookupAsset = parse.data;
          if (parse.data != null) {
            this.listLookupAsset.numberIndex = dtParameters.start;
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
  //#endregion branch

  //#region button back
  btnBack() {
    this.route.navigate(['/management/subchangeduedatelistifinopl/changeduedatedetail/' + this.code + '/changeduedatedetaillistwiz', this.code], { skipLocationChange: true });
    $('#datatabledetail').DataTable().ajax.reload();
  }
  //#endregion button back
}