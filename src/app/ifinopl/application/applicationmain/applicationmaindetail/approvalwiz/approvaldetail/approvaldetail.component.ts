import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import { DALService } from '../../../../../../../DALservice.service';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './approvaldetail.component.html'
})

export class ApprovaldetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  levelStatus = this.getRouteparam.snapshot.paramMap.get('status');
  pageType = this.getRouteparam.snapshot.paramMap.get('page');

  // variable
  private dataTamp: any = [];
  private APIController: String = 'MasterWorkflow';
  private APIRouteForGetRow: String = 'GETROW';

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

  constructor(private dalservice: DALService, public getRouteparam: ActivatedRoute, public route: Router) { super(); }

  ngOnInit() {
    if ($('#levelStatus').val() === 'ENTRY') {
      $('#tabapplicationApprovalDynamicScreens').hide();
    }
    this.wizard();
    $('#tabapplicationApprovalLog .nav-link').addClass('active');
    this.logwiz();
    this.callGetrow();
  }

  //#region getrow data
  callGetrow() {
     
    this.dataTamp = [{
      'p_code': this.levelStatus
    }];
    
    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];

          // this.dynamicscreen();

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

  //#region List tabs
  deviationwiz() {
    if (this.pageType != null) {
      this.route.navigate(['/application/banberjalanapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/approvaldetail/' + this.param + '/' + this.levelStatus + '/' + 'banberjalan' + '/deviationlist/', this.param, 'banberjalan'], { skipLocationChange: true });
    } else {
      this.route.navigate(['/application/subapplicationmainlist/applicationmaindetail/' + this.param + '/approvaldetail/' + this.param + '/' + this.levelStatus + '/deviationlist/', this.param], { skipLocationChange: true });
    }
  }

  approvalcommentwiz() {
    if (this.pageType != null) {
      this.route.navigate(['/application/banberjalanapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/approvaldetail/' + this.param + '/' + this.levelStatus + '/' + 'banberjalan' + '/approvalcommentlist/', this.param, 'banberjalan'], { skipLocationChange: true });
    } else {
      this.route.navigate(['/application/subapplicationmainlist/applicationmaindetail/' + this.param + '/approvaldetail/' + this.param + '/' + this.levelStatus + '/approvalcommentlist/', this.param], { skipLocationChange: true });
    }
  }

  // recomendationwiz() {
  //   if (this.pageType != null) {
  //     this.route.navigate(['/application/banberjalanapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/approvaldetail/' + this.param + '/' + this.levelStatus + '/' + 'banberjalan' + '/recomendationlist/', this.param, 'banberjalan'], { skipLocationChange: true });
  //   } else {
  //     this.route.navigate(['/application/subapplicationmainlist/applicationmaindetail/' + this.param + '/approvaldetail/' + this.param + '/' + this.levelStatus + '/recomendationlist/', this.param], { skipLocationChange: true });
  //   }
  // }

  rulesresultwiz() {
    if (this.pageType != null) {
      this.route.navigate(['/application/banberjalanapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/approvaldetail/' + this.param + '/' + this.levelStatus + '/' + 'banberjalan' + '/rulesresultlist/', this.param, 'banberjalan'], { skipLocationChange: true });
    } else {
      this.route.navigate(['/application/subapplicationmainlist/applicationmaindetail/' + this.param + '/approvaldetail/' + this.param + '/' + this.levelStatus + '/rulesresultlist/', this.param], { skipLocationChange: true });
    }
  }

  logwiz() {
    if (this.pageType != null) {
      this.route.navigate(['/application/banberjalanapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/approvaldetail/' + this.param + '/' + this.levelStatus + '/' + 'banberjalan' + '/loglist/', this.param, 'banberjalan'], { skipLocationChange: true });
    } else {
      this.route.navigate(['/application/subapplicationmainlist/applicationmaindetail/' + this.param + '/approvaldetail/' + this.param + '/' + this.levelStatus + '/loglist/', this.param], { skipLocationChange: true });
    }
  }

  // dynamicscreen() {
  //   this.route.navigate(['/application/banberjalanapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/approvaldetail/' + this.param + '/' + this.levelStatus + '/banberjalan/' + this.model.screen_name + '/', this.param], { skipLocationChange: true });
  // }
  //#endregion List tabs
}
