import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './parametertransactiondetail.component.html'
})

export class ParametertransactiondetailComponent extends BaseComponent implements OnInit {
  // get param from url
  parametertransactioncode = this.getRouteparam.snapshot.paramMap.get('parametertransactioncode');

  // variable
  public isReadOnly: Boolean = false;
  public dataTampPush: any = [];
  public lookupmodulecode: any = [];
  public isBreak: Boolean = false;
  private dataTamp: any = [];
  private listparametertransactiondetail: any = [];

  private APIController: String = 'SysGeneralSubcode';
  private APIControllerMasterTransactionParameter: String = 'MasterTransactionParameter';
  private APIControllerSysModule = 'SysModule';
  private APIRouteForGetRow: String = 'Getrow';
  private APIRouteForGetRows: String = 'Getrows';
  private APIRouteForDelete: String = 'Delete';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private RoleAccessCode = 'R00020860000000A'; // role access 


  // form 2 way binding
  model: any = {};

  // checklist

  public selectedAll: any;
  public selectedAllTable: any;
  private checkedList: any = [];

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
    if (this.parametertransactioncode != null) {
      this.isReadOnly = true;

      // call web service
      this.callGetrow();
      this.loadData();
    } else {
      this.showSpinner = false;
    }
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
          'p_process_code': this.parametertransactioncode
        });
        
        // tslint:disable-next-line:max-line-length
        this.dalservice.Getrows(dtParameters, this.APIControllerMasterTransactionParameter, this.APIRouteForGetRows).subscribe(resp => {
          const parametertransactiondetailparse = JSON.parse(resp);
          this.listparametertransactiondetail = parametertransactiondetailparse.data;
          if (parametertransactiondetailparse.data != null) {
            this.listparametertransactiondetail.numberIndex = dtParameters.start;
          }

          // if use checkAll use this
          $('#checkall').prop('checked', false);
          // end checkall

          callback({
            draw: parametertransactiondetailparse.draw,
            recordsTotal: parametertransactiondetailparse.recordsTotal,
            recordsFiltered: parametertransactiondetailparse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 7] }], // for disabled coloumn
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
      'p_code': this.parametertransactioncode,
    }];
    

    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parametertransactiondetailparse = JSON.parse(res);
          const parametertransactiondetailparsedata = this.getrowNgb(parametertransactiondetailparse.data[0]);

          // mapper dbtoui
          Object.assign(this.model, parametertransactiondetailparsedata);
          // end mapper dbtoui

          this.showSpinner = false;
        },
        error => {
          console.log('There was an error while Retrieving Data(API) !!!' + error);
        });
  }
  //#endregion getrow data

  //#region button add
  btnAdd() {
    this.route.navigate(['/setting/submastertransactionparameterlist/parametertransactiondetaildetail', this.parametertransactioncode]);
  }
  //#endregion button add

  //#region button edit
  btnEdit(codeEdit: string) {
    this.route.navigate(['/setting/submastertransactionparameterlist/parametertransactiondetaildetail', this.parametertransactioncode, codeEdit]);
  }
  //#endregion button edit

  //#region button back
  btnBack() {
    this.route.navigate(['/setting/submastertransactionparameterlist']);
    $('#datatableParameterTransaction').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region checkbox all table
  btnDeleteAll() {
    this.isBreak = false;
    this.checkedList = [];
    for (let i = 0; i < this.listparametertransactiondetail.length; i++) {
      if (this.listparametertransactiondetail[i].selected) {
        this.checkedList.push(this.listparametertransactiondetail[i].id);
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
        this.dataTampPush = [];
        for (let J = 0; J < this.checkedList.length; J++) {
          
          this.dataTampPush = [{
            p_id: this.checkedList[J]
          }];
          

          
          this.dalservice.Delete(this.dataTampPush, this.APIControllerMasterTransactionParameter, this.APIRouteForDelete)
            .subscribe(
              ress => {
                const parse = JSON.parse(ress);
                if (parse.result === 1) {
                  if (J + 1 === this.checkedList.length) {
                    this.showSpinner = false;
                    this.showNotification('bottom', 'right', 'success');
                    $('#datatableParameterTransactionDetail').DataTable().ajax.reload();
                  }
                } else {
                  this.isBreak = true;
                  this.showSpinner = false;
                  $('#datatableParameterTransactionDetail').DataTable().ajax.reload();
                  this.swalPopUpMsg(parse.data)
                }
              },
              error => {
                this.isBreak = true;
                this.showSpinner = false;
                const parse = JSON.parse(error);
                this.swalPopUpMsg(parse.data);
              });
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
    for (let i = 0; i < this.listparametertransactiondetail.length; i++) {
      this.listparametertransactiondetail[i].selected = this.selectedAll;
    }
  }

  checkIfAllTableSelected() {
    this.selectedAll = this.listparametertransactiondetail.every(function (item: any) {
      return item.selected === true;
    })
  }
  //#endregion checkbox all table

  //#region lookup type
  btnLookupModuleCode() {
    $('#datatableModuleCode').DataTable().clear().destroy();
    $('#datatableModuleCode').DataTable({
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
        
        // tslint:disable-next-line:max-line-length
        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysModule, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupmodulecode = parse.data;
          if (parse.data != null) {
            this.lookupmodulecode.numberIndex = dtParameters.start;
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
        search: 'INPUT',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowModule(code: String, module_name: String) {
    this.model.module_code = code;
    this.model.module_name = module_name;
    $('#lookupModalModuleCode').modal('hide');
  }
  //#endregion lookup type
}
