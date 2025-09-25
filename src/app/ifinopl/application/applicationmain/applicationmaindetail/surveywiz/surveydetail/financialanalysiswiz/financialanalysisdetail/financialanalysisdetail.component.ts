import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../../../base.component';
import { DALService } from '../../../../../../../../../DALservice.service';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './financialanalysisdetail.component.html'
})

export class FinancialanalysisdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');
  pageType = this.getRouteparam.snapshot.paramMap.get('page');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public financialanalysisdetailData: any = [];
  public isReadOnly: Boolean = false;
  private dataTamp: any = [];

  private APIController: String = 'ApplicationFinancialAnalysis';

  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForUpdate: String = 'UPDATE';

  private RoleAccessCode = 'R00019900000000A'; // role access 

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
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    if (this.params != null) {
      this.wizard();
      $('#tabapplicationFinancialIncome .nav-link').addClass('active');
      this.incomewiz();
      this.isReadOnly = true;
      // call web service
      this.callGetrow();
    } else {
      this.showSpinner = false;
      this.model.dsr_pct = 0;
      this.model.idir_pct = 0;
      this.model.dbr_pct = 0;
      this.model.periode_month = '01';
    }
  }

  //#region getrow data
  callGetrow() {
     
    this.dataTamp = [{
      'p_code': this.params
    }];
    
    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];

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

  //#region  form submit
  onFormSubmit(financialanalysisdetailForm: NgForm, isValid: boolean) {
    // validation form submit
    if (!isValid) {
      swal({
        title: 'Warning',
        text: 'Please Fill a Mandatory Field OR Format Is Invalid',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-warning',
        type: 'warning'
      }).catch(swal.noop)
      return;
    } else {
      this.showSpinner = true;
    }

    this.financialanalysisdetailData = financialanalysisdetailForm;
    const usersJson: any[] = Array.of(this.financialanalysisdetailData);
    if (this.params != null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showSpinner = false;
              $('#applicationDetail').click();
              this.callGetrow();
              this.showNotification('bottom', 'right', 'success');
            } else {
              this.showSpinner = false;
              this.swalPopUpMsg(parse.data);
            }
          },
          error => {
            this.showSpinner = false;
            const parse = JSON.parse(error);
            this.swalPopUpMsg(parse.data);
          });
    } else {
      // call web service
      this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showSpinner = false;
              $('#applicationDetail').click();
              this.showNotification('bottom', 'right', 'success');
              this.route.navigate(['/application/subapplicationmainlist/applicationmaindetail/' + this.param + '/surveydetail/' + this.param + '/financialanalysisdetail/', this.param, parse.code], { skipLocationChange: true });
            } else {
              this.showSpinner = false;
              this.swalPopUpMsg(parse.data);
            }
          },
          error => {
            this.showSpinner = false;
            const parse = JSON.parse(error);
            this.swalPopUpMsg(parse.data);
          });
    }
  }
  //#endregion form submit

  //#region button back
  btnBack() {
    if (this.pageType != null) {
      this.route.navigate(['/application/banberjalanapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/surveydetail/' + this.param + '/' + 'banberjalan' + '/financialanalysislist/', this.param, 'banberjalan'], { skipLocationChange: true });
    } else {
      this.route.navigate(['/application/subapplicationmainlist/applicationmaindetail/' + this.param + '/surveydetail/' + this.param + '/financialanalysislist/', this.param], { skipLocationChange: true });
    }
    $('#datatableApplicationFinancialAnalysis').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region List tabs
  incomewiz() {
    if (this.pageType != null) {
      this.route.navigate(['/application/banberjalanapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/surveydetail/' + this.param + '/' + 'banberjalan' + '/financialanalysislist/' + this.param + '/' + this.params + '/' + 'banberjalan' + '/incomelist/', this.params, 'banberjalan'], { skipLocationChange: true });
    } else {
      this.route.navigate(['/application/subapplicationmainlist/applicationmaindetail/' + this.param + '/surveydetail/' + this.param + '/financialanalysisdetail/' + this.param + '/' + this.params + '/incomelist/', this.params], { skipLocationChange: true });
    }
  }

  expensewiz() {
    if (this.pageType != null) {
      this.route.navigate(['/application/banberjalanapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/surveydetail/' + this.param + '/' + 'banberjalan' + '/financialanalysislist/' + this.param + '/' + this.params + '/' + 'banberjalan' + '/expenselist/', this.params, 'banberjalan'], { skipLocationChange: true });
    } else {
      this.route.navigate(['/application/subapplicationmainlist/applicationmaindetail/' + this.param + '/surveydetail/' + this.param + '/financialanalysisdetail/' + this.param + '/' + this.params + '/expenselist/', this.params], { skipLocationChange: true });
    }
  }
  //#endregion List tabs
}