import { OnInit, ViewChild, Component, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../base.component';
import { DALService } from '../../../../DALservice.service';
import { Location } from '@angular/common';
import swal from 'sweetalert2';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './contractmaturityrequestlist.component.html'
})
export class ContractmaturityrequestlistComponent extends BaseComponent implements OnInit {
  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public listcontractmaturityrequest: any = [];
  public lookupsysbranch: any = [];
  public branch_name: String;
  public branch_code: String;
  public tampMaturityDays: String;
  private dataTamp: any = [];

  private APIController: String = 'SettlementAgreement';
  private APIControllerGlobalParam: String = 'SysGlobalParam';
  private APIControllerSysBranch: String = 'SysBranch';

  private APIRouteForGetRows: String = 'GetRowsForMaturityRequest';
  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForProceed: String = 'ExecSpForProceed';
  private APIRouteMaturityRequestForGetrowGlobalParam: String = 'ExecSpMaturityRequestForGetrowGlobalParam';

  private RoleAccessCode = 'R00020820000000A'; // role access 

  // form 2 way binding
  model: any = {};

  // checklist
  public selectedAll: any;
  public checkedList: any = [];

  // spinner
  showSpinner: Boolean = true;
  // end

  // ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  constructor(private dalservice: DALService,
    private _location: Location,
    public route: Router,
    private _elementRef: ElementRef) { super(); }

  ngOnInit() {
    this.compoSide(this._location, this._elementRef, this.route);
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.loadData();
    this.maturityDefaultDays();
  }

  //#region MaturityDays
  MaturityDays(event) {
    this.tampMaturityDays = event.target.value;
    $('#datatableContractmaturityrequestlist').DataTable().ajax.reload();
  }
  //#endregion MaturityDays

  //#region btn process
  btnProceed() {
    this.dataTamp = [];
    this.checkedList = [];
    for (let i = 0; i < this.listcontractmaturityrequest.length; i++) {
      if (this.listcontractmaturityrequest[i].selected) {
        this.checkedList.push({
          agreement_no: this.listcontractmaturityrequest[i].agreement_no,
          branch_code: this.listcontractmaturityrequest[i].branch_code,
          branch_name: this.listcontractmaturityrequest[i].branch_name
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
            th.dalservice.ExecSp(th.dataTamp, th.APIController, th.APIRouteForProceed)
              .subscribe(
                res => {
                  const parse = JSON.parse(res);
                  if (parse.result === 1) {
                    if (th.checkedList.length == i + 1) {
                      th.showNotification('bottom', 'right', 'success');
                      $('#datatableContractmaturityrequestlist').DataTable().ajax.reload();
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
    for (let i = 0; i < this.listcontractmaturityrequest.length; i++) {
      this.listcontractmaturityrequest[i].selected = this.selectedAll;
    }
  }

  checkIfAllTableSelected() {
    this.selectedAll = this.listcontractmaturityrequest.every(function (item: any) {
      return item.selected === true;
    })
  }
  //#endregion btn process

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
          'p_branch_code': this.branch_code,
          'p_maturity_days': this.tampMaturityDays
        });

        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listcontractmaturityrequest = parse.data;
          if (parse.data != null) {
            this.listcontractmaturityrequest.numberIndex = dtParameters.start;
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
          this.showSpinner = false;

        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;">No Data Available !</p>'
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion load all data

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
          'p_cre_by': this.uid
        });

        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBranch, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupsysbranch = parse.data;
          if (parse.data != null) {
            this.lookupsysbranch.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
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

  btnSelectRowSysBranch(code: String, name: String) {
    this.branch_code = code;
    this.branch_name = name;
    $('#datatableContractmaturityrequestlist').DataTable().ajax.reload();
    $('#lookupModalSysBranch').modal('hide');
  }

  btnClearLookupBranch() {
    this.branch_code = '';
    this.branch_name = '';
    $('#datatableContractmaturityrequestlist').DataTable().ajax.reload();
  }
  //#endregion SysBranch

  //#region validate
  maturityDefaultDays() {
    this.showSpinner = true;
    // param tambahan 
    this.dataTamp = [{
      'p_code': 'DFBMDV',
      'action': 'getResponse'
    }];
    // param tambahan
    this.dalservice.ExecSp(this.dataTamp, this.APIControllerGlobalParam, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          this.tampMaturityDays = parsedata.value

          $('#datatableApplicationAsset').DataTable().ajax.reload();
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
  }
  //#endregion validate
}

