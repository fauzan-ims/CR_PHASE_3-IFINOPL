import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import swal from 'sweetalert2';
import { DALService } from '../../../../../DALservice.service';
import { NgForm } from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './deliverydetail.component.html'
})

export class DeliverydetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  pageType = this.getRouteparam.snapshot.paramMap.get('page');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public isStatus: Boolean = false;
  public isProceed: Boolean = false;
  public isCancel: Boolean = false;
  public deliverydetailData: any = [];
  public listapplicationasset: any = [];
  public lookupemployee: any = [];
  public lookupasset: any = [];
  public setStyle: any = [];
  private dataTamp: any = [];

  private APIController: String = 'AssetDelivery';
  private APIControllerApplicationAsset: String = 'ApplicationAsset';
  private APIControllerMasterAsset: String = 'AgreementInformation';
  private APIControllerSysEmployee = 'SysEmployeeMain';

  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForGetRows: String = 'GetRowsForAssetDelivery';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForUpdate: String = 'Update';
  private APIRouteForDelete: String = 'Delete';
  private APIRouteForProceed: String = 'ExecSpForProceed';
  private APIRouteForCancel: String = 'ExecSpForCancel';

  private RoleAccessCode = 'R00020670000000A'; // role access 

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = false;
  // end

  // checklist
  public selectedAll: any;
  private checkedList: any = [];

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
    this.Delimiter(this._elementRef);
    // call web service
    this.callGetrow();
    this.loadData();
  }

  //#region load all data
  loadData() {
    this.dtOptions = {
      'pagingType': 'first_last_numbers',
      'pageLength': 10,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false
      ajax: (dtParameters: any, callback) => {
        
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_delivery_code': this.param
        })
        
        this.dalservice.Getrows(dtParameters, this.APIControllerApplicationAsset, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listapplicationasset = parse.data;
          if (parse.data != null) {
            this.listapplicationasset.numberIndex = dtParameters.start;
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
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 8] }], // for disabled coloumn
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
      'p_code': this.param
    }];
    
    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

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

  //#region btnProceed
  btnProceed(code: any) {

  }
  //#endregion btnProceed

  //#region btnCancel
  btnCancel(code: any) {

  }
  //#endregion btnCancel

  //#region button back
  btnBack() {
    this.route.navigate(['/golive/subdeliverylist']);
    $('#datatableDeliverylist').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region  form submit
  onFormSubmit(deliverydetailForm: NgForm, isValid: boolean) {
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

    this.deliverydetailData = this.JSToNumberFloats(deliverydetailForm);
    const usersJson: any[] = Array.of(this.deliverydetailData);
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
            this.swalPopUpMsg(parse.data);
            this.showSpinner = false;
          }
        },
        error => {
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
          this.showSpinner = false;
        });
  }
  //#endregion form submit

  //#region lookup Employee
  btnLookupModalEmployee() {
    $('#datatableEmployee').DataTable().clear().destroy();
    $('#datatableEmployee').DataTable({
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

        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysEmployee, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupemployee = parse.data;
          if (parse.data != null) {
            this.lookupemployee.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API)' + err));
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

  btnSelectRowModule(code: String, name: String) {
    this.model.employee_code = code;
    this.model.employee_name = name;
    $('#lookupModalEmployee').modal('hide');
  }
  //#endregion lookup Employee

  //#region checkbox all table
  btnDeleteAll() {
    this.checkedList = [];
    for (let i = 0; i < this.listapplicationasset.length; i++) {
      if (this.listapplicationasset[i].selected) {
        this.checkedList.push(this.listapplicationasset[i].id);
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
          const code = this.checkedList[J];
          
          this.dataTamp = [{
            'p_id': code,
            'p_application_no': this.param
          }];
          
          this.dalservice.Delete(this.dataTamp, this.APIController, this.APIRouteForDelete)
            .subscribe(
              res => {
                const parse = JSON.parse(res);
                if (parse.result === 1) {
                  if (this.checkedList.length == J + 1) {
                    this.showSpinner = false;
                    $('#applicationDetail').click();
                    this.showNotification('bottom', 'right', 'success');
                    $('#datatableApplicationFee').DataTable().ajax.reload();
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
    for (let i = 0; i < this.listapplicationasset.length; i++) {
      if (this.listapplicationasset[i].is_calculated !== '1') {
        this.listapplicationasset[i].selected = this.selectedAll;
      }
    }
  }

  checkIfAllTableSelected() {
    this.selectedAll = this.listapplicationasset.every(function (item: any) {
      return item.selected === true;
    })
  }
  //#endregion checkbox all table

  //#region button edit
  btnEdit(codeEdit: String) {
    this.route.navigate(['/golive/subdeliverylist/deliveryassetdetail', this.param, codeEdit]);
  }
  //#endregion button edit
}