import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../../base.component';
import { DALService } from '../../../../../../../../DALservice.service';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './bankbookdetail.component.html'
})

export class BankbookdetailComponent extends BaseComponent implements OnInit {
  // get param from url

  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');
  type = this.getRouteparam.snapshot.paramMap.get('type');
  from = this.getRouteparam.snapshot.paramMap.get('from');
  page = this.getRouteparam.snapshot.paramMap.get('page');
  paramss = this.getRouteparam.snapshot.paramMap.get('id3');
  paramsss = this.getRouteparam.snapshot.paramMap.get('id4');

  // variable
  public plafond_status: String;
  public NumberOnlyPattern = this._numberonlyformat;
  public bankbookdetailData: any = [];
  public isReadOnly: Boolean = false;
  private rolecode: any = [];
  public periode_month = String;
  private dataRoleTamp: any = [];
  private dataTamp: any = [];
  private APIController: String = 'ClientBankBook';
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForGetRole: String = 'ExecSpForGetRole';
  private RoleAccessCode = 'R00022550000010A';

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
    this.plafond_status = $('#plafondStatus').val();
    this.Delimiter(this._elementRef);
    if (this.paramsss != null) {
      this.isReadOnly = true;

      // call web service
      this.callGetrow();
    } else {
      this.model.opening_balance_amount = 0;
      this.model.freq_debet_mutation = 0;
      this.model.highest_balance_amount = 0;
      this.model.total_db_mutation_amount = 0;
      this.model.freq_credit_mutation = 0;
      this.model.average_balance_amount = 0;
      this.model.total_cr_mutation_amount = 0;
      this.model.average_db_mutation_amount = 0;
      this.model.lowest_balance_amount = 0;
      this.model.ending_balance_amount = 0;
      this.model.average_cr_mutation_amount = 0;
      this.model.showSpinner = false;
      this.model.periode_month = '01';
    }
  }

  //#region getrow data
  callGetrow() {
     
    this.dataTamp = [{
      'p_id': this.paramsss
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
          console.log('There was an error while Retrieving Data(API) !!!' + error);
        });
  }
  //#endregion getrow data

  //#region form submit
  onFormSubmit(bankbookdetailForm: NgForm, isValid: boolean) {
    // validation form submit
    if (!isValid) {
      swal({
        allowOutsideClick: false,
        title: 'Warning!',
        text: 'Please Fill a Mandatory Field OR Format Is Invalid!!',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-warning',
        type: 'warning'
      }).catch(swal.noop)
      return;
    } else {
      this.showSpinner = false;
    }

    this.bankbookdetailData = this.JSToNumberFloats(bankbookdetailForm);
    const usersJson: any[] = Array.of(this.bankbookdetailData);
    if (this.paramsss != null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
        .subscribe(
          res => {
            this.showSpinner = false;
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              $('#clientDetail').click();
              this.callGetrow();
              this.showNotification('bottom', 'right', 'success');
            } else {
              this.swalPopUpMsg(parse.data);
            }
          },
          error => {
            this.showSpinner = false;
            const parse = JSON.parse(error);
            this.swalPopUpMsg(parse.data)
          });
    } else {
      // call web service
      this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
        .subscribe(
          res => {
            this.showSpinner = false;
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              $('#clientDetail').click();
              this.showNotification('bottom', 'right', 'success');
              this.route.navigate(['/client/subclientpersonallist/clientpersonaldetail/' + this.param + '/' + this.params + '/' + this.type + '/' + this.from + '/' + this.page + '/bankbookdetail', this.param, this.params, this.type, this.from, this.page, this.paramss, parse.id], { skipLocationChange: true });
            } else {
              this.swalPopUpMsg(parse.data);
            }
          },
          error => {
            this.showSpinner = false;
            const parse = JSON.parse(error);
            this.swalPopUpMsg(parse.data)
          });
    }
  }
  //#endregion form submit

  //#region button back
  btnBack() {
    this.route.navigate(['/client/subclientpersonallist/clientpersonaldetail/' + this.param + '/' + this.params + '/' + this.type + '/' + this.from + '/' + this.page + '/clientbankdetail', this.param, this.params, this.type, this.from, this.page, this.paramss], { skipLocationChange: true });
    $('#datatableClientBankBook').DataTable().ajax.reload();
  }
  //#endregion button back

}
