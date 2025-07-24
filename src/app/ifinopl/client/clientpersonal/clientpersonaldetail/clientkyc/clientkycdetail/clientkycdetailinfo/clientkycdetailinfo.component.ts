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
  templateUrl: './clientkycdetailinfo.component.html'
})

export class ClientkycdetailinfoComponent extends BaseComponent implements OnInit {
  // get param from url

  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');
  paramss = this.getRouteparam.snapshot.paramMap.get('id3');
  type = this.getRouteparam.snapshot.paramMap.get('type');
  from = this.getRouteparam.snapshot.paramMap.get('from');
  page = this.getRouteparam.snapshot.paramMap.get('page');

  // variable
  public plafond_status: String;
  public NumberOnlyPattern = this._numberonlyformat;
  public clientkycdetailinfoData: any = [];
  public isReadOnly: Boolean = false;
  public periode_month = String;
  private dataTamp: any = [];

  private APIController: String = 'ClientKycDetail';

  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForUpdate: String = 'UPDATE';

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
    this.isReadOnly = true;

    // call web service
    this.callGetrow();
  }

  //#region getrow data
  callGetrow() {
     
    this.dataTamp = [{
      'p_id': this.paramss
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
  onFormSubmit(clientkycdetailinfoForm: NgForm, isValid: boolean) {
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
      this.showSpinner = true;
    }

    this.clientkycdetailinfoData = this.JSToNumberFloats(clientkycdetailinfoForm);
    const usersJson: any[] = Array.of(this.clientkycdetailinfoData);
    // call web service
    this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            $('#clientDetail').click();
            this.callGetrow();
            this.showNotification('bottom', 'right', 'success');
            this.showSpinner = false;
          } else {
            this.swalPopUpMsg(parse.data);
            this.showSpinner = false;
          }
        },
        error => {
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data)
          this.showSpinner = false;
        });
  }
  //#endregion form submit

  //#region button back
  btnBack() {
    this.route.navigate(['/client/subclientpersonallist/clientpersonaldetail/' + this.param + '/' + this.params + '/' + this.type + '/' + this.from + '/' + this.page + '/clientkycdetail', this.param, this.params, this.type, this.from, this.page], { skipLocationChange: true });
    $('#datatableClientkyc').DataTable().ajax.reload();
  }
  //#endregion button back

}
