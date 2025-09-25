import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';

@Component({
  moduleId: module.id,
  selector: 'app-masteruploadtabledetail',
  templateUrl: './masteruploadtabledetail.component.html'
})

export class MasterUploadTabledetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public isReadOnly: Boolean = false;
  public lookupuploadtablecolumn: any = [];
  private listuploadtabledetail: any = [];

  private dataTamp: any = [];
  private masteruploadtabledetailData: any = [];
  public dataTampPush: any = [];
  private APIController: String = 'MasterUploadTable';
  private APIControllerMasterUploadTabelColumn: String = 'MasterUploadTabelColumn';
  private APIRouteForLookupUploadTableDetail: String = 'GetRowsForLookupMasterUploadTableDetail';
  private APIRouteForGetRow: String = 'Getrow';
  private APIRouteForGetRows: String = 'Getrows';
  private APIRouteForInsert: String = 'Insert';
  private APIRouteForUpdate: String = 'Update';
  private APIRouteForDelete: String = 'Delete';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private RoleAccessCode = 'R00002720000273A';

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = true;
  // end

  // datatable
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
      this.showSpinner = false;
    }
  }

  //#region button save in list
  // saveList() {

  //   this.listuploadtabledetail = [];

  //   let i = 0;

  //   const getID = $('[name="p_id"]')
  //     .map(function () { return $(this).val(); }).get();

  //   const getParamGeneric1 = $('[name="p_param_generic_1"]')
  //     .map(function () { return $(this).val(); }).get();

  //   const getParamGeneric2 = $('[name="p_param_generic_2"]')
  //     .map(function () { return $(this).val(); }).get();

  //   while (i < getID.length) {

  //     while (i < getParamGeneric1.length) {

  //       while (i < getParamGeneric2.length) {

  //         // const getPbsNo = $('[name="p_public_service_no"]')
  //         //   .map(function () { return $(this).val(); }).get();

  //         // tslint:disable-next-line: no-shadowed-variable
  //         this.listuploadtabledetail.push({
  //           p_id: getID[i],
  //           p_upload_tabel_code: this.param,
  //           p_param_generic_1: getParamGeneric1[i],
  //           p_param_generic_2: getParamGeneric2[i]
  //         });

  //         i++;
  //       }

  //       i++;
  //     }

  //     i++;
  //   }

  //   this.dalservice.Update(this.listuploadtabledetail, this.APIControllerMasterUploadTableDetail, this.APIRouteForUpdate)
  //     .subscribe(
  //       res => {
  //         this.showSpinner = false;
  //         const parse = JSON.parse(res);
  //         if (parse.result === 1) {
  //           $('#datatable').DataTable().ajax.reload();
  //           this.showNotification('bottom', 'right', 'success');
  //         } else {
  //           this.swalPopUpMsg(parse.data);
  //         }
  //       },
  //       error => {
  //         this.showSpinner = false;
  //         const parse = JSON.parse(error);
  //         this.swalPopUpMsg(parse.data);
  //       });
  // }
  //#endregion button save in list

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

          // checkbox is_active
          if (parsedata.is_active === '1') {
            parsedata.is_active = true;
          } else {
            parsedata.is_active = false;
          }
          // end checkbox is_active

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
  onFormSubmit(masteruploadtabledetailForm: NgForm, isValid: boolean) {
    // validation form submit
    if (!isValid) {
      swal({
        title: 'Warning',
        text: 'Please Fill a Mandatory Field OR Format Is Invalid',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-danger',
        type: 'warning'
      }).catch(swal.noop)
      return;
    } else {
      this.showSpinner = true;
    }

    this.masteruploadtabledetailData = masteruploadtabledetailForm;
    if (this.masteruploadtabledetailData.p_is_active == null) {
      this.masteruploadtabledetailData.p_is_active = false;
    }
    const usersJson: any[] = Array.of(this.masteruploadtabledetailData);
    if (this.param != null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
        .subscribe(
          res => {
            this.showSpinner = false;
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showNotification('bottom', 'right', 'success');
              this.callGetrow()
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
      this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
        .subscribe(
          res => {
            this.showSpinner = false;
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showNotification('bottom', 'right', 'success');
              this.route.navigate(['/upload/submasteruploadtablelist/masteruploadtabledetail', parse.code]);
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

  //#region button back
  btnBack() {
    this.route.navigate(['/upload/submasteruploadtablelist']);
    $('#datatables').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region checkall table delete
  btnDeleteAll() {
    this.checkedList = [];
    for (let i = 0; i < this.listuploadtabledetail.length; i++) {
      if (this.listuploadtabledetail[i].selected) {
        this.checkedList.push(this.listuploadtabledetail[i].code);
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
    for (let J = 0; J < this.checkedList.length; J++) {
      
      this.dataTampPush.push({
        'p_code': this.checkedList[J]
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
        this.dalservice.Delete(this.dataTampPush, this.APIControllerMasterUploadTabelColumn, this.APIRouteForDelete)
          .subscribe(
            res => {
              this.showSpinner = false;
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                $('#datatables').DataTable().ajax.reload();
                this.showNotification('bottom', 'right', 'success');
              } else {
                this.swalPopUpMsg(parse.data)
              }
            },
            error => {
              this.showSpinner = false;
              const parse = JSON.parse(error);
              this.swalPopUpMsg(parse.data)
            });
      } else {
        this.showSpinner = false;
      }
    });
  }

  selectAllTable() {
    for (let i = 0; i < this.listuploadtabledetail.length; i++) {
      this.listuploadtabledetail[i].selected = this.selectedAllTable;
    }
  }

  checkIfAllTableSelected() {
    this.selectedAllTable = this.listuploadtabledetail.every(function (item: any) {
      return item.selected === true;
    })
  }
  //#endregion checkall table delete

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
          'p_upload_tabel_code': this.param
        });
        
        // tslint:disable-next-line:max-line-length
        this.dalservice.Getrows(dtParameters, this.APIControllerMasterUploadTabelColumn, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)

          this.listuploadtabledetail = parse.data;

          if (parse.data != null) {
            this.listuploadtabledetail.numberIndex = dtParameters.start;
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

        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 6] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion load all data

  //#region button edit
  btnEdit(codeEdit: string) {
    this.route.navigate(['/upload/submasteruploadtablelist/masteruploadtabledetaildetail', this.param, codeEdit, this.model.tabel_name]);
  }
  //#endregion button edit

  //#region lookup Upload Validation
  btnLookupUploadTableColumn() {
    const paramTableName = $('#tablename').val();

    $('#datatableLookupUploadTableColumn').DataTable().clear().destroy();
    $('#datatableLookupUploadTableColumn').DataTable({
      'pagingType': 'full_numbers',
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // ini untuk hilangin search box nya
      ajax: (dtParameters: any, callback) => {

        
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_tabel_name': paramTableName,
          'p_upload_tabel_code': this.param
        });
        

        this.dalservice.Getrows(dtParameters, this.APIControllerMasterUploadTabelColumn, this.APIRouteForLookupUploadTableDetail).subscribe(resp => {
          const parse = JSON.parse(resp);

          // if use checkAll use this
          $('#checkallLookup').prop('checked', false);
          // end checkall

          this.lookupuploadtablecolumn = parse.data;

          if (parse.data != null) {
            this.lookupuploadtablecolumn.numberIndex = dtParameters.start;
          }

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
  //#endregion lookup Upload Validation

  //#region checkbox all lookup
  btnSelectAllLookup() {
    this.checkedLookup = [];
    for (let i = 0; i < this.lookupuploadtablecolumn.length; i++) {
      if (this.lookupuploadtablecolumn[i].selectedLookup) {
        this.checkedLookup.push(this.lookupuploadtablecolumn[i].column_name);
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
    this.dataTampPush = [];
    for (let J = 0; J < this.checkedLookup.length; J++) {
      
      const columnname = this.checkedLookup[J];
      this.dataTampPush.push({
        'p_upload_tabel_code': this.param,
        'p_column_name': columnname
      });
      
    }

    this.showSpinner = true;

    this.dalservice.Insert(this.dataTampPush, this.APIControllerMasterUploadTabelColumn, this.APIRouteForInsert)
      .subscribe(
        res => {
          this.showSpinner = false;
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            $('#datatables').DataTable().ajax.reload();
            this.showNotification('bottom', 'right', 'success');
            $('#datatableLookupUploadTableColumn').DataTable().ajax.reload();
            $('#datatables').DataTable().ajax.reload();
          } else {
            this.swalPopUpMsg(parse.data);
          }
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data)
        })
  }

  selectAllLookup() {
    for (let i = 0; i < this.lookupuploadtablecolumn.length; i++) {
      this.lookupuploadtablecolumn[i].selectedLookup = this.selectedAllLookup;
    }
  }

  checkIfAllLookupSelected() {
    this.selectedAllLookup = this.lookupuploadtablecolumn.every(function (item: any) {
      return item.selectedLookup === true;
    })
  }
  //#endregion checkbox all lookup

}
