import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-dimensiondetail',
  templateUrl: './budgetapprovaldetail.component.html'
})
export class BudgetapprovaldetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public budgetapprovalData: any = [];
  public listBudget: any = [];
  public lookupBudget: any = [];
  private dataTamp: any = [];
  private dataTampPush: any = [];

  private APIController: String = 'BudgetApproval';
  private APIControllerMasterBudgetCost: String = 'MasterBudgetCost';
  private APIControllerBudgetApprovalDetail: String = 'BudgetApprovalDetail';

  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForUpdate: String = 'Update';
  private APIRouteForInsert: String = 'Insert';
  private APIRouteForDelete: String = 'Delete';
  private APIRouteForCancel: String = 'ExecSpForCancel';
  private APIRouteForPost: String = 'ExecSpForPost';
  private APIRouteForMultipleLookup: String = 'GetRowsForMultipleLookup';

  private RoleAccessCode = 'R00021000000000A'; // role access 

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = true;
  // end

  // checklist
  public selectedAllTable: any;
  public selectedAllLookup: any;
  private checkedList: any = [];
  private checkedLookup: any = [];

  // datatable
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  constructor(private dalservice: DALService,
    public getRouteparam: ActivatedRoute,
    public route: Router,
    private _elementRef: ElementRef,
    private parserFormatter: NgbDateParserFormatter
  ) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    if (this.param != null) {
      // call web service
      this.callGetrow();
      this.loadData();
    } else {
      this.model.employee_name = this.userName;
      this.model.employee_code = this.userId;
      this.model.status = 'HOLD';
      this.showSpinner = false;
    }
  }

  //#region onBlur
  onBlur(event, i, type) {
    if (type === 'cost_amount_monthly' || type === 'cost_amount_yearly') {
      event = '' + event.target.value;
      event = event.trim();
      event = parseFloat(event).toFixed(2); // ganti jadi 6 kalo mau pct
      event = event.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    } else {
      event = '' + event.target.value;
      event = event.trim();
      event = parseFloat(event).toFixed(6);
    }

    if (event === 'NaN') {
      event = 0;
      event = parseFloat(event).toFixed(2);
    }

    if (type === 'cost_amount_monthly') {
      $('#cost_amount_monthly' + i)
        .map(function () { return $(this).val(event); }).get();
    } else if (type === 'cost_amount_yearly') {
      $('#cost_amount_yearly' + i)
        .map(function () { return $(this).val(event); }).get();
    }
  }
  //#endregion onBlur

  //#region onFocus
  onFocus(event, i, type) {
    event = '' + event.target.value;

    if (event != null) {
      event = event.replace(/[ ]*,[ ]*|[ ]+/g, '');
    }

    if (type === 'cost_amount_monthly') {
      $('#cost_amount_monthly' + i)
        .map(function () { return $(this).val(event); }).get();
    } else if (type === 'cost_amount_yearly') {
      $('#cost_amount_yearly' + i)
        .map(function () { return $(this).val(event); }).get();
    }
  }
  //#endregion onFocus

  //#region costAmountMonthly && costAmountYearly
  costAmountMonthly() {
    this.btnSaveList();
  }

  costAmountYearly() {
    this.btnSaveList();
  }
  //#endregion costAmountMonthly && costAmountYearly

  //#region button save list
  btnSaveList() {
    this.listBudget = [];

    let i = 0;

    const getCostCode = $('[name="p_cost_code"]')
      .map(function () { return $(this).val(); }).get();

    const getcostAmountMonthly = $('[name="p_cost_amount_monthly"]')
      .map(function () { return $(this).val(); }).get();

    const getcostAmountYearly = $('[name="p_cost_amount_yearly"]')
      .map(function () { return $(this).val(); }).get();

    while (i < getCostCode.length) {
      while (i < getcostAmountMonthly.length) {
        while (i < getcostAmountYearly.length) {
          this.listBudget.push(
            this.JSToNumberFloats({
              p_budget_approval_code: this.param,
              p_cost_code: getCostCode[i],
              p_cost_amount_monthly: getcostAmountMonthly[i],
              p_cost_amount_yearly: getcostAmountYearly[i]
            }));
          i++;
        }
        i++;
      }
      i++;
    }

    //#region web service
    this.dalservice.Update(this.listBudget, this.APIControllerBudgetApprovalDetail, this.APIRouteForUpdate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            $('#datatableBudgetList').DataTable().ajax.reload();
            $('#btnApplicationAssetSave').click();
          } else {
            this.swalPopUpMsg(parse.data)
          }
        },
        error => {
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data)
        });
    //#endregion web service
  }
  //#endregion button save list

  //#region load all data
  loadData() {
    this.dtOptions = {
      'pagingType': 'full_numbers',
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: false, // ini untuk hilangin search box nya
      ajax: (dtParameters: any, callback) => {
        
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_budget_approval_code': this.param
        })
        
        this.dalservice.Getrows(dtParameters, this.APIControllerBudgetApprovalDetail, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listBudget = parse.data;
          if (parse.data != null) {
            this.listBudget.numberIndex = dtParameters.start;
          }

          // if use checkAll use this
          $('#checkalltable').prop('checked', false);
          // end checkall

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }

  }
  //#endregion load all data

  //#region getrow data
  callGetrow() {

    this.dataTamp = [{
      'p_code': this.param,
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

  //#region form submit
  onFormSubmit(budgetapprovalForm: NgForm, isValid: boolean) {
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

    this.budgetapprovalData = this.JSToNumberFloats(budgetapprovalForm);
    const usersJson: any[] = Array.of(this.budgetapprovalData);

    if (this.param != null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showSpinner = false;
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
    } else {
      // call web service
      this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showSpinner = false;
              this.showNotification('bottom', 'right', 'success');
              this.route.navigate(['/application/subbudgetapprovallist/budgetapprovaldetail', parse.code]);
            } else {
              this.showSpinner = false;
              this.swalPopUpMsg(parse.data)
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
    this.route.navigate(['/application/subbudgetapprovallist']);
    $('#datatableBudgetapprovallist').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region button Cancel
  btnCancel(code: string) {
    // param tambahan untuk getrole dynamic
    this.dataTampPush = [{
      'p_code': code,
    }];
    // param tambahan untuk getrole dynamic

    // call web service
    swal({
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: this._deleteconf,
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        this.dalservice.ExecSp(this.dataTampPush, this.APIController, this.APIRouteForCancel)
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
              this.showSpinner = false;
              const parse = JSON.parse(error);
              this.swalPopUpMsg(parse.data);
            });
      } else {
        this.showSpinner = false;
      }
    })
  }
  //#endregion button Cancel

  //#region button Post
  btnPost(code: string) {
    // param tambahan untuk getrole dynamic
    this.dataTampPush = [{
      'p_code': code,
    }];
    // param tambahan untuk getrole dynamic

    // call web service
    swal({
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: this._deleteconf,
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        this.dalservice.ExecSp(this.dataTampPush, this.APIController, this.APIRouteForPost)
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
              this.showSpinner = false;
              const parse = JSON.parse(error);
              this.swalPopUpMsg(parse.data);
            });
      } else {
        this.showSpinner = false;
      }
    })
  }
  //#endregion button Post

  //#region multiplelookup Budget
  btnLookupBudget() {
    $('#datatableLookupBudget').DataTable().clear().destroy();
    $('#datatableLookupBudget').DataTable({
      'pagingType': 'full_numbers',
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: false, // ini untuk hilangin search box nya
      ajax: (dtParameters: any, callback) => {

        
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_budget_approval_code': this.param
        });
        

        this.dalservice.Getrows(dtParameters, this.APIControllerMasterBudgetCost, this.APIRouteForMultipleLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupBudget = parse.data;
          if (parse.data != null) {
            this.lookupBudget.numberIndex = dtParameters.start;
          }

          // if use checkAll use this
          $('#checkallLookup').prop('checked', false);
          // end checkall

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }
  //#endregion lookup Budget

  //#region btnSelectAllLookup
  btnSelectAllLookup() {
    this.showSpinner = true;
    this.checkedLookup = [];
    for (let i = 0; i < this.lookupBudget.length; i++) {
      if (this.lookupBudget[i].selectedLookup) {
        this.checkedLookup.push({
          'code': this.lookupBudget[i].code,
          'cost_type': this.lookupBudget[i].cost_type
        });
      }
    }

    // jika tidak di checklist
    if (this.checkedLookup.length === 0) {
      swal({
        title: this._listdialogconf,
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-danger'
      }).catch(swal.noop)
      return
    }

    this.dataTampPush = [];
    let th = this;
    var J = 0;
    (function loopDeleteBudgetApprovalDetail() {

      if (J < th.checkedLookup.length) {
        th.dataTampPush.push({
          'p_budget_approval_code': th.param,
          'p_cost_code': th.checkedLookup[J].code,
          'p_cost_type': th.checkedLookup[J].cost_type
        });
        th.dalservice.Insert(th.dataTampPush, th.APIControllerBudgetApprovalDetail, th.APIRouteForInsert)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                if (th.checkedLookup.length == J + 1) {
                  th.showNotification('bottom', 'right', 'success');
                  $('#datatableBudgetList').DataTable().ajax.reload();
                  $('#datatableLookupBudget').DataTable().ajax.reload();
                  th.callGetrow();
                  th.showSpinner = false;
                } else {
                  th.dataTampPush = [];
                  J++;
                  loopDeleteBudgetApprovalDetail();
                }
              } else {
                th.swalPopUpMsg(parse.data);
                th.showSpinner = false;
              }
            },
            error => {
              th.showSpinner = false;
              const parse = JSON.parse(error);
              th.swalPopUpMsg(parse.data)
            })
      }
    })();
  }

  selectAllLookup() {
    for (let i = 0; i < this.lookupBudget.length; i++) {
      this.lookupBudget[i].selectedLookup = this.selectedAllLookup;
    }
  }

  checkIfAllLookupSelected() {
    this.selectedAllLookup = this.lookupBudget.every(function (item: any) {
      return item.selectedLookup === true;
    })
  }
  //#endregion btnSelectAllLookup

  //#region btnDeleteAll
  btnDeleteAll() {
    this.showSpinner = false;
    this.checkedList = [];
    for (let i = 0; i < this.listBudget.length; i++) {
      if (this.listBudget[i].selected) {
        this.checkedList.push(this.listBudget[i].id);
      }
    }
    // jika tidak di checklist
    if (this.checkedList.length === 0) {
      swal({
        title: this._listdialogconf,
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-danger'
      }).catch(swal.noop)
      return
    }

    this.dataTampPush = [];
    swal({
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Yes',
      buttonsStyling: false
    }).then((result) => {
      this.showSpinner = true;
      if (result.value) {
        let th = this;
        var J = 0;
        (function loopDeleteBudgetApprovalDetail() {
          if (J < th.checkedList.length) {

            th.dataTampPush.push({
              'p_id': th.checkedList[J],
              'action': ''
            });

            th.dalservice.Delete(th.dataTampPush, th.APIControllerBudgetApprovalDetail, th.APIRouteForDelete)
              .subscribe(
                res => {
                  const parse = JSON.parse(res);
                  if (parse.result === 1) {
                    if (th.checkedList.length == J + 1) {
                      th.showNotification('bottom', 'right', 'success');
                      $('#datatableBudgetList').DataTable().ajax.reload();
                      th.callGetrow();
                      th.showSpinner = false;
                    } else {
                      J++;
                      loopDeleteBudgetApprovalDetail();
                    }
                  } else {
                    th.swalPopUpMsg(parse.data);
                    th.showSpinner = false;
                  }
                },
                error => {
                  th.showSpinner = false;
                  const parse = JSON.parse(error);
                  th.swalPopUpMsg(parse.data);
                });
          }
        })();
      } else {
        this.showSpinner = false;
      }
    });
  }

  selectAllTable() {
    for (let i = 0; i < this.listBudget.length; i++) {
      this.listBudget[i].selected = this.selectedAllTable;
    }
  }

  checkIfAllTableSelected() {
    this.selectedAllTable = this.listBudget.every(function (item: any) {
      return item.selected === true;
    })
  }
  //#endregion btnDeleteAll
}