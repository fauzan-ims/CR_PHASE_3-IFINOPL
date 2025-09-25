import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../../../../../base.component';
import { DALService } from '../../../../../../../../../../../DALservice.service';

@Component({
  selector: 'app-expenselist',
  templateUrl: './expenselist.component.html'
})

export class ExpenselistComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  pageType = this.getRouteparam.snapshot.paramMap.get('page');

  // variable
  public listexpense: any = [];
  public lookupsysgeneralsubcode: any = [];
  public listdataExpense: any = [];
  private dataTamp: any = [];

  private APIController: String = 'ApplicationFinancialAnalysisExpense';
  private APIControllerSysGeneralSubcode: String = 'SysGeneralSubcode';

  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForDelete: String = 'DELETE';
  private APIRouteForLookupForApplicationFinancialAnalysisIncome: String = 'GetRowsLookupForApplicationFinancialAnalysisExpense';

  private RoleAccessCode = 'R00019900000000A'; // role access 

  // checklist
  public selectedAllLookup: any;
  public selectedAll: any;
  private checkedList: any = [];
  private checkedLookup: any = [];

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = false;
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
    this.Delimiter(this._elementRef);
    this.loadData();
  }

  //#region load all data
  loadData() {
    this.dtOptions = {
      'pagingType': 'first_last_numbers',
      'pageLength': 10,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false
      ajax: (dtParameters: any, callback) => {

        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_application_financial_analysis_code': this.param,
        });

        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listexpense = parse.data;
          if (parse.data != null) {
            this.listexpense.numberIndex = dtParameters.start;
          }

          // if use checkAll use this
          $('#checkall').prop('checked', false);
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

  //#region checkbox all table
  btnDeleteAll() {
    this.checkedList = [];
    for (let i = 0; i < this.listexpense.length; i++) {
      if (this.listexpense[i].selected) {
        this.checkedList.push(this.listexpense[i].id);
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
        for (let J = 0; J < this.checkedList.length; J++) {
          const code = this.checkedList[J];

          this.dataTamp = [{
            'p_id': code
          }];

          this.dalservice.Delete(this.dataTamp, this.APIController, this.APIRouteForDelete)
            .subscribe(
              res => {
                const parse = JSON.parse(res);
                if (parse.result === 1) {
                  if (this.checkedList.length == J + 1) {
                    this.showSpinner = false;
                    $('#applicationFinancialAnalysis').click();
                    $('#applicationDetail').click();
                    this.showNotification('bottom', 'right', 'success');
                    $('#datatableExpenseList').DataTable().ajax.reload();
                  }
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
        }
      } else {
        this.showSpinner = false;
      }
    });
  }

  selectAllTable() {
    for (let i = 0; i < this.listexpense.length; i++) {
      this.listexpense[i].selected = this.selectedAll;
    }
  }

  checkIfAllTableSelected() {
    this.selectedAll = this.listexpense.every(function (item: any) {
      return item.selected === true;
    })
  }
  //#endregion checkbox all table

  //#region lookup SysGeneralSubcode
  btnLookupSysGeneralSubcode() {
    $('#datatablelookupSysGeneralSubcode').DataTable().clear().destroy();
    $('#datatablelookupSysGeneralSubcode').DataTable({
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
          'p_application_financial_analysis_code': this.param,
        });

        // tslint:disable-next-line:max-line-length
        this.dalservice.Getrows(dtParameters, this.APIControllerSysGeneralSubcode, this.APIRouteForLookupForApplicationFinancialAnalysisIncome).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupsysgeneralsubcode = parse.data;
          if (parse.data != null) {
            this.lookupsysgeneralsubcode.numberIndex = dtParameters.start;
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
  //#endregion lookup SysGeneralSubcode

    //#region checkbox all lookup
    btnSelectAllLookup() {
      this.checkedLookup = [];
      for (let i = 0; i < this.lookupsysgeneralsubcode.length; i++) {
        if (this.lookupsysgeneralsubcode[i].selectedLookup) {
          this.checkedLookup.push(this.lookupsysgeneralsubcode[i].code);
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
  
      this.showSpinner = true;
      for (let J = 0; J < this.checkedLookup.length; J++) {
        const codeData = this.checkedLookup[J];
        this.dataTamp = [{
        'p_expense_type_code': codeData,
        'p_application_financial_analysis_code': this.param
        }];
        
        this.dalservice.Insert(this.dataTamp, this.APIController, this.APIRouteForInsert)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                if (J + 1 === this.checkedList.length) {
                  this.showSpinner = false;
                  this.showNotification('bottom', 'right', 'success');
                }
              $('#datatableExpenseList').DataTable().ajax.reload();
              $('#datatablelookupSysGeneralSubcode').DataTable().ajax.reload();
            } else {
                this.showSpinner = false;
                this.swalPopUpMsg(parse.data);
              }
            },
            error => {
              this.showSpinner = false;
              const parse = JSON.parse(error);
              this.swalPopUpMsg(parse.data);
            })
      }
    }
  
    selectAllLookup() {
      for (let i = 0; i < this.lookupsysgeneralsubcode.length; i++) {
        this.lookupsysgeneralsubcode[i].selectedLookup = this.selectedAllLookup;
      }
    }
  
    checkIfAllLookupSelected() {
      this.selectedAllLookup = this.lookupsysgeneralsubcode.every(function (item: any) {
        return item.selectedLookup === true;
      })
    }
    //#endregion checkbox all table

  //#region checkbox all lookup
  // btnSelectAllLookup() {
  //   this.checkedLookup = [];
  //   for (let i = 0; i < this.lookupsysgeneralsubcode.length; i++) {
  //     if (this.lookupsysgeneralsubcode[i].selectedLookup) {
  //       this.checkedLookup.push(this.lookupsysgeneralsubcode[i].code);
  //     }
  //   }

  //   if (this.checkedLookup.length === 0) {
  //     swal({
  //       title: this._listdialogconf,
  //       buttonsStyling: false,
  //       confirmButtonClass: 'btn btn-danger'
  //     }).catch(swal.noop)
  //     return
  //   }

  //   this.showSpinner = true;
  //   for (let J = 0; J < this.checkedLookup.length; J++) {
  //     const codeData = this.checkedLookup[J];
  //     this.dataTamp = [{
  //       'p_expense_type_code': codeData,
  //       'p_application_financial_analysis_code': this.param
  //     }];

  //     this.dalservice.Insert(this.dataTamp, this.APIController, this.APIRouteForInsert)
  //       .subscribe(
  //         res => {
  //           const parse = JSON.parse(res);
  //           if (parse.result === 1) {
  //             if (this.checkedList.length == J + 1) {
  //               setTimeout(() => {
  //                 $('#applicationDetail').click();
  //                 $('#datatableExpenseList').DataTable().ajax.reload();
  //                 $('#datatablelookupSysGeneralSubcode').DataTable().ajax.reload();
  //               }, 500);
  //               this.showSpinner = false;
  //               this.showNotification('bottom', 'right', 'success');
  //             }
  //           } else {
  //             this.showSpinner = false;
  //             this.swalPopUpMsg(parse.data);
  //           }
  //         },
  //         error => {
  //           this.showSpinner = false;
  //           const parse = JSON.parse(error);
  //           this.swalPopUpMsg(parse.data);
  //         })
  //   }
  // }

  // selectAllLookup() {
  //   for (let i = 0; i < this.lookupsysgeneralsubcode.length; i++) {
  //     this.lookupsysgeneralsubcode[i].selectedLookup = this.selectedAllLookup;
  //   }
  // }

  // checkIfAllLookupSelected() {
  //   this.selectedAllLookup = this.lookupsysgeneralsubcode.every(function (item: any) {
  //     return item.selectedLookup === true;
  //   })
  // }
  //#endregion checkbox all table

  //#region button save list
  btnSaveList() {
    this.showSpinner = true;
    this.listdataExpense = [];

    let i = 0;

    const getID = $('[name="p_id"]')
      .map(function () { return $(this).val(); }).get();

    const getAmount = $('[name="p_expense_amounts"]')
      .map(function () { return $(this).val(); }).get();

    const getRemark = $('[name="p_remarks"]')
      .map(function () { return $(this).val(); }).get();


    while (i < getID.length) {

      while (i < getAmount.length) {

        while (i < getRemark.length) {

          this.listdataExpense.push(
            this.JSToNumberFloats({
              p_id: getID[i],
              p_expense_amount: getAmount[i],
              p_remarks: getRemark[i]
            })
          );

          i++;
        }

        i++;
      }

      i++;
    }

    //#region web service
    this.dalservice.Update(this.listdataExpense, this.APIController, this.APIRouteForUpdate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.showSpinner = false;
            $('#applicationFinancialAnalysis').click();
            $('#applicationDetail').click();
            $('#datatableExpenseList').DataTable().ajax.reload();
            this.showNotification('bottom', 'right', 'success');
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
    //#endregion web service

  }

  onBlur(event, i, type) {
    if (type === 'amount') {
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

    if (type === 'amount') {
      $('#expense_amount' + i)
        .map(function () { return $(this).val(event); }).get();
    }

  }

  onFocus(event, i, type) {
    event = '' + event.target.value;

    if (event != null) {
      event = event.replace(/[ ]*,[ ]*|[ ]+/g, '');
    }

    if (type === 'amount') {
      $('#expense_amount' + i)
        .map(function () { return $(this).val(event); }).get();
    }

  }
  //#endregion button save list
}