import { Component, OnInit, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { BaseComponent } from '../../../../../../../../../base.component';
import { DataTableDirective } from 'angular-datatables';
import { DALService } from '../../../../../../../../../DALservice.service';

@Component({
  selector: 'app-approvalpurchaseorderlist',
  templateUrl: './approvalpurchaseorderlist.component.html'
})
export class ApprovalpurchaseorderlistComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  pageType = this.getRouteparam.snapshot.paramMap.get('page');

  // variable
  public purchaseorderlistData: any = [];
  public isReadOnly: Boolean = false; 
  private dataTamp: any = []; 
  private APIController: String = 'WorkflowInputResult';
  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForInsert: String = 'Insert'; 

  private RoleAccessCode = 'R00020690000010A'; // role access 
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
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route); 
    this.isReadOnly = true;
    this.Delimiter(this._elementRef);
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
  onFormSubmit(purchaseorderlistForm: NgForm, isValid: boolean) {

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

    this.purchaseorderlistData = purchaseorderlistForm;

    const usersJson: any[] = Array.of(this.purchaseorderlistData);
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

  //#region button back
  btnBack() {
    this.route.navigate(['/setting/subdocumentlist']);
  }
  //#endregion button back

   
}
