import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-fakturcancelationdetail',
  templateUrl: './fakturcancelationdetail.component.html' // GetRowsForLookupForDocgroup
})
export class FakturcancelationdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  fakturcancelationcode = this.getRouteparam.snapshot.paramMap.get('fakturcancelationCode');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public fakturcancelationData: any = [];
  public listfakturcancelationdetail: any = [];
  public lookupbranch: any = [];
  public lookupagreement: any = [];
  public lookupasset: any = [];
  public lookupemployee: any = [];
  public setStyle: any = [];

  public isReadOnly: Boolean = false;
  public isRequired: any;
  public isBreak: Boolean = false;

  public tamps = new Array();
  private dataTamp: any = [];
  private dataTampPush: any = [];

  private APIController: String = 'FakturCancelation';
  private APIControllerDetail: String = 'FakturCancelationDetail';
  private APIControllerSysBranch: String = 'SysBranch';

  private APIRouteForGetRows: String = 'GETROWS';
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForLookup: String = 'GetRowsForLookup';

  private APIRouteForPost: String = 'ExecSpForPost';
  private APIRouteForGenerate: String = 'ExecSpForGenerate';
  private APIRouteForCancel: String = 'ExecSpForCancel';
  private RoleAccessCode = 'R00020840000000A'; // role access 

  // checklist
  public selectedAllTable: any;
  public selectedAllLookup: any;

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
    if (this.fakturcancelationcode != null) {
      // call web service
      this.callGetrow();
      this.loadData();
    } else {
      this.model.status = 'HOLD';
      this.model.billing_mode = 'NORMAL';
      this.showSpinner = false;
    }
  }

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

  //#region load all data
  loadData() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      responsive: true,
      serverSide: true,
      processing: true,
      paging: true,
      'lengthMenu': [
        [10, 25, 50, 100],
        [10, 25, 50, 100]
      ],
      ajax: (dtParameters: any, callback) => {
        
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_cancelation_code': this.fakturcancelationcode
        });
        
        // tslint:disable-next-line:max-line-length
        this.dalservice.Getrows(dtParameters, this.APIControllerDetail, this.APIRouteForGetRows).subscribe(fakturcancelationresp => {
          const fakturcancelationparse = JSON.parse(fakturcancelationresp)

          this.listfakturcancelationdetail = fakturcancelationparse.data;
          if (fakturcancelationparse.data != null) {
            this.listfakturcancelationdetail.numberIndex = dtParameters.start;
          }

          // if use checkAll use this
          $('#checkalltable').prop('checked', false);
          // end checkall

          callback({
            draw: fakturcancelationparse.draw,
            recordsTotal: fakturcancelationparse.recordsTotal,
            recordsFiltered: fakturcancelationparse.recordsFiltered,
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
      'p_code': this.fakturcancelationcode,
    }];
    
    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const fakturcancelationparse = JSON.parse(res);
          const fakturcacelationparsedata = this.getrowNgb(fakturcancelationparse.data[0]);

          // checkbox active
          if (fakturcacelationparsedata.status !== 'HOLD') {
            this.isReadOnly = true;
          } else {
            this.isReadOnly = false;  
          }
          // end checkbox active

          // mapper dbtoui
          Object.assign(this.model, fakturcacelationparsedata);
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
  onFormSubmit(fakturcancelationForm: NgForm, isValid: boolean) {
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

    // this.fakturcancelationData = fakturcancelationForm;
    this.fakturcancelationData = this.JSToNumberFloats(fakturcancelationForm);
    const usersJson: any[] = Array.of(this.fakturcancelationData);

    if (this.fakturcancelationcode != null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
        .subscribe(
          res => {
            const fakturcancelationparse = JSON.parse(res);
            if (fakturcancelationparse.result === 1) {
              this.showSpinner = false;
              this.showNotification('bottom', 'right', 'success');
              this.callGetrow();
            } else {
              this.showSpinner = false;
              this.swalPopUpMsg(fakturcancelationparse.data);
            }
          },
          error => {
            this.showSpinner = false;
            const fakturcancelationparse = JSON.parse(error);
            this.swalPopUpMsg(fakturcancelationparse.data)
          });
    } else {
      // call web service
      this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
        .subscribe(
          res => {
            const fakturcancelationparse = JSON.parse(res);
            if (fakturcancelationparse.result === 1) {
              this.showSpinner = false;
              this.showNotification('bottom', 'right', 'success');
              this.route.navigate(['/billing/subfakturcancelationlist/fakturcancelationdetail', fakturcancelationparse.code]);
            } else {
              this.showSpinner = false;
              this.swalPopUpMsg(fakturcancelationparse.data);
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

  //#region button Post
  btnPost(code: string) {
    // param tambahan untuk button Post dynamic  
    this.dataTamp = [{
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
        this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForPost)
          .subscribe(
            res => {
              this.showSpinner = false;
              const fakturcancelationpostparse = JSON.parse(res);
              if (fakturcancelationpostparse.result === 1) {
                this.showNotification('bottom', 'right', 'success');
                this.callGetrow();
                this.route.navigate(['/billing/subfakturcancelationlist/fakturcancelationdetail/' + this.model.code]);
              } else {
                this.showSpinner = false;
                this.swalPopUpMsg(fakturcancelationpostparse.data);
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

  //#region button Cancel

  btnCancel(code: string) {
    // param tambahan untuk getrole dynamic
    this.dataTamp = [{
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
        this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForCancel)
          .subscribe(
            res => {
              this.showSpinner = false;
              const fakturcancelationcancelparse = JSON.parse(res);
              if (fakturcancelationcancelparse.result === 1) {
                this.showNotification('bottom', 'right', 'success');
                this.callGetrow();
              } else {
                this.swalPopUpMsg(fakturcancelationcancelparse.data);
              }
            },
            error => {
              this.showSpinner = false;
              const fakturcancelationcancelparse = JSON.parse(error);
              this.swalPopUpMsg(fakturcancelationcancelparse.data);
            });
      } else {
        this.showSpinner = false;
      }
    })
  }

  //#endregion button Cancel

  //#region button back
  btnBack() {
    this.route.navigate(['/billing/subfakturcancelationlist']);
    $('#datatableFakturCancelationList').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region Branch
  btnLookupBranch() {
    $('#datatableLookupBranch').DataTable().clear().destroy();
    $('#datatableLookupBranch').DataTable({
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
          // 'p_cre_by': this.uid
          'default': ''
        });
        
        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBranch, this.APIRouteForLookup).subscribe(lookupbranchresp => {
          const lookupbranchparse = JSON.parse(lookupbranchresp);
          this.lookupbranch = lookupbranchparse.data;
          if (lookupbranchparse.data != null) {
            this.lookupbranch.numberIndex = dtParameters.start;
          }
          callback({
            draw: lookupbranchparse.draw,
            recordsTotal: lookupbranchparse.recordsTotal,
            recordsFiltered: lookupbranchparse.recordsFiltered,
            data: []
          })
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

  btnSelectRowBranch(code: String, name: String) {
    this.model.branch_code = code;
    this.model.branch_name = name;
    $('#lookupModalBranch').modal('hide');
  }
  //#endregion branch

  //#region Generate
  btnGenerate(code: string) {
    // param tambahan untuk button Post dynamic  
    this.dataTamp = [{
      'p_code': code,
      'p_year': this.model.year,
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
        this.dalservice.ExecSp(this.dataTamp, this.APIControllerDetail, this.APIRouteForGenerate)
          .subscribe(
            res => {
              this.showSpinner = false;
              const fakturcancelationgenerateparse = JSON.parse(res);
              if (fakturcancelationgenerateparse.result === 1) {
                this.showNotification('bottom', 'right', 'success');
                this.route.navigate(['/billing/subfakturcancelationlist/fakturcancelationdetail/' + this.model.code]);
                $('#dataFakturCancelationDetail').DataTable().ajax.reload();
              } else {
                this.showSpinner = false;
                this.swalPopUpMsg(fakturcancelationgenerateparse.data);
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
  //#endregion Generate


}
