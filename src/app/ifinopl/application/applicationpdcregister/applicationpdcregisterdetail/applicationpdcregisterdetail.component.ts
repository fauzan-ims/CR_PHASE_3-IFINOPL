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
  templateUrl: './applicationpdcregisterdetail.component.html'
})

export class ApplicationPdcRegisterdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  pageType = this.getRouteparam.snapshot.paramMap.get('page');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public isApproval: Boolean = false;
  public isReadOnly: Boolean = false;
  private dataTamp: any = [];
  public setStyle: any = [];

  private APIController: String = 'ApplicationMain';

  private APIRouteForGetRow: String = 'GETROW';

  private RoleAccessCode = 'R00015590000000A'; // role access 

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
    public route: Router,
    private _elementRef: ElementRef
  ) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.Delimiter(this._elementRef);
    this.isReadOnly = true;
    this.wizard();
    this.pdcregisterdetailwiz();

    // call web service
    this.callGetrow();
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
      'p_application_no': this.param
    }];
    
    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          if (parsedata.is_blacklist_area === '1') {
            parsedata.is_blacklist_area = true;
          } else {
            parsedata.is_blacklist_area = false;
          }

          if (parsedata.is_blacklist_job === '1') {
            parsedata.is_blacklist_job = true;
          } else {
            parsedata.is_blacklist_job = false;
          }

          if (parsedata.is_approval === '1') {
            this.isApproval = true;
          }
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
    this.route.navigate(['/application/subapplicationpdclist']);
    $('#datatableApplicationPdcRegisterList').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region List tabs
  pdcregisterdetailwiz() {
    this.route.navigate(['/application/subapplicationpdclist/applicationpdcregisterdetail/' + this.param + '/pdcregisterdetaillist', this.param], { skipLocationChange: true });
  }

  amortizationwiz() {
    this.route.navigate(['/application/subapplicationpdclist/applicationpdcregisterdetail/' + this.param + '/amortizationpdclist', this.param], { skipLocationChange: true });
  }
  //#endregion List tabs
}