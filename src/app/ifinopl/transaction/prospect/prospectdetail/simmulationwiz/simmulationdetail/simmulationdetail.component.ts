import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import { DALService } from '../../../../../../../DALservice.service';
import { DatePipe } from '@angular/common';
import { data } from 'jquery';
import { parseLazyRoute } from '@angular/compiler/src/aot/lazy_routes';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './simmulationdetail.component.html'
})

export class SimmulationdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');
  pageType = this.getRouteparam.snapshot.paramMap.get('page');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public EmailPattern = this._emailformat;
  public simmulationData: any = [];
  public isReadOnly: Boolean = false;
  public isStatus: Boolean = false;
  public isDate: Boolean = false;
  public lookupgeneralsubcode: any = [];
  public lookuppaymenttype: any = [];
  private asset_value_amount: any = 0;
  private dp_pct: any = 0;
  private dp_amount: any = 0;
  private admin_amount: any = 0;
  private provision_amount: any = 0;
  private insurance_amount: any = 0;
  private other_fee_amount: any = 0;
  private financing_amount: any = 0;
  public total_amount: any = [];
  public installmentAmount: any = [];
  public tdpAmount: any = [];
  public tdp_amount: any = [];
  public installment_amount: any = [];
  private dataTamp: any = [];
  private dataRoleTamp: any = [];
  private APIController: String = 'ProspectSimmulation';
  private APIControllerSysGeneralSubcode: String = 'SysGeneralSubcode';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForUpdate: String = 'Update';
  private APIRouteForInsert: String = 'Insert';
  private APIRouteForPost: String = 'ExecSpForPost';
  private APIRouteForCancel: String = 'ExecSpForCancel';
  private RoleAccessCode = 'R00002650000266A';

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = true;
  // end

  // datatable
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  setStyle: { 'pointer-events': string; };

  constructor(private dalservice: DALService,
    public getRouteparam: ActivatedRoute,
    public route: Router,
    private _elementRef: ElementRef
  ) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.Delimiter(this._elementRef)
    if (this.params != null) {
      this.isReadOnly = true;
      this.wizard();

      // call web service
      this.callGetrow();
    } else {
      this.model.capitalize_amount = 0;
      this.model.asset_value_amount = 0;
      this.model.dp_pct = 0;
      this.model.tdp_amount = 0;
      this.model.installment_amount = 0;
      this.model.financing_amount = 0;
      this.model.dp_amount = 0;
      this.model.other_fee_amount = 0;
      this.model.insurance_amount = 0;
      this.model.provision_amount = 0;
      this.model.total_amount = 0;
      this.model.admin_amount = 0;
      this.model.flat_rate = 0;
      this.model.eff_rate = 0;

      this.model.interest_rate_type = 'FLAT';
      this.model.first_payment_type = 'ADV';
      this.model.simulation_status = 'ON PROCESS';
      this.showSpinner = false;
    }
  }

  //#region getrow data
  callGetrow() {

    this.dataTamp = [{
      'p_id': this.params,
    }];
    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          if (parsedata.date == '1') {
            this.isDate = true;
          }
          else {
            this.isDate = false;
          }

          if (parsedata.simmulation_status !== 'ON PROCESS') {
            this.isStatus = true;
          }
          else {
            this.isStatus = false;
          }

          // level 1
          this.asset_value_amount = parsedata.asset_value_amount;
          this.dp_pct = parsedata.dp_pct;
          this.dp_amount = parsedata.dp_amount;

          // level 2
          this.admin_amount = parsedata.admin_amount;
          this.provision_amount = parsedata.provision_amount;
          this.insurance_amount = parsedata.insurance_amount;
          this.other_fee_amount = parsedata.other_fee_amount;

          // level 3
          this.tdp_amount = parsedata.tdp_amount;
          this.installment_amount = parsedata.installment_amount;
          this.model.total_amount = parsedata.installment_amount + parsedata.tdp_amount;

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

  //#region Tenor
  Tenor(event) {
    this.model.tenor = event.target.value;
  }
  //#endregion Tenor

  //#region form submit
  onFormSubmit(simmulationForm: NgForm, isValid: boolean) {
    // validation form submit
    if (!isValid) {
      swal({
        title: 'Warning',
        text: 'Please Fill a Mandatory Field OR Format Is Invalid',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-danger',
        type: 'warning'
      }).catch(swal.noop)
      return;
    } else {
      this.showSpinner = true;
    }

    this.simmulationData = this.JSToNumberFloats(simmulationForm);

    if (this.simmulationData.p_first_date === '' || this.simmulationData.p_first_date == null) {
      this.simmulationData.p_first_date = undefined;
    }

    if (this.simmulationData.p_last_date === '' || this.simmulationData.p_last_date == null) {
      this.simmulationData.p_last_date = undefined;
    }

    if (this.simmulationData.p_eff_rate === '' || this.simmulationData.p_eff_rate == null) {
      this.simmulationData.p_eff_rate = 0;
    }

    if (this.simmulationData.p_flat_rate === '' || this.simmulationData.p_flat_rate == null) {
      this.simmulationData.p_flat_rate = 0;
    }

    const usersJson: any[] = Array.of(this.simmulationData);
    if (this.params != null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
        .subscribe(
          res => {
            this.showSpinner = false;
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.callGetrow();
              this.showNotification('bottom', 'right', 'success');
            } else {
              this.swalPopUpMsg(parse.data);
            }
          },
          error => {
            this.showSpinner = false;
            const parse = JSON.parse(error);
            this.swalPopUpMsg(parse.data);
          });
    } else {
      // call web service
      this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
        .subscribe(
          res => {
            this.showSpinner = false;
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showNotification('bottom', 'right', 'success');
              this.route.navigate(['/transaction/subprospectlist/prospectdetail/' + this.param + '/simmulationlist/' + this.param + '/simmulationdetail', this.param, parse.id], { skipLocationChange: true });
            } else {
              this.swalPopUpMsg(parse.data);
            }
          },
          error => {
            this.showSpinner = false;
            const parse = JSON.parse(error);
            this.swalPopUpMsg(parse.data);
          });
    }
  }
  //#endregion form submit

  //#region assetValue
  assetValue(event: any) {
    this.asset_value_amount = event.target.value * 1;
    this.model.dp_amount = this.asset_value_amount * (this.model.dp_pct / 100);
    this.model.financing_amount = this.asset_value_amount - (this.model.dp_amount * 1);
  }
  //#endregion assetValue

  //#region dpPct
  dpPct(event: any) {
    this.dp_pct = event.target.value * 1;
    this.model.dp_amount = this.asset_value_amount * (this.dp_pct / 100);
    this.model.financing_amount = this.asset_value_amount - (this.model.dp_amount * 1);
  }
  //#endregion dpPct

  //#region dpAmount
  dpAmount(event: any) {
    this.dp_amount = event.target.value * 1;
    this.model.dp_pct = ((this.dp_amount / this.asset_value_amount) * 100);
    this.model.financing_amount = this.asset_value_amount - this.dp_amount;
  }
  //#endregion dpAmount

  //#region AdminAmount
  AdminAmount(event: any) {
    this.admin_amount = event.target.value * 1;
    this.model.tdp_amount = this.admin_amount + this.provision_amount + this.insurance_amount + this.other_fee_amount;
    this.model.total_amount = this.model.installment_amount + this.model.tdp_amount;
  }
  //#endregion AdminAmount

  //#region ProvisionAmount
  ProvisionAmount(event: any) {
    this.provision_amount = event.target.value * 1;
    this.model.tdp_amount = this.provision_amount + this.admin_amount + this.insurance_amount + this.other_fee_amount;
    this.model.total_amount = this.model.installment_amount + this.model.tdp_amount;
  }
  //#endregion ProvisionAmount

  //#region InsuranceAmount
  InsuranceAmount(event: any) {
    this.insurance_amount = event.target.value * 1;
    this.model.tdp_amount = this.provision_amount + this.admin_amount + this.insurance_amount + this.other_fee_amount;
    this.model.total_amount = this.model.installment_amount + this.model.tdp_amount;
  }
  //#endregion InsuranceAmount

  //#region OtherFeeAmount
  OtherFeeAmount(event: any) {
    this.other_fee_amount = event.target.value * 1;
    this.model.tdp_amount = this.provision_amount + this.admin_amount + this.insurance_amount + this.other_fee_amount;
    this.model.total_amount = this.model.installment_amount + this.model.tdp_amount;
  }
  //#endregion OtherFeeAmount

  //#region totalAmount
  totalAmount(event: any) {
    this.total_amount = event.target.value;
    this.model.total_amount = this.installment_amount + this.tdp_amount;
  }
  //#endregion totalAmount

  //#region button back
  btnBack() {
    this.route.navigate(['/transaction/subprospectlist/prospectdetail/' + this.param + '/simmulationlist', this.param], { skipLocationChange: true });
    $('#datatableSimmulationWiz').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region button Cancel
  btnCancel(id: string) {
    // param tambahan untuk button Cancel dynamic
    this.dataRoleTamp = [{
      'p_id': id,
      'action': ''
    }];
    // param tambahan untuk button Cancel dynamic

    swal({
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: this._deleteconf,

      buttonsStyling: false
    }).then((result) => {
      this.showSpinner = true;
      if (result.value) {
        // call web service
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForCancel)
          .subscribe(
            res => {
              this.showSpinner = false;
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.callGetrow();
                this.showNotification('bottom', 'right', 'success');
              } else {
                this.swalPopUpMsg(parse.data)
              }
            },
            error => {
              this.showSpinner = false;
              const parse = JSON.parse(error);
              this.swalPopUpMsg(parse.data);
            });
      } else {
        this.showSpinner = false;
      }
    });
  }
  //#endregion button Cancel

  //#region button Post
  btnPost(id: string) {
    // param tambahan untuk button Post dynamic
    this.dataRoleTamp = [{
      'p_id': id,
      'action': ''
    }];
    // param tambahan untuk button Post dynamic

    swal({
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: this._deleteconf,

      buttonsStyling: false
    }).then((result) => {
      this.showSpinner = true;
      if (result.value) {
        // call web service
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForPost)
          .subscribe(
            res => {
              this.showSpinner = false;
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.callGetrow();
                this.showNotification('bottom', 'right', 'success');
                this.route.navigate(['/transaction/subprospectlist']);
                $('#datatable').DataTable().ajax.reload();
                // $('#prospectDetail', parent.parent.document).click();
              } else {
                this.swalPopUpMsg(parse.data)
              }
            },
            error => {
              this.showSpinner = false;
              const parse = JSON.parse(error);
              this.swalPopUpMsg(parse.data);
            });
      } else {
        this.showSpinner = false;
      }
    });
  }
  //#endregion button Post

  //#region general subcode Lookup
  btnLookupGeneralSubcode() {
    $('#datatableLookupGeneralSubcode').DataTable().clear().destroy();
    $('#datatableLookupGeneralSubcode').DataTable({
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
          'p_general_code': 'PDTYP'
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerSysGeneralSubcode, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupgeneralsubcode = parse.data;

          if (parse.data != null) {
            this.lookupgeneralsubcode.numberIndex = dtParameters.start;
          }

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [1, 4] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }
  btnSelectRowGeneralSubcode(code: String, description: String) {
    this.model.object_type = code;
    this.model.description = description;
    $('#lookupModalGeneralSubcode').modal('hide');
  }
  //#endregion general subcode lookup

  //#region general subcode Lookup
  btnLookupPaymentType() {
    $('#datatableLookupPaymentType').DataTable().clear().destroy();
    $('#datatableLookupPaymentType').DataTable({
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
          'p_general_code': 'PSTYP'
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerSysGeneralSubcode, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookuppaymenttype = parse.data;

          if (parse.data != null) {
            this.lookuppaymenttype.numberIndex = dtParameters.start;
          }

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [1, 4] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }
  btnSelectRowPaymentType(code: String, description: String) {
    this.model.payment_schedule_type_code = code;
    this.model.payment_schedule_type_name = description;
    $('#lookupModalPaymentType').modal('hide');
  }
  //#endregion general subcode lookup

}


