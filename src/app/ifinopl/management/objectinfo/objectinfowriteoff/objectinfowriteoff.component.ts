import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { DatePipe } from '@angular/common';
// import { log } from 'console';

// call function from js shared
declare function headerPage(controller, route): any;
declare function hideButtonLink(idbutton): any;
declare function hideTabWizard(): any;

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './objectinfowriteoff.component.html'
})

export class ObjectinfowriteoffComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public writeoffData: any = [];
  public isReadOnly: Boolean = false;
  public isButton: Boolean = false;
  public processcode: String;
  private dataTamp: any = [];
  public listwriteoffdetail: any = [];
  public listwriteoffinformation: any = [];

  private APIControllerWriteOffMain: String = 'WriteOffMain';
  private APIControllerWoDetail: String = 'WriteOffDetail';
  private APIControllerTransaction: String = 'WriteOffTransaction';
  
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForGetRow: String = 'GetRow';

  private RoleAccessCode = 'R00020890000000A';

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = true;
  // end

  // datatable
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptionsAsset: DataTables.Settings = {};
  dtOptions: DataTables.Settings = {};

  constructor(private dalservice: DALService,
    public getRouteparam: ActivatedRoute,
    public route: Router,
    private _elementRef: ElementRef, private datePipe: DatePipe
  ) { super(); }

  ngOnInit() {
    this.Delimiter(this._elementRef);
    //
    this.wizard();
    if (this.param != null) {
      this.isReadOnly = true;
      this.callGetrow();
      this.loadDataAsset();
      this.loadData();
    } else {
      this.showSpinner = false;
    }
  }

  //#region getrow data
  callGetrow() {

    this.dataTamp = [{
      'p_code': this.param,
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIControllerWriteOffMain, this.APIRouteForGetRow)
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
          'p_write_off_code': this.param
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerWoDetail, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          
          for (let i = 0; i < parse.data.length; i++) {
            // checkbox
            if (parse.data[i].is_take_assets === '1') {
              parse.data[i].is_take_assets = true;
            } else {
              parse.data[i].is_take_assets = false;
            }
            // end checkbox

            this.listwriteoffdetail = parse.data;
          }

          // this.listwriteoffdetail = parse.data;
          if (parse.data != null) {
            this.listwriteoffdetail.numberIndex = dtParameters.start;
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
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, ] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion load all data asset

   //#region writeoffinformationList load all data
   loadData() {
    this.dtOptions = {
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
          'p_wo_code': this.param,
          'p_is_transaction': '0'
        });
        
        this.dalservice.Getrows(dtParameters, this.APIControllerTransaction, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          
          this.listwriteoffinformation = parse.data;
          if (parse.data != null) {
            this.listwriteoffinformation.numberIndex = dtParameters.start;
          }

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });

        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0] }], // for disabled coloumn
      order: [['2', 'asc']],
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '

      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion public serviceAddressList load all data

}


