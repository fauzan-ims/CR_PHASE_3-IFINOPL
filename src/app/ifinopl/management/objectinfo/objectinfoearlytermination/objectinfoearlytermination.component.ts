import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { DatePipe } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './objectinfoearlytermination.component.html'
})

export class ObjectInfoEarlyterminationdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public setStyle: any = [];
  public processcode: String;
  private dataTamp: any = [];
  public listearlyterminationdetail: any = [];
  public listearlyterminationtransaction: any = [];

  //routing
  private APIController: String = 'EtMain';
  private APIControllerEtDetail: String = 'EtDetail';
  private APIControllerEtTransaction: String = 'EtTransaction';

  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForGetRows: String = 'GetRows';

  private RoleAccessCode = 'R00020880000000A'; // role access 

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = true;
  // end

  // datatable
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptionsAsset: DataTables.Settings = {};
  dtOptionsTransaction: DataTables.Settings = {};

  constructor(private dalservice: DALService,
    public getRouteparam: ActivatedRoute,
    public route: Router,
    private _elementRef: ElementRef, private datePipe: DatePipe
  ) { super(); }

  ngOnInit() {
    this.wizard();
    this.Delimiter(this._elementRef);
    //
    if (this.param != null) {
      // call web service
      this.callGetrow();
      this.loadDataAsset();
      this.loadDataTransaction();
    } else {
      this.showSpinner = false;
    }
  }

  //#region getrow data
  callGetrow() {

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
          // end mapper dbtoui

          this.showSpinner = false;
        },
        error => {
          console.log('There was an error while Retrieving Data(API) !!!' + error);
        });
  }
  //#endregion getrow data  

  //#region load all data asset
  loadDataAsset() {
    this.dtOptionsAsset = {
      'pagingType': 'first_last_numbers',
      'pageLength': 50,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false 
      ajax: (dtParameters: any, callback) => {

        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_et_code': this.param
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerEtDetail, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          for (let i = 0; i < parse.data.length; i++) {
            // checkbox
            if (parse.data[i].is_terminate === '1') {
              parse.data[i].is_terminate = true;
            } else {
              parse.data[i].is_terminate = false;
            }
            // end checkbox

            this.listearlyterminationdetail = parse.data;
          }

          this.listearlyterminationdetail = parse.data;
          if (parse.data != null) {
            this.listearlyterminationdetail.numberIndex = dtParameters.start;
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
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 4] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion load all data asset

  //#region load all data transaction
  loadDataTransaction() {
    this.dtOptionsTransaction = {
      'pagingType': 'first_last_numbers',
      'pageLength': 50,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false
      ajax: (dtParameters: any, callback) => {
        
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_et_code': this.param,
          'p_is_transaction': '1'
        });
        
        this.dalservice.Getrows(dtParameters, this.APIControllerEtTransaction, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listearlyterminationtransaction = parse.data;
          if (parse.data != null) {
            this.listearlyterminationtransaction.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });

        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion load all data transaction

}