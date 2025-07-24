import { OnInit, ViewChild, Component, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import { DALService } from '../../../../../../../DALservice.service';
import swal from 'sweetalert2';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './sp3list.component.html'
})

export class Sp3listComponent extends BaseComponent implements OnInit {

  // variable
  public branch_code: any = [];
  public letter_type: any = [];
  public letter_status: any = [];
  public branch_name: any = [];
  public listsp3: any = [];
  public isBreak: Boolean = false; 
  public lookupbranchcode: any = [];
  private dataTamp: any = [];
  private RoleAccessCode = 'R00021010000000A';

  private APIController: String = 'WarningLetter';
  private APIRouteForGetRows: String = 'GetRowsForSP';
  private APIRouteForProcess: String = 'ExecSpForSPProceed';
  private APIControllerSysBranch: String = 'sysbranch';
  private APIRouteForLookup: String = 'GetRowsForLookup';

  // form 2 way binding
  model: any = {};

  // checklist
  public selectedAll: any;
  private checkedList: any = [];

  // spinner
  showSpinner: Boolean = true;
  // end

  // ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  constructor(private dalservice: DALService,
    public route: Router,
    public getRouteparam: ActivatedRoute,
    private _elementRef: ElementRef) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);

    this.loadData();
  }

  //#region listsp1 load all data
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
          'p_letter_type': 'SOMASI',
          // 'p_letter_status': 'HOLD'
        });
        
        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listsp3 = parse.data;
          if (parse.data != null) {
            this.listsp3.numberIndex = dtParameters.start;
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
  //#endregion listsp1 load all data

  //#region Proceed
  btnProcess() {
    this.isBreak = false;
    this.checkedList = [];
    for (let i = 0; i < this.listsp3.length; i++) {
      if (this.listsp3[i].selected) {
        this.checkedList.push(this.listsp3[i].code);
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
        this.dataTamp = [];
        for (let J = 0; J < this.checkedList.length; J++) {
          const code = this.checkedList[J];
          
          this.dataTamp = [{
            'p_code': code
          }];
          

          this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForProcess)
            .subscribe(
              res => {
                const parse = JSON.parse(res);
                if (parse.result === 1) {
                  if (J + 1 === this.checkedList.length) {
                    this.showSpinner = false;
                    this.showNotification('bottom', 'right', 'success');
                    $('#datatableSp3List').DataTable().ajax.reload();
                  }
                } else {
                  this.isBreak = true; 
                  this.showSpinner = false;
                  $('#datatableSp3List').DataTable().ajax.reload();
                  this.swalPopUpMsg(parse.data);
                }
              },
              error => {
                this.isBreak = true; 
                this.showSpinner = false;
                const parse = JSON.parse(error);
                this.swalPopUpMsg(parse.data);
              })
          if (this.isBreak) {
            break;
          }
        }
      } else {
        this.showSpinner = false;
      }
    });
  }

  selectAllTable() {
    for (let i = 0; i < this.listsp3.length; i++) {
      this.listsp3[i].selected = this.selectedAll;
    }
  }

  checkIfAllTableSelected() {
    this.selectedAll = this.listsp3.every(function (item: any) {
      return item.selected === true;
    })
  }
  //#endregion Proceed

  //#region lookup branch
  btnLookupSysBranch() {
    $('#datatableLookupBranchcode').DataTable().clear().destroy();
    $('#datatableLookupBranchcode').DataTable({
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
        // end tambahan param untuk getrows dynamic
        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBranch, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupbranchcode = parse.data;
          if (parse.data != null) {
            this.lookupbranchcode.numberIndex = dtParameters.start;
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

  btnSelectRowBranchcode(branch_code: String, branch_name: String) {
    this.branch_code = branch_code;
    this.branch_name = branch_name;
    $('#lookupModalSysBranchcode').modal('hide');
    $('#datatableSp3List').DataTable().ajax.reload();
  }

  btnClearBranch(){
    this.branch_code = '';
    this.branch_name = '';
    $('#lookupModalSysBranchcode').modal('hide');
    $('#datatableSp3List').DataTable().ajax.reload();
  }
  //#endregion lookup branch

  //#region button PrintAll
  btnPrintAll() {
  }
  //#endregion button PrintAll
}
