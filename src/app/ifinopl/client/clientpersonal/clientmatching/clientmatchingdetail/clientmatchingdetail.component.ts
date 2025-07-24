import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../base.component';
import { DALService } from '../../../../../../DALservice.service';
import { MAT_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR } from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './clientmatchingdetail.component.html'
})

export class ClientmatchingdetailComponent extends BaseComponent implements OnInit {
  prospectId = this.getRouteparam.snapshot.paramMap.get('prospectId');
  from = this.getRouteparam.snapshot.paramMap.get('from');

  // variable

  public TextonlyPattern = this._textonlyformat;
  public AlfaNumericPattern = this._alfaNumericformat;
  public NumberOnlyPattern = this._numberonlyformat;
  public NpwpPattern = this._npwpformat;
  public clientmatchingdetailData: any = [];
  public listclient: any = [];
  public kitas_no: String;
  public ktp_no: String;
  public npwp_no: String;
  public document_no: String;
  public full_name: String;
  public alias_name: String;
  public client_type: String;
  public document_type: String;
  public mother_maiden_name: String;
  public place_of_birth: String;
  public date_of_birth: any = {};
  public est_date: any;
  public isReadOnly: Boolean = false;
  public lookupsysbranch: any = [];
  public branch_name: String;
  public branch_code: String;
  public param: Boolean = false;
  public setStyle: any = [];
  public clientMatchingData: any = [];
  private clientCode: String;
  private disabledRow: any;
  private dataTamp: any = [];
  private dataTampClientMain: any = {};
  private dataTampClientCode: any = [];
  private dataTampClient: any = [];
  private APIController: String;
  private APIControllerMain: String;
  private APIRouteForInsert: String;
  private ValidationStatus: String = undefined;

  private APIControllerApplicationMain: String = 'ApplicationMain';
  private APIControllerApplicationSimulation: String = 'ApplicationSimulation';
  private APIControllerPlafondMain: String = 'PlafondMain';
  private APIControllerClientPersonal: String = 'ClientPersonalInfo';
  private APIControllerClientCorporate: String = 'ClientCorporateInfo';
  private APIControllerClientMain: String = 'ClientMain';
  private APIControllerSysGeneralValidation: String = 'SysGeneralValidation';
  private APIControllerProspectSales: String = 'ProspectSales';

  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForInsertNormal: String = 'Insert';
  private APIRouteForDelete: String = 'Delete';
  private APIRouteForInsertQuickEntryVehicle: String = 'InsertQuickEntryVehicle';
  private APIControllerSysBranch: String = 'SysBranch';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForGetRows: String = 'GetRowsForMatching';
  private APIRouteForExecSpForClientCorporate: String = 'ExecSpForClientCorporate';
  private APIRouteForExecSpForClientCorporateInsert: String = 'ExecSpForClientCorporateInsert';

  private RoleAccessCode = 'R00022550000010A';

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
    $("#npwp").attr('maxlength', '15');
    $("#ktp").attr('maxlength', '16');
    this.branch_code = this.branchCodes;
    this.branch_name = this.branchNames;
    this.client_type = 'CORPORATE';
    this.document_type = 'NPWP';

    if (this.prospectId !== null) {
      setTimeout(() => {
        this.callGetrowProspect();
      }, 500);
    }

    if (this.from === 'APPLICATION') {
      this.APIControllerMain = this.APIControllerApplicationMain;
      this.APIRouteForInsert = this.APIRouteForInsertNormal;
    } else if (this.from === 'PLAFOND') {
      this.APIControllerMain = this.APIControllerPlafondMain;
      this.APIRouteForInsert = this.APIRouteForInsertNormal;
    } else if (this.from === 'APPLICATION_QC_VEHICLE') {
      this.APIControllerMain = this.APIControllerApplicationMain;
      this.APIRouteForInsert = this.APIRouteForInsertQuickEntryVehicle;
    } else if (this.from === 'APPLICATION_SIMULATION') {
      this.APIControllerMain = this.APIControllerApplicationSimulation;
      this.APIRouteForInsert = this.APIRouteForInsertNormal;
    }

    if (this.client_type === 'PERSONAL') {
      this.APIController = this.APIControllerClientPersonal;
      this.disabledRow = 10;
    } else {
      this.APIController = this.APIControllerClientCorporate;
      this.disabledRow = 9;
    }
    this.loadData();
  }

  //#region getrow prospect
  callGetrowProspect() {

    this.dataTamp = [{
      'p_id': this.prospectId
    }];


    this.dalservice.Getrow(this.dataTamp, this.APIControllerProspectSales, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          this.full_name = parsedata.client_name;
          if (parsedata.personal_id_no != null) {
            this.ktp_no = parsedata.personal_id_no;
            this.document_no = parsedata.personal_id_no;
            this.client_type = 'PERSONAL';
            this.document_type = 'KTP';
            this.place_of_birth = parsedata.personal_place_of_birth;
          } else {
            this.npwp_no = parsedata.corporate_npwp_no;
            this.document_no = parsedata.corporate_npwp_no;
            this.client_type = 'CORPORATE';
            this.document_type = 'NPWP';
          }

          // mapper dbtoui
          Object.assign(this.model, parsedata);
          // end mapper dbtoui
          this.showSpinner = false;
        },
        error => {
          this.showSpinner = false;
          console.log('There was an error while Retrieving Data(API) !!!' + error);
        });
  }
  //#endregion getrow prospect

  //#region ddl clientType
  clientType(event: any) {
    this.client_type = event.target.value;
    if (this.client_type === 'PERSONAL') {
      this.document_type = 'KTP';
      this.APIController = this.APIControllerClientPersonal;
      this.disabledRow = 8;
    } else {
      this.document_type = 'NPWP';
      this.APIController = this.APIControllerClientCorporate;
      this.disabledRow = 7;
    }
    $('#datatableClientMatchingList').DataTable().ajax.reload();
  }
  //#endregion ddl clientType

  //#region ddl documentType
  documentType(event: any) {
    this.document_type = event.target.value;
  }
  //#endregion ddl documentType

  //#region load all data
  loadData() {
    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   responsive: true,
    //   serverSide: true,
    //   processing: true,
    //   paging: true,
    //   'lengthMenu': [
    //     [10, 25, 50, 100],
    //     [10, 25, 50, 100]
    //   ],
    //   ajax: (dtParameters: any, callback) => {

    //     dtParameters.paramTamp = [];
    //     let paramTamps = {};
    //     if (this.client_type === 'PERSONAL') {
    //       paramTamps = {
    //         'p_document_no': this.document_no,
    //         'p_full_name': this.full_name,
    //         'p_alias_name': this.alias_name,
    //         'p_mother_maiden_name': this.mother_maiden_name,
    //         'p_place_of_birth': this.place_of_birth,
    //         'p_date_of_birth': this.date_of_birth,
    //         'p_document_type': this.document_type
    //       };

    //     } else {
    //       paramTamps = {
    //         'p_document_no': this.document_no,
    //         'p_full_name': this.full_name,
    //         'p_est_date': this.est_date,
    //         'p_document_type': this.document_type
    //       };
    //     }

    //     dtParameters.paramTamp.push(paramTamps);
    //     this.dalservice.GetrowsCms(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
    //       const parse = JSON.parse(resp);
    //       this.listclient = parse.data;

    //       if (parse.data != null) {
    //         this.listclient.numberIndex = dtParameters.start;
    //       }

    //       this.showSpinner = false;
    //       callback({
    //         draw: parse.draw,
    //         recordsTotal: parse.recordsTotal,
    //         recordsFiltered: parse.recordsFiltered,
    //         data: []
    //       });
    //     }, err => {
    //       this.showSpinner = false;
    //     });
    //   },
    //   columnDefs: [{ orderable: false, width: '5%', targets: [this.disabledRow] }], // for disabled coloumn
    //   language: {
    //     search: '_INPUT_',
    //     searchPlaceholder: 'Search records',
    //     infoEmpty: '<p style="color:red;" > No Data Available !</p> '
    //   },
    //   searchDelay: 800 // pake ini supaya gak bug search
    // }
  }
  //#endregion load all data

  //#region btnReset
  btnReset() {
    this.param = false;
  }
  //#endregion btnReset

  //#region getStyles
  getStyles(isTrue: Boolean) {

    if (isTrue) {
      this.setStyle = {
        'pointer-events': 'none',
      }
    } else {
      this.setStyle = {
        'pointer-events': 'auto',
      }
    }

    return this.setStyle;
  }
  //#endregion

  //#region npwp
  onKeydownNpwp(event: any) {

    let ctrlDown = false;

    if (event.keyCode == 17 || event.keyCode == 91) {
      ctrlDown = true;
    }

    if (!((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)
      || (ctrlDown && (event.keyCode == 86 || event.keyCode == 67 || event.keyCode == 65 || event.keyCode == 90))
      || event.keyCode == 8 || event.keyCode == 9
      || (event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 38 || event.keyCode == 40)
    )) {

      return false;
    }

  }

  onPasteNpwp(event: any) {

    if (!event.originalEvent.clipboardData.getData('Text').match(/^[0-9,.-]*$/)) {
      event.preventDefault();
    }

  }

  onFokusNpwp(event: any) {
    let valEvent: any;
    valEvent = '' + event.target.value;

    if (valEvent != null) {
      this.npwp_no = valEvent.replace(/[^0-9]/g, '');
    }

  }

  onChangeNpwp(event: any) {

    let valEvent: any;

    valEvent = '' + event.target.value;
    var x = valEvent.split('');

    if (x.length == 15) {
      var tt = x[0] + x[1] + '.';
      var dd = tt + x[2] + x[3] + x[4] + '.';
      var ee = dd + x[5] + x[6] + x[7] + '.';
      var ff = ee + x[8] + '-';
      var gg = ff + x[9] + x[10] + x[11] + '.';
      var hh = gg + x[12] + x[13] + x[14];

      this.npwp_no = hh;
    }

  }
  //#endregion npwp

  //#region form submit
  onFormSubmit(clientmatchingdetailForm: NgForm, isValid: boolean) {
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
    this.clientmatchingdetailData = this.JSToNumberFloats(clientmatchingdetailForm);
    this.param = true;
    this.full_name = this.clientmatchingdetailData.p_full_name;
    this.alias_name = this.clientmatchingdetailData.p_alias_name;
    this.mother_maiden_name = this.clientmatchingdetailData.p_mother_maiden_name;
    this.place_of_birth = this.clientmatchingdetailData.p_place_of_birth;
    this.date_of_birth = this.clientmatchingdetailData.p_date_of_birth;
    this.est_date = this.clientmatchingdetailData.p_est_date;
    this.document_type = this.clientmatchingdetailData.p_document_type;
    if (this.document_type === 'KTP') {
      this.document_no = this.clientmatchingdetailData.p_ktp_no;
    } else if (this.document_type === 'KITAS') {
      this.document_no = this.clientmatchingdetailData.p_kitas_no;
    } else if (this.document_type === 'NPWP') {
      this.document_no = this.clientmatchingdetailData.p_npwp_no;
    }
    $('#datatableClientMatchingList').DataTable().ajax.reload();
  }
  //#endregion form submit

  //#region button add
  btnAdd() {
    this.ValidationStatus = undefined;
    // param tambahan untuk getrole dynamic
    if (this.client_type === 'PERSONAL') {
      this.dataTampClientMain = {
        'p_id_no': this.document_no,
        'p_full_name': this.full_name,
        'p_branch_code': this.branch_code,
        'p_branch_name': this.branch_name,
        'p_mother_maiden_name': this.mother_maiden_name,
        'p_place_of_birth': this.place_of_birth,
        'p_date_of_birth': this.date_of_birth,
        'p_client_type': this.client_type,
        'p_document_type': this.document_type,
        'p_prospect_id': this.prospectId
      };
    } else {
      this.dataTampClientMain = {
        'p_id_no': this.document_no,
        'p_full_name': this.full_name,
        'p_est_date': this.est_date,
        'p_branch_code': this.branch_code,
        'p_branch_name': this.branch_name,
        'p_client_type': this.client_type,
        'p_document_type': this.document_type,
        'p_prospect_id': this.prospectId
      };
    }
    // param tambahan untuk getrole dynamic

    if (this.branch_code == undefined) {
      swal({
        allowOutsideClick: false,
        title: 'Warning!',
        text: 'Please Select Branch to Add',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-warning',
        type: 'warning'
      }).catch(swal.noop)
      return;
    } else {
      this.showSpinner = true;
      this.dataTamp = this.JSToNumberFloats(this.dataTampClientMain);
      const usersJson: any[] = Array.of(this.dataTamp);

      this.dataTamp = [{
        'p_group_code': 'DOUBLE DOCUMENT NO',
        'p_is_active': '1'
      }];
      this.dalservice.ExecSp(this.dataTamp, this.APIControllerSysGeneralValidation, this.APIRouteForGetRow)
        .subscribe(
          resGetApi => {
            const parseGetApi = JSON.parse(resGetApi);
            if (parseGetApi.data.length > 0) {
              let th = this;
              var i = 0;
              (function loopClientMatchingAdd() {
                if (i < parseGetApi.data.length) {
                  // param tambahan untuk getrole dynamic
                  th.dataTampClientCode = [{
                    'p_client_no': '',
                    'p_doc_no': th.document_no,
                    'p_doc_type': th.document_type,
                    'action': 'getResponse'
                  }];
                  // param tambahan untuk getrole dynamic 

                  th.dalservice.ExecSpAll(th.dataTampClientCode, parseGetApi.data[i].api_name)
                    .subscribe(
                      resValidation => {
                        const parseValidation = JSON.parse(resValidation);

                        if (parseValidation.data[0].status !== '') {
                          th.ValidationStatus = parseValidation.data[0].msg;
                        }
                        if (parseGetApi.data.length == i + 1) {
                          if (th.ValidationStatus == undefined) {
                            // call web service
                            th.dalservice.Insert(usersJson, th.APIControllerMain, th.APIRouteForInsert)
                              .subscribe(
                                res => {
                                  const parse = JSON.parse(res);
                                  if (parse.result === 1) {
                                    th.showSpinner = false;
                                    th.showNotification('bottom', 'right', 'success');
                                    if (th.from === 'APPLICATION') {
                                      th.route.navigate(['/application/subapplicationmainlist/applicationmaindetail', parse.code]);
                                    } else if (th.from === 'PLAFOND') {
                                      th.route.navigate(['/plafond/subplafondlist/plafonddetail', parse.code]);
                                    } else if (th.from === 'APPLICATION_QC_VEHICLE') {
                                      th.route.navigate(['/application/subapplicationquickentryvehiclelist/applicationquickentryvehicledetail', parse.code]);
                                    } else if (th.from === 'APPLICATION_SIMULATION') {
                                      th.route.navigate(['/application/subapplicationsimulationlist/applicationsimulationdetail', parse.code]);
                                    }
                                    th.ValidationStatus = undefined;
                                  } else {
                                    th.showSpinner = false;
                                    th.swalPopUpMsg(parse.data);
                                    th.ValidationStatus = undefined;
                                  }
                                },
                                error => {
                                  th.showSpinner = false;
                                  const parse = JSON.parse(error);
                                  th.swalPopUpMsg(parse.data);
                                  th.ValidationStatus = undefined;
                                });
                          } else if (th.ValidationStatus !== undefined) {
                            th.showSpinner = false;
                            th.swalPopUpMsg(th.ValidationStatus);
                            th.ValidationStatus = undefined;
                          }
                        } else {
                          i++;
                          loopClientMatchingAdd();
                        }
                      },
                      error => {
                        th.showSpinner = false;
                        const parseValidation = JSON.parse(error);
                        th.swalPopUpMsg(parseValidation.data);
                        th.ValidationStatus = undefined;
                      });
                }
              })();
            } else {
              // call web service
              this.dalservice.Insert(usersJson, this.APIControllerMain, this.APIRouteForInsert)
                .subscribe(
                  res => {
                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                      this.showSpinner = false;
                      this.showNotification('bottom', 'right', 'success');
                      if (this.from === 'APPLICATION') {
                        this.route.navigate(['/application/subapplicationmainlist/applicationmaindetail', parse.code]);
                      } else if (this.from === 'PLAFOND') {
                        this.route.navigate(['/plafond/subplafondlist/plafonddetail', parse.code]);
                      } else if (this.from === 'APPLICATION_QC_VEHICLE') {
                        this.route.navigate(['/application/subapplicationquickentryvehiclelist/applicationquickentryvehicledetail', parse.code]);
                      } else if (this.from === 'APPLICATION_SIMULATION') {
                        this.route.navigate(['/application/subapplicationsimulationlist/applicationsimulationdetail', parse.code]);
                      }
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
          },
          error => {
            this.showSpinner = false;
            const parseGetApi = JSON.parse(error);
            this.swalPopUpMsg(parseGetApi.data)
          });
    }
  }
  //#endregion button add

  //#region button edit
  btnEdit(codeEdit: string, clientno: string) {
    // this.ValidationStatus = undefined;
    // this.showSpinner = true;
    // this.dataTamp = [];
    // this.dataTamp = [{
    //   'p_group_code': 'DOUBLE REGISTER',
    //   'p_is_active': '1'
    // }];

    // // param tambahan untuk getrole dynamic
    // this.dataTampClientCode = [{
    //   'p_client_code': codeEdit,
    //   'p_client_no': clientno,
    //   'p_doc_no': this.document_no,
    //   'p_doc_type': this.document_type,
    //   'action': 'getResponse'
    // }];
    // // param tambahan untuk getrole dynamic

    // this.dalservice.ExecSp(this.dataTamp, this.APIControllerSysGeneralValidation, this.APIRouteForGetRow)
    //   .subscribe(
    //     resGetApi => {
    //       const parseGetApi = JSON.parse(resGetApi);

    //       if (parseGetApi.data.length > 0) {
    //         let th = this;
    //         let i = 0;
    //         (function loopClientMatchingEdit() {
    //           if (i < parseGetApi.data.length) {

    //             th.dalservice.ExecSpAll(th.dataTampClientCode, parseGetApi.data[i].api_name)
    //               .subscribe(
    //                 resValidation => {
    //                   const parseValidation = JSON.parse(resValidation);

    //                   if (parseValidation.data[0].status !== '') {
    //                     th.ValidationStatus = parseValidation.data[0].msg;
    //                   }

    //                   if (parseGetApi.data.length == i + 1) {
    //                     if (th.ValidationStatus == undefined) {
    //                       th.dalservice.ExecSpCms(th.dataTampClientCode, th.APIControllerClientMain, th.APIRouteForExecSpForClientCorporate)
    //                         .subscribe(
    //                           res => {
    //                             const parse = JSON.parse(res);
    //                             if (parse.result === 1) {
    //                               // param tambahan untuk getrole dynamic
    //                               th.dataTampClient = [{
    //                                 'client_main_data': parse.data.client_main_data,
    //                                 'client_corporate_data': parse.data.client_corporate_data,
    //                                 'client_corporate_notarial': parse.data.client_corporate_notarial,
    //                                 'client_personal_data': parse.data.client_personal_data,
    //                                 'client_personal_work': parse.data.client_personal_work,
    //                                 'client_address': parse.data.client_address,
    //                                 'client_asset': parse.data.client_asset,
    //                                 'client_bank': parse.data.client_bank,
    //                                 'client_bank_book': parse.data.client_bank_book,
    //                                 'client_doc': parse.data.client_doc,
    //                                 'client_log': parse.data.client_log,
    //                                 'client_sipp': parse.data.client_sipp,
    //                                 'client_silik': parse.data.client_silik,
    //                                 'client_slik_financial': parse.data.client_slik_financial,
    //                                 'client_financial_recapitulation': parse.data.client_financial_recapitulation,
    //                                 'client_financial_statement': parse.data.client_financial_statement,
    //                                 'client_financial_recapitulation_detail': parse.data.client_financial_recapitulation_detail,
    //                                 'client_financial_statement_detail': parse.data.client_financial_statement_detail,
    //                                 'client_relation': parse.data.client_relation,
    //                                 'client_kyc': parse.data.client_kyc,
    //                                 'client_kyc_detail': parse.data.client_kyc_detail,
    //                               }];
    //                               // param tambahan untuk getrole dynamic
    //                               th.dalservice.ExecSp(th.dataTampClient, th.APIControllerClientMain, th.APIRouteForExecSpForClientCorporateInsert)
    //                                 .subscribe(
    //                                   ress => {
    //                                     const parses = JSON.parse(ress);
    //                                     th.clientCode = parses.code;
    //                                     if (parses.result === 1) {
    //                                       // param tambahan untuk getrole dynamic
    //                                       th.dataTamp = [{
    //                                         'p_client_code': parses.code,
    //                                         'p_branch_code': th.branch_code,
    //                                         'p_branch_name': th.branch_name,
    //                                         'p_prospect_id': th.prospectId
    //                                       }];
    //                                       // param tambahan untuk getrole dynamic
    //                                       // call web service
    //                                       th.dalservice.Insert(th.dataTamp, th.APIControllerMain, th.APIRouteForInsert)
    //                                         .subscribe(
    //                                           resss => {
    //                                             const parsess = JSON.parse(resss);
    //                                             if (parsess.result === 1) {
    //                                               th.showSpinner = false;
    //                                               th.showNotification('bottom', 'right', 'success');
    //                                               if (th.from === 'APPLICATION') {
    //                                                 th.route.navigate(['/application/subapplicationmainlist/applicationmaindetail', parsess.code]);
    //                                               } else if (th.from === 'PLAFOND') {
    //                                                 th.route.navigate(['/plafond/subplafondlist/plafonddetail', parsess.code]);
    //                                               } else if (th.from === 'APPLICATION_QC_VEHICLE') {
    //                                                 th.route.navigate(['/application/subapplicationquickentryvehiclelist/applicationquickentryvehicledetail', parsess.code]);
    //                                               } else if (th.from === 'APPLICATION_SIMULATION') {
    //                                                 th.route.navigate(['/application/subapplicationsimulationlist/applicationsimulationdetail', parsess.code]);
    //                                               }
    //                                             } else {
    //                                               th.deleteClientData(th.clientCode);
    //                                               th.showSpinner = false;
    //                                               th.swalPopUpMsg(parsess.data);
    //                                             }
    //                                           },
    //                                           error => {
    //                                             th.deleteClientData(th.clientCode);
    //                                             th.showSpinner = false;
    //                                             const parsess = JSON.parse(error);
    //                                             th.swalPopUpMsg(parsess.data)
    //                                           });
    //                                     } else {
    //                                       th.deleteClientData(th.clientCode);
    //                                       th.showSpinner = false;
    //                                       th.swalPopUpMsg(parses.data);
    //                                     }
    //                                   },
    //                                   error => {
    //                                     th.showSpinner = false;
    //                                     const parses = JSON.parse(error);
    //                                     th.swalPopUpMsg(parses.data)
    //                                   });
    //                               th.ValidationStatus = undefined;
    //                             } else {
    //                               th.showSpinner = false;
    //                               th.swalPopUpMsg(parse.data);
    //                               th.ValidationStatus = undefined;
    //                             }
    //                           },
    //                           error => {
    //                             th.showSpinner = false;
    //                             const parse = JSON.parse(error);
    //                             th.swalPopUpMsg(parse.data);
    //                             th.ValidationStatus = undefined;
    //                           });
    //                     } else if (th.ValidationStatus !== undefined) {
    //                       th.showSpinner = false;
    //                       th.swalPopUpMsg(th.ValidationStatus);
    //                       th.ValidationStatus = undefined;
    //                     }
    //                   } else {
    //                     i++;
    //                     loopClientMatchingEdit();
    //                   }
    //                 },
    //                 error => {
    //                   th.showSpinner = false;
    //                   const parseValidation = JSON.parse(error);
    //                   th.swalPopUpMsg(parseValidation.data);
    //                   th.ValidationStatus = undefined;
    //                 });
    //           }
    //         })();
    //       } else {
    //         this.dalservice.ExecSpCms(this.dataTampClientCode, this.APIControllerClientMain, this.APIRouteForExecSpForClientCorporate)
    //           .subscribe(
    //             res => {
    //               const parse = JSON.parse(res);
    //               if (parse.result === 1) {
    //                 // param tambahan untuk getrole dynamic
    //                 this.dataTampClient = [{
    //                   'client_main_data': parse.data.client_main_data,
    //                   'client_corporate_data': parse.data.client_corporate_data,
    //                   'client_corporate_notarial': parse.data.client_corporate_notarial,
    //                   'client_personal_data': parse.data.client_personal_data,
    //                   'client_personal_work': parse.data.client_personal_work,
    //                   'client_address': parse.data.client_address,
    //                   'client_asset': parse.data.client_asset,
    //                   'client_bank': parse.data.client_bank,
    //                   'client_bank_book': parse.data.client_bank_book,
    //                   'client_doc': parse.data.client_doc,
    //                   'client_log': parse.data.client_log,
    //                   'client_sipp': parse.data.client_sipp,
    //                   'client_silik': parse.data.client_silik,
    //                   'client_slik_financial': parse.data.client_slik_financial,
    //                   'client_financial_recapitulation': parse.data.client_financial_recapitulation,
    //                   'client_financial_statement': parse.data.client_financial_statement,
    //                   'client_financial_recapitulation_detail': parse.data.client_financial_recapitulation_detail,
    //                   'client_financial_statement_detail': parse.data.client_financial_statement_detail,
    //                   'client_relation': parse.data.client_relation,
    //                   'client_kyc': parse.data.client_kyc,
    //                   'client_kyc_detail': parse.data.client_kyc_detail,
    //                 }];
    //                 // param tambahan untuk getrole dynamic
    //                 this.dalservice.ExecSp(this.dataTampClient, this.APIControllerClientMain, this.APIRouteForExecSpForClientCorporateInsert)
    //                   .subscribe(
    //                     ress => {
    //                       const parses = JSON.parse(ress);
    //                       if (parses.result === 1) {
    //                         this.clientCode = parses.code;
    //                         // param tambahan untuk getrole dynamic
    //                         this.dataTamp = [{
    //                           'p_client_code': parses.code,
    //                           'p_branch_code': this.branch_code,
    //                           'p_branch_name': this.branch_name,
    //                           'p_prospect_id': this.prospectId
    //                         }];
    //                         // param tambahan untuk getrole dynamic
    //                         // call web service
    //                         this.dalservice.Insert(this.dataTamp, this.APIControllerMain, this.APIRouteForInsert)
    //                           .subscribe(
    //                             resss => {
    //                               const parsess = JSON.parse(resss);
    //                               if (parsess.result === 1) {
    //                                 this.showSpinner = false;
    //                                 this.showNotification('bottom', 'right', 'success');
    //                                 if (this.from === 'APPLICATION') {
    //                                   this.route.navigate(['/application/subapplicationmainlist/applicationmaindetail', parsess.code]);
    //                                 } else if (this.from === 'PLAFOND') {
    //                                   this.route.navigate(['/plafond/subplafondlist/plafonddetail', parsess.code]);
    //                                 } else if (this.from === 'APPLICATION_QC_VEHICLE') {
    //                                   this.route.navigate(['/application/subapplicationquickentryvehiclelist/applicationquickentryvehicledetail', parsess.code]);
    //                                 } else if (this.from === 'APPLICATION_SIMULATION') {
    //                                   this.route.navigate(['/application/subapplicationsimulationlist/applicationsimulationdetail', parsess.code]);
    //                                 }
    //                               } else {
    //                                 this.showSpinner = false;
    //                                 this.deleteClientData(this.clientCode);
    //                                 this.swalPopUpMsg(parsess.data);
    //                               }
    //                             },
    //                             error => {
    //                               this.deleteClientData(this.clientCode);
    //                               this.showSpinner = false;
    //                               const parsess = JSON.parse(error);
    //                               this.swalPopUpMsg(parsess.data)
    //                             });
    //                       } else {
    //                         this.showSpinner = false;
    //                         this.swalPopUpMsg(parses.data);
    //                       }
    //                     },
    //                     error => {
    //                       this.showSpinner = false;
    //                       const parses = JSON.parse(error);
    //                       this.swalPopUpMsg(parses.data)
    //                     });
    //               } else {
    //                 this.showSpinner = false;
    //                 this.swalPopUpMsg(parse.data);
    //               }
    //             },
    //             error => {
    //               this.showSpinner = false;
    //               const parse = JSON.parse(error);
    //               this.swalPopUpMsg(parse.data)
    //             });
    //       }
    //     },
    //     error => {
    //       this.showSpinner = false;
    //       const parseGetApi = JSON.parse(error);
    //       this.swalPopUpMsg(parseGetApi.data)
    //     });
  }
  //#endregion button edit

  //#region button back
  btnBack() {
    this.showSpinner = true;
    if (this.prospectId !== null) {
      this.route.navigate(['/application/subprospectlist/prospectdetail', this.prospectId]);
    } else if (this.from === 'APPLICATION') {
      this.route.navigate(['/application/subapplicationmainlist']);
    } else if (this.from === 'PLAFOND') {
      this.route.navigate(['/plafond/subplafondlist']);
    } else if (this.from === 'APPLICATION_QC_VEHICLE') {
      this.route.navigate(['/application/subapplicationquickentryvehiclelist']);
    } else if (this.from === 'APPLICATION_SIMULATION') {
      this.route.navigate(['/application/subapplicationsimulationlist']);
    }
  }
  //#endregion button back

  //#region deleteClientData
  deleteClientData(client_code) {
    this.dataTamp = [{
      'p_code': client_code
    }];
    this.dalservice.Delete(this.dataTamp, this.APIControllerClientMain, this.APIRouteForDelete)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.showSpinner = false;
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
  //#endregion deleteClientData

  //#region SysBranch
  btnLookupSysBranch() {
    $('#datatableLookupSysBranch').DataTable().clear().destroy();
    $('#datatableLookupSysBranch').DataTable({
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
          'p_cre_by': this.uid
        });

        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBranch, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupsysbranch = parse.data;

          if (parse.data != null) {
            this.lookupsysbranch.numberIndex = dtParameters.start;
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
  }

  btnSelectRowSysBranch(code: String, name: String) {
    this.branch_code = code;
    this.branch_name = name;
    $('#datatableClientMatchingList').DataTable().ajax.reload();
    $('#lookupModalSysBranch').modal('hide');
  }
  //#endregion SysBranch
}
