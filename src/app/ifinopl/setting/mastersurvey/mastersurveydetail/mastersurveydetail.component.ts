import { Component, OnInit, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { BaseComponent } from '../../../../../base.component';
import { DataTableDirective } from 'angular-datatables';
import { DALService } from '../../../../../DALservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './mastersurveydetail.component.html'
})
export class MastersurveydetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');

  // variable
  public mastersurveyData: any = [];
  public listdimension: any = [];
  public lookupgeneral: any = [];
  public isReadOnly: Boolean = false;
  public lookupapproval: any = [];
  public approval_category_name: String;
  public idIndex: any;
  public isStatus: Boolean;
  public lookupSysDimension: any = [];
  public code: String;
  private dataTamp: any = [];
  private dataTampPush: any = [];
  private idDetailForColumn: any;

  private APIController: String = 'MasterSurvey';
  private APIControllerSysDimension: String = 'SysDimension';
  private APIControllerDimension: String = 'MasterSurveyDimension';
  private APIControllerGeneralSubcode: String = 'SysGeneralSubcode';

  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForInsert: String = 'INSERT';

  private APIRouteLookupDimension: String = 'GetRowsForLookup';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForSync: String = 'ExecSpForSyncOpl';

  private RoleAccessCode = 'R00016900000010A'; // role access 

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
  ) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    if (this.param != null) {
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
          'p_survey_code': this.param,
        });
        

        this.dalservice.Getrows(dtParameters, this.APIControllerDimension, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listdimension = parse.data;

          if (parse.data != null) {
            this.listdimension.numberIndex = dtParameters.start;
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
      'p_code': this.param,
    }];
    
    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];

          // checkbox is active
          if (parsedata.is_active === '1') {
            parsedata.is_active = true;
          } else {
            parsedata.is_active = false;
          }
          // end checkbox is active

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
  onFormSubmit(mastersurveyForm: NgForm, isValid: boolean) {
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

    this.mastersurveyData = mastersurveyForm;
    if (this.mastersurveyData.p_is_active == null) {
      this.mastersurveyData.p_is_active = false;
    }
    const usersJson: any[] = Array.of(this.mastersurveyData);

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
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showSpinner = false;
              this.showNotification('bottom', 'right', 'success');
              this.route.navigate(['/setting/submastersurveylist/mastersurveydetail', parse.code]);
            } else {
              this.showSpinner = false;
              this.swalPopUpMsg(parse.data)
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
    $('#datatable').DataTable().ajax.reload();
    this.route.navigate(['/setting/submastersurveylist']);
  }
  //#endregion button back

  //#region button Sync
  btnSync(code: string) {
    // // param tambahan untuk button Sync dynamic
    // this.dataTampPush = [{
    //   'p_survey_code': code,
    //   'p_reff_survey_category_code': this.model.reff_survey_category_code,
    //   'action': 'getResponse'
    // }];
    // // param tambahan untuk button Sync dynamic

    // swal({
    //   title: 'Are you sure?',
    //   type: 'warning',
    //   showCancelButton: true,
    //   confirmButtonClass: 'btn btn-success',
    //   cancelButtonClass: 'btn btn-danger',
    //   confirmButtonText: this._deleteconf,
    //   buttonsStyling: false
    // }).then((result) => {
    //   this.showSpinner = true;
    //   if (result.value) {
    //     // call web service
    //     this.dalservice.ExecSpSvy(this.dataTampPush, this.APIControllerSysDimension, this.APIRouteForSync)
    //       .subscribe(
    //         ress => {
    //           const parses = JSON.parse(ress);

    //           this.dataTamp = [];
    //           this.dataTamp = parses.data;

    //           if (parses.result === 1) {
    //             if (this.dataTamp.length > 0) {
    //               this.listdimension = [];
    //               for (let JJ = 0; JJ < this.dataTamp.length; JJ++) {
    //                 this.listdimension.push({
    //                   'p_survey_code': this.param,
    //                   'p_reff_dimension_code': this.dataTamp[JJ].code,
    //                   'p_reff_dimension_name': this.dataTamp[JJ].description
    //                 });
    //               }

    //               this.dalservice.Insert(this.listdimension, this.APIControllerDimension, this.APIRouteForInsert)
    //                 .subscribe(
    //                   ressss => {
    //                     const parsesss = JSON.parse(ressss);

    //                     if (parsesss.result === 1) {
    //                       this.showSpinner = false;
    //                       this.showNotification('bottom', 'right', 'success');
    //                       $('#datatableMasterSurveyDetail').DataTable().ajax.reload();
    //                     } else {
    //                       this.showSpinner = false;
    //                       this.swalPopUpMsg(parsesss.data);
    //                     }
    //                   },
    //                   error => {
    //                     this.showSpinner = false;
    //                     const parsesss = JSON.parse(error);
    //                     this.swalPopUpMsg(parsesss.data);
    //                   });
    //             }
    //           } else {
    //             this.showSpinner = false;
    //             this.swalPopUpMsg(parses.data);
    //           }
    //         },
    //         error => {
    //           this.showSpinner = false;
    //           const parse = JSON.parse(error);
    //           this.swalPopUpMsg(parse.data);
    //         });
    //   } else {
    //     this.showSpinner = false;
    //   }
    // });
  }
  //#endregion button Sync

  //#region lookup general
  btnLookupGeneral() {
    $('#datatableLookupGeneral').DataTable().clear().destroy();
    $('#datatableLookupGeneral').DataTable({
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
          'p_general_code': 'QTYPE'
        });
        this.dalservice.Getrows(dtParameters, this.APIControllerGeneralSubcode, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupgeneral = parse.data;
          if (parse.data != null) {
            this.lookupgeneral.numberIndex = dtParameters.start;
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
    // } , 1000);
  }

  btnSelectRowGeneral(code: String, name: String) {
    this.model.reff_survey_category_code = code;
    this.model.reff_survey_category_name = name;
    $('#lookupModalGeneral').modal('hide');
  }
  //#endregion lookup general

  //#region Sys Dimension
  btnLookupRowDimension(id: any, index: any) {
    $('#datatableLookupSelectDimension').DataTable().clear().destroy();
    $('#datatableLookupSelectDimension').DataTable({
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
        this.dalservice.Getrows(dtParameters, this.APIControllerSysDimension, this.APIRouteLookupDimension).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupSysDimension = parse.data;
          console.log(parse);

          if (parse.data != null) {
            this.lookupSysDimension.numberIndex = dtParameters.start;
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
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
    this.idDetailForColumn = id;
    this.idIndex = index;
  }

  btnSelectRowDimension(description: String) {

    this.listdimension = [];
    this.listdimension.push({
      p_id: this.idDetailForColumn,
      p_dimension_code: description

    });

    // call web service
    this.dalservice.Update(this.listdimension, this.APIControllerDimension, this.APIRouteForUpdate)
      .subscribe(
        res => {
          this.showSpinner = false;
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.showNotification('bottom', 'right', 'success');
            $('#datatableMasterSurveyDetail').DataTable().ajax.reload();
          } else {
            this.swalPopUpMsg(parse.data);
          }
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
    $('#lookupModalSelectDimension').modal('hide');
  }
  //#endregion Sys Dimension
}