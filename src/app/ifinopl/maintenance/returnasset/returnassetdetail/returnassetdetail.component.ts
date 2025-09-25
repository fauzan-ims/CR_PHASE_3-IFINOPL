import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import swal from 'sweetalert2';
import { DALService } from '../../../../../DALservice.service';
import { NgForm } from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './returnassetdetail.component.html'
})

export class ReturnassetdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  pageType = this.getRouteparam.snapshot.paramMap.get('page');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public isStatus: Boolean = false;
  public isProceed: Boolean = false;
  public isCancel: Boolean = false;
  public returnassetdetailData: any = [];
  public listagreementassetlist: any = [];
  public lookupemployee: any = [];
  public lookupasset: any = [];
  public setStyle: any = [];
  private dataTamp: any = [];
  public tampassetStatus: String;

  private APIController: String = 'AgreementMain';
  private APIControllerAgreementAsset: String = 'AgreementAsset';

  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForGetRows: String = 'GetrowsForReturnAsset';

  private RoleAccessCode = 'R00020680000000A'; // role access 

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = false;
  // end

  // checklist
  public selectedAll: any;
  private checkedList: any = [];

  // datatable
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
    this.Delimiter(this._elementRef);
    // call web service
    this.callGetrow();
    this.loadData();
    this.tampassetStatus = 'RENTED';
  }

  //#region assetStatus
  assetStatus(event) {
    this.tampassetStatus = event.target.value;
    $('#datatableAgreementAssetList').DataTable().ajax.reload();
  }
  //#endregion assetStatus

  //#region load all data
  loadData() {
    this.dtOptions = {
      'pagingType': 'first_last_numbers',
      'pageLength': 10,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false
      ajax: (dtParameters: any, callback) => {
        
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_agreement_no': this.param,
          'p_asset_status': this.tampassetStatus
        })
        
        this.dalservice.Getrows(dtParameters, this.APIControllerAgreementAsset, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listagreementassetlist = parse.data;
          if (parse.data != null) {
            this.listagreementassetlist.numberIndex = dtParameters.start;
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

  //#region getrow data
  callGetrow() {
     
    this.dataTamp = [{
      'p_agreement_no': this.param
    }];
    
    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
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
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
  }
  //#endregion getrow data

  //#region button back
  btnBack() {
    this.route.navigate(['/maintenance/subreturnassetlist']);
    $('#datatableReturnassetlist').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region  form submit
  onFormSubmit(returnassetdetailForm: NgForm, isValid: boolean) {
  }
  //#endregion form submit

  //#region button edit
  btnEdit(codeEdit: String) {
    this.route.navigate(['/maintenance/subreturnassetlist/returnassetdetaildetail', this.param, codeEdit]);
  }
  //#endregion button edit
}