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
  templateUrl: './notarydetail.component.html'
})

export class NotarydetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');
  branch = this.getRouteparam.snapshot.paramMap.get('branch');
  pageType = this.getRouteparam.snapshot.paramMap.get('page');

  // variable
  public notarydetailData: any = [];
  public isReadOnly: Boolean = false;
  public lookupnotaryservice: any = [];
  private dataTamp: any = [];

  private APIController: String = 'ApplicationNotary';
  private APIControllerApplicationMain: String = 'ApplicationMain';
  private APIControllerMasterNotaryService: String = 'MasterNotaryService';
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForLookup: String = 'GetRowsForLookupActive';

  private RoleAccessCode = 'R00022400000000A'; // role access 

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
    this.callGetrowApplication()
    this.Delimiter(this._elementRef);
    if (this.params != null) {
      this.isReadOnly = true;

      // call web service
      this.callGetrow();
    } else {
      this.showSpinner = false;
    }
  }

  //#region getrow data
  callGetrowApplication() {

    this.dataTamp = [{
      'p_application_no': this.param
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIControllerApplicationMain, this.APIRouteForGetRow)
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

  //#region getrow data
  callGetrow() {

    this.dataTamp = [{
      'p_application_no': this.param,
      'p_id': this.params
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
  onFormSubmit(notarydetailForm: NgForm, isValid: boolean) {
    // validation form submit
    if (!isValid) {
      swal({
        allowOutsideClick: false,
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

    this.notarydetailData = this.JSToNumberFloats(notarydetailForm);
    const usersJson: any[] = Array.of(this.notarydetailData);
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
            this.swalPopUpMsg(parse.data)
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
              this.route.navigate(['/inquiry/subapplicationmainlist/applicationmaindetail/' + this.param + '/legaldetail/' + this.param + '/' + this.branch + '/notarydetail/', this.param, parse.id, this.branch], { skipLocationChange: true });
            } else {
              this.showSpinner = false;
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
    this.route.navigate(['/inquiry/inquiryapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/legaldetail/' + this.param + '/' + this.branch + '/' + 'banberjalan' + '/notarylist/', this.param, this.branch, 'banberjalan'], { skipLocationChange: true });
    $('#datatableApplicationNotary').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region NotaryService Lookup
  btnLookupNotaryService() {
    $('#datatableLookupNotaryService').DataTable().clear().destroy();
    $('#datatableLookupNotaryService').DataTable({
      'pagingType': 'first_last_numbers',
      'pageLength': 5,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false
      ajax: (dtParameters: any, callback) => {

        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_branch_code': this.model.branch_code,
          'p_is_agreement': '1',
          'p_is_fiducia': '0',
          'p_currency_code': this.model.currency_code,
          'p_base_amount': this.model.financing_amount
        });

        this.dalservice.GetrowsLgl(dtParameters, this.APIControllerMasterNotaryService, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupnotaryservice = parse.data;
          if (parse.data != null) {
            this.lookupnotaryservice.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 4] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowNotaryService(code: String, service_name: String, notary_fee_amount: any, fee_bnbp_amount: any, fee_admin_amount: any) {
    this.model.notary_service_code = code;
    this.model.notary_service_name = service_name;
    this.model.notary_fee_amount = notary_fee_amount * 1;
    this.model.fee_admin_amount = fee_admin_amount * 1;
    this.model.fee_bnbp_amount = fee_bnbp_amount * 1;
    this.model.total_notary_amount = this.model.fee_admin_amount + this.model.fee_bnbp_amount + this.model.notary_fee_amount;
    $('#lookupModalNotaryService').modal('hide');
  }
  //#endregion NotaryService lookup
}