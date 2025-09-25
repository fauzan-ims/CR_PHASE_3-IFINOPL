import { OnInit, ViewChild, Component, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import { DALService } from '../../../../../../../DALservice.service';
import swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './changeduedateagreementamortizationhistorylist.component.html'
})

export class ChangeduedateagreementamortizationhistorylistComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');

  // variable
  public listchangeduedateagreementamortizationhistory: any = [];
  private dataTamp: any = [];
  private tamps = new Array();
  private base64textString: string;
  private newDate: any;
  private tempFile: any;
  private tempFileSize: any;
  public due_date_change_code: any;
  public listLookupAsset: any = [];
  public asset_no: String;
  public asset_name: String;

  //controller
  private APIController: String = 'AgreementAssetAmortization';
  private APIControllerDueDateChangeMain: String = 'DueDateChangeMain';
  private APIControllerDueDateChangeDetail: String = 'DueDateChangeDetail';
  private APIControllerSysGlobalparam: String = 'SysGlobalparam';

  //rooute
  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForUploadDataFile: String = 'ExecSpForUploadExcel';
  private APIRouteForCalculate: String = 'ExecSpForCalculate';
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteLookup: String = 'GetRowsForLookup';
  private RoleAccessCode = 'R00023870000001A'; // role access 

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = false;
  // end

  // ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  constructor(private dalservice: DALService,
    private _location: Location,
    public route: Router,
    public getRouteparam: ActivatedRoute,
    private _elementRef: ElementRef) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.loadData();
    this.compoSide('', this._elementRef, this.route);
    this.callGetrow();
    this.callGetrowGlobalParam()
  }

  //#region getrow data
  callGetrow() {
    // param tambahan untuk getrow dynamic
    this.dataTamp = [{
      'p_code': this.param
    }];
    // end param tambahan untuk getrow dynamic

    this.dalservice.Getrow(this.dataTamp, this.APIControllerDueDateChangeMain, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);
          this.newDate = parsedata.new_due_date_day;

          this.showSpinner = false;
        },
        error => {
          console.log('There was an error while Retrieving Data(API) !!!' + error);
        });
  }
  //#endregion getrow data

  //#region getrow data
  callGetrowGlobalParam() {

    this.dataTamp = [{
      'p_code': 'FUPS'
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIControllerSysGlobalparam, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];

          this.tempFileSize = parsedata.file_size;

          this.showSpinner = false;
        },
        error => {
          console.log('There was an error while Retrieving Data(API) !!!' + error);
        });
  }
  //#endregion getrow data

  //#region btnCalculate
  btnCalculate(code: any) {
    // param tambahan untuk getrole dynamic
    this.dataTamp = [{
      'p_code': code,
      'action': ''
    }];
    // param tambahan untuk getrole dynamic

    if (this.newDate === null) {
      swal({
        title: 'Warning',
        text: 'Please Fill a Mandatory Field OR Format Is Invalid',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-warning',
        type: 'warning'
      }).catch(swal.noop)
      return;
    } else {
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
        if (result.value) {
          this.showSpinner = true;
          this.dalservice.ExecSp(this.dataTamp, this.APIControllerDueDateChangeMain, this.APIRouteForCalculate)
            .subscribe(
              res => {
                const parse = JSON.parse(res);
                if (parse.result === 1) {
                  this.showSpinner = false;
                  this.showNotification('bottom', 'right', 'success');
                  $('#datatableAgreement').DataTable().ajax.reload()
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
  }
  //#endregion btnCalculate

  //#region upload  file
  handleFile(event) {
    const binaryString = event.target.result;
    this.base64textString = btoa(binaryString);

    this.tamps.push({
      p_module: 'IFINLMS',
      p_header: 'DRAWDOWN_AMORTIZATION',
      p_child: this.param,
      p_code: this.param,
      filename: this.tempFile,
      base64: this.base64textString
    });
  }

  onUploadReader(event) {

    const files = event.target.files;
    const file = files[0];
    if (this.CheckFileSize(files[0].size, this.tempFileSize)) {
      this.swalPopUpMsg('V;File size must be less or equal to ' + this.tempFileSize + ' MB');
    } else {
      if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();

        reader.readAsDataURL(event.target.files[0]); // read file as data url

        // tslint:disable-next-line:no-shadowed-variable
        reader.onload = (event) => {
          reader.onload = this.handleFile.bind(this);
          reader.readAsBinaryString(file);
        }
      }
      this.tempFile = files[0].name;
      swal({
        title: 'Are you sure?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false
      }).then((result) => {
        if (result.value) {
          this.dalservice.UploadFile(this.tamps, this.APIControllerDueDateChangeMain, this.APIRouteForUploadDataFile)
            .subscribe(
              res => {
                const parse = JSON.parse(res);
                if (parse.result === 1) {
                  $('#drawdownDetail').click();
                  this.showNotification('bottom', 'right', 'success');
                  $('#fileControl').val('');
                  window.location.reload();
                  this.tempFile = '';
                } else {
                  this.swalPopUpMsg(parse.data)
                  $('#fileControl').val('');
                  window.location.reload();
                  this.tempFile = '';
                }
              }, error => {
                const parse = JSON.parse(error);
                this.swalPopUpMsg(parse.data)
                $('#fileControl').val('');
                window.location.reload();
                this.tempFile = '';
              });
        } else {
          $('#fileControl').val('');
          window.location.reload();
          this.tempFile = '';
        }
      })
    }
  }
  //#endregion upload  file

  //#region load all data
  loadData() {
    this.dtOptions = {
      'pagingType': 'first_last_numbers',
      'pageLength': 500,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false
      ajax: (dtParameters: any, callback) => {
        // param tambahan untuk getrow dynamic
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_agreement_no': this.params,
          'p_asset_no': this.asset_no,
        });
        console.log(dtParameters);

        // end param tambahan untuk getrow dynamic
        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listchangeduedateagreementamortizationhistory = parse.data;
          if (parse.data != null) {
            this.listchangeduedateagreementamortizationhistory.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });

        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 2, 3, 4, 5, 6, 7] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion public serviceAddressList load all data

  //#region Branch Name
  btnLookupAsset() {
    $('#datatableLookAsset').DataTable().clear().destroy();
    $('#datatableLookAsset').DataTable({
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
          'p_due_date_change_code': this.param
        });
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIControllerDueDateChangeDetail, this.APIRouteLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listLookupAsset = parse.data;
          if (parse.data != null) {
            this.listLookupAsset.numberIndex = dtParameters.start;
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

  btnSelectRowAsset(code: String, name: String) {
    this.asset_no = code;
    this.asset_name = name;
    $('#lookupModalAsset').modal('hide');
    $('#datatableAgreement').DataTable().ajax.reload();
  }

  resteAsset() {
    this.asset_no = undefined;
    this.asset_name = undefined;
    $('#datatableAgreement').DataTable().ajax.reload();
  }
  //#endregion branch
}




