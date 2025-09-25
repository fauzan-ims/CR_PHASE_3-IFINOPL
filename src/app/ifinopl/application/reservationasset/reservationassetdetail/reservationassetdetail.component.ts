import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-dimensiondetail',
  templateUrl: './reservationassetdetail.component.html'
})
export class ReservationassetdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public reservationassetData: any = [];
  public lookupfixasset: any = [];
  private dataTamp: any = [];
  private dataRoleTamp: any = [];
  private setStyle: any = [];
  private tempFaCode: any;

  private APIController: String = 'ApplicationAssetReservation';
  private APIControllerMasterFixAsset: String = 'Asset';

  private APIRouteForFixedAssetLookup: String = 'GetRowsForFixedAssetLookup';
  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForUpdate: String = 'Update';
  private APIRouteForInsert: String = 'Insert';
  private APIRouteForUpdateRentalStatus: String = 'UpdateRentalStatus';
  private APIRouteForProceed: String = 'ExecSpForGetProceed';
  private APIRouteForReturn: String = 'ExecSpForGetReturn';
  private APIRouteForCancel: String = 'ExecSpForGetCancel';
  private APIRouteForPost: String = 'ExecSpForGetPost';

  private RoleAccessCode = 'R00020770000000A'; // role access 

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
    private _elementRef: ElementRef,
    private parserFormatter: NgbDateParserFormatter
  ) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    if (this.param != null) {
      // call web service
      this.callGetrow();
    } else {
      this.model.employee_name = this.userName;
      this.model.employee_code = this.userId;
      this.model.status = 'HOLD';
      this.showSpinner = false;
    }
  }

  //#region getrow data
  callGetrow() {

    this.dataTamp = [{
      'p_id': this.param,
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          this.tempFaCode = parsedata.fa_code;

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

  //#region form submit
  onFormSubmit(reservationassetForm: NgForm, isValid: boolean) {
    let tempFixedAsset = [];

    // validation form submit
    if (!isValid) {
      swal({
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

    this.reservationassetData = this.JSToNumberFloats(reservationassetForm);

    tempFixedAsset = [{
      'p_code': this.reservationassetData.p_fa_code,
      'p_reserved_by': this.userId,
      'p_rental_status': 'RESERVED'
    }]

    const usersJson: any[] = Array.of(this.reservationassetData);

    if (this.param != null) {
      this.dalservice.UpdateAms(tempFixedAsset, this.APIControllerMasterFixAsset, this.APIRouteForUpdateRentalStatus)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              // call web service
              this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
                .subscribe(
                  res => {
                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                      this.btnClearFixedAsset(this.tempFaCode);
                      this.showSpinner = false;
                      this.showNotification('bottom', 'right', 'success');
                      this.callGetrow();
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
      this.dalservice.UpdateAms(tempFixedAsset, this.APIControllerMasterFixAsset, this.APIRouteForUpdateRentalStatus)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              // call web service
              this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
                .subscribe(
                  res => {
                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                      this.showSpinner = false;
                      this.showNotification('bottom', 'right', 'success');
                      this.route.navigate(['/application/subreservationassetlist/reservationassetdetail', parse.id]);
                    } else {
                      this.showSpinner = false;
                      this.swalPopUpMsg(parse.data);
                      this.btnClearFixedAsset(this.reservationassetData.p_fa_code);
                    }
                  },
                  error => {
                    this.showSpinner = false;
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data);
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
    }
  }
  //#endregion form submit

  //#region button back
  btnBack() {
    this.route.navigate(['/application/subreservationassetlist']);
    $('#datatableReservationassetlist').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region FixAsset Lookup
  btnLookupFixAsset() {
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
          'default': ''
        });

        this.dalservice.GetrowsAms(dtParameters, this.APIControllerMasterFixAsset, this.APIRouteForFixedAssetLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupfixasset = parse.data;

          console.log(parse);

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
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 5] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  // tslint:disable-next-line: max-line-length
  btnSelectRowFixAsset(code: String, item_name: String, plat_no: String) {
    this.model.fa_code = code;
    this.model.fa_name = item_name + ' - ' + plat_no;
    $('#lookupModalFixAsset').modal('hide');
  }
  //#endregion FixAsset lookup

  //#region  btnClearFixedAsset
  btnClearFixedAsset(fa_code: String) {
    let tempFixedAsset = [];
    tempFixedAsset = [{
      'p_code': fa_code
    }]
    this.dalservice.UpdateAms(tempFixedAsset, this.APIControllerMasterFixAsset, this.APIRouteForUpdateRentalStatus)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
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
  //#endregion  btnClearFixedAsset

  //#region set datepicker
  getStyles(isTrue: Boolean) {
    if (isTrue) {
      this.setStyle = {
        'pointer-events': 'none',
      }
    } else {
      this.setStyle = {
        'pointer-events': 'pointer',
      }
    }

    return this.setStyle;
  }
  //#endregion  set datepicker

  //#region button Proceed
  btnProceed(id: string, isValid: boolean) {
    // validation form submit
    if (!isValid) {
      swal({
        title: 'Warning',
        text: 'Please Fill a Mandatory Field OR Format Is Invalid',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-warning',
        type: 'warning'
      }).catch(swal.noop)
      return;
    }
    // param tambahan untuk getrole dynamic
    this.dataRoleTamp = [{
      'p_id': id,
    }];
    // param tambahan untuk getrole dynamic

    // call web service
    swal({
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: this._deleteconf,
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForProceed)
          .subscribe(
            res => {
              this.showSpinner = false;
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showNotification('bottom', 'right', 'success');
                this.callGetrow();
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
    })
  }
  //#endregion button Proceed

  //#region button Return
  btnReturn(id: string) {
    // param tambahan untuk getrole dynamic
    this.dataRoleTamp = [{
      'p_id': id,
    }];
    // param tambahan untuk getrole dynamic

    // call web service
    swal({
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: this._deleteconf,
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForReturn)
          .subscribe(
            res => {
              this.showSpinner = false;
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showNotification('bottom', 'right', 'success');
                this.callGetrow();
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
    })
  }
  //#endregion button Return

  //#region button Cancel
  btnCancel(id: string) {
    // param tambahan untuk getrole dynamic
    this.dataRoleTamp = [{
      'p_id': id,
    }];
    // param tambahan untuk getrole dynamic

    // call web service
    swal({
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: this._deleteconf,
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForCancel)
          .subscribe(
            res => {
              this.showSpinner = false;
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showNotification('bottom', 'right', 'success');
                this.callGetrow();
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
    })
  }
  //#endregion button Cancel

  //#region button Post
  btnPost(id: string) {
    // param tambahan untuk getrole dynamic
    this.dataRoleTamp = [{
      'p_id': id,
    }];
    // param tambahan untuk getrole dynamic

    // call web service
    swal({
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: this._deleteconf,
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        this.dalservice.ExecSp(this.dataRoleTamp, this.APIController, this.APIRouteForPost)
          .subscribe(
            res => {
              this.showSpinner = false;
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showNotification('bottom', 'right', 'success');
                this.callGetrow();
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
    })
  }
  //#endregion button Post
}