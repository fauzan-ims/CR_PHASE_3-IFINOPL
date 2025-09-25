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
  templateUrl: './contractmaturitydetail.component.html'
})

export class ContractmaturitydetailComponent extends BaseComponent implements OnInit {
  // get param from url
  maturityCode = this.getRouteparam.snapshot.paramMap.get('maturityCode');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public isStatus: Boolean = false;
  public isProceed: Boolean = false;
  public isCancel: Boolean = false;
  public contractmaturitydetailData: any = [];
  public listapplicationasset: any = [];
  public lookupemployee: any = [];
  public lookupasset: any = [];
  public setStyle: any = [];
  private dataTamp: any = [];
  public listmaturitydetailData: any = [];
  public tampHidden: Boolean;
  private dataTamps: any = [];
  private base64textString: string;
  public tempFile: any;
  private tamps = new Array();
  public tampDocumentCode: String;
  public lookupapproval: any = [];
  public lookupbillingtype: any = [];

  private APIController: String = 'Maturity';
  private APIControllerMaturityDetail: String = 'MaturityDetail';
  private APIControllerApprovalSchedule: String = 'ApprovalSchedule';

  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIControllerReport: String = 'Report';
  private APIRouteForDownload: String = 'getReport';
  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForUpdate: String = 'Update';
  private APIRouteForUpdateResult: String = 'UpdateForResult';
  private APIRouteForCancel: String = 'ExecSpForGetCancel';
  private APIRouteForProceed: String = 'ExecSpForGetProceed';
  private APIRouteForUploadFile: String = 'Upload';
  private APIRouteForPriviewFile: String = 'Priview';
  private APIRouteForDeleteFile: String = 'Deletefile';
  private APIControllerBillingType: String = 'MasterBillingType';

  private RoleAccessCode = 'R00020730000000A'; // role access 

  // form 2 way binding
  model: any = {};
  model_upload: any = {};

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
          'p_code': this.maturityCode,
          'p_pickup_date': this.model.pickup_date
        })

        this.dalservice.Getrows(dtParameters, this.APIControllerMaturityDetail, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          for (let i = 0; i < parse.data.length; i++) {
            // change btn
            if (parse.data[i].result === 'CONTINUE') {
              parse.data[i].result = true;
            } else {
              parse.data[i].result = false;
            }
            // end change btn

            this.listapplicationasset = parse.data;
          }
          this.listapplicationasset = parse.data;

          if (parse.data != null) {
            this.listapplicationasset.numberIndex = dtParameters.start;
          }

          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 6, 7] }], // for disabled coloumn
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
      'p_code': this.maturityCode
    }];
    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);
          if (parsedata.file_paths === '' || parsedata.file_paths == null) {
            this.tampHidden = true;
          } else {
            this.tampHidden = false;
          }
          $('#datatableApplicationAsset').DataTable().ajax.reload();

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

  //#region button Proceed
  btnProceed() {
    // param tambahan untuk button Proceed dynamic
    this.dataTamps = [{
      'p_code': this.maturityCode,
      'action': ''
    }];
    // param tambahan untuk button Proceed dynamic

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
        this.dalservice.ExecSp(this.dataTamps, this.APIController, this.APIRouteForProceed)
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
        this.showSpinner = false;
      }
    });
  }
  //#endregion button Proceed

  //#region button Cancel
  btnCancel(agreement_no: any) {
    // param tambahan untuk getrole dynamic
    this.dataTamps = [{
      'p_code': this.maturityCode,
      'p_agreement_no': agreement_no,
      'action': 'default'
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
        this.dalservice.ExecSp(this.dataTamps, this.APIController, this.APIRouteForCancel)
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
    });
  }
  //#endregion button Cancel

  //#region button back
  btnBack() {
    this.route.navigate(['/maintenance/subcontractmaturitylist']);
    $('#datatableContractmaturitylist').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region  form submit
  onFormSubmit(contractmaturitydetailForm: NgForm, isValid: boolean) {
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

    this.contractmaturitydetailData = this.JSToNumberFloats(contractmaturitydetailForm);
    const usersJson: any[] = Array.of(this.contractmaturitydetailData);

    // call web service
    this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.callGetrow();
            $('#datatableApplicationAsset').DataTable().ajax.reload();
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

  //#region button save list
  btnSaveList() {
    // this.showSpinner = true;
    this.listmaturitydetailData = [];

    var i = 0;

    var getID = $('[name="p_id_detail"]')
      .map(function () { return $(this).val(); }).get();

    var getAdditionalPeriode = $('[name="p_additional_periode"]')
      .map(function () { return $(this).val(); }).get();

    var getRemarks = $('[name="p_remark_detail"]')
      .map(function () { return $(this).val(); }).get();

    var getPickupDate = $('[name="p_pickup_date"]')
      .map(function () { return $(this).val(); }).get();

    while (i < getID.length) {

      while (i < getPickupDate.length) {

        this.listmaturitydetailData.push(
          this.JSToNumberFloats({
            p_id: getID[i],
            p_additional_periode: getAdditionalPeriode[i],
            p_remark: getRemarks[i],
            p_pickup_date: this.dateFormatList(getPickupDate[i])
          })
        )
        i++;
      }

      i++;
    }


    //#region web service
    this.dalservice.Update(this.listmaturitydetailData, this.APIControllerMaturityDetail, this.APIRouteForUpdate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);

          if (parse.result === 1) {
            this.showNotification('bottom', 'right', 'success');
            $('#datatableApplicationAsset').DataTable().ajax.reload();
          } else {
            this.swalPopUpMsg(parse.data);
          }
        },
        error => {
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
    //#endregion web service
  }
  //#endregion button save list

  //#region button Update replacement type
  changeConfirmationResult(replacementtype: any) {
    this.model.result = replacementtype.target.value
    if (this.model.result === 'STOP') {
      this.model.pickup_date = undefined;
      this.model.additional_periode = 0
    }
    // this.dataTamp = [{
    //   'p_code': code,
    //   'p_result': replacementtype.target.value,
    // }];

    // // call web service
    // this.dalservice.Update(this.dataTamp, this.APIController, this.APIRouteForUpdateResult)
    //   .subscribe(
    //     res => {
    //       const parse = JSON.parse(res);

    //       if (parse.result === 1) {
    //         this.model.pickup_date = undefined;
    //         $('#datatableApplicationAsset').DataTable().ajax.reload();
    //         this.callGetrow()
    //         this.showSpinner = false;
    //       } else {
    //         this.showSpinner = false;
    //         this.swalPopUpMsg(parse.data);
    //       }
    //     },
    //     error => {
    //       this.showSpinner = false;
    //       const parse = JSON.parse(error);
    //       this.swalPopUpMsg(parse.data);
    //     });
  }
  //#endregion button Update Replacement Type

  //#region button edit
  btnEdit(codeEdit: String) {
    this.route.navigate(['/maintenance/subcontractmaturitylist/contractmaturitydetaillist', this.maturityCode, codeEdit]);
  }
  //#endregion button edit

  //#region btn print
  btnPrint() {
    this.showSpinner = true;
    this.dataTamp = [{
      'p_code': this.model.code
    }];
    const dataParam = {
      TableName: 'rpt_maturity',
      SpName: 'xsp_rpt_maturity',
      reportparameters: {
        p_user_id: this.userId,
        p_code: this.model.code,
        p_print_option: 'PDF'
      }
    };

    this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
      this.printRptNonCore(res);
      this.showSpinner = false;
    }, err => {
      this.showSpinner = false;
      const parse = JSON.parse(err);
      this.swalPopUpMsg(parse.data);
    });
  }
  //#endregion tbn print

  //#region convert to base64
  handleFile(event) {
    this.showSpinner = true;
    const binaryString = event.target.result;
    this.base64textString = btoa(binaryString);

    this.tamps.push({
      p_header: 'MATURITY',
      p_module: 'IFINOPL',
      p_child: this.maturityCode,
      p_code: this.maturityCode,
      p_file_paths: this.maturityCode,
      p_file_name: this.tempFile,
      p_base64: this.base64textString
    });
    console.log(this.tamps);

    this.dalservice.UploadFile(this.tamps, this.APIController, this.APIRouteForUploadFile)
      .subscribe(
        res => {
          this.tamps = new Array();
          const parses = JSON.parse(res);
          if (parses.result === 1) {
            this.showSpinner = false;
          } else {
            this.showSpinner = false;
            this.swalPopUpMsg(parses.message);
          }
          this.callGetrow();
        },
        error => {
          this.showSpinner = false;
          this.tamps = new Array();
          const parses = JSON.parse(error);
          this.swalPopUpMsg(parses.message);
          this.callGetrow();
        });
  }
  //#endregion convert to base64

  //#region button select image
  onUpload(event, code: String) {
    const files = event.target.files;
    const file = files[0];

    if (this.CheckFileSize(files[0].size, this.model_upload.value)) {
      this.swalPopUpMsg('V;File size must be less or equal to ' + this.model_upload.value + ' MB');
      this.callGetrow();
    } else {
      if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();

        reader.readAsDataURL(event.target.files[0]); // read file as data url

        reader.onload = (event) => {
          reader.onload = this.handleFile.bind(this);
          reader.readAsBinaryString(file);
        }
      }
      this.tempFile = files[0].name;
      this.tampDocumentCode = code;
    }
  }
  //#endregion button select image

  //#region button delete image
  deleteImage(file_name: any, row2) {
    const usersJson: any[] = Array.of();

    usersJson.push({
      p_code: this.maturityCode,
      p_file_name: file_name,
      p_branch_code: this.maturityCode,
      p_file_paths: row2
    });

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
        this.dalservice.DeleteFile(usersJson, this.APIController, this.APIRouteForDeleteFile)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showSpinner = false;
                this.callGetrow();
                this.tempFile = undefined;
                this.showNotification('bottom', 'right', 'success');
              } else {
                this.showSpinner = false;
                this.swalPopUpMsg(parse.message);
              }
              this.callGetrow();
            },
            error => {
              this.showSpinner = false;
              const parse = JSON.parse(error);
              this.swalPopUpMsg(parse.message);
            });
      } else {
        this.showSpinner = false;
      }
    });
  }
  //#endregion button delete image

  //#region button priview image
  priviewFile(row1, row2) {
    this.showSpinner = true;
    const usersJson: any[] = Array.of();

    usersJson.push({
      p_file_name: row1,
      p_file_paths: row2
    });

    this.dalservice.PriviewFile(usersJson, this.APIController, this.APIRouteForPriviewFile)
      .subscribe(
        (res) => {
          const parse = JSON.parse(res);
          if (parse.value.filename !== '') {
            const fileType = parse.value.filename.split('.').pop();
            if (fileType === 'PNG') {
              this.downloadFile(parse.value.data, parse.value.filename, fileType);
              // const newTab = window.open();
              // newTab.document.body.innerHTML = this.pngFile(parse.value.data);
              // this.showSpinner = false;
            }
            if (fileType === 'JPEG' || fileType === 'JPG') {
              this.downloadFile(parse.value.data, parse.value.filename, fileType);
              // const newTab = window.open();
              // newTab.document.body.innerHTML = this.jpgFile(parse.value.data);
              // this.showSpinner = false;
            }
            if (fileType === 'PDF') {
              this.downloadFile(parse.value.data, parse.value.filename, 'pdf');
              // const newTab = window.open();
              // newTab.document.body.innerHTML = this.pdfFile(parse.value.data);
              // this.showSpinner = false;
            }
            if (fileType === 'DOCX' || fileType === 'DOC') {
              this.downloadFile(parse.value.data, parse.value.filename, 'msword');
            }
            if (fileType === 'XLSX') {
              this.downloadFile(parse.value.data, parse.value.filename, 'vnd.ms-excel');
            }
            if (fileType === 'PPTX') {
              this.downloadFile(parse.value.data, parse.value.filename, 'vnd.ms-powerpoint');
            }
            if (fileType === 'TXT') {
              this.downloadFile(parse.value.data, parse.value.filename, 'txt');
            }
            if (fileType === 'ODT' || fileType === 'ODS' || fileType === 'ODP') {
              this.downloadFile(parse.value.data, parse.value.filename, 'vnd.oasis.opendocument');
            }
            if (fileType === 'ZIP') {
              this.downloadFile(parse.value.data, parse.value.filename, 'zip');
            }
            if (fileType === '7Z') {
              this.downloadFile(parse.value.data, parse.value.filename, 'x-7z-compressed');
            }
            if (fileType === 'RAR') {
              this.downloadFile(parse.value.data, parse.value.filename, 'vnd.rar');
            }
          }
        }
      );
  }

  downloadFile(base64: string, fileName: string, extention: string) {
    var temp = 'data:application/' + extention + ';base64,'
      + encodeURIComponent(base64);
    var download = document.createElement('a');
    download.href = temp;
    download.download = fileName;
    document.body.appendChild(download);
    download.click();
    document.body.removeChild(download);
    this.showSpinner = false;
  }

  //#endregion button priview image

  //#region approval Lookup
  btnViewApproval() {
    $('#datatableLookupApproval').DataTable().clear().destroy();
    $('#datatableLookupApproval').DataTable({
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
          'p_reff_no': this.maturityCode
        });


        this.dalservice.GetrowsApv(dtParameters, this.APIControllerApprovalSchedule, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupapproval = parse.data;
          if (parse.data != null) {
            this.lookupapproval.numberIndex = dtParameters.start;
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
      order: [[5, 'ASC']],
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }
  //#endregion approval Lookup

  //#region btnContinue
  btnContinue(id) {
    this.showSpinner = true;
    this.dataTamp = [];
    this.dataTamp = [{
      'p_id': id,
      'p_code': this.maturityCode
    }];

    // call web service
    this.dalservice.Update(this.dataTamp, this.APIControllerMaturityDetail, this.APIRouteForUpdate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            $('#datatableApplicationAsset').DataTable().ajax.reload();
            this.showSpinner = false;
          } else {
            this.showSpinner = false;
            this.swalPopUpMsg(parse.data);
            $('#datatableApplicationAsset').DataTable().ajax.reload();
          }
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data)
        });
  }
  //#endregion btnContinue 

  //#region BillingType Lookup
  btnLookupBillingType() {
    $('#datatableLookupBillingType').DataTable().clear().destroy();
    $('#datatableLookupBillingType').DataTable({
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

        this.dalservice.Getrows(dtParameters, this.APIControllerBillingType, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupbillingtype = parse.data;
          if (parse.data != null) {
            this.lookupbillingtype.numberIndex = dtParameters.start;
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

  btnSelectRowBillingType(code: String, description: String) {
    this.model.new_billing_type = code;
    this.model.new_billing_type_desc = description;
    $('#lookupModalBillingType').modal('hide');
  }
  //#endregion BillingType lookup
}