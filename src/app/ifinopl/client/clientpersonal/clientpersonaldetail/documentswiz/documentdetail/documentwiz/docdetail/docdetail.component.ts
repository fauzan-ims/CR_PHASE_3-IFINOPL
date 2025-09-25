import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../../../base.component';
import { DALService } from '../../../../../../../../../DALservice.service';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './docdetail.component.html'
})

export class DocdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');
  type = this.getRouteparam.snapshot.paramMap.get('type');
  from = this.getRouteparam.snapshot.paramMap.get('from');
  page = this.getRouteparam.snapshot.paramMap.get('page');

  // variable
  public NpwpPattern = this._npwpformat;
  public plafond_status: String;
  public plafondStatus: Boolean;
  public documentdetailData: any = [];
  public lookupdocumenttype: any = [];
  public isReadOnly: Boolean = false;
  public setStyle: any = [];
  private dataTamp: any = [];
  private dataTampClientCode: any = [];
  private ValidationStatus: String = undefined;

  private APIController: String = 'ClientDoc';
  private APIControllerSysGeneralSubcode: String = 'SysGeneralSubcode';
  private APIControllerSysGeneralValidation: String = 'SysGeneralValidation';

  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForLookup: String = 'GetRowsForLookup';

  private RoleAccessCode = 'R00022550000010A';

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
    this.plafond_status = $('#plafondStatus').val();
    if (this.plafond_status !== 'HOLD') {
      this.plafondStatus = true;
    } else {
      this.plafondStatus = false;
    }
    if (this.params != null) {
      // call web service
      this.callGetrow();
    } else {
      this.model.doc_status = 'EXIST';
      this.showSpinner = false;
    }
  }

  //#region getrow data
  callGetrow() {
     
    this.dataTamp = [{
      'p_id': this.params
    }];
    
    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);
          // checkbox
          if (parsedata.is_default === '1') {
            parsedata.is_default = true;
          } else {
            parsedata.is_default = false;
          }
          // end checkbox

          // mapper dbtoui
          Object.assign(this.model, parsedata);
          // end mapper dbtoui

          if (this.model.doc_type_code === 'TAXID') {
            $("#npwp").attr('maxlength', '15');
          }

          this.showSpinner = false;
        },
        error => {
          console.log('There was an error while Retrieving Data(API) !!!' + error);
        });
  }
  //#endregion getrow data

  //#region npwp
  onKeydownNpwp(event: any) {

    let ctrlDown = false;

    if (event.keyCode == 17 || event.keyCode == 91) {
      ctrlDown = true;
    }

    if (!((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)
      || (ctrlDown && (event.keyCode == 86 || event.keyCode == 67 || event.keyCode == 65 || event.keyCode == 90))
      || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 46
      || (event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 38 || event.keyCode == 40)
    )) {

      return false;
    }

  }

  onPasteNpwp(event: any) {
    if (this.model.doc_type_code === 'TAXID') {
      if (!event.originalEvent.clipboardData.getData('Text').match(/^[0-9,.-]*$/)) {
        event.preventDefault();
      }
    }
  }

  onFokusNpwp(event: any) {
    if (this.model.doc_type_code === 'TAXID') {
      let valEvent: any;
      valEvent = '' + event.target.value;

      if (valEvent != null) {
        this.model.document_no_taxid = valEvent.replace(/[^0-9]/g, '');
      }
    }
  }

  onChangeNpwp(event: any) {
    if (this.model.doc_type_code === 'TAXID') {
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

        this.model.document_no_taxid = hh;
      }
    }
  }
  //#endregion npwp

  //#region  form submit
  onFormSubmit(documentdetailForm: NgForm, isValid: boolean) {
    this.ValidationStatus = undefined;
    // validation form submit
    if (!isValid) {
      swal({
        title: 'Warning!',
        text: 'Please Fill a Mandatory Field OR Format Is Invalid!!',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-warning',
        type: 'warning'
      }).catch(swal.noop)
      return;
    } else {
      this.showSpinner = true;
    }

    this.documentdetailData = documentdetailForm;
    if (this.documentdetailData.p_is_default == null) {
      this.documentdetailData.p_is_default = false;
    }
    if (this.documentdetailData.p_doc_type_code === 'TAXID') {
      this.documentdetailData.p_document_no = this.documentdetailData.p_document_no_taxid;
    }
    this.documentdetailData = this.JSToNumberFloats(documentdetailForm);
    const usersJson: any[] = Array.of(this.documentdetailData);
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
            let i = 0;

            (function loopClientDoc() {
              if (i < parseGetApi.data.length) {
                // param tambahan untuk getrole dynamic
                th.dataTampClientCode = [{
                  'p_client_no': $('#clientNo').val(),
                  'p_doc_no': th.documentdetailData.p_document_no,
                  'p_doc_type': th.documentdetailData.p_doc_type_code,
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
                          if (th.params != null) {
                            // call web service
                            th.dalservice.Update(usersJson, th.APIController, th.APIRouteForUpdate)
                              .subscribe(
                                res => {
                                  const parse = JSON.parse(res);
                                  if (parse.result === 1) {
                                    th.showSpinner = false;
                                    $('#clientDetail').click();
                                    th.callGetrow();
                                    th.showNotification('bottom', 'right', 'success');
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
                          } else {
                            // call web service
                            th.dalservice.Insert(usersJson, th.APIController, th.APIRouteForInsert)
                              .subscribe(
                                res => {
                                  const parse = JSON.parse(res);
                                  if (parse.result === 1) {
                                    th.showSpinner = false;
                                    $('#clientDetail').click();
                                    th.showNotification('bottom', 'right', 'success');
                                    th.route.navigate(['/client/subclientpersonallist/clientpersonaldetail/' + th.param + '/' + th.params + '/' + th.type + '/' + th.from + '/' + th.page + '/documentdetail/' + th.param + '/' + th.type + '/docdetail/', th.param, parse.id], { skipLocationChange: true });
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
                          }
                        } else if (th.ValidationStatus !== undefined) {
                          th.showSpinner = false;
                          th.swalPopUpMsg(th.ValidationStatus);
                          th.ValidationStatus = undefined;
                        }
                      } else {
                        i++;
                        loopClientDoc();
                      }
                    },
                    error => {
                      this.showSpinner = false;
                      const parseValidation = JSON.parse(error);
                      this.swalPopUpMsg(parseValidation.data);
                      this.ValidationStatus = undefined;
                    });
              }
            })();
          }
          else {
            if (this.params != null) {
              // call web service
              this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
                .subscribe(
                  res => {
                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                      this.showSpinner = false;
                      $('#clientDetail').click();
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
                      $('#clientDetail').click();
                      this.showNotification('bottom', 'right', 'success');
                      this.route.navigate(['/client/subclientpersonallist/clientpersonaldetail/' + this.param + '/' + this.params + '/' + this.type + '/' + this.from + '/' + this.page + '/documentdetail/' + this.param + '/' + this.type + '/docdetail/', this.param, parse.id], { skipLocationChange: true });
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
          }
        },
        error => {
          this.showSpinner = false;
          const parseGetApi = JSON.parse(error);
          this.swalPopUpMsg(parseGetApi.data)
        });
  }
  //#endregion form submit

  //#region button back
  btnBack() {
    this.route.navigate(['/client/subclientpersonallist/clientpersonaldetail/' + this.param + '/' + this.params + '/' + this.type + '/' + this.from + '/' + this.page + '/documentdetail/' + this.param + '/' + this.type + '/doclist/', this.param], { skipLocationChange: true });
    $('#datatableClientDoc').DataTable().ajax.reload();
  }
  //#endregion button back

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

  //#region DocumentType Lookup
  btnLookupDocumentType() {
    $('#datatableLookupDocumentType').DataTable().clear().destroy();
    $('#datatableLookupDocumentType').DataTable({
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
          'p_general_code': 'CDTYP'
        });
        
        this.dalservice.Getrows(dtParameters, this.APIControllerSysGeneralSubcode, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupdocumenttype = parse.data;

          if (parse.data != null) {
            this.lookupdocumenttype.numberIndex = dtParameters.start;
          }

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 3] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowDocumentType(code: String, description: String) {
    this.model.doc_type_code = code;
    this.model.doc_type_desc = description;

    if (this.model.doc_type_code === 'TAXID') {
      $("#npwp").attr('maxlength', '15');
    }
    $('#lookupModalDocumentType').modal('hide');
  }
  //#endregion DocumentType lookup

}
