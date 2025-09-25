import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import { DALService } from '../../../../../../../DALservice.service';
import { DatePipe } from '@angular/common';
import { data } from 'jquery';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './followupdetail.component.html'
})

export class FollowupdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');

  // variable
  public followupData: any = [];
  public isReadOnly: Boolean = false;
  public isDate: Boolean = false;
  public lookupgeneralsubcode: any = [];
  public lookupaction: any = [];
  public lookupnextaction: any = [];
  private dataTamp: any = [];
  private APIController: String = 'ProspectFollowup';
  private APIControllerSysGeneralSubcode: String = 'SysGeneralSubcode';
  private APIControllerSysGeneralSubcodeAction: String = 'SysGeneralSubcode';
  private APIControllerSysGeneralSubcodeNextAction: String = 'SysGeneralSubcode';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForUpdate: String = 'Update';
  private APIRouteForInsert: String = 'Insert';
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
    if (this.params != null) {
      this.isReadOnly = true;
      this.wizard();

      // call web service
      this.callGetrow();
    } else {
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

  //#region form submit
  onFormSubmit(followupForm: NgForm, isValid: boolean) {
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

    this.followupData = this.JSToNumberFloats(followupForm);

    if (this.followupData.p_followup_next_action_date == '' || this.followupData.p_followup_next_action_date == null) {
      this.followupData.p_followup_next_action_date = undefined;
    }

    const usersJson: any[] = Array.of(this.followupData);
    if (this.params != null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
        .subscribe(
          res => {
            this.showSpinner = false;
            const parse = JSON.parse(res);
            if (parse.result === 1) {
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
              this.route.navigate(['/transaction/subprospectlist/prospectdetail/' + this.param + '/followuplist/' + this.param + '/followupdetail', this.param, parse.id], { skipLocationChange: true });
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

  //#region button back
  btnBack() {
    this.route.navigate(['/transaction/subprospectlist/prospectdetail/' + this.param + '/followuplist', this.param], { skipLocationChange: true });
    $('#datatableFollowupWiz').DataTable().ajax.reload();
  }
  //#endregion button back

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
          'p_general_code': 'FLTYP'
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
    this.model.followup_status = code;
    this.model.description = description;
    $('#lookupModalGeneralSubcode').modal('hide');
  }
  //#endregion general subcode lookup

  //#region action lookup
  btnLookupAction() {
    $('#datatableLookupAction').DataTable().clear().destroy();
    $('#datatableLookupAction').DataTable({
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
          'p_general_code': 'FLACT'
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerSysGeneralSubcodeAction, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupaction = parse.data;

          if (parse.data != null) {
            this.lookupaction.numberIndex = dtParameters.start;
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
  btnSelectRowAction(code: String, name: String) {
    this.model.followup_action = code;
    this.model.followup_action_name = name;
    $('#lookupModalAction').modal('hide');
  }
  //#endregion action lookup

  //#region next action lookup
  btnLookupNextAction() {
    $('#datatableLookupNextAction').DataTable().clear().destroy();
    $('#datatableLookupNextAction').DataTable({
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
          'p_general_code': 'FLNCT'
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerSysGeneralSubcodeNextAction, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupnextaction = parse.data;

          if (parse.data != null) {
            this.lookupnextaction.numberIndex = dtParameters.start;
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
  btnSelectRowNextAction(code: String, name: String) {
    this.model.followup_next_action = code;
    this.model.followup_next_action_name = name;
    $('#lookupModalNextAction').modal('hide');
  }
  //#endregion next action lookup

}


