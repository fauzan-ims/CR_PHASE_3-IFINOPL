import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { DALService } from '../../../../../../../DALservice.service';
import { BaseComponent } from '../../../../../../../base.component';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './legaldetail.component.html'
})

export class LegaldetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  pageType = this.getRouteparam.snapshot.paramMap.get('page');
  branch = this.getRouteparam.snapshot.paramMap.get('branch');

  // variable 
  private dataTamp: any = [];

  private APIControllerApplicationMain: String = 'ApplicationMain';

  private APIRouteForGetRow: String = 'GetRow';

  private RoleAccessCode = 'R00019900000000A';

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = false;
  // end

  // datatable
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  constructor(private dalservice: DALService,
    public getRouteparam: ActivatedRoute,
    public route: Router
  ) { super(); }

  ngOnInit() {
    this.callGetrow();
    this.guarantorwiz();
  }

  //#region getrow data
  callGetrow() {
    this.dataTamp = [{
      'p_application_no': this.param
    }];
    this.dalservice.Getrow(this.dataTamp, this.APIControllerApplicationMain, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          this.wizard();
          $('#tabapplicationLegalGuarantor .nav-link').addClass('active');

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
  guarantorwiz() {
    if (this.pageType != null) {
      this.route.navigate(['/application/banberjalanapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/legaldetail/' + this.param + '/' + this.branch + '/' + 'banberjalan' + '/guarantorlist/', this.param, 'banberjalan'], { skipLocationChange: true });
    } else {
      this.route.navigate(['/application/subapplicationmainlist/applicationmaindetail/' + this.param + '/legaldetail/' + this.param + '/' + this.branch + '/guarantorlist/', this.param], { skipLocationChange: true });
    }
  }

  notarywiz() {
    if (this.pageType != null) {
      this.route.navigate(['/application/banberjalanapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/legaldetail/' + this.param + '/' + this.branch + '/' + 'banberjalan' + '/notarylist/', this.param, this.branch, 'banberjalan'], { skipLocationChange: true });
    } else {
      this.route.navigate(['/application/subapplicationmainlist/applicationmaindetail/' + this.param + '/legaldetail/' + this.param + '/' + this.branch + '/notarylist/', this.param, this.branch], { skipLocationChange: true });
    }
  }
  //#endregion List tabs
}
