import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';

// call function from js shared
declare function headerPage(controller, route): any;
declare function hideButtonLink(idbutton): any;
declare function hideTabWizard(): any;

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './leadsdetail.component.html'
})

export class LeadsdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  type = this.getRouteparam.snapshot.paramMap.get('type');
  from = this.getRouteparam.snapshot.paramMap.get('from');
  client = this.getRouteparam.snapshot.paramMap.get('client');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public EmailPattern = this._emailformat;
  public leadsdetailData: any = [];
  public lookupsysbranch: any = [];
  public branch_name: String;
  public branch_code: String;
  public lookupmarketing: any = [];
  public marketing_name: String;
  public marketing_code: String;
  public isReadOnly: Boolean = false;
  public isType: Boolean = false;
  private dataRoleTamp: any = [];
  private dataTamp: any = [];
  private APIController: String = 'ProspectMain';
  private APIControllerSysBranch: String = 'SysBranch';
  private APIControllerMasterMarketing: String = 'MasterMarketing';
  private APIRouteForGetRowByEmployeeCode: String = 'GetRowByEmployeeCode';
  private APIRouteForGetRow: String = 'GetRowLeads';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForProceed: String = 'ExecSpForProceed';
  private APIRouteForPost: String = 'ExecSpForPost';
  private APIRouteForCancel: String = 'ExecSpForCancelLeads';
  private APIRouteForReject: String = 'ExecSpForGetReject';
  private APIRouteForCheck: String = 'ExecSpForCheck';
  private RoleAccessCode = 'R00002640000265A';

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = false;
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
    this.wizard();
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    if (this.type === 'PERSONAL') {
      this.APIController;
      this.isType = false;
    } else {
      this.APIController;
      this.isType = true;
    }

    if (this.param != null) {
      this.isReadOnly = true;
      // call web service
      this.callGetrow();
      this.callGetrowByUser();

    } else {
      this.model.prospect_status = 'PROSPECT';
      this.model.source = 'MANUAL';
      this.showSpinner = false;
    }
    if (this.type === 'PERSONAL') {
      this.model.client_type = 'PERSONAL';
    } else {
      this.model.client_type = 'CORPORATE';
    }
  }

  onRouterOutletActivate(event: any) {
    // console.log(event);
    // event.callGetrowLogin();
  }

  //#region getrow data
  callGetrow() {
    
    this.dataTamp = [{
      'p_code': this.param
    }];
    
    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          if (parsedata.prospect_status == 'CAPTURE') {
            this.offerwiz();
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

  //#region form submit
  onFormSubmit(leadsdetailForm: NgForm, isValid: boolean) {

    // validation form submit
    if (!isValid) {
      swal({
        allowOutsideClick: false,
        title: 'Warning!',
        text: 'Please Fill a Mandatory Field OR Format Is Invalid!!',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-danger',
        type: 'warning'
      }).catch(swal.noop)
      return;
    } else {
      this.showSpinner = true;
    }

    this.leadsdetailData = leadsdetailForm;

    if (this.leadsdetailData.p_corporate_npwp_no == null) {
      this.leadsdetailData.p_corporate_npwp_no = undefined
    }
    const usersJson: any[] = Array.of(this.leadsdetailData);
    if (this.param != null) {
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
            this.swalPopUpMsg(parse.data)
          });
    }
  }
  //#endregion form submit

  //#region button Proceed
  btnProceed(code: string) {
    // param tambahan untuk button Proceed dynamic
    this.dataRoleTamp = [{
      'p_code': code,
      'action': ''
    }];
    // param tambahan untuk button Proceed dynamic

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
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForProceed)
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
  //#endregion button Proceed

  //#region button Post
  btnPost(code: string) {
    // param tambahan untuk button Post dynamic
    this.dataRoleTamp = [{
      'p_code': code,
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
                this.route.navigate(['/transaction/subprospectlist/prospectdetail/' + this.model.code]);
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

  //#region button Check
  btnCheck(code: string) {
    // param tambahan untuk button Post dynamic
    this.dataRoleTamp = [{
      'p_code': code,
      'action': ''
    }];
    // param tambahan untuk button Post dynamic

    // call web service
    this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForCheck)
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
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data)
        });
  }
  //#endregion button Check

  //#region button Cancel
  btnCancel(code: string) {
    // param tambahan untuk button Cancel dynamic
    this.dataRoleTamp = [{
      'p_code': code,
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
                // window.top.location.reload();
                $('#datatable').DataTable().ajax.reload();
                this.route.navigate(['/transaction/subleadslist']);
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

  //#region button Reject
  btnReject(code: string) {
    // param tambahan untuk button Cancel dynamic
    this.dataRoleTamp = [{
      'p_code': code,
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
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForReject)
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
  //#endregion button Reject

  //#region getrow data by user
  callGetrowByUser() {
    
    this.dataTamp = [{
      'p_employee_code': this.userId,
    }];
    
    this.dalservice.Getrow(this.dataTamp, this.APIControllerMasterMarketing, this.APIRouteForGetRowByEmployeeCode)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];

          this.marketing_code = parsedata.code
          // this.model.cashier_name = parsedata.employee_name
          // this.model.branch_code = parsedata.branch_code
          // this.model.branch_name = parsedata.branch_name

        },
        error => {
          console.log('There was an error while Retrieving Data(API) !!!' + error);
        });
  }
  //#endregion getrow data by user

  //#region button back
  btnBack() {
    this.route.navigate(['/transaction/subleadslist']);
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region SysBranch
  btnLookupSysBranch() {
    $('#datatableLookupSysBranch').DataTable().clear().destroy();
    $('#datatableLookupSysBranch').DataTable({
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
        
        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBranch, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupsysbranch = parse.data;
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          })
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [3] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowSysBranch(code: String, name: String) {
    this.model.branch_code = code;
    this.model.branch_name = name;
    this.model.marketing_code = '';
    this.model.name = '';
    $('#lookupModalSysBranch').modal('hide');
  }
  //#endregion SysBranch

  //#region marketing lookup
  btnLookupMarketing() {
    $('#datatableLookupMarketing').DataTable().clear().destroy();
    $('#datatableLookupMarketing').DataTable({
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
          'p_branch_code': this.model.branch_code
        });
        
        this.dalservice.Getrows(dtParameters, this.APIControllerMasterMarketing, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupmarketing = parse.data;

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [3] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }
  btnSelectRowMarketing(code: String, name: String) {
    this.model.marketing_code = code;
    this.model.name = name;
    $('#lookupModalMarketing').modal('hide');
  }
  //#endregion marketing lookup

  //#region List tabs
  offerwiz() {
    this.route.navigate(['/transaction/subleadslist/leadsdetail/' + this.param + '/offerdetail', this.param], { skipLocationChange: true });
  }

  logwiz() {
    this.route.navigate(['/transaction/subleadslist/leadsdetail/' + this.param + '/loglist', this.param], { skipLocationChange: true });
  }
  //#endregion List tabs

}
