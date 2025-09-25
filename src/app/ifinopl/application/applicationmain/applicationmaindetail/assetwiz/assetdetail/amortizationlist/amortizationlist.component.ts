import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../../base.component';
import { DALService } from '../../../../../../../../DALservice.service';
import swal from 'sweetalert2';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './amortizationlist.component.html'
})

export class AmortizationlistComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  pageType = this.getRouteparam.snapshot.paramMap.get('page');

  // variable
  public listamortization: any = [];
  public tempFile: any;
  public isStatus: Boolean = false;
  private tamps = new Array();
  private base64textString: string;
  private dataTamp: any = [];
  private templatename: any = [];
  private tempFile_upload: any;
  private char_upload: any = [];
  private tempFileSize: any;

  private APIControllerSysGlobalparam: String = 'SysGlobalparam';
  private APIController: String = 'ApplicationAmortization';
  private APIControllerApplicationAsset: String = 'ApplicationAsset';

  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForDownload: String = 'DownloadFileWithData';
  private APIRouteForUpdateAmortization: String = 'UpdateAmortization';
  private APIRouteForUploadDataFile: String = 'UploadDataExcel';
  private APIRouteForCalculate: String = 'ExecSpForCalculate';

  private RoleAccessCode = 'R00019900000000A'; // role access 

  // spinner
  showSpinner: Boolean = false;
  // end

  // form 2 way binding
  model: any = {};
  dataTampPush: any[];
  // ini buat datatables
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
    this.callGetrow();
    this.loadData();
    this.callGetrowGlobalParam()
  }

  //#region getrow data
  callGetrow() {
    this.dataTamp = [];

    this.dataTamp = [{
      'p_asset_no': this.param
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIControllerApplicationAsset, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];

          if (parsedata.amort_type_code === 'UPL') {
            this.isStatus = true;
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

  //#region btnDownload
  btnDownload() {
    const dataParam = [
      {
        'p_asset_no': this.param
      }
    ];
    // param tambahan untuk button Reject dynamic

    this.showSpinner = true;

    this.dalservice.DownloadFileWithData(dataParam, this.APIController, this.APIRouteForDownload).subscribe(res => {

      this.showSpinner = false;
      var contentDisposition = res.headers.get('content-disposition');


      var filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();

      const blob = new Blob([res.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();

    }, err => {
      this.showSpinner = false;
      const parse = JSON.parse(err);
      this.swalPopUpMsg(parse.data);
    });
  }
  //#endregion btnDownload 

  //#region load all data
  loadData() {
    this.dtOptions = {
      'pageLength': 500,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false
      ajax: (dtParameters: any, callback) => {

        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_asset_no': this.param
        })

        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listamortization = parse.data;
          if (parse.data != null) {
            this.listamortization.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 2, 3, 4, 5, 6] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }

  }
  //#endregion load all data

  //#region btnCalculate
  btnCalculate(code: any) {
    this.dataTamp = [];
    // param tambahan untuk getrole dynamic 
    this.dataTamp = [{
      'p_asset_no': code,
      'action': 'default'
    }];
    // param tambahan untuk getrole dynamic
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
        this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForCalculate)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showSpinner = false;
                $('#applicationDetail').click();
                this.showNotification('bottom', 'right', 'success');
                $('#datatableApplicationAmortization').DataTable().ajax.reload()
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
  //#endregion btnCalculate

  //#region upload  file
  handleFile(event) {
    const binaryString = event.target.result;
    this.base64textString = btoa(binaryString);

    this.tamps.push({
      p_module: 'IFINLOS',
      p_header: 'APPLICATION_AMORTIZATION',
      p_child: this.param,
      p_asset_no: this.param,
      filename: this.tempFile,
      base64: this.base64textString
    });
  }

  onUploadReader(event) {
    const files = event.target.files;
    const file = files[0];

    if (this.CheckFileSize(files[0].size, this.tempFileSize)) {
      this.swalPopUpMsg('V;File size must be less or equal to ' + this.tempFileSize + ' MB');
      $('#datatableApplicationAmortization').DataTable().ajax.reload();
    } else {
      if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]); // read file as data url 
        reader.onload = (event) => {
          reader.onload = this.handleFile.bind(this);
          reader.readAsBinaryString(file);
        }
      }
      this.templatename = 'APPLICATION_AMORTIZATION.XLSX';
      this.tempFile = files[0].name.toUpperCase();
      this.char_upload = (this.templatename.length) - 5
      this.tempFile_upload = this.tempFile.substr(0, ~~this.char_upload) + '.XLSX';

      if (this.templatename != this.tempFile_upload) { //this.templatename != this.tempFile
        this.tempFile = undefined;
        swal({
          title: 'Warning',
          text: 'Invalid Template Name',
          buttonsStyling: false,
          confirmButtonClass: 'btn btn-danger',
          type: 'warning'
        }).catch(swal.noop)
        return;
      } else {
        this.showSpinner = true;
      }

      // this.tampDocumentCode = code;
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
        this.showSpinner = true;
        if (result.value) {
          this.dalservice.UploadFile(this.tamps, this.APIController, this.APIRouteForUploadDataFile)
            .subscribe(
              res => {
                const parse = JSON.parse(res);
                if (parse.result === 1) {
                  const dataParam = [
                    {
                      'p_asset_no': this.param
                    }
                  ];
                  // call web service
                  this.dalservice.Update(dataParam, this.APIController, this.APIRouteForUpdateAmortization)
                    .subscribe(
                      res => {
                        const parse = JSON.parse(res);
                        if (parse.result === 1) {
                          this.showSpinner = false;
                          this.tamps = [];
                          this.showNotification('bottom', 'right', 'success');
                          $('#fileControl').val('');
                          $('#datatableApplicationAmortization').DataTable().ajax.reload();
                          this.tempFile = undefined;
                        } else {
                          this.showSpinner = false;
                          this.swalPopUpMsg(parse.data);
                          this.tamps = [];
                          $('#fileControl').val('');
                          $('#datatableApplicationAmortization').DataTable().ajax.reload();
                          this.tempFile = undefined;
                        }
                      },
                      error => {
                        this.showSpinner = false;
                        const parse = JSON.parse(error);
                        this.swalPopUpMsg(parse.data);
                        this.tamps = [];
                        $('#fileControl').val('');
                        $('#datatableApplicationAmortization').DataTable().ajax.reload();
                        this.tempFile = undefined;
                      });
                } else {
                  this.showSpinner = false;
                  this.swalPopUpMsg(parse.data);
                  $('#fileControl').val('');
                  $('#datatableApplicationAmortization').DataTable().ajax.reload();
                  this.tempFile = undefined;
                  this.tamps = [];
                }

              }, error => {
                this.showSpinner = false;
                const parse = JSON.parse(error);
                this.swalPopUpMsg(parse.data);
                $('#fileControl').val('');
                $('#datatableApplicationAmortization').DataTable().ajax.reload();
                this.tempFile = undefined;
                this.tamps = [];
              });
        } else {
          this.showSpinner = false;
          $('#fileControl').val('');
          $('#datatableApplicationAmortization').DataTable().ajax.reload();
          this.tempFile = undefined;
          this.tamps = [];
        }
      })
    }

  }
  //#endregion upload  file
}