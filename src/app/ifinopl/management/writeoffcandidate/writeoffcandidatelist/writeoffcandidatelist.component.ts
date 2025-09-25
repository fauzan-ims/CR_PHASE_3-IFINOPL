import { OnInit, ViewChild, Component, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './writeoffcandidatelist.component.html'
})

export class WriteoffcandidatelistComponent extends BaseComponent implements OnInit {

  // #variable
  public branch_code: any = [];
  public branch_name: any = [];
  public recovery_status: any = [];
  public listwocandidate: any = [];
  public lookupbranchfilter: any = [];
  public currencyrevaluationData: any = [];
  public isReadOnly: Boolean = false;
  public isBreak: Boolean = false;
  private dataTampTransaction: any = [];
  public param: any = [];
  private rolecode: any = [];
  private dataTamp: any = [];
  private dataRoleTamp: any = [];

  private APIControllerWriteOffCandidate: String = 'AgreementMain';
  private APIControllerSysBranch: String = 'SysBranch';

  private APIControllerMasterTransactionParameter: String = 'MasterTransactionParameter';
  private APIControllerWriteOffTransaction: String = 'WriteOffTransaction';
  private APIControllerAgreementAmortization: String = 'AgreementAmortization';
  private APIControllerAgreementAmortizationHistory: String = 'AgreementAmortizationHistory';
  private APIControllerAgreementAmortizationPayment: String = 'AgreementAmortizationPayment'
  private APIControllerAgreementAmortizationPaymentHistory: String = 'AgreementAmortizationPaymentHistory';

  private APIRouteForInsert: String = 'Insert';
  private APIRouteLookup: String = 'GetRowsForLookup';
  private APIRouteForGetRows: String = 'GetRowsForWriteOffCandidate';
  private APIRouteForProceed: String = 'ExecSpForGetProceed';
  private APIRouteForExecSp: String = 'ExecSpGeneral';
  private APIRouteForExecSpForGetrow: String = 'ExecSpForGetrowGeneral';
  private APIRouteForUpdateHeader: String = 'ExecSpUpdateHeader';

  private RoleAccessCode = 'R00020910000000A';


  // spinner
  showSpinner: Boolean = true;
  // end

  // #ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  checkedList: any;
  selectedAll: any;
  selectedAllTable: any;

  constructor(private dalservice: DALService,
    public route: Router,
    private _location: Location,
    private _elementRef: ElementRef) { super(); }

  ngOnInit() {
    // this.callGetRole(this.userId);
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.compoSide(this._location, this._elementRef, this.route);
    this.loadData();
  }

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
          'p_agreement_no': this.param,
          'p_branch_code': this.branch_code
        });


        this.dalservice.Getrows(dtParameters, this.APIControllerWriteOffCandidate, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listwocandidate = parse.data;

          console.log(this.listwocandidate);

          if (parse.data != null) {
            this.listwocandidate.numberIndex = dtParameters.start;
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

          this.showSpinner = false;
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

  //#region btn process

  btnProceed() {
    this.dataTamp = [];
    this.checkedList = [];
    for (let i = 0; i < this.listwocandidate.length; i++) {
      if (this.listwocandidate[i].selected) {
        this.checkedList.push({
          agreement_no: this.listwocandidate[i].agreement_no,
          branch_code: this.listwocandidate[i].branch_code,
          branch_name: this.listwocandidate[i].branch_name
        });
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
        let th = this;
        var i = 0;
        (function loopAgreementMaturity() {
          if (i < th.checkedList.length) {
            th.dataTamp = [{
              'p_agreement_no': th.checkedList[i].agreement_no,
              'p_branch_code': th.checkedList[i].branch_code,
              'p_branch_name': th.checkedList[i].branch_name,
              'action': ''
            }];
            th.dalservice.ExecSp(th.dataTamp, th.APIControllerWriteOffCandidate, th.APIRouteForProceed)
              .subscribe(
                res => {
                  const parse = JSON.parse(res);
                  if (parse.result === 1) {
                    if (th.checkedList.length == i + 1) {
                      th.showNotification('bottom', 'right', 'success');
                      $('#datatableWriteOffCandidate').DataTable().ajax.reload();
                      th.showSpinner = false;
                    } else {
                      i++;
                      loopAgreementMaturity();
                    }
                  } else {
                    th.swalPopUpMsg(parse.data);
                    th.showSpinner = false;
                  }
                },
                error => {
                  const parse = JSON.parse(error);
                  th.swalPopUpMsg(parse.data);
                  th.showSpinner = false;
                });
          }
        })();
      } else {
        this.showSpinner = false;
      }
    });
  }


  selectAllTable() {
    for (let i = 0; i < this.listwocandidate.length; i++) {
      this.listwocandidate[i].selected = this.selectedAllTable;
    }
  }

  checkIfAllTableSelected() {
    this.selectedAllTable = this.listwocandidate.every(function (item: any) {
      return item.selected === true;
    })
  }
  //#endregion btn process

  //#region callUpdateHeader
  callUpdateHeader(code: any, update: boolean) {
    this.dataTamp = [{
      'p_wo_code': code,
      'action': ''
    }]
    // tslint:disable-next-line:max-line-length

    this.dalservice.ExecSp(this.dataTamp, this.APIControllerWriteOffTransaction, this.APIRouteForUpdateHeader)
      .subscribe(
        res => {

          const parse = JSON.parse(res);
          this.showSpinner = false;
          if (parse.result === 1) {
            this.showNotification('bottom', 'right', 'success');
            $('#datatableWriteOffCandidate').DataTable().ajax.reload();
            this.loadData();
          }
        });
  }
  //#endregion callUpdateHeader

  //#region lookup filter
  btnLookupBranchfilter() {
    $('#datatableLookupBranchfilter').DataTable().clear().destroy();
    $('#datatableLookupBranchfilter').DataTable({
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
          'p_cre_by': this.uid
        });
        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBranch, this.APIRouteLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupbranchfilter = parse.data;
          if (parse.data != null) {
            this.lookupbranchfilter.numberIndex = dtParameters.start;
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
    // } , 1000);
  }

  btnSelectRowBranchfilter(branch_code: String, branch_name: String) {
    this.branch_code = branch_code;
    this.branch_name = branch_name;
    $('#lookupModalBranchfilter').modal('hide');
    $('#datatableWriteOffCandidate').DataTable().ajax.reload();
  }
  //#endregion lookup filter

  //#region resteBranch
  resteBranch() {
    this.branch_code = undefined;
    this.branch_name = undefined;
    $('#datatableWriteOffCandidate').DataTable().ajax.reload();
  }
  //#endregion resteBranch
}

