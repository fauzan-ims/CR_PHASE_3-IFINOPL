import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';

@Component({
  selector: 'app-amortizedeferredincomedetail',
  templateUrl: './amortizedeferredincomedetail.component.html'
})
export class AmortizedeferredincomedetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  // type = this.getRouteparam.snapshot.paramMap.get('type');
  // from = this.getRouteparam.snapshot.paramMap.get('from');

  // variable
  public agreementData: any = [];
  public listasset: any = [];
  public isReadOnly: Boolean = false;
  private dataTamp: any = [];
  public setStyle: any = [];
  public lookupasset: any = [];
  public listagreement: any = [];
  public asset_code: String = '';
  public asset_name: String = '';

  //controller
  private APIController: String = 'AgreementMain';
  private APIControllerAgreementAsset: String = 'AgreementAsset';
  private APIControllerAgreementAssetInterest: String = 'AgreementAssetInterestIncome';

  //routing
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteGetRowsForLookup: String = 'GetRowsForLookup';
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForDownloadExcel: String = 'DownloadFileWithData';
  private RoleAccessCode = 'R00023860000001A';

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

  //#region agreement list tabs
  // agreementtcwiz() {
  //   this.route.navigate(['/inquiry/subagreementlist/agreementdetail/' + this.param + '/agreementassetlist', this.param], { skipLocationChange: true });
  // }
  //#endregion agreement list tabs

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
          'p_asset_no': this.asset_code
        })

        this.dalservice.Getrows(dtParameters, this.APIControllerAgreementAssetInterest, this.APIRouteForGetRows).subscribe(resp => {
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
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 8] }], // for disabled coloumn
      order: [['3', 'asc']],
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
    this.route.navigate(['/inquiry/subamortizedeferredincomelist/amortizedeferredincomedetaildetail', this.param, codeEdit]);
  }
  //#endregion button edit

  //#region button back
  btnBack() {
    this.route.navigate(['/inquiry/subamortizedeferredincomelist']);
  }
  //#endregion button back

  //#region button print

  btnPrint() {
    this.showSpinner = true;
    const dataParam = {
      TableName: 'rpt_agreement_amortization',
      SpName: 'xsp_rpt_agreement_amortization',
      reportparameters: {
        p_user_id: this.userId,
        p_agreement_no: this.model.agreement_no,
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
  //#end region button print

  //#region LookupAsset
  btnLookupAsset() {
    $('#datatableLookupSysBranch').DataTable().clear().destroy();
    $('#datatableLookupSysBranch').DataTable({
      'pagingType': 'simple_numbers',
      'pageLength': 5,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false

      ajax: (dtParameters: any, callback) => {
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_agreement_no': this.param,
          'default': ''
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerAgreementAsset, this.APIRouteGetRowsForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupasset = parse.data;

          if (parse.data != null) {
            this.lookupasset.numberIndex = dtParameters.start;
            console.log(this.lookupasset);
            
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          })
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      'lengthMenu': [
        [5, 25, 50, 100],
        [5, 25, 50, 100]
      ],
      columnDefs: [{ orderable: false, width: '5%', targets: [4] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '

      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }
  btnClearLookupAsset() {
    this.asset_code = '';
    this.asset_name = '';
    $('#datatableAsset').DataTable().ajax.reload();
  }
  btnSelectRowAsset(code: String, name: String) {
    console.log(code, name);
    
    this.asset_code = code;
    this.asset_name = name;
    $('#lookupModalAsset').modal('hide');
    $('#datatableAsset').DataTable().ajax.reload();
  }
  //#endregion LookupAsset

    //#region btnDownload
    btnDownload() {
      const dataParam = [
        {
          'p_agreement_no': this.param
        }
      ];
  
      this.showSpinner = true;
      this.dalservice.DownloadFileWithData(dataParam, this.APIControllerAgreementAssetInterest, this.APIRouteForDownloadExcel).subscribe(res => {
        var contentDisposition = res.headers.get('content-disposition');
        var filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();
        const blob = new Blob([res.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        this.showSpinner = false;
      }, err => {
        this.showSpinner = false;
        const parse = JSON.parse(err);
        this.swalPopUpMsg(parse.data);
      });
    }
    //#endregion btnDownload 
}
