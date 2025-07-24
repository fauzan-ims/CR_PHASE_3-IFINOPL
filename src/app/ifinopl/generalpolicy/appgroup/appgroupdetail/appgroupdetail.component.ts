import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { DatePipe } from '@angular/common';
import { parse } from 'querystring';

@Component({
  selector: 'app-appgroupdetail',
  templateUrl: './appgroupdetail.component.html'
})
export class AppgroupdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public appgroupData: any = [];
  public listappgroup: any = [];
  public lookupdoc: any = [];
  public lookupdimension: any = [];
  public lookupdimensionvalue: any = [];
  public isReadOnly: Boolean = false;
  private listDimensionPush: any = [];
  private current_id: any;
  private current_type: any;
  private id: any;
  private dataTamp: any = [];
  private dataTampPush: any = [];

  private APIController: String = 'MasterDocumentContractGroup';
  private APIControllerDetail: String = 'MasterDocumentContractGroupDetail';
  private APIControllerDoc: String = 'MasterDocumentContract';
  private APIControllerSysDimensionValue: String = 'SysDimensionValue';
  private APIControllerSysDimension: String = 'SysDimension'

  private APIRouteForGetRows: String = 'GETROWS';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForLookupDoc: String = 'GetRowsForLookupForMultipleContract';
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForDelete: String = 'DELETE';

  private RoleAccessCode = 'R00016800000000A'; // role access 

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = true;
  // end

  // datatable
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  // checklist
  public selectedAllTable: any;
  public selectedAllLookup: any;
  private checkedList: any = [];
  private checkedLookup: any = [];


  constructor(private dalservice: DALService,
    public getRouteparam: ActivatedRoute,
    public route: Router,
    private _elementRef: ElementRef
  ) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    if (this.param != null) {
      this.isReadOnly = true;

      // call web service
      this.callGetrow();
      this.loadData()
    } else {
      this.model.dim_count = '0';
      this.model.contract_type = 'DCAPPLICATION';
      this.showSpinner = false;
    }
  }

  //#region lookup Doc
  btnLookupDoc() {
    $('#datatableLookupDoc').DataTable().clear().destroy();
    $('#datatableLookupDoc').DataTable({
      'pagingType': 'full_numbers',
      'processing': true,
      'serverSide': true,
      'pageLength': 5,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // ini untuk hilangin search box nya
      ajax: (dtParameters: any, callback) => {

        
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_document_contract_group_code': this.param
        });
        
        this.dalservice.Getrows(dtParameters, this.APIControllerDoc, this.APIRouteForLookupDoc).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupdoc = parse.data;
          if (parse.data != null) {
            this.lookupdoc.numberIndex = dtParameters.start;
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
  //#endregion lookup Doc

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
          'p_document_contract_group_code': this.param
        });
        
        // tslint:disable-next-line:max-line-length
        this.dalservice.Getrows(dtParameters, this.APIControllerDetail, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listappgroup = parse.data;
          if (parse.data != null) {
            this.listappgroup.numberIndex = dtParameters.start;
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

  //#region checkbox all lookup
  btnSelectAllLookup() {
    this.checkedLookup = [];
    for (let i = 0; i < this.lookupdoc.length; i++) {
      if (this.lookupdoc[i].selectedLookup) {
        this.checkedLookup.push(this.lookupdoc[i].code);
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
    this.dataTampPush = [];
    for (let J = 0; J < this.checkedLookup.length; J++) {
      
      this.dataTampPush.push({
        'p_document_contract_group_code': this.param,
        'p_document_contract_code': this.checkedLookup[J]
      });
      
    }
    this.dalservice.Insert(this.dataTampPush, this.APIControllerDetail, this.APIRouteForInsert)
      .subscribe(
        res => {
          this.showSpinner = false;
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.showNotification('bottom', 'right', 'success');
            $('#datatableAppGroupDetail').DataTable().ajax.reload();
            $('#datatableLookupDoc').DataTable().ajax.reload();
          } else {
            this.swalPopUpMsg(parse.data);
          }
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data)
        });
  }

  selectAllLookup() {
    for (let i = 0; i < this.lookupdoc.length; i++) {
      this.lookupdoc[i].selectedLookup = this.selectedAllLookup;
    }
  }

  checkIfAllLookupSelected() {
    this.selectedAllLookup = this.lookupdoc.every(function (item: any) {
      return item.selectedLookup === true;
    })
  }
  //#endregion checkbox all lookup

  //#region getrow data
  callGetrow() {
    
    this.dataTamp = [{
      'p_code': this.param,
    }];
    
    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];
          // checkbox active
          if (parsedata.is_active === '1') {
            parsedata.is_active = true;
          } else {
            parsedata.is_active = false;
          }
          // end checkbox active

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

  //#region  form submit
  onFormSubmit(appgroupForm: NgForm, isValid: boolean) {
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

    this.appgroupData = appgroupForm;
    if (this.appgroupData.p_is_active == null) {
      this.appgroupData.p_is_active = false;
    }
    const usersJson: any[] = Array.of(this.appgroupData);
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
              this.swalPopUpMsg(parse.data)
            }
          },
          error => {
            this.showSpinner = false;
            const parse = JSON.parse(error);
            this.swalPopUpMsg(parse.data)
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
              this.route.navigate(['/generalpolicy/subappgrouplist/appgroupdetail', parse.code]);
            } else {
              this.showSpinner = false;
              this.swalPopUpMsg(parse.data)
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

  //#region button back
  btnBack() {
    this.route.navigate(['/generalpolicy/subappgrouplist']);
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region checkbox all table
  btnDeleteAll() {
    this.checkedList = [];
    for (let i = 0; i < this.listappgroup.length; i++) {
      if (this.listappgroup[i].selected) {
        this.checkedList.push({
          id: this.listappgroup[i].id,
          code: this.listappgroup[i].document_contract_group_code
        })
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
      confirmButtonText: this._deleteconf,
      buttonsStyling: false
    }).then((result) => {
      this.showSpinner = true;
      if (result.value) {
        for (let J = 0; J < this.checkedList.length; J++) {
          
          this.dataTampPush.push({
            'p_id': this.checkedList[J].id,
            'p_document_contract_group_code': this.checkedList[J].code
          });
          
          this.dalservice.Delete(this.dataTampPush, this.APIControllerDetail, this.APIRouteForDelete)
            .subscribe(
              res => {
                this.showSpinner = false;
                const parse = JSON.parse(res);
                if (parse.result === 1) {
                  if (this.checkedList.length == J + 1) {
                    this.showSpinner = false;
                    this.showNotification('bottom', 'right', 'success');
                    $('#datatableAppGroupDetail').DataTable().ajax.reload();
                  }
                } else {
                  this.swalPopUpMsg(parse.data);
                }
              },
              error => {
                this.showSpinner = false;
                const parse = JSON.parse(error);
                this.swalPopUpMsg(parse.data)
              });
        }
      } else {
        this.showSpinner = false;
      }
    });
  }

  selectAllTable() {
    for (let i = 0; i < this.listappgroup.length; i++) {
      this.listappgroup[i].selected = this.selectedAllTable;
    }
  }

  checkIfAllTableSelected() {
    this.selectedAllTable = this.listappgroup.every(function (item: any) {
      return item.selected === true;
    })
  }
  //#endregion checkbox all table

  //#region dimensionCount
  dimensionCount(event) {
    const dimCount = event.target.value;
    if (dimCount === '1') {
      this.model.operator_1 = 'EQUAL';
    } else if (dimCount === '2') {
      this.model.operator_1 = 'EQUAL';
      this.model.operator_2 = 'EQUAL';
    } else if (dimCount === '3') {
      this.model.operator_1 = 'EQUAL';
      this.model.operator_2 = 'EQUAL';
      this.model.operator_3 = 'EQUAL';
    } else if (dimCount === '4') {
      this.model.operator_1 = 'EQUAL';
      this.model.operator_2 = 'EQUAL';
      this.model.operator_3 = 'EQUAL';
      this.model.operator_4 = 'EQUAL';
    } else if (dimCount === '5') {
      this.model.operator_1 = 'EQUAL';
      this.model.operator_2 = 'EQUAL';
      this.model.operator_3 = 'EQUAL';
      this.model.operator_4 = 'EQUAL';
      this.model.operator_5 = 'EQUAL';
    } else if (dimCount === '6') {
      this.model.operator_1 = 'EQUAL';
      this.model.operator_2 = 'EQUAL';
      this.model.operator_3 = 'EQUAL';
      this.model.operator_4 = 'EQUAL';
      this.model.operator_5 = 'EQUAL';
      this.model.operator_6 = 'EQUAL';
    } else if (dimCount === '7') {
      this.model.operator_1 = 'EQUAL';
      this.model.operator_2 = 'EQUAL';
      this.model.operator_3 = 'EQUAL';
      this.model.operator_4 = 'EQUAL';
      this.model.operator_5 = 'EQUAL';
      this.model.operator_6 = 'EQUAL';
      this.model.operator_7 = 'EQUAL';
    } else if (dimCount === '8') {
      this.model.operator_1 = 'EQUAL';
      this.model.operator_2 = 'EQUAL';
      this.model.operator_3 = 'EQUAL';
      this.model.operator_4 = 'EQUAL';
      this.model.operator_5 = 'EQUAL';
      this.model.operator_6 = 'EQUAL';
      this.model.operator_7 = 'EQUAL';
      this.model.operator_8 = 'EQUAL';
    } else if (dimCount === '9') {
      this.model.operator_1 = 'EQUAL';
      this.model.operator_2 = 'EQUAL';
      this.model.operator_3 = 'EQUAL';
      this.model.operator_4 = 'EQUAL';
      this.model.operator_5 = 'EQUAL';
      this.model.operator_6 = 'EQUAL';
      this.model.operator_7 = 'EQUAL';
      this.model.operator_8 = 'EQUAL';
      this.model.operator_9 = 'EQUAL';
    } else if (dimCount === '10') {
      this.model.operator_1 = 'EQUAL';
      this.model.operator_2 = 'EQUAL';
      this.model.operator_3 = 'EQUAL';
      this.model.operator_4 = 'EQUAL';
      this.model.operator_5 = 'EQUAL';
      this.model.operator_6 = 'EQUAL';
      this.model.operator_7 = 'EQUAL';
      this.model.operator_8 = 'EQUAL';
      this.model.operator_9 = 'EQUAL';
      this.model.operator_10 = 'EQUAL';
    }
  }
  //#endregion dimensionCount

  //#region operator1
  operator1(event) {
    this.model.operator_1 = event.target.value;
  }
  //#endregion operator1

  //#region operator2
  operator2(event) {
    this.model.operator_2 = event.target.value;
  }
  //#endregion operator2

  //#region operator3
  operator3(event) {
    this.model.operator_3 = event.target.value;
  }
  //#endregion operator1

  //#region operator4
  operator4(event) {
    this.model.operator_4 = event.target.value;
  }
  //#endregion operator1

  //#region operator5
  operator5(event) {
    this.model.operator_5 = event.target.value;
  }
  //#endregion operator1

  //#region operator6
  operator6(event) {
    this.model.operator_6 = event.target.value;
  }
  //#endregion operator1

  //#region operator7
  operator7(event) {
    this.model.operator_7 = event.target.value;
  }
  //#endregion operator1

  //#region operator8
  operator8(event) {
    this.model.operator_8 = event.target.value;
  }
  //#endregion operator1

  //#region operator9
  operator9(event) {
    this.model.operator_9 = event.target.value;
  }
  //#endregion operator1

  //#region operator10
  operator10(event) {
    this.model.operator_10 = event.target.value;
  }
  //#endregion operator1

  //#region lookup dimension 1
  btnLookupDimension1() {
    this.id = 1;
    this.listDimensionPush = [];
    this.listDimensionPush.push({ p_id: this.model.dim_1 })
    this.listDimensionPush.push({ p_id: this.model.dim_2 })
    this.listDimensionPush.push({ p_id: this.model.dim_3 })
    this.listDimensionPush.push({ p_id: this.model.dim_4 })
    this.listDimensionPush.push({ p_id: this.model.dim_5 })
    this.listDimensionPush.push({ p_id: this.model.dim_6 })
    this.listDimensionPush.push({ p_id: this.model.dim_7 })
    this.listDimensionPush.push({ p_id: this.model.dim_8 })
    this.listDimensionPush.push({ p_id: this.model.dim_9 })
    this.listDimensionPush.push({ p_id: this.model.dim_10 })
    $('#datatableDimension').DataTable().clear().destroy();
    $('#datatableDimension').DataTable({
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
          'p_array_data': JSON.stringify(this.listDimensionPush),
        });
        
        this.dalservice.Getrows(dtParameters, this.APIControllerSysDimension, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupdimension = parse.data;
          if (parse.data != null) {
            this.lookupdimension.numberIndex = dtParameters.start;
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

  }
  //#endregion lookup dimension

  //#region lookup dimension 2
  btnLookupDimension2() {
    this.id = 2;
    this.listDimensionPush = [];
    this.listDimensionPush.push({ p_id: this.model.dim_1 })
    this.listDimensionPush.push({ p_id: this.model.dim_2 })
    this.listDimensionPush.push({ p_id: this.model.dim_3 })
    this.listDimensionPush.push({ p_id: this.model.dim_4 })
    this.listDimensionPush.push({ p_id: this.model.dim_5 })
    this.listDimensionPush.push({ p_id: this.model.dim_6 })
    this.listDimensionPush.push({ p_id: this.model.dim_7 })
    this.listDimensionPush.push({ p_id: this.model.dim_8 })
    this.listDimensionPush.push({ p_id: this.model.dim_9 })
    this.listDimensionPush.push({ p_id: this.model.dim_10 })
    $('#datatableDimension').DataTable().clear().destroy();
    $('#datatableDimension').DataTable({
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
          'p_array_data': JSON.stringify(this.listDimensionPush)
        });
        
        this.dalservice.Getrows(dtParameters, this.APIControllerSysDimension, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);

          this.lookupdimension = parse.data;
          if (parse.data != null) {
            this.lookupdimension.numberIndex = dtParameters.start;
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
  }
  //#endregion lookup dimension 2

  //#region lookup dimension 3
  btnLookupDimension3() {
    this.id = 3;
    this.listDimensionPush = [];
    this.listDimensionPush.push({ p_id: this.model.dim_1 })
    this.listDimensionPush.push({ p_id: this.model.dim_2 })
    this.listDimensionPush.push({ p_id: this.model.dim_3 })
    this.listDimensionPush.push({ p_id: this.model.dim_4 })
    this.listDimensionPush.push({ p_id: this.model.dim_5 })
    this.listDimensionPush.push({ p_id: this.model.dim_6 })
    this.listDimensionPush.push({ p_id: this.model.dim_7 })
    this.listDimensionPush.push({ p_id: this.model.dim_8 })
    this.listDimensionPush.push({ p_id: this.model.dim_9 })
    this.listDimensionPush.push({ p_id: this.model.dim_10 })
    $('#datatableDimension').DataTable().clear().destroy();
    $('#datatableDimension').DataTable({
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
          'p_array_data': JSON.stringify(this.listDimensionPush)
        });
        
        this.dalservice.Getrows(dtParameters, this.APIControllerSysDimension, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);

          this.lookupdimension = parse.data;
          if (parse.data != null) {
            this.lookupdimension.numberIndex = dtParameters.start;
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
  }
  //#endregion lookup dimension 3

  //#region lookup dimension 4
  btnLookupDimension4() {
    this.id = 4;
    this.listDimensionPush = [];
    this.listDimensionPush.push({ p_id: this.model.dim_1 })
    this.listDimensionPush.push({ p_id: this.model.dim_2 })
    this.listDimensionPush.push({ p_id: this.model.dim_3 })
    this.listDimensionPush.push({ p_id: this.model.dim_4 })
    this.listDimensionPush.push({ p_id: this.model.dim_5 })
    this.listDimensionPush.push({ p_id: this.model.dim_6 })
    this.listDimensionPush.push({ p_id: this.model.dim_7 })
    this.listDimensionPush.push({ p_id: this.model.dim_8 })
    this.listDimensionPush.push({ p_id: this.model.dim_9 })
    this.listDimensionPush.push({ p_id: this.model.dim_10 })
    $('#datatableDimension').DataTable().clear().destroy();
    $('#datatableDimension').DataTable({
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
          'p_array_data': JSON.stringify(this.listDimensionPush)
        });
        
        this.dalservice.Getrows(dtParameters, this.APIControllerSysDimension, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);

          this.lookupdimension = parse.data;
          if (parse.data != null) {
            this.lookupdimension.numberIndex = dtParameters.start;
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
  }
  //#endregion lookup dimension 4

  //#region lookup dimension 5
  btnLookupDimension5() {
    this.id = 5;
    this.listDimensionPush = [];
    this.listDimensionPush.push({ p_id: this.model.dim_1 })
    this.listDimensionPush.push({ p_id: this.model.dim_2 })
    this.listDimensionPush.push({ p_id: this.model.dim_3 })
    this.listDimensionPush.push({ p_id: this.model.dim_4 })
    this.listDimensionPush.push({ p_id: this.model.dim_5 })
    this.listDimensionPush.push({ p_id: this.model.dim_6 })
    this.listDimensionPush.push({ p_id: this.model.dim_7 })
    this.listDimensionPush.push({ p_id: this.model.dim_8 })
    this.listDimensionPush.push({ p_id: this.model.dim_9 })
    this.listDimensionPush.push({ p_id: this.model.dim_10 })
    $('#datatableDimension').DataTable().clear().destroy();
    $('#datatableDimension').DataTable({
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
          'p_array_data': JSON.stringify(this.listDimensionPush)
        });
        
        this.dalservice.Getrows(dtParameters, this.APIControllerSysDimension, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);

          this.lookupdimension = parse.data;
          if (parse.data != null) {
            this.lookupdimension.numberIndex = dtParameters.start;
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
  }
  //#endregion lookup dimension 5

  //#region lookup dimension 6
  btnLookupDimension6() {
    this.id = 6;
    this.listDimensionPush = [];
    this.listDimensionPush.push({ p_id: this.model.dim_1 })
    this.listDimensionPush.push({ p_id: this.model.dim_2 })
    this.listDimensionPush.push({ p_id: this.model.dim_3 })
    this.listDimensionPush.push({ p_id: this.model.dim_4 })
    this.listDimensionPush.push({ p_id: this.model.dim_5 })
    this.listDimensionPush.push({ p_id: this.model.dim_6 })
    this.listDimensionPush.push({ p_id: this.model.dim_7 })
    this.listDimensionPush.push({ p_id: this.model.dim_8 })
    this.listDimensionPush.push({ p_id: this.model.dim_9 })
    this.listDimensionPush.push({ p_id: this.model.dim_10 })
    $('#datatableDimension').DataTable().clear().destroy();
    $('#datatableDimension').DataTable({
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
          'p_array_data': JSON.stringify(this.listDimensionPush)
        });
        
        this.dalservice.Getrows(dtParameters, this.APIControllerSysDimension, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);

          this.lookupdimension = parse.data;
          if (parse.data != null) {
            this.lookupdimension.numberIndex = dtParameters.start;
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
  }
  //#endregion lookup dimension 6

  //#region lookup dimension 7
  btnLookupDimension7() {
    this.id = 7;
    this.listDimensionPush = [];
    this.listDimensionPush.push({ p_id: this.model.dim_1 })
    this.listDimensionPush.push({ p_id: this.model.dim_2 })
    this.listDimensionPush.push({ p_id: this.model.dim_3 })
    this.listDimensionPush.push({ p_id: this.model.dim_4 })
    this.listDimensionPush.push({ p_id: this.model.dim_5 })
    this.listDimensionPush.push({ p_id: this.model.dim_6 })
    this.listDimensionPush.push({ p_id: this.model.dim_7 })
    this.listDimensionPush.push({ p_id: this.model.dim_8 })
    this.listDimensionPush.push({ p_id: this.model.dim_9 })
    this.listDimensionPush.push({ p_id: this.model.dim_10 })
    $('#datatableDimension').DataTable().clear().destroy();
    $('#datatableDimension').DataTable({
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
          'p_array_data': JSON.stringify(this.listDimensionPush)
        });
        
        this.dalservice.Getrows(dtParameters, this.APIControllerSysDimension, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);

          this.lookupdimension = parse.data;
          if (parse.data != null) {
            this.lookupdimension.numberIndex = dtParameters.start;
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
  }
  //#endregion lookup dimension 7

  //#region lookup dimension 8
  btnLookupDimension8() {
    this.id = 8;
    this.listDimensionPush = [];
    this.listDimensionPush.push({ p_id: this.model.dim_1 })
    this.listDimensionPush.push({ p_id: this.model.dim_2 })
    this.listDimensionPush.push({ p_id: this.model.dim_3 })
    this.listDimensionPush.push({ p_id: this.model.dim_4 })
    this.listDimensionPush.push({ p_id: this.model.dim_5 })
    this.listDimensionPush.push({ p_id: this.model.dim_6 })
    this.listDimensionPush.push({ p_id: this.model.dim_7 })
    this.listDimensionPush.push({ p_id: this.model.dim_8 })
    this.listDimensionPush.push({ p_id: this.model.dim_9 })
    this.listDimensionPush.push({ p_id: this.model.dim_10 })
    $('#datatableDimension').DataTable().clear().destroy();
    $('#datatableDimension').DataTable({
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
          'p_array_data': JSON.stringify(this.listDimensionPush)
        });
        
        this.dalservice.Getrows(dtParameters, this.APIControllerSysDimension, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);

          this.lookupdimension = parse.data;
          if (parse.data != null) {
            this.lookupdimension.numberIndex = dtParameters.start;
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
  }
  //#endregion lookup dimension 8

  //#region lookup dimension 9
  btnLookupDimension9() {
    this.id = 9;
    this.listDimensionPush = [];
    this.listDimensionPush.push({ p_id: this.model.dim_1 })
    this.listDimensionPush.push({ p_id: this.model.dim_2 })
    this.listDimensionPush.push({ p_id: this.model.dim_3 })
    this.listDimensionPush.push({ p_id: this.model.dim_4 })
    this.listDimensionPush.push({ p_id: this.model.dim_5 })
    this.listDimensionPush.push({ p_id: this.model.dim_6 })
    this.listDimensionPush.push({ p_id: this.model.dim_7 })
    this.listDimensionPush.push({ p_id: this.model.dim_8 })
    this.listDimensionPush.push({ p_id: this.model.dim_9 })
    this.listDimensionPush.push({ p_id: this.model.dim_10 })
    $('#datatableDimension').DataTable().clear().destroy();
    $('#datatableDimension').DataTable({
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
          'p_array_data': JSON.stringify(this.listDimensionPush)
        });
        
        this.dalservice.Getrows(dtParameters, this.APIControllerSysDimension, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);

          this.lookupdimension = parse.data;
          if (parse.data != null) {
            this.lookupdimension.numberIndex = dtParameters.start;
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
  }
  //#endregion lookup dimension 9

  //#region lookup dimension 10
  btnLookupDimension10() {
    this.id = 10;
    this.listDimensionPush = [];
    this.listDimensionPush.push({ p_id: this.model.dim_1 })
    this.listDimensionPush.push({ p_id: this.model.dim_2 })
    this.listDimensionPush.push({ p_id: this.model.dim_3 })
    this.listDimensionPush.push({ p_id: this.model.dim_4 })
    this.listDimensionPush.push({ p_id: this.model.dim_5 })
    this.listDimensionPush.push({ p_id: this.model.dim_6 })
    this.listDimensionPush.push({ p_id: this.model.dim_7 })
    this.listDimensionPush.push({ p_id: this.model.dim_8 })
    this.listDimensionPush.push({ p_id: this.model.dim_9 })
    this.listDimensionPush.push({ p_id: this.model.dim_10 })
    $('#datatableDimension').DataTable().clear().destroy();
    $('#datatableDimension').DataTable({
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
          'p_array_data': JSON.stringify(this.listDimensionPush)
        });
        
        this.dalservice.Getrows(dtParameters, this.APIControllerSysDimension, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);

          this.lookupdimension = parse.data;
          if (parse.data != null) {
            this.lookupdimension.numberIndex = dtParameters.start;
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
  }
  //#endregion lookup dimension 10

  //#region lookup dimension value
  btnLookupDimensionValue(id: any, type: any) {
    this.current_id = id
    this.current_type = type
    if (id == 1) {
      this.model.dimension_code = this.model.dim_1
    } else if (id == 2) {
      this.model.dimension_code = this.model.dim_2
    } else if (id == 3) {
      this.model.dimension_code = this.model.dim_3
    } else if (id == 4) {
      this.model.dimension_code = this.model.dim_4
    } else if (id == 5) {
      this.model.dimension_code = this.model.dim_5
    } else if (id == 6) {
      this.model.dimension_code = this.model.dim_6
    } else if (id == 7) {
      this.model.dimension_code = this.model.dim_7
    } else if (id == 8) {
      this.model.dimension_code = this.model.dim_8
    } else if (id == 9) {
      this.model.dimension_code = this.model.dim_9
    } else if (id == 10) {
      this.model.dimension_code = this.model.dim_10
    }

    $('#datatableLookupDimensionValue').DataTable().clear().destroy();
    $('#datatableLookupDimensionValue').DataTable({
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
          'p_dimension_code': this.model.dimension_code
        });
        
        this.dalservice.Getrows(dtParameters, this.APIControllerSysDimensionValue, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupdimensionvalue = parse.data;

          if (parse.data != null) {
            this.lookupdimensionvalue.numberIndex = dtParameters.start;
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
  }
  btnSelectRowDimensionValue(dimension_value: String, dimension_description: String) {
    console.log(this.current_type);
    console.log(dimension_value);
    console.log(dimension_description);

    if (this.current_type === 'from') {
      if (this.current_id == 1) {
        this.model.dim_value_from_1 = dimension_value
        this.model.from_dimension_description1 = dimension_description
      } else if (this.current_id == 2) {
        this.model.dim_value_from_2 = dimension_value
        this.model.from_dimension_description2 = dimension_description
      } else if (this.current_id == 3) {
        this.model.dim_value_from_3 = dimension_value
        this.model.from_dimension_description3 = dimension_description
      } else if (this.current_id == 4) {
        this.model.dim_value_from_4 = dimension_value
        this.model.from_dimension_description4 = dimension_description
      } else if (this.current_id == 5) {
        this.model.dim_value_from_5 = dimension_value
        this.model.from_dimension_description5 = dimension_description
      } else if (this.current_id == 6) {
        this.model.dim_value_from_6 = dimension_value
        this.model.from_dimension_description6 = dimension_description
      } else if (this.current_id == 7) {
        this.model.dim_value_from_7 = dimension_value
        this.model.from_dimension_description7 = dimension_description
      } else if (this.current_id == 8) {
        this.model.dim_value_from_8 = dimension_value
        this.model.from_dimension_description8 = dimension_description
      } else if (this.current_id == 9) {
        this.model.dim_value_from_9 = dimension_value
        this.model.from_dimension_description9 = dimension_description
      } else if (this.current_id == 10) {
        this.model.dim_value_from_10 = dimension_value
        this.model.from_dimension_description10 = dimension_description
      }

    } else {
      if (this.current_id == 1) {
        this.model.dim_value_to_1 = dimension_value
        this.model.to_dimension_description1 = dimension_description
      } else if (this.current_id == 2) {
        this.model.dim_value_from_2 = dimension_value
        this.model.to_dimension_description2 = dimension_description
      } else if (this.current_id == 3) {
        this.model.dim_value_from_3 = dimension_value
        this.model.to_dimension_description3 = dimension_description
      } else if (this.current_id == 4) {
        this.model.dim_value_from_4 = dimension_value
        this.model.to_dimension_description4 = dimension_description
      } else if (this.current_id == 5) {
        this.model.dim_value_from_5 = dimension_value
        this.model.to_dimension_description5 = dimension_description
      } else if (this.current_id == 6) {
        this.model.dim_value_from_6 = dimension_value
        this.model.to_dimension_description6 = dimension_description
      } else if (this.current_id == 7) {
        this.model.dim_value_from_7 = dimension_value
        this.model.to_dimension_description7 = dimension_description
      } else if (this.current_id == 8) {
        this.model.dim_value_from_8 = dimension_value
        this.model.to_dimension_description8 = dimension_description
      } else if (this.current_id == 9) {
        this.model.dim_value_from_9 = dimension_value
        this.model.to_dimension_description9 = dimension_description
      } else if (this.current_id == 10) {
        this.model.dim_value_from_10 = dimension_value
        this.model.to_dimension_description10 = dimension_description
      }
    }

    $('#lookupModalDimensionValue').modal('hide');
  }
  //#endregion lookup dimension value

  //#region button Select Row Dimension
  btnSelectRowDimension(code: String, description: string) {
    // debugger;
    if (this.id === 1) {
      this.model.dim_1 = code;
      this.model.dimension1_name = description;
      this.id = '';
    } else if (this.id === 2) {
      this.model.dim_2 = code;
      this.model.dimension2_name = description;
      this.id = '';
    } else if (this.id === 3) {
      this.model.dim_3 = code;
      this.model.dimension3_name = description;
      this.id = '';
    } else if (this.id === 4) {
      this.model.dim_4 = code;
      this.model.dimension4_name = description;
      this.id = '';
    } else if (this.id === 5) {
      this.model.dim_5 = code;
      this.model.dimension5_name = description;
      this.id = '';
    } else if (this.id === 6) {
      this.model.dim_6 = code;
      this.model.dimension6_name = description;
      this.id = '';
    } else if (this.id === 7) {
      this.model.dim_7 = code;
      this.model.dimension7_name = description;
      this.id = '';
    } else if (this.id === 8) {
      this.model.dim_8 = code;
      this.model.dimension8_name = description;
      this.id = '';
    } else if (this.id === 9) {
      this.model.dim_9 = code;
      this.model.dimension9_name = description;
      this.id = '';
    } else if (this.id === 10) {
      this.model.dim_10 = code;
      this.model.dimension10_name = description;
      this.id = '';
    }
    $('#lookupModalDimension').modal('hide');
  }
  //#endregion button Select Row Dimension
}
