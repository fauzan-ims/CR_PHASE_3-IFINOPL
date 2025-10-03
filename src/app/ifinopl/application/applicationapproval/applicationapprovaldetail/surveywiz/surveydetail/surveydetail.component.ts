import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import { DALService } from '../../../../../../../DALservice.service';

@Component({
  selector: 'app-surveydetail',
  templateUrl: './surveydetail.component.html'
})

export class ApprovalsurveydetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  pageType = this.getRouteparam.snapshot.paramMap.get('page');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public applicationapprovalsurveydetailData: any = [];
  public lookupapplication: any = [];
  private dataTamp: any = [];
  public isReadOnly: Boolean = false;

  private APIController: String = 'ApplicationMain';

  private APIRouteForGetRow: String = 'GetRow';

  private RoleAccessCode = 'R00020690000010A';

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = true;
  // end

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
    this.callGetrow();
  }

  //#region getrow data
  callGetrow() {

    this.dataTamp = [{
      'p_application_no': this.param
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];

          if (parsedata.client_type === 'PERSONAL') {
            $('#tabapplicationfinancialrecapitulation').hide();
            this.scoringrequestwiz();
            $('#tabapplicationScoring .nav-link').addClass('active');
          }
          else {
            $('#tabapplicationFinancialAnalysis').hide();
            this.scoringrequestwiz();
            $('#tabapplicationScoring .nav-link').addClass('active');
          }
          this.showSpinner = false;
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
  }
  //#endregion getrow data

  //#region List tabs
  scoringrequestwiz() {
    this.route.navigate(['/application/banberjalanapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/surveydetail/' + this.param + '/' + 'banberjalan' + '/scoringrequestlist/', this.param, 'banberjalan'], { skipLocationChange: true });
  }

  surveyrequestwiz() {
    // this.route.navigate(['/application/banberjalanapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/surveydetail/' + this.param + '/' + 'banberjalan' + '/surveyrequestlist/', this.param, 'banberjalan'], { skipLocationChange: true });
    this.route.navigate(['/application/banberjalanapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/surveydetail/' + this.param + '/' + 'banberjalan' + '/surveyrequestdetail/', this.param, 'banberjalan'], { skipLocationChange: true });
  }

  financialanalysiswiz() {
    this.route.navigate(['/application/banberjalanapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/surveydetail/' + this.param + '/' + 'banberjalan' + '/financialanalysislist/', this.param, 'banberjalan'], { skipLocationChange: true });
  }

  financialrecapitulationwiz() {
    this.route.navigate(['/application/banberjalanapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/surveydetail/' + this.param + '/banberjalan' + '/financialrecapitulationlist', this.param, 'banberjalan'], { skipLocationChange: true });
  }
  //#region List tabs
}