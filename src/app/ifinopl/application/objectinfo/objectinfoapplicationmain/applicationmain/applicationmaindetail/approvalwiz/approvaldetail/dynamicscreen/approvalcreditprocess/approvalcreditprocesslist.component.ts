import { Component, OnInit, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { BaseComponent } from '../../../../../../../../../../../base.component';
import { DataTableDirective } from 'angular-datatables';
import { DALService } from '../../../../../../../../../../../DALservice.service';

@Component({
  selector: 'app-approvalcreditprocesslist',
  templateUrl: './approvalcreditprocesslist.component.html'
})
export class ObjectInfoApprovalcreditprocesslistComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  pageType = this.getRouteparam.snapshot.paramMap.get('page');

  // variable
  public creditprocesslistData: any = [];
  public isReadOnly: Boolean = false;
  private rolecode: any = [];
  private dataTamp: any = [];

  private APIController: String = 'WorkflowInputResult';

  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForInsert: String = 'Insert';

  private RoleAccessCode = 'R00022400000000A'; // role access 

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
    
    this.isReadOnly = true;
    // call web service
    this.callGetrow();
    this.model.flow_type = 'APPLICATION';
    this.model.recommendation_status = 'RECOMMEND';
    this.model.employee_name = this.uid;
    this.showSpinner = false;
  }

  //#region getrow data
  callGetrow() {

    this.dataTamp = [{
      'p_reff_code': this.param
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
  onFormSubmit(creditprocesslistForm: NgForm, isValid: boolean) {
    console.log(creditprocesslistForm);

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

    this.creditprocesslistData = creditprocesslistForm;

    const usersJson: any[] = Array.of(this.creditprocesslistData);
    // call web service
    this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
      .subscribe(
        res => {
          this.showSpinner = false;
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.showNotification('bottom', 'right', 'success');
            this.callGetrow();
          } else {
            this.swalPopUpMsg(parse.data);
          }
        },
        error => {
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
  }
  //#endregion form submit 
}
