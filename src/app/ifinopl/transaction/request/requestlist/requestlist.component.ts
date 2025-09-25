import { OnInit, ViewChild, Component, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { Location } from '@angular/common';
import swal from 'sweetalert2';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './requestlist.component.html'
})
export class RequestlistComponent extends BaseComponent implements OnInit {
  // variable
  public listrequest: any = [];
  public lookupbranch: any = [];
  public request_status: String;
  public tampStatus: String;
  public marketing_code: any;
  private rolecode: any = [];
  private dataTamp: any = [];
  private dataRoleTamp: any = [];
  private APIController: String = 'ProspectRequest';
  private APIControllerSysBranch: String = 'SysBranch';
  private APIControllerMasterMarketing: String = 'MasterMarketing';
  private APIRouteForGetRowByEmployeeCode: String = 'GetRowByEmployeeCode';
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForGetRole: String = 'ExecSpForGetRole';
  private APIRouteForProceed: String = 'ExecSpForGetProceed';
  private APIRouteForReject: String = 'ExecSpForGetReject';

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
    this.tampStatus = 'HOLD';
    this.compoSide(this._location, this._elementRef, this.route);
    this.loadData();
    this.callGetrowByUser();
  }

  //#region btn process
  btnProceed() {
    this.checkedList = [];
    for (let i = 0; i < this.listrequest.length; i++) {
      if (this.listrequest[i].selected) {
        this.checkedList.push(this.listrequest[i].code);
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
      this.showSpinner = true;
      if (result.value) {
        for (let J = 0; J < this.checkedList.length; J++) {
          const code = this.checkedList[J];
          
          this.dataTamp = [{
            'p_code': code,
            'p_marketing_code': this.marketing_code,
            'action': ''
          }];
          
          this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForProceed)
            .subscribe(
              res => {
                this.showSpinner = false;
                const parse = JSON.parse(res);
                if (parse.result === 1) {
                  this.showNotification('bottom', 'right', 'success');
                  $('#datatable').DataTable().ajax.reload();
                } else {
                  this.swalPopUpMsg(parse.data);
                }
              },
              error => {
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
    for (let i = 0; i < this.listrequest.length; i++) {
      this.listrequest[i].selected = this.selectedAll;
    }
  }

  checkIfAllTableSelected() {
    this.selectedAll = this.listrequest.every(function (item: any) {
      return item.selected === true;
    })
  }
  //#endregion btn process

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

  //#region Reject
  btnReject() {
    this.checkedList = [];
    for (let i = 0; i < this.listrequest.length; i++) {
      if (this.listrequest[i].selected) {
        this.checkedList.push(this.listrequest[i].code);
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

    this.dataTamp = [];
    for (let J = 0; J < this.checkedList.length; J++) {
      const code = this.checkedList[J];
      
      this.dataTamp.push({
        'p_code': code
      });
      
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
      this.showSpinner = true;
      if (result.value) {

        this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForReject)
          .subscribe(
            res => {
              this.showSpinner = false;
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showNotification('bottom', 'right', 'success');
                $('#datatable').DataTable().ajax.reload();
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
    });
  }
  //#endregion Reject

  //#region getrole
  callGetRole(uidParam) {
    // param tambahan untuk getrole dynamic
    this.dataRoleTamp = [{
      'p_uid': uidParam,
      'action': 'getResponse'
    }];
    // param tambahan untuk getrole dynamic

    this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForGetRole)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const rolecode = parse.data;

          // get role code from server and push into array
          for (let i = 0; i < rolecode.length; i++) {
            this.rolecode.push(rolecode[i].role_code);
          }

          // hide element when not a role code match with data-role in screen
          const domElement = this._elementRef.nativeElement.querySelectorAll('[data-role]');
          for (let j = 0; j < domElement.length; j++) {
            // tslint:disable-next-line:no-shadowed-variable
            const element = domElement[j].getAttribute('data-role');
            if (this.rolecode.indexOf(element) === -1) {
              this._elementRef.nativeElement.querySelector('[data-role = "' + element + '"]').style.display = 'none';
            }
          }
          // end hide element
        },
        error => {
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data)
        });
  }
  //#endregion getrole

  //#region button edit
  btnEdit(codeEdit: string) {
    this.route.navigate(['/request/subrequestlist/requestdetail', codeEdit]);
  }
  //#endregion button edit

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
          'p_branch_code': this.model.branch_code,
          'p_request_status': this.tampStatus
        });
        
        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listrequest = parse.data;

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });

        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;">No Data Available !</p>'
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion load all data

  //#region ddl Status
  PageStatus(event: any) {
    this.tampStatus = event.target.value;
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion ddl Status

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
          'default': ''
        });
        
        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBranch, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupbranch = parse.data;

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

  btnSelectRowBranch(code: String, name: String) {
    this.model.branch_code = code;
    this.model.branch_name = name;
    $('#lookupModalBranch').modal('hide');
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion branch
}

