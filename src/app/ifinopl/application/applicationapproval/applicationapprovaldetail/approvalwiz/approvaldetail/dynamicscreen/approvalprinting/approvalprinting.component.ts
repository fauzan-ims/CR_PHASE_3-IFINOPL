import { Component, OnInit, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { BaseComponent } from '../../../../../../../../../base.component';
import { DataTableDirective } from 'angular-datatables';
import { DALService } from '../../../../../../../../../DALservice.service';

@Component({
  selector: 'app-approvalprinting',
  templateUrl: './approvalprinting.component.html'
})
export class ApprovalprintingComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public printingData: any = [];
  public isReadOnly: Boolean = false;
  private dataTamp: any = [];
  public setStyle: any = [];

  private APIController: String = 'ApplicationMain';

  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForUpdateAgreementDate: String = 'UpdateAgreementDate';
  private RoleAccessCode = 'R00020690000010A';

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
    private _elementRef: ElementRef
  ) { super(); }

  ngOnInit() {
    // this.callGetRole(this.userId);
    this.isReadOnly = true;
    // call web service
    this.callGetrow();
    this.showSpinner = false;
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
  onFormSubmit(printingForm: NgForm, isValid: boolean) {
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

    this.printingData = this.JSToNumberFloats(printingForm);

    const usersJson: any[] = Array.of(this.printingData);
    // call web service
    this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdateAgreementDate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.showSpinner = false;
            $('#applicationDetail').click();
            this.showNotification('bottom', 'right', 'success');
            this.callGetrow();
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
  //#endregion form submit 
}
