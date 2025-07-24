import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';

@Component({
  selector: 'app-fakturallocationdetail',
  templateUrl: './fakturallocationdetail.component.html'
})
export class FakturallocationdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  fakturallocationCode = this.getRouteparam.snapshot.paramMap.get('fakturallocationcode');

  // variable
  public fakturallocationData: any = [];
  public listfakturallocationdetail: any = [];
  public isReadOnly: Boolean = false;
  public dataTamp: any = [];
  public setStyle: any = [];
  public lookupsysbranch: any = [];
  private APIControllerSysBranch: String = 'SysBranch';
  public branch_name: String;
  public branch_code: String;
  private dataRoleTamp: any = [];
  public generatexmlData: any = [];
  private dataRoleTampGetrowsXml: any = [];
  private filename_xml: any = [];

  //controller
  private APIController: String = 'FakturAllocation';
  private APIControllerSub: String = 'FakturAllocationDetail';

  //route
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForGetRows: String = 'GETROWS';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForRefresh: String = 'ExecSpForRefresh';
  private APIRouteForProceed: String = 'ExecSpProceed';
  private APIRouteForCancel: String = 'ExecSpCancel';
  private APIRouteForReturn: String = 'ExecSpReturn';
  private APIRouteForPost: String = 'ExecSpPost';
  private APIRouteForDownload: String = 'DownloadFileWithData';
  private APIRouteForFileZip: String = 'ExecSpForFileZip';
  private APIRouteForGetrowsXml: String = 'ExecSpForXml';
  private APIRouteForGenerate: String = 'ExecSpForGenerate';
  private RoleAccessCode = 'R00020810000000A'; // role access 

  // report
  private APIControllerReport: String = 'Report';
  private APIRouteForDownloadReport: String = 'getReport';

  // form 2 way binding
  model: any = {};

  // checklist
  public selectedAll: any;
  public selectedAllTable: any;
  private checkedList: any = [];

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
    if (this.fakturallocationCode != null) {
      this.isReadOnly = true;

      // call web service
      this.callGetrow();
      this.loadData();
    } else {
      this.model.is_editable = true;
      this.showSpinner = false;
      this.model.status = 'HOLD';
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
          'p_allocation_code': this.fakturallocationCode
        });


        // tslint:disable-next-line:max-line-length
        this.dalservice.Getrows(dtParameters, this.APIControllerSub, this.APIRouteForGetRows).subscribe(fakturallocationresp => {
          const fakturallocationparse = JSON.parse(fakturallocationresp);
          this.listfakturallocationdetail = fakturallocationparse.data;
          if (fakturallocationparse.data != null) {
            this.listfakturallocationdetail.numberIndex = dtParameters.start;
          }

          // if use checkAll use this
          $('#checkall').prop('checked', false);
          // end checkall

          callback({
            draw: fakturallocationparse.draw,
            recordsTotal: fakturallocationparse.recordsTotal,
            recordsFiltered: fakturallocationparse.recordsFiltered,
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
      'p_code': this.fakturallocationCode
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          // checkbox active
          if (parsedata.status !== 'HOLD') {
            this.isReadOnly = true;
          } else {
            this.isReadOnly = false;
          }
          // end checkbox active

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

  //#region  form submit
  onFormSubmit(fakturallocationForm: NgForm, isValid: boolean) {
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

    this.fakturallocationData = fakturallocationForm;
    this.fakturallocationData = this.JSToNumberFloats(fakturallocationForm);
    console.log(this.fakturallocationData);

    const usersJson: any[] = Array.of(this.fakturallocationData);
    if (this.fakturallocationCode != null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showSpinner = false;
              this.showNotification('bottom', 'right', 'success');
              this.callGetrow();
              $('#datatableFaktur').DataTable().ajax.reload();
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
      // call web service
      this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            console.log(parse);

            if (parse.result === 1) {
              this.showSpinner = false;
              this.showNotification('bottom', 'right', 'success');
              this.route.navigate(['/billing/subfakturallocationlist/fakturallocationdetail', parse.code]);
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
    this.route.navigate(['/billing/subfakturallocationlist']);
    $('#datatable').DataTable().ajax.reload();
  }
  //#endregion button back

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
          'default': ''
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
    this.model.branch_code = code;
    this.model.branch_name = name;
    $('#lookupModalSysBranch').modal('hide');
  }
  //#endregion SysBranch

  //#region getStyles
  getStyles(isTrue: Boolean) {
    if (isTrue) {
      this.setStyle = {
        'pointer-events': 'none',
      }
    } else {
      this.setStyle = {
        'pointer-events': 'unset',
      }
    }

    return this.setStyle;
  }
  //#endregion getStyles

  //#region button refresh
  btnRefresh() {
    // param tambahan untuk button Post dynamic
    this.dataTamp = [{
      'p_allocation_code': this.fakturallocationCode,
      'action': ''
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
        this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForRefresh)
          .subscribe(
            res => {
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                this.showSpinner = false;
                this.showNotification('bottom', 'right', 'success');
                $('#datatableFaktur').DataTable().ajax.reload();
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
  //#endregion button refresh

  //#region button Proceed
  btnProceed(code: string) {
    // param tambahan untuk getrole dynamic
    this.dataRoleTamp = [{
      'p_code': code,
    }];
    // param tambahan untuk getrole dynamic
    console.log(this.dataRoleTamp);

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
                this.callGetrow();
                this.showNotification('bottom', 'right', 'success');
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

  //#region button Cancel
  btnCancel(code: string) {
    // param tambahan untuk button Done dynamic
    this.dataRoleTamp = [{
      'p_code': code,
    }];
    // param tambahan untuk button Done dynamic

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
                this.callGetrow();
                this.showNotification('bottom', 'right', 'success');
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
  btnPost(code: string) {
    // param tambahan untuk button Done dynamic
    this.dataRoleTamp = [{
      'p_code': code,
    }];
    // param tambahan untuk button Done dynamic

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
                this.callGetrow();
                this.showNotification('bottom', 'right', 'success');
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

  //#region button Return
  btnReturn(code: string) {
    // param tambahan untuk button Done dynamic
    this.dataRoleTamp = [{
      'p_code': code,
    }];
    // param tambahan untuk button Done dynamic

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
                this.callGetrow();
                this.showNotification('bottom', 'right', 'success');
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

  //#region btn Print
  btnPrint(code: string) {
    const dataParam = [
      {
        'p_code': code
      }
    ];

    this.showSpinner = true;
    this.dalservice.DownloadFileWithData(dataParam, this.APIControllerSub, this.APIRouteForDownload).subscribe(res => {
      var contentDisposition = res.headers.get('content-disposition');
      var filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();
      const blob = new Blob([res.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      this.showSpinner = false;
    }, err => {
      this.showSpinner = false;
      const parse = JSON.parse(err);
      this.swalPopUpMsg(parse.data);
    });
  }
  //#endregion

  //#region button print pajak
  btnPrintPajak() {
    this.showSpinner = true;
    const dataParam = {
      TableName: 'rpt_list_faktur_pajak_ar_detail',
      SpName: 'xsp_rpt_list_faktur_pajak_ar_detail',
      reportparameters: {
        p_user_id: this.userId,
        p_faktur_no: this.model.code,
        p_print_option: 'Excel'

      }
    };

    this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownloadReport).subscribe(res => {
      this.printRptNonCore(res);
      this.showSpinner = false;
    }, err => {
      this.showSpinner = false;
      const parse = JSON.parse(err);
      this.swalPopUpMsg(parse.data);
    });
  }

  //#endregion button print pajak

  selectAllTable() {
    for (let i = 0; i < this.listfakturallocationdetail.length; i++) {
      this.listfakturallocationdetail[i].selected = this.selectedAll;
    }
  }

  checkIfAllTableSelected() {
    this.selectedAll = this.listfakturallocationdetail.every(function (item: any) {
      return item.selected === true;
    })
  }


  //   //#region btnGenerate
  // btnGenerate(fakturallocationForm: NgForm) {
  //   this.generatexmlData = fakturallocationForm;

  // console.log(this.generatexmlData);

  //   this.dataRoleTampGetrowsXml = [this.JSToNumberFloats({
  //       // 'p_file_name': vm.filename_xml,
  //       'p_file_name': 'faktur_no_allocation_'+this.generatexmlData.p_code,
  //       'p_date': this.generatexmlData.p_date,
  //       'p_finance_company_type': this.generatexmlData.p_finance_company_type,
  //       p_user_id: this.userId,
  //       p_faktur_no: this.generatexmlData.p_code,
  //       p_print_option: 'Excel'
  //   })];

  //   // Show confirmation dialog
  //   swal({
  //     title: 'Are you sure?',
  //     type: 'warning',
  //     showCancelButton: true,
  //     confirmButtonClass: 'btn btn-success',
  //     cancelButtonClass: 'btn btn-danger',
  //     confirmButtonText: this._deleteconf,
  //     buttonsStyling: false
  //   }).then((result) => {
  //     if (result.value) {
  //       this.dalservice.ExecSp(this.dataRoleTampGetrowsXml, this.APIController, this.APIRouteForGenerate)
  //       .subscribe(
  //         res => {
  //           this.showSpinner = false;
  //           const parse = JSON.parse(res);
  //           if (parse.result === 1) {
  //             this.showNotification('bottom', 'right', 'success');

  //             // Ambil nama file dari parameter yang dikirim
  //             const fileName = this.dataRoleTampGetrowsXml[0].p_file_name + '.xml';

  //             // Buat URL download. Asumsikan 'FilesXml' berada di root aplikasi.
  //             const downloadUrl = `/FilesXml/${fileName}`;

  //             // Buat link download dan picu download
  //             const link = document.createElement('a');
  //             link.href = downloadUrl;
  //             link.download = fileName;
  //             document.body.appendChild(link);
  //             link.click();
  //             document.body.removeChild(link);

  //           } else {
  //             this.swalPopUpMsg(parse.data);
  //           }
  //         },
  //         error => {
  //           this.showSpinner = false;
  //           const parse = JSON.parse(error);
  //           this.swalPopUpMsg(parse.data);
  //         });

  //     }
  //   });
  // }
  // //#endregion btnGenerate

  //#region btnGenerate
  btnGenerate(fakturallocationForm: NgForm) {
    this.showSpinner = true;
    this.generatexmlData = fakturallocationForm;

    console.log(this.generatexmlData);

    this.dataRoleTampGetrowsXml = [this.JSToNumberFloats({
      // 'p_file_name': vm.filename_xml,
      'p_file_name': 'faktur_no_allocation_' + this.generatexmlData.p_code,
      'p_date': this.generatexmlData.p_date,
      'p_finance_company_type': this.generatexmlData.p_finance_company_type,
      p_user_id: this.userId,
      p_faktur_no: this.generatexmlData.p_code,
      p_print_option: 'Excel'
    })];

    // Show confirmation dialog
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
        this.dalservice.ExecSp(this.dataRoleTampGetrowsXml, this.APIControllerSub, this.APIRouteForGenerate)
          .subscribe(
            res => {
              this.showSpinner = false;
              const parse = JSON.parse(res);
              if (parse.result === 1) {
                // this.showNotification('bottom', 'right', 'success');
                const base64Xml = parse.data[0];
                const decodedXml = atob(base64Xml);


                const blob = new Blob([decodedXml], { type: parse.data[1] });
                const url = window.URL.createObjectURL(blob);
                var link = document.createElement('a');
                link.href = url;
                link.download = parse.data[2];
                link.click();

                // // Ambil nama file dari parameter yang dikirim
                // const fileName = this.dataRoleTampGetrowsXml[0].p_file_name + '.xml';

                // // Buat URL download. Asumsikan 'FilesXml' berada di root aplikasi.
                // const downloadUrl = `/FilesXml/${fileName}`;

                // // Buat link download dan picu download
                // const link = document.createElement('a');
                // link.href = downloadUrl;
                // link.download = fileName;
                // document.body.appendChild(link);
                // link.click();
                // document.body.removeChild(link);

              } else {
                this.swalPopUpMsg(parse.data);
              }
            },
            error => {
              this.showSpinner = false;
              const parse = JSON.parse(error);
              this.swalPopUpMsg(parse.data);
            });

      }
    });
  }
  //#endregion btnGenerate
}