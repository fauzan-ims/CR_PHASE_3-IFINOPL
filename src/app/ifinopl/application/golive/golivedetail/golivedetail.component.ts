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
  templateUrl: './golivedetail.component.html'
})

export class GolivedetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  pageType = this.getRouteparam.snapshot.paramMap.get('page');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public listapplicationasset: any = [];
  public setStyle: any = [];
  private dataTamp: any = [];
  private dataTampCms: any = [];
  private dataTampClientStatus: any = [];
  private dataTempApprovalReturn: any = [];

  private APIController: String = 'ApplicationMain';
  private APIControllerClientMain: String = 'ClientMain';
  private APIControllerApplicationAsset: String = 'ApplicationAsset';

  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForGetRowsGolive: String = 'GetRowsGolive';
  private APIRouteForUpdateStatus: String = 'UpdateStatus';
  private APIRouteForExecSpForBlacklistValidation: String = 'ExecSpForBlacklistValidation';
  private APIRouteForGoLive: String = 'ExecSpForGolive';
  private APIRouteForReturn: String = 'ExecSpForReturn';

  private RoleAccessCode = 'R00020650000000A'; // role access 

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = false;
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
          'p_application_no': this.param
        })

        this.dalservice.Getrows(dtParameters, this.APIControllerApplicationAsset, this.APIRouteForGetRowsGolive).subscribe(resp => {
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

  //#region btnGolive
  btnGolive(code: any) {
    this.dataTamp = [{
      'p_application_no': code
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

        this.dataTampCms = [{
          'p_client_no': this.model.client_no,
          'action': 'getResponse'
        }];

        this.dalservice.Update(this.dataTampClientStatus, this.APIControllerClientMain, this.APIRouteForUpdateStatus)
          .subscribe(
            resUpdateClientStatus => {
              const parseUpdateClientStatus = JSON.parse(resUpdateClientStatus);
              if (parseUpdateClientStatus.result === 1) {
                this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForGoLive)
                  .subscribe(
                    res => {
                      const parse = JSON.parse(res);
                      if (parse.result === 1) {
                        this.showNotification('bottom', 'right', 'success');
                        this.route.navigate(['/application/subgolivelist']);
                        $('#datatableGolivelist').DataTable().ajax.reload();
                        this.showSpinner = false;
                      } else {
                        this.swalPopUpMsg(parse.data);
                        this.showSpinner = false;
                      }
                    },
                    error => {
                      const parse = JSON.parse(error);
                      this.swalPopUpMsg(parse.data)
                      this.showSpinner = false;
                    });
              } else {
                this.showSpinner = false;
                this.swalPopUpMsg(parseUpdateClientStatus.data);
              }
            },
            error => {
              this.showSpinner = false;
              const parseUpdateClientStatus = JSON.parse(error);
              this.swalPopUpMsg(parseUpdateClientStatus.data)
            });
      } else {
        this.showSpinner = false;
      }
    });
  }
  //#endregion btnGolive

  //#region btnReturn
  // btnReturn(code: any) {
  //   swal({
  //     html:
  //       '<label style="float: left; font-size:12px">Remark</label>' +
  //       '<div class="form-group">' +
  //       '<textarea id="input-remark" type="text" class="form-control" ></textarea>' +
  //       '</div>' +
  //       '<label style="float: left; font-size:12px">Password</label>' +
  //       '<div class="form-group">' +
  //       '<input id="input-password" type="password" class="form-control" />' +
  //       '</div>',
  //     showCancelButton: true,
  //     confirmButtonClass: 'btn btn-success',
  //     cancelButtonClass: 'btn btn-danger',
  //     confirmButtonText: 'Yes',
  //     buttonsStyling: false
  //   }).then((result) => {
  //     this.showSpinner = true;
  //     if (result.value) {
  //       const remark = $('#input-remark').val();
  //       const password = $('#input-password').val();

  //       this.dataTamp = [{
  //         'p_application_no': code,
  //         'p_approval_reff': password,
  //         'p_approval_remark': remark,
  //         'action': 'default'
  //       }];


  //       this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForReturn)
  //         .subscribe(
  //           res => {
  //             const parse = JSON.parse(res);
  //             if (parse.result === 1) {
  //               this.showSpinner = false;
  //               this.showNotification('bottom', 'right', 'success');
  //               this.route.navigate(['/application/subgolivelist']);
  //               $('#datatableGolivelist').DataTable().ajax.reload();
  //             } else {
  //               this.showSpinner = false;
  //               this.swalPopUpMsg(parse.data);
  //             }
  //           },
  //           error => {
  //             this.showSpinner = false;
  //             const parse = JSON.parse(error);
  //             this.swalPopUpMsg(parse.data);
  //           });
  //     } else {
  //       this.showSpinner = false;
  //     }
  //   });
  // }
  //#endregion btnReturn

  //#region button back
  btnBack() {
    this.route.navigate(['/application/subgolivelist']);
    $('#datatableGolivelist').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region  form submit
  onFormSubmit(golivedetailForm: NgForm, isValid: boolean) {
  }
  //#endregion form submit

  //#region form submit
  onFormSubmitApprovalReturn(ApprovalReturnForm: NgForm, isValid: boolean) {
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

    this.dataTempApprovalReturn = ApprovalReturnForm;

    const usersJson: any[] = Array.of(this.JSToNumberFloats(this.dataTempApprovalReturn));

    this.dalservice.ExecSp(usersJson, this.APIController, this.APIRouteForReturn)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            $('#lookupRemark').modal('hide');
            this.route.navigate(['/application/subgolivelist']);
            $('#datatableGolivelist').DataTable().ajax.reload();
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

  //#region form close
  btnLookupClose() {
    this.model.approval_remark = undefined;
  }
  //#end region form close

  //#region btnReturn
  btnReturn() {
    this.btnLookupClose();
  }
  //#end region btnReturn
}