import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import { DALService } from '../../../../../../../DALservice.service';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './chargesdetail.component.html'
})

export class MasterContractChargesdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public chargesdetailData: any = [];
  public isReadOnly: Boolean = false;
  public lookupcharges: any = [];
  private dataTamp: any = [];
  public tampHidden: Boolean;

  private APIController: String = 'MainContractCharges';
  private APIControllerMasterCharges: String = 'MasterCharges';
  private APIControllerApplicationExtention: String = 'ApplicationExtention';

  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForLookup: String = 'GetRowsForLookup';

  private RoleAccessCode = 'R00022360000000A'; // role access 

  // form 2 way binding
  model: any = {};
  modelApplicationExtention: any = {};

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
    this.Delimiter(this._elementRef);
    this.callGetrowAppExtentio();
    if (this.params != null) {
      this.isReadOnly = true;

      // call web service
      setTimeout(() => {
        this.callGetrow();
      }, 300);
    } else {
      this.model.calculate_by = 'PCT';
      this.showSpinner = false;
    }
  }

  //#region callGetrowAppExtentio
  callGetrowAppExtentio() {

    this.dataTamp = [{
      'p_application_no': this.param
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIControllerApplicationExtention, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          // if (parsedata.memo_file_name === '') {
          //   this.tampHidden = true;
          // } else if (parsedata.main_contract_status === 'NEW' || parsedata.memo_file_name !== '') {
          //   this.tampHidden = false;
          // }

          if (parsedata.memo_file_name === '') {
            this.tampHidden = true;
          } else {
            this.tampHidden = false;
          }

          // mapper dbtoui
          Object.assign(this.modelApplicationExtention, parsedata);
          // end mapper dbtoui 
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
  }
  //#endregion callGetrowAppExtentio

  //#region getrow data
  callGetrow() {

    this.dataTamp = [{
      'p_main_contract_no': this.modelApplicationExtention.main_contract_no,
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
  onFormSubmit(chargesdetailForm: NgForm, isValid: boolean) {
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
    this.chargesdetailData = chargesdetailForm;

    if (this.chargesdetailData.p_new_calculate_by === 'PCT') {
      this.chargesdetailData.p_new_charges_amount = 0;
    } else {
      this.chargesdetailData.p_new_charges_rate = 0;
    }

    this.chargesdetailData.p_is_from_application = '0';

    this.chargesdetailData = this.JSToNumberFloats(chargesdetailForm);
    const usersJson: any[] = Array.of(this.chargesdetailData);
    if (this.params !== null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              $('#MasterContractReload').click();
              this.callGetrow();
              this.showNotification('bottom', 'right', 'success');
              this.showSpinner = false;
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
              $('#MasterContractReload').click();
              this.showSpinner = false;
              this.route.navigate(['/application/subapplicationtbodocumentlist/applicationtbodocumentdetail/' + this.param + '/chargesdetail/', this.param, parse.id], { skipLocationChange: true });
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
    }
  }
  //#endregion form submit

  //#region button back
  btnBack() {
    this.route.navigate(['/application/subapplicationtbodocumentlist/applicationtbodocumentdetail/' + this.param + '/chargeslist/', this.param], { skipLocationChange: true });
    $('#datatableMainContractCharges').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region Charges Lookup
  btnLookupCharges() {
    $('#datatableLookupCharges').DataTable().clear().destroy();
    $('#datatableLookupCharges').DataTable({
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
          'default': ''
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerMasterCharges, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupcharges = parse.data;
          if (parse.data != null) {
            this.lookupcharges.numberIndex = dtParameters.start;
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

  btnSelectRowCharges(code: String, description: String, charges_rate: String, charges_amount: String) {
    this.model.charges_code = code;
    this.model.charges_desc = description;
    this.model.dafault_charges_rate = charges_rate;
    this.model.dafault_charges_amount = charges_amount;
    $('#lookupModalCharges').modal('hide');
  }
  //#endregion Charges lookup 
}
