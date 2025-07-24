import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import { DALService } from '../../../../../../../DALservice.service';
import swal from 'sweetalert2';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './pdcregisterdetaillist.component.html'
})

export class PdcregisterdetaillistComponent extends BaseComponent implements OnInit {

  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  status = this.getRouteparam.snapshot.paramMap.get('status');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public applicationpdcgenerateData: any = [];
  public listpdcregisterdetail: any = [];
  public listdataRegister: any = [];
  public isStatus: Boolean = false;
  public isButton: Boolean = false;
  public lookupbank: any = [];
  public lookupcurrency: any = [];
  public lookupAllocationType: any = [];
  public isRowcount: Boolean = false;
  private dataRoleTamp: any = [];
  private pdc_value_amount: any = [];
  private pdc_inkaso_fee_amount: any = [];
  private pdc_clearing_fee_amount: any = [];
  private dataTamp: any = [];
  private APIController: String = 'ApplicationPdc';
  private APIControllerPdcRegister: String = 'ApplicationPdcGenerate';
  private APIControllerGeneralSubcode: String = 'SysGeneralSubcode';
  private APIControllerSysBank: String = 'sysbank';
  private APIControllerSysCurrency: String = 'syscurrency';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForAllocationType: String = 'GetRowsLookupSysGeneralSubcodeForPdc';
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForUpdateForGenerate: String = 'UpdateForGenerate';
  private APIRouteForDelete: String = 'Delete';
  private APIRouteForGenerate: String = 'ExecSpForGenerate';
  private RoleAccessCode = 'R00015590000000A';
  private setStyle: any = [];

  // checklist
  public selectedAll: any;
  private checkedList: any = [];

  // form 2 way binding
  model: any = {};

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
    this.compoSide('', this._elementRef, this.route);
    this.loadData();
    this.callGetrow();

    this.model.pdc_frequency_month = '1';
    this.pdc_value_amount = 0;
    this.pdc_inkaso_fee_amount = 0;
    this.pdc_clearing_fee_amount = 0;
  }

  //#region load all data
  loadData() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      responsive: true,
      serverSide: true,
      processing: true,
      paging: true,
      lengthChange: false, // hide lengthmenu
      'lengthMenu': [
        [10, 25, 50, 100],
        [10, 25, 50, 100]
      ],
      ajax: (dtParameters: any, callback) => {
        
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_application_code': this.param,
        })
        

        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listpdcregisterdetail = parse.data;

          // if (parse.data.length > 1) {
          //   if (parse.data[0].agreement_rows_count < 2) {
          //     this.isRowcount = true;
          //   }
          // } else {
          //   this.isRowcount = true;
          // }

          if (parse.data != null) {
            this.listpdcregisterdetail.numberIndex = dtParameters.start;
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

  //#region set datepicker
  getStyles(isTrue: Boolean) {
    if (isTrue) {
      this.setStyle = {
        'pointer-events': 'none',
      }
    } else {
      this.setStyle = {
        'pointer-events': 'pointer',
      }
    }

    return this.setStyle;
  }
  //#endregion  set datepicker

  //#region getrow data
  callGetrow() {
     
    this.dataTamp = [{
      'p_application_no': this.param
    }];
    

    this.dalservice.Getrow(this.dataTamp, this.APIControllerPdcRegister, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          this.model.branch_code = parsedata.branch_code;
          this.pdc_value_amount = parsedata.pdc_value_amount;
          this.pdc_inkaso_fee_amount = parsedata.pdc_inkaso_fee_amount;
          this.pdc_clearing_fee_amount = parsedata.pdc_clearing_fee_amount;

          // mapper dbtoui
          Object.assign(this.model, parsedata);
          // end mapper dbtoui

        },
        error => {
          console.log('There was an error while Retrieving Data(API) !!!' + error);
        });
  }
  //#endregion getrow data

  //#region checkbox all table
  btnDeleteAll() {
    this.checkedList = [];
    for (let i = 0; i < this.listpdcregisterdetail.length; i++) {
      if (this.listpdcregisterdetail[i].selected) {
        this.checkedList.push(this.listpdcregisterdetail[i].id);
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
      confirmButtonText: this._deleteconf,

      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        this.dataTamp = [];
        for (let J = 0; J < this.checkedList.length; J++) {
          const code = this.checkedList[J];
          
          this.dataTamp.push({
            'p_id': code,
          });
          
          this.dalservice.Delete(this.dataTamp, this.APIController, this.APIRouteForDelete)
            .subscribe(
              res => {
                const parse = JSON.parse(res);
                if (parse.result === 1) {
                  this.showNotification('bottom', 'right', 'success');
                  $('#datatabless').DataTable().ajax.reload();
                } else {
                  this.swalPopUpMsg(parse.data);
                  // $('#datatables').DataTable().ajax.reload();
                }
              },
              error => {
                const parse = JSON.parse(error);
                this.swalPopUpMsg(parse.data);
              });
        }
      }
    });
  }

  selectAll() {
    for (let i = 0; i < this.listpdcregisterdetail.length; i++) {
      this.listpdcregisterdetail[i].selected = this.selectedAll;
    }
  }

  checkIfAllTableSelected() {
    this.selectedAll = this.listpdcregisterdetail.every(function (item: any) {
      return item.selected === true;
    })
  }
  //#endregion checkbox all table

  //#region button save list
  btnSaveList() {

    this.listdataRegister = [];

    var i = 0;

    var getID = $('[name="p_id"]')
      .map(function () { return $(this).val(); }).get();

    var getPdcNo = $('[name="p_pdc_no"]')
      .map(function () { return $(this).val(); }).get();

    var getAmount = $('[name="p_pdc_amountt"]')
      .map(function () { return $(this).val(); }).get();


    while (i < getID.length) {

      while (i < getPdcNo.length) {

        while (i < getAmount.length) {

          this.listdataRegister.push(
            this.JSToNumberFloats({
              p_id: getID[i],
              p_application_code: this.param,
              p_pdc_no: getPdcNo[i],
              p_pdc_amount: getAmount[i]
            })
          );

          i++;
        }
        i++;
      }

      i++;
    }
    // this.listdataRegister = this.JSToNumberFloats(this.listdataRegister);

    //#region web service
    this.dalservice.Update(this.listdataRegister, this.APIController, this.APIRouteForUpdate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.showNotification('bottom', 'right', 'success');
            $('#datatableApplicationPdcRegisterDetailList').DataTable().ajax.reload();
          } else {
            this.swalPopUpMsg(parse.data);
          }
        },
        error => {
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);

        });
    //#endregion web service
  }

  onBlur(event, i, type) {
    if (type === 'amount') {
      if (event.target.value.match('[0-9]+(,[0-9]+)')) {
        if (event.target.value.match('(\.\d+)')) {

          event = '' + event.target.value;
          event = event.trim();
          event = event.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
        } else {
          event = '' + event.target.value;
          event = event.trim();
          event = parseFloat(event.replace(/,/g, '')).toFixed(2); // ganti jadi 6 kalo mau pct
          event = event.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
        }
      } else {
        event = '' + event.target.value;
        event = event.trim();
        event = parseFloat(event).toFixed(2); // ganti jadi 6 kalo mau pct
        event = event.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
      }
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
      $('#pdc_amount' + i)
        .map(function () { return $(this).val(event); }).get();
    } else {
      $('#net_income_pct' + i)
        .map(function () { return $(this).val(event); }).get();
    }

  }

  onFocus(event, i, type) {
    event = '' + event.target.value;

    if (event != null) {
      event = event.replace(/[ ]*,[ ]*|[ ]+/g, '');
    }

    if (type === 'amount') {
      $('#pdc_amount' + i)
        .map(function () { return $(this).val(event); }).get();
    } else {
      $('#net_income_pct' + i)
        .map(function () { return $(this).val(event); }).get();
    }

  }
  //#endregion button save list

  //#region button Generate
  btnGenerate(applicationpdcgenerateForm: NgForm, isValid: boolean) {
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
    }
    this.applicationpdcgenerateData = this.JSToNumberFloats(applicationpdcgenerateForm);
    const usersJson: any[] = Array.of(this.applicationpdcgenerateData);

    // call web service
    this.dalservice.Update(usersJson, this.APIControllerPdcRegister, this.APIRouteForUpdateForGenerate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            // param tambahan untuk getrole dynamic
            this.dataRoleTamp = [{
              'p_application_no': this.applicationpdcgenerateData.p_application_no,
              'action': ''
            }];
            // param tambahan untuk getrole dynamic

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
                // call web service
                this.dalservice.ExecSp(this.dataRoleTamp, this.APIControllerPdcRegister, this.APIRouteForGenerate)
                  .subscribe(
                    ress => {
                      const parses = JSON.parse(ress);
                      if (parses.result === 1) {
                        this.showNotification('bottom', 'right', 'success');
                        $('#datatabless').DataTable().ajax.reload();
                        $('#lookupModalGenerate').modal('hide');
                      } else {
                        this.swalPopUpMsg(parses.data);
                      }
                    },
                    error => {
                      const parses = JSON.parse(error);
                      this.swalPopUpMsg(parses.data);
                    });
              }
            });
          } else {
            this.swalPopUpMsg(parse.data);
          }
        },
        error => {
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);

        });
  }
  //#endregion button Generate

  //#region Bank Lookup
  btnLookupBank() {
    $('#datatableLookupBank').DataTable().clear().destroy();
    $('#datatableLookupBank').DataTable({
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
        
        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBank, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupbank = parse.data;
          if (parse.data != null) {
            this.lookupbank.numberIndex = dtParameters.start;
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

  btnSelectRowBank(bank_code: String, bank_desc: string) {
    this.model.pdc_bank_code = bank_code;
    this.model.pdc_bank_name = bank_desc;
    $('#lookupModalBank').modal('hide');
  }
  //#endregion Bank lookup

  //#region Currency Bank Lookup
  btnLookupCurrency() {
    $('#datatableLookupCurrency').DataTable().clear().destroy();
    $('#datatableLookupCurrency').DataTable({
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
        
        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysCurrency, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupcurrency = parse.data;
          if (parse.data != null) {
            this.lookupcurrency.numberIndex = dtParameters.start;
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

  btnSelectRowCurrency(currency_code: String, currency_desc: string) {
    this.model.pdc_currency_code = currency_code;
    this.model.pdc_currency_desc = currency_desc;
    $('#lookupModalCurrency').modal('hide');
  }
  //#endregion Currency Bank lookup

  //#region Allocation Type lookup
  btnLookupAllocationType() {
    $('#datatableLookupAllocationType').DataTable().clear().destroy();
    $('#datatableLookupAllocationType').DataTable({
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
          // 'default': ''
          'p_general_code': 'PDCTYP'
        });
        
        this.dalservice.Getrows(dtParameters, this.APIControllerGeneralSubcode, this.APIRouteForAllocationType).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupAllocationType = parse.data;
          if (parse.data != null) {
            this.lookupAllocationType.numberIndex = dtParameters.start;
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

  btnSelectRowAllocationType(pdc_allocation_type: String, pdc_allocation_desc: String) {
    this.model.pdc_allocation_type = pdc_allocation_type;
    this.model.pdc_allocation_desc = pdc_allocation_desc;
    $('#lookupModalAllocationType').modal('hide');
  }
  //#endregion Allocation Type lookup

  //#region ValueAmount
  ValueAmount(event: any) {
    this.pdc_value_amount = event.target.value;
    this.model.pdc_amount = (this.pdc_value_amount * 1) + (this.pdc_inkaso_fee_amount * 1) + (this.pdc_clearing_fee_amount * 1);
  }
  //#endregion ValueAmount

  //#region InkasoAmount
  InkasoAmount(event: any) {
    this.pdc_inkaso_fee_amount = event.target.value;
    this.model.pdc_amount = (this.pdc_value_amount * 1) + (this.pdc_inkaso_fee_amount * 1) + (this.pdc_clearing_fee_amount * 1);
  }
  //#endregion InkasoAmount

  //#region ClearingAmount
  ClearingAmount(event: any) {
    this.pdc_clearing_fee_amount = event.target.value;
    this.model.pdc_amount = (this.pdc_value_amount * 1) + (this.pdc_inkaso_fee_amount * 1) + (this.pdc_clearing_fee_amount * 1);
  }
  //#endregion ClearingAmount
}
