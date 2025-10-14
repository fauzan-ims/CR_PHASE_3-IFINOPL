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
  templateUrl: './assetallocationdetail.component.html'
})

export class AssetallocationdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  pageType = this.getRouteparam.snapshot.paramMap.get('page');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public listapplicationasset: any = [];
  private dataTamp: any = [];
  public lookupfixasset: any = [];
  public tempAssetNo: any;
  public tempType: any;
  public listdateDeliveryRequest: any = [];
  private dataTempAssetAllocationReturn: any = [];
  public lookupassetproc: any = [];
  private idDetailForReason: any;
  private Id: any;
  private dataRoleTamp: any = [];
  public IsClearAssetProc: any;
  public IsClearAssetAms: any;

  private APIController: String = 'ApplicationMain';
  private APIControllerApplicationAsset: String = 'ApplicationAsset';
  private APIControllerMasterFixAsset: String = 'Asset';
  private APIControllerAssetProc: String = 'ProcAssetLookup';

  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForUpdateRentalStatus: String = 'UpdateRentalStatus';
  private APIRouteForUpdateForFixAsset: String = 'UpdateForFixAsset';
  private APIRouteForGetRows: String = 'GetRowsForAssetAllocation';
  private APIRouteForFixedAssetLookup: String = 'GetRowsForFixedAssetLookupForAssetAllocation';
  private APIRouteForProceed: String = 'ExecSpForProceedAssetAllocation';
  private APIRouteForPost: String = 'ExecSpForPostAssetAllocation';
  private APIRouteForPurchaseRequest: String = 'ExecSpForPurchaseRequest';
  private APIRouteForUpdateRequestDelivaryDate: String = 'UpdateRequestDate';
  private APIRouteForDeleteRptAssetAllocation: String = 'DeleteRptAssetAllocation';
  private APIRouteForInsertRptAssetAllocation: String = 'ExecSpInsertToRptAssetAllocation';
  private APIRouteForValidateRptAssetAllocation: String = 'ExecSpForValidateRptAssetAllocation';
  private APIRouteForPurchaseRequestGTS: String = 'ExecSpForPurchaseRequestGTS';
  private APIRouteForCancel: String = 'ExecSpForCancel';
  private APIRouteForBackToEntry: String = 'ExecSpForBackToEntry';
  private APIRouteForGetRowsAssetProc: String = 'GetRows';
  private APIRouteForUpdateAssetProc: String = 'Update';
  private APIRouteForClearAssetProc: String = 'ExecSpClear';


  //Report
  private APIControllerReport: String = 'Report';
  private APIRouteForDownload: String = 'getReport';

  private RoleAccessCode = 'R00020600000000A'; // role access 

  // form 2 way binding
  model: any = {};

  // checklist
  public selectedAll: any;
  public checkedList: any = [];

  // spinner
  showSpinner: Boolean = false;
  showSpinner1: Boolean = false;
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
    this.Delimiter(this._elementRef);
    // call web service
    this.callGetrow();
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
          'p_application_no': this.param
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

  //#region getrow data
  callGetrow() {

    this.dataTamp = [{
      'p_application_no': this.param
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          if (parsedata.is_blacklist_area === '1') {
            parsedata.is_blacklist_area = true;
          } else {
            parsedata.is_blacklist_area = false;
          }

          if (parsedata.is_blacklist_job === '1') {
            parsedata.is_blacklist_job = true;
          } else {
            parsedata.is_blacklist_job = false;
          }

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

  //#region btnPurchaseRequest
  btnPurchaseRequest(code: any) {

    this.dataTamp = [{
      'p_asset_no': code,
      'action': 'default'
    }];

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
        this.dalservice.ExecSp(this.dataTamp, this.APIControllerApplicationAsset, this.APIRouteForPurchaseRequest)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showSpinner = false;
                this.showNotification('bottom', 'right', 'success');
                $('#datatableApplicationAsset').DataTable().ajax.reload();
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
        this.showSpinner = false;
      }
    });
  }
  //#endregion btnPurchaseRequest

  //#region button back
  btnBack() {
    this.route.navigate(['/contract/subassetallocationlist']);
  }
  //#endregion button back

  //#region FixAsset Lookup
  btnLookupFixAsset(assetNo: any, asset_type_code: any, unit_code: any, merk_code: any, model_code: any, type: any) {
    this.tempAssetNo = assetNo;
    this.tempType = type;
    let assetStatus = '';
    
    if (this.tempType === 'fixedAsset') {
      assetStatus = 'STOCK'
    } else {
      assetStatus = 'REPLACEMENT'
    }
    $('#datatableLookupFixAsset').DataTable().clear().destroy();
    $('#datatableLookupFixAsset').DataTable({
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
          'p_type_code': asset_type_code,
          'p_type_item_code': unit_code,
          'p_asset_status': assetStatus,
          'p_merk_code': merk_code,
          'p_model_code': model_code
        });

        this.dalservice.GetrowsAms(dtParameters, this.APIControllerMasterFixAsset, this.APIRouteForFixedAssetLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupfixasset = parse.data;
          if (parse.data != null) {
            this.lookupfixasset.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
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
    });
  }

  btnSelectRowFixAsset(code: String, item_name: String, fa_reff_no_01: String, fa_reff_no_02: String, fa_reff_no_03: String) {
    let tempFixedAsset = [];
    tempFixedAsset = [{
      'p_code': code,
      'p_rental_reff_no': this.tempAssetNo,
      'p_rental_status': 'RESERVED'
    }]

    this.dataTamp = [{
      'p_asset_no': this.tempAssetNo
      , 'p_fa_code': code
      , 'p_fa_name': item_name
      , 'p_fa_reff_no_01': fa_reff_no_01
      , 'p_fa_reff_no_02': fa_reff_no_02
      , 'p_fa_reff_no_03': fa_reff_no_03
      , 'p_type': this.tempType
    }]

    this.dalservice.UpdateAms(tempFixedAsset, this.APIControllerMasterFixAsset, this.APIRouteForUpdateRentalStatus)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            // call web service
            this.dalservice.Update(this.dataTamp, this.APIControllerApplicationAsset, this.APIRouteForUpdateForFixAsset)
              .subscribe(
                res => {
                  const parse = JSON.parse(res);
                  if (parse.result === 1) {
                    this.showSpinner = false;
                    $('#datatableApplicationAsset').DataTable().ajax.reload();
                    $('#applicationDetail').click();
                    this.callGetrow();
                    this.showNotification('bottom', 'right', 'success');
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
            this.tempAssetNo = undefined;
            $('#lookupModalFixAsset').modal('hide');
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
    this.tempAssetNo = undefined;
    $('#lookupModalFixAsset').modal('hide');
  }
  //#endregion FixAsset lookup

  //#region  btnClearFixedAsset
  btnClearFixedAsset(assetNo: String, fa_code: String, type: any) {
    let tempFixedAsset = [];
    tempFixedAsset = [{
      'p_code': fa_code
    }]
    this.dalservice.UpdateAms(tempFixedAsset, this.APIControllerMasterFixAsset, this.APIRouteForUpdateRentalStatus)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.dataTamp = [{
              'p_asset_no': assetNo,
              'p_type': type
            }]
            // call web service
            this.dalservice.Update(this.dataTamp, this.APIControllerApplicationAsset, this.APIRouteForUpdateForFixAsset)
              .subscribe(
                res => {
                  const parse = JSON.parse(res);
                  if (parse.result === 1) {
                    this.showSpinner = false;
                    $('#datatableApplicationAsset').DataTable().ajax.reload();
                    $('#applicationDetail').click();
                    this.callGetrow();
                    this.showNotification('bottom', 'right', 'success');
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
            this.showSpinner = false;
            this.swalPopUpMsg(parse.data);
          }
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data)
        });
    this.tempAssetNo = undefined;
    $('#lookupModalFixAsset').modal('hide');
  }
  //#endregion  btnClearFixedAsset

  //#region  form submit
  onFormSubmit(assetallocationdetailForm: NgForm, isValid: boolean) {
  }
  //#endregion form submit

  //#region btn process
  btnProceed() {
    this.checkedList = [];
    for (let i = 0; i < this.listapplicationasset.length; i++) {
      if (this.listapplicationasset[i].selected) {
        this.checkedList.push(this.listapplicationasset[i].asset_no);
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
        let th = this;
        var i = 0;
        (function loopDeliveryRequestProceed() {
          if (i < th.checkedList.length) {
            th.dataTamp = [{
              'p_application_no': th.param,
              'p_asset_no': th.checkedList[i],
              'action': ''
            }];

            th.dalservice.ExecSp(th.dataTamp, th.APIControllerApplicationAsset, th.APIRouteForPost)
              .subscribe(
                res => {
                  const parse = JSON.parse(res);
                  if (parse.result === 1) {
                    if (th.checkedList.length == i + 1) {
                      th.showNotification('bottom', 'right', 'success');
                      $('#datatableApplicationAsset').DataTable().ajax.reload();
                      th.showSpinner = false;
                    } else {
                      i++;
                      loopDeliveryRequestProceed();
                      $('#datatableApplicationAsset').DataTable().ajax.reload();
                    }
                  } else {
                    th.swalPopUpMsg(parse.data);
                    th.showSpinner = false;
                    $('#datatableApplicationAsset').DataTable().ajax.reload();
                  }
                },
                error => {
                  const parse = JSON.parse(error);
                  th.swalPopUpMsg(parse.data);
                  th.showSpinner = false;
                  $('#datatableApplicationAsset').DataTable().ajax.reload();
                });
          }
        })();
      } else {
        this.showSpinner = false;
      }
    });
  }

  selectAllTable() {
    for (let i = 0; i < this.listapplicationasset.length; i++) {
      if (this.listapplicationasset[i].purchase_status === 'DONE' || this.listapplicationasset[i].purchase_status === 'NONE' || this.listapplicationasset[i].purchase_status === 'ON PROCESS') {
        this.listapplicationasset[i].selected = this.selectedAll;
      }
    }
  }

  checkIfAllTableSelected() {
    this.selectedAll = this.listapplicationasset.every(function (item: any) {
      return item.selected === true;
    })
  }
  //#endregion btn process

  //#region btn print
  btnPrint() {
    //checklist data 
    this.checkedList = [];
    for (let i = 0; i < this.listapplicationasset.length; i++) {
      if (this.listapplicationasset[i].selected) {
        this.checkedList.push(this.listapplicationasset[i].asset_no);
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

    this.showSpinner = true;
    //Validasi fix asset
    let th = this;
    var i = 0;
    (function loopReportValidate() {
      if (i < th.checkedList.length) {
        th.dataTamp = [{
          'p_asset_no': th.checkedList[i],
          'action': ''
        }];
        th.dalservice.ExecSp(th.dataTamp, th.APIControllerApplicationAsset, th.APIRouteForValidateRptAssetAllocation)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                i++;
                loopReportValidate()
              } else {
                th.showSpinner = false;
                th.swalPopUpMsg(parse.data);
              }
            },
            error => {
              th.showSpinner = false;
              const parse = JSON.parse(error);
              th.swalPopUpMsg(parse.data)
            });
      } else {

        let dataTampDelete = [{
          'p_user_id': th.userId,
          'action': ''
        }];
        th.dalservice.ExecSp(dataTampDelete, th.APIControllerApplicationAsset, th.APIRouteForDeleteRptAssetAllocation)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                i++;

                th.insertandprint(th.checkedList)
              } else {
                th.showSpinner = false;
                th.swalPopUpMsg(parse.data);
              }
            },
            error => {
              th.showSpinner = false;
              const parse = JSON.parse(error);
              th.swalPopUpMsg(parse.data)
            });
      }
    })();
  }
  //#endregion btn print

  //#region function insert prnit
  insertandprint(dataChecklist: any) {

    let th = this;
    var j = 0;
    (function loopReportInsertandPrint() {
      if (j < dataChecklist.length - 1) {
        let dataTampInsert = [{
          'p_application_no': th.param,
          'p_asset_no': dataChecklist[j],
          'p_user_id': th.userId,
          'action': ''
        }];
        th.dalservice.ExecSp(dataTampInsert, th.APIControllerApplicationAsset, th.APIRouteForInsertRptAssetAllocation)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                j++;
                loopReportInsertandPrint()
              } else {
                th.showSpinner = false;
                th.swalPopUpMsg(parse.data);
              }
            },
            error => {
              th.showSpinner = false;
              const parse = JSON.parse(error);
              th.swalPopUpMsg(parse.data)
            });
      } else {
        let asset_no = dataChecklist[j];
        console.log(asset_no);
        let dataParamPrint = {
          TableName: 'rpt_asset_allocation_permohonan_pengiriman_barang',
          SpName: 'xsp_rpt_asset_allocation_permohonan_pengiriman_barang',
          reportparameters: {
            p_application_no: th.param,
            p_asset_no: dataChecklist[j],
            p_user_id: th.userId,
            p_count: dataChecklist.length,
            p_print_option: 'PDF'
          }
        };

        th.dalservice.ReportFile(dataParamPrint, th.APIControllerReport, th.APIRouteForDownload).subscribe(res => {
          th.printRptNonCore(res);
          th.showSpinner = false;
        }, err => {
          th.showSpinner = false;
          const parse = JSON.parse(err);
          th.swalPopUpMsg(parse.data);
        });
      }
    })();
  }
  //#endregion function insert prnit

  //#region button save in list
  saveList() {

    this.showSpinner = true;
    this.listdateDeliveryRequest = [];

    let i = 0;

    const getAssetNo = $('[name="p_asset_no"]')
      .map(function () { return $(this).val(); }).get();

    const getRequestDeliveryDate = $('[name="p_request_delivery_date"]')
      .map(function () { return $(this).val(); }).get();


    while (i < getAssetNo.length) {

      while (i < getRequestDeliveryDate.length) {

        if (getRequestDeliveryDate[i] === '') {
          getRequestDeliveryDate[i] = undefined;
        }
        this.listdateDeliveryRequest.push(this.JSToNumberFloats({
          p_asset_no: getAssetNo[i],
          p_request_delivery_date: this.dateFormatList(getRequestDeliveryDate[i]),
        }));
        i++;
      }
      i++;
    }

    //#region web service
    this.dalservice.Update(this.listdateDeliveryRequest, this.APIControllerApplicationAsset, this.APIRouteForUpdateRequestDelivaryDate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.showSpinner = false;
            this.showNotification('bottom', 'right', 'success');
            $('#datatableApplicationAsset').DataTable().ajax.reload();
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
    //#endregion web service
  }
  //#endregion button save in list

  //#region btnPurchaseRequestGts
  btnPurchaseRequestGts(code: any) {

    this.dataTamp = [{
      'p_asset_no': code,
      'action': 'default'
    }];

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
        this.dalservice.ExecSp(this.dataTamp, this.APIControllerApplicationAsset, this.APIRouteForPurchaseRequestGTS)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showSpinner = false;
                this.showNotification('bottom', 'right', 'success');
                $('#datatableApplicationAsset').DataTable().ajax.reload();
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
        this.showSpinner = false;
      }
    });
  }
  //#endregion btnPurchaseRequestGts

  //#region form submit
  onFormSubmitAssetAllocationReturn(AssetAllocationReturnForm: NgForm, isValid: boolean) {
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
      this.showSpinner1 = true;
    }

    this.dataTempAssetAllocationReturn = AssetAllocationReturnForm;
    this.dataTempAssetAllocationReturn.p_from_asset_allocation = '1'
    const usersJson: any[] = Array.of(this.JSToNumberFloats(this.dataTempAssetAllocationReturn));

    this.dalservice.ExecSp(usersJson, this.APIController, this.APIRouteForBackToEntry)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.route.navigate(['/contract/subassetallocationlist']);
            $('#lookupRemark').modal('hide');
            this.showNotification('bottom', 'right', 'success');
            $('#datatableAssetallocationList').DataTable().ajax.reload();
            this.showSpinner1 = false;
          } else {
            this.swalPopUpMsg(parse.data);
            this.showSpinner1 = false;
          }
        },
        error => {
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
          this.showSpinner1 = false;
        });
  }

  btnReturn() {
    this.model.approval_remark = undefined;
  }

  btnLookupClose() {
    this.model.approval_remark = undefined;
  }
  //#endregion form submit

  //#region tax Lookup
  btnLookupAssetProc(application_no: any, asset_no: any) {    
          // console.log(application_no);
    $('#datatableLookupAssetProc').DataTable().clear().destroy();
    $('#datatableLookupAssetProc').DataTable({
      'pagingType': 'first_last_numbers',
      'pageLength': 5,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false
      
      ajax: (dtParameters: any, callback) => {
        // param tambahan untuk getrows dynamic
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          // 'p_application_no': application_no,
          'p_application_no': this.param,
          'action': 'getResponse'
        });        
        // end param tambahan untuk getrows dynamic
        this.dalservice.GetrowsProc(dtParameters, this.APIControllerAssetProc, this.APIRouteForGetRowsAssetProc).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupassetproc = parse.data;

          if (parse.data != null) {
            this.lookupassetproc.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API)' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 6] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '

      },
      searchDelay: 800 // pake ini supaya gak bug search
    });

    this.idDetailForReason = asset_no;
  }

  btnSelectAssetProc(asset_code: string, item_name: string, plat_no: string, engine_no: string, chasis_no: string, id: string) {

    this.model.fa_code = asset_code;
    this.model.fa_name = item_name;
    this.model.fa_reff_no_01 = plat_no;
    this.model.fa_reff_no_02 = engine_no;
    this.model.fa_reff_no_03 = chasis_no;

    const listdataAssetProc = [];

    listdataAssetProc.push({
      p_asset_no: this.idDetailForReason,
      p_fa_code: asset_code,
      p_fa_name: item_name,
      p_fa_reff_no_01: plat_no,
      p_fa_reff_no_02: engine_no,
      p_fa_reff_no_03: chasis_no,
      p_type: 'Procurement'
    });

    this.dataTamp = [{
      'p_id': id,
      'p_asset_no': this.idDetailForReason
    }]


    //#region web service
    this.dalservice.Update(listdataAssetProc, this.APIControllerApplicationAsset, this.APIRouteForUpdateForFixAsset)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.dalservice.UpdateProc(this.dataTamp, this.APIControllerAssetProc, this.APIRouteForUpdateAssetProc)
              .subscribe(
                res => {
                  const parse = JSON.parse(res);
                  if (parse.result === 1) {
                    $('#datatableLookupAssetProc').DataTable().ajax.reload();
                    $('#datatableApplicationAsset').DataTable().ajax.reload();
                  } else {
                    this.swalPopUpMsg(parse.data);
                  }
                },
                error => {
                  const parse = JSON.parse(error);
                  this.swalPopUpMsg(parse.data);
                });
          } else {
            this.swalPopUpMsg(parse.data);
          }
        },
        error => {
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
    //#endregion web service
    $('#lookupModalAssetProcurement').modal('hide');
  }
  //#endregion tax lookup

  //#region clear asset proc
  btnClearFixedAssetproc(asset_no: string, code: string, type: any) {
    // param tambahan untuk button Post dynamic

    this.dataRoleTamp = [{
      'p_asset_code': code,
      'action': 'default'
    }];

    // param tambahan untuk button Post dynamic
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
        // call web service
        this.dalservice.ExecSpProc(this.dataRoleTamp, this.APIControllerAssetProc, this.APIRouteForClearAssetProc)
          .subscribe(
            res => {
              this.showSpinner = false;
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.dataTamp = [{
                  'p_asset_no': asset_no,
                  'p_type': type
                }]
                // call web service
                this.dalservice.Update(this.dataTamp, this.APIControllerApplicationAsset, this.APIRouteForUpdateForFixAsset)
                  .subscribe(
                    res => {
                      const parse = JSON.parse(res);
                      if (parse.result === 1) {
                        this.showSpinner = false;
                        $('#datatableApplicationAsset').DataTable().ajax.reload();
                        $('#applicationDetail').click();
                        this.callGetrow();
                        this.showNotification('bottom', 'right', 'success');
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
  //#endregion clear asset proc
}