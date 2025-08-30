import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { DatePipe } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './spmanualdetail.component.html'
})

export class SpmanualdetailComponent extends BaseComponent implements OnInit {

  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public spmanualData: any = [];
  public lookupbranch: any = [];
  public lookupAgreement: any = [];
  public lookupbranchname: any = [];
  public listjournaldetail: any = [];
  public isReadOnly: Boolean = false;
  public isButton: Boolean = false;
  public lookupaccountcurrencycode: any = [];
  public statusCancel: any = [];
  public statusNull: any = [];
  private setStyle: any = [];
  private dataTamp: any = [];
  private dataRoleTamp: any = [];
  private RoleAccessCode = 'R00020990000000A';

  private APIControllerSPManual: String = 'WarningLetter';
  private APIControllerAgreement: String = 'AgreementMain';
  private APIRouteForUpdate: String = 'Update';
  private APIRouteForInsert: String = 'Insert';
  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteGetRowsForAgreement: String = 'GetRowsForSPLookup';
  private APIRouteForPost: String = 'ExecSpForPost';
  private APIRouteForCancel: String = 'ExecSpForCancel';
  private APIControllerSysBranch: String = 'sysbranch';
  private APIRouteForLookup: String = 'GetRowsForLookup';

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = true;
  // end

  // datatable
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  checkedList: any;
  selectedAll: any;
  selectedAllTable: any;

  constructor(private dalservice: DALService,
    public getRouteparam: ActivatedRoute,
    public route: Router,
    private _elementRef: ElementRef, private datePipe: DatePipe
  ) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);

    if (this.param != null) {
      this.isReadOnly = true;
      this.isReadOnly = true;

      // call web service
      this.callGetrow();
      this.wizard();
    } else {
      this.model.letter_status = 'REQUEST';
      this.model.letter_type = 'SP1';
      this.showSpinner = false;
    }
  }

  //#region  set datepicker
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
  //#endregion  set datepicker

  //#region getrow data
  callGetrow() {

    this.dataTamp = [{
      'p_code': this.param,
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIControllerSPManual, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          setTimeout(() => {
            this.amortizationnwiz();
          }, 200);

          if (parsedata.letter_status !== 'REQUEST') {
            this.isButton = true;
          } else {
            this.isButton = false;
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

  //#region form submit
  onFormSubmit(spmanualForm: NgForm, isValid: boolean) {
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

    this.spmanualData = this.JSToNumberFloats(spmanualForm);

    if (this.spmanualData.p_editable == null) {
      this.spmanualData.p_editable = false;
    }
    const usersJson: any[] = Array.of(this.spmanualData);
    if (this.param != null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIControllerSPManual, this.APIRouteForUpdate)
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
      // call web service
      this.dalservice.Insert(usersJson, this.APIControllerSPManual, this.APIRouteForInsert)
        .subscribe(
          res => {
            this.showSpinner = false;
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showNotification('bottom', 'right', 'success');
              this.route.navigate(['/collection/subspmanuallist/spmanualdetail', parse.code]);
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

  //#region button Post
  btnPost(code: string) {
    // param tambahan untuk getrole dynamic
    this.dataRoleTamp = [{
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
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIControllerSPManual, this.APIRouteForPost)
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

  //#region button Cancel
  btnCancel(code: string) {
    // param tambahan untuk button Done dynamic
    this.dataRoleTamp = [{
      'p_code': code,
    }];
    // param tambahan untuk button Done dynamic

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
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIControllerSPManual, this.APIRouteForCancel)
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

  //#region button back
  btnBack() {
    this.route.navigate(['/collection/subspmanuallist']);
    $('#datatableSpManualList').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region lookup branch
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
        // tambahan param untuk getrows dynamic
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'default': ''
        });
        // endtambahan param untuk getrows dynamic
        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBranch, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupbranch = parse.data;
          if (parse.data != null) {
            this.lookupbranch.numberIndex = dtParameters.start;
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
    // } , 1000);
  }

  btnSelectRowBranch(branch_code: String, branch_name: String) {
    this.model.branch_code = branch_code;
    this.model.branch_name = branch_name;
    this.model.agreement_no = ''
    this.model.client_name = ''
    this.model.agreement_external_no = '';
    $('#lookupModalSysBranch').modal('hide');
  }
  //#endregion lookup branch

  //#region Agreement Lookup
  btnLookupAgreement() {
    $('#datatableLookupAgreement').DataTable().clear().destroy();
    $('#datatableLookupAgreement').DataTable({
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


        this.dalservice.Getrows(dtParameters, this.APIControllerAgreement, this.APIRouteGetRowsForAgreement).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupAgreement = parse.data;
          if (parse.data != null) {
            this.lookupAgreement.numberIndex = dtParameters.start;
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

  btnSelectRowAgreement(agreement_no: String, agreement_external_no: String, agreement_desc: String, client_no: String) {
    this.model.agreement_no = agreement_no;
    this.model.agreement_external_no = agreement_external_no;
    this.model.client_name = agreement_desc;
    this.model.client_no = client_no;
    $('#lookupModalAgreement').modal('hide');
  }

    //#region amortizationnwiz
  amortizationnwiz() {
    this.route.navigate(['/collection/subspmanuallist/spmanualdetail/' + this.param + '/spamortizationlist', this.param], { skipLocationChange: true });
  }
  //#endregion amortizationnwiz
  //#endregion Agreement lookup
}







