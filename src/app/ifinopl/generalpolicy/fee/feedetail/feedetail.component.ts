import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './feedetail.component.html'
})

export class MasterFeedetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public feedetailData: any = [];
  public listfeeamount: any = [];
  public lookupfacility: any = [];
  public lookupPsakGllink: any = [];
  public lookupGllink: any = [];
  public isReadOnly: Boolean = false;
  public dataTamp: any = [];
  public dataTampPush: any = [];

  private APIController: String = 'MasterFee';
  private APIControllerFeeAmount: String = 'MasterFeeAmount';
  private APIControllerFacility: String = 'MasterFacility';
  private APIControllerGllink: String = 'JournalGlLink';

  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForGetRows: String = 'GETROWS';
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForDelete: String = 'DELETE';

  private RoleAccessCode = 'R00016860000000A'; // role access 

  // checklist
  public selectedAll: any;
  private checkedList: any = [];

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
    if (this.param != null) {
      this.isReadOnly = true;

      // call web service
      this.loadData();
      this.model.facility_code = 'ALL';
      this.callGetrow();
    } else {
      this.showSpinner = false;
    }
  }

  //#region isCalculatePsak
  isCalculatePsak(event) {
    this.model.is_calculate_psak = event.target.checked;
    this.model.psak_gl_link_code = undefined;
    this.model.psak_gl_link_name = undefined;
  }
  //#endregion isCalculatePsak

  //#region PsakGllink
  btnLookupPsakGllink() {
    $('#datatableLookupPsakGllink').DataTable().clear().destroy();
    $('#datatableLookupPsakGllink').DataTable({
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

        this.dalservice.Getrows(dtParameters, this.APIControllerGllink, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupPsakGllink = parse.data;
          if (parse.data != null) {
            this.lookupPsakGllink.numberIndex = dtParameters.start;
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
        infoEmpty: '<p style="color:red;">No Data Available !</p>'
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowPsakGllink(code: String, gl_link_name: String) {
    this.model.psak_gl_link_code = code;
    this.model.psak_gl_link_name = gl_link_name;
    $('#lookupModalPsakGllink').modal('hide');
  }
  //#endregion PsakGllink

  //#region Gllink
  btnLookupGllink() {
    $('#datatableLookupGllink').DataTable().clear().destroy();
    $('#datatableLookupGllink').DataTable({
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

        this.dalservice.Getrows(dtParameters, this.APIControllerGllink, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupGllink = parse.data;
          if (parse.data != null) {
            this.lookupGllink.numberIndex = dtParameters.start;
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
        infoEmpty: '<p style="color:red;">No Data Available !</p>'
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowGllink(code: String, gl_link_name: String) {
    this.model.gl_link_code = code;
    this.model.gl_link_name = gl_link_name;
    $('#lookupModalGllink').modal('hide');
  }
  //#endregion Gllink

  //#region Facility Lookup
  btnLookupFacility() {
    $('#datatableLookupFacility').DataTable().clear().destroy();
    $('#datatableLookupFacility').DataTable({
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

        this.dalservice.Getrows(dtParameters, this.APIControllerFacility, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupfacility = parse.data;
          if (parse.data != null) {
            this.lookupfacility.numberIndex = dtParameters.start;
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

  btnSelectRowFacility(code: String, description: String) {
    this.model.facility_code = code;
    this.model.facility_desc = description;
    $('#lookupModalFacility').modal('hide');
    $('#datatableFeeAmount').DataTable().ajax.reload();
  }
  //#endregion Facility lookup

  //#region resteFacility
  resteFacility() {
    this.model.facility_code = 'ALL';
    this.model.facility_desc = undefined;
    $('#datatableFeeAmount').DataTable().ajax.reload();
  }
  //#endregion resteFacility

  //#region getrow data
  callGetrow() {

    this.dataTamp = [{
      'p_code': this.param
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];

          // checkbox
          if (parsedata.is_calculate_psak === '1') {
            parsedata.is_calculate_psak = true;
          } else {
            parsedata.is_calculate_psak = false;
          }
          if (parsedata.is_calculated === '1') {
            parsedata.is_calculated = true;
          } else {
            parsedata.is_calculated = false;
          }
          if (parsedata.is_active === '1') {
            parsedata.is_active = true;
          } else {
            parsedata.is_active = false;
          }
          // end checkbox

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
          'p_fee_code': this.param,
          'p_facility_code': this.model.facility_code
        });

        this.dalservice.Getrows(dtParameters, this.APIControllerFeeAmount, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listfeeamount = parse.data;
          if (parse.data != null) {
            this.listfeeamount.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 9] }], // for disabled coloumn
      order: [[1, 'desc']],
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion load all data

  //#region  form submit
  onFormSubmit(feedetailForm: NgForm, isValid: boolean) {
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

    this.feedetailData = feedetailForm;
    if (this.feedetailData.p_is_calculate_psak == null) {
      this.feedetailData.p_is_calculate_psak = false;
    }
    if (this.feedetailData.p_is_calculated == null) {
      this.feedetailData.p_is_calculated = false;
    }
    if (this.feedetailData.p_is_active == null) {
      this.feedetailData.p_is_active = false;
    }
    const usersJson: any[] = Array.of(this.feedetailData);

    if (this.param != null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.callGetrow();
              this.showNotification('bottom', 'right', 'success');
              this.showSpinner = false;
            } else {
              this.showSpinner = false;
              this.swalPopUpMsg(parse.data);
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
              this.route.navigate(['/generalpolicy/subfeelist/feedetail', this.feedetailData.p_code]);
            } else {
              this.showSpinner = false;
              this.swalPopUpMsg(parse.data);
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

  //#region button add
  btnAdd() {
    this.route.navigate(['/generalpolicy/subfeelist/feeamountdetail', this.param]);
  }
  //#endregion button add

  //#region button edit
  btnEdit(codeEdit: string) {
    this.route.navigate(['/generalpolicy/subfeelist/feeamountdetail', this.param, codeEdit]);
  }
  //#endregion button edit

  //#region button back
  btnBack() {
    this.route.navigate(['/generalpolicy/subfeelist']);
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region checkbox all table
  btnDeleteAll() {
    this.checkedList = [];
    for (let i = 0; i < this.listfeeamount.length; i++) {
      if (this.listfeeamount[i].selected) {
        this.checkedList.push(this.listfeeamount[i].code);
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
      allowOutsideClick: false,
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
        for (let J = 0; J < this.checkedList.length; J++) {

          this.dataTampPush.push({
            'p_code': this.checkedList[J]
          });

          this.dalservice.Delete(this.dataTampPush, this.APIControllerFeeAmount, this.APIRouteForDelete)
            .subscribe(
              res => {
                const parse = JSON.parse(res);
                if (parse.result === 1) {
                  if (this.checkedList.length == J + 1) {
                    this.showSpinner = false;
                    this.showNotification('bottom', 'right', 'success');
                    $('#datatableFeeAmount').DataTable().ajax.reload();
                  }
                } else {
                  this.showSpinner = false;
                  this.swalPopUpMsg(parse.data);
                }
              },
              error => {
                this.showSpinner = false;
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
    for (let i = 0; i < this.listfeeamount.length; i++) {
      this.listfeeamount[i].selected = this.selectedAll;
    }
  }

  checkIfAllTableSelected() {
    this.selectedAll = this.listfeeamount.every(function (item: any) {
      return item.selected === true;
    })
  }
  //#endregion checkbox all table
}