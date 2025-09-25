import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../../../base.component';
import { DALService } from '../../../../../../../../../DALservice.service';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './administrationdetail.component.html'
})

export class ObjectInfoAdministrationdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');
  pageType = this.getRouteparam.snapshot.paramMap.get('page');

  private dataTamp: any = [];

  private APIControllerApplicationMain: String = 'ApplicationMain';

  private APIRouteForGetRow: String = 'GetRow';

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
    this.callGetrowApplicationMain();
  }

  //#region callGetrowApplicationMain
  callGetrowApplicationMain() {

    this.dataTamp = [{
      'p_application_no': this.param
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIControllerApplicationMain, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];

          if (parsedata.is_simulation === '1') {
            $('#tabapplicationDocumentDocument').remove();
          }

          setTimeout(() => {
            this.wizard();
            $('#tabapplicationFeeChargesCharges .nav-link').addClass('active');
            this.chargeswiz();
          }, 200);

          this.showSpinner = false;
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
  }
  //#endregion callGetrowApplicationMain

  //#region List tabs
  // feewiz() {
  //   this.route.navigate(['/inquiry/inquiryapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/administrationdetail/' + this.param + '/' + 'banberjalan' + '/feelist/', this.param, 'banberjalan'], { skipLocationChange: true });
  // }

  chargeswiz() {
    this.route.navigate(['/objectinfoapplication/objectinfoapplicationmain/' + this.param + '/' + this.pageType + '/administrationdetail/' + this.param + '/' + 'banberjalan' + '/chargeslist/', this.param, 'banberjalan'], { skipLocationChange: true });
  }

  documentwiz() {
    this.route.navigate(['/objectinfoapplication/objectinfoapplicationmain/' + this.param + '/' + this.pageType + '/administrationdetail/' + this.param + '/' + this.pageType + '/doclist/', this.param, this.pageType], { skipLocationChange: true });
  }
  //#endregion List tabs
}
