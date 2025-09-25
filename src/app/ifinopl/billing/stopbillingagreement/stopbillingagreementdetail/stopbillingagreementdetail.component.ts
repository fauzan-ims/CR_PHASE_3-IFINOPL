import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';

@Component({
  selector: 'app-stopbillingagreementdetail',
  templateUrl: './stopbillingagreementdetail.component.html'
})
export class StopbillingagreementdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  // type = this.getRouteparam.snapshot.paramMap.get('type');
  // from = this.getRouteparam.snapshot.paramMap.get('from');

  // variable
  public agreementData: any = [];
  public listasset: any = [];
  public isReadOnly: Boolean = false;
  private dataTamp: any = [];
  public isHideButtonPrint: Boolean = false;
  public setStyle: any = [];
  private APIController: String = 'AgreementMain';
  private APIControllerStopBilling: String = 'StopBilling';
  private APIControllerAgreementAsset: String = 'AgreementAsset';
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForGetRows: String = 'GetRowsForStopBilling';
  private APIRouteForCheckingCustomer: String = 'GetRowCheckCustomer';
  private RoleAccessCode = 'R00020750000000A';

  // report
  private APIControllerReport: String = 'Report';
  private APIRouteForDownload: String = 'getReport';
  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = true;
  // end

  // ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  constructor(private dalservice: DALService,
    public getRouteparam: ActivatedRoute,
    public route: Router,
    private _elementRef: ElementRef,
    private parserFormatter: NgbDateParserFormatter
  ) { super(); }

  ngOnInit() {
    // this.callGetRole('');
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    if (this.param != null) {
      this.isReadOnly = true;

      // call web service
      this.callGetrow();
      this.loadData();
      this.callGetrowCheckCustomer()
      // this.wizard();
      // this.agreementtcwiz();
      // this.agreementtcwiz();
    } else {
      this.showSpinner = false;
    }

  }

  //#region getStyles
  getStyles(isTrue: Boolean) {

    if (isTrue) {
      this.setStyle = {
        'pointer-events': 'none',
      }
    } else {
      this.setStyle = {
        'pointer-events': 'auto',
      }
    }

    return this.setStyle;
  }
  //#endregion

  //#region getrow data
  callGetrow() {
    
    this.dataTamp = [{
      'p_agreement_no': this.param
    }]
    

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

  //#region getrow data
  callGetrowCheckCustomer() {

    this.dataTamp = [{
      'p_agreement_no': this.param,
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIControllerStopBilling, this.APIRouteForCheckingCustomer)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);
          
          if (parsedata.is_on_customer === '1') {
            this.isHideButtonPrint = true;
          } else {
            this.isHideButtonPrint = false;
          }
          // mapper dbtoui
          Object.assign(this.model, parsedata);
          // end mapper dbtoui
          console.log(this.isHideButtonPrint);
          

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
          'p_agreement_no': this.param
        })
        
        this.dalservice.Getrows(dtParameters, this.APIControllerAgreementAsset, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listasset = parse.data;
          if (parse.data != null) {
            this.listasset.numberIndex = dtParameters.start;
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
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 9] }], // for disabled coloumn
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
    this.route.navigate(['/billing/substopbillingagreementlist/stopbillingagreementassetdetail', this.param, codeEdit]);
  }
  //#endregion button edit

  //#region button back
  btnBack() {
    this.route.navigate(['/billing/substopbillingagreementlist']);
  }
  //#endregion button back

   //#region button print somasi pemenuhan
   btnPrintSomasiPenyelesaianKewajiban() {
    this.showSpinner = true;
    const dataParam = {
      TableName: 'RPT_SOMASI_PENYELESAIAN_KEWAJIBAN',
      SpName: 'xsp_rpt_somasi_penyelesaian_kewajiban',
      reportparameters: {
        p_user_id: this.userId,
        p_agreement_no: this.param,
        p_print_option: 'PDF'
      }
    };

    this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
      this.printRptNonCore(res);
      this.showSpinner = false;
    }, err => {
      this.showSpinner = false;
      const parse = JSON.parse(err);
      this.swalPopUpMsg(parse.data);
    });
  }

  //#end region button print somasi pemenuhan

  //#region button print somasi pemenuhan
  btnPrintSomasiPenyelesaianKewajibanPengembalian() {
    this.showSpinner = true;
    const dataParam = {
      TableName: 'RPT_SOMASI_PENYELESAIAN_KEWAJIBAN_DAN_PENGEMBALIAN_KENDARAAN',
      SpName: 'xsp_rpt_somasi_penyelesaian_kewajiban_dan_pengembalian_kendaraan',
      reportparameters: {
        p_user_id: this.userId,
        p_agreement_no: this.param,
        p_print_option: 'PDF'
      }
    };

    this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
      this.printRptNonCore(res);
      this.showSpinner = false;
    }, err => {
      this.showSpinner = false;
      const parse = JSON.parse(err);
      this.swalPopUpMsg(parse.data);
    });
  }

  //#end region button print somasi pemenuhan
}
