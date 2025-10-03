import { Component, OnInit, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { BaseComponent } from '../../../../../../../../../base.component';
import { DataTableDirective } from 'angular-datatables';
import { DALService } from '../../../../../../../../../DALservice.service';

@Component({
  selector: 'app-approvalfinalchecklist',
  templateUrl: './approvalfinalchecklist.component.html',
})
export class ApprovalfinalchecklistComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public listlog: any = [];

  private APIController: String = 'ApplicationMain';
  private APIRouteForGetRows: String = 'GetRowsForApplicationWorkflowPrinting';
  private APIRouteForDownloadOfferingLater: String = 'PrinOfferingLater';

  private RoleAccessCode = 'R00020690000010A';

  // spinner
  showSpinner: Boolean = false;
  // end

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

        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listlog = parse.data;
          if (parse.data != null) {
            this.listlog.numberIndex = dtParameters.start;
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
      order: [[1, 'DESC']],
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 3] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }

  }
  //#endregion load all data

  //#region print
  btnPrint(description: any) {

    this.showSpinner = true;
    if (description == "OFFERING LATER") {
      let filename = ""

      filename = "OFFERING_LATER"

      const dataParamOfferingLater = [{
        "p_file_name": filename,
        "p_user_id": this.userId,
        "p_application_no": this.param
      }];

      this.dalservice.DownloadFileWithParam(dataParamOfferingLater, this.APIController, this.APIRouteForDownloadOfferingLater).subscribe(res => {

        this.showSpinner = false;
        var contentOfferingLater = res.headers.get('content-disposition');

        var filename = contentOfferingLater.split(';')[1].split('filename')[1].split('=')[1].trim();

        const blob = new Blob([res.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        this.showNotification('bottom', 'right', 'success');
        // $('#datatables').DataTable().ajax.reload();
        // window.open(url);

      },
        err => {
          this.showSpinner = false;
          const parse = JSON.parse(err);
          this.swalPopUpMsg(parse.data);
        });
    } else if (description == "PERJANJIAN") {

      let filename = ""

      filename = "PERJANJIAN"

      const dataParamOfferingLater = [{
        "p_file_name": filename,
        "p_user_id": this.userId,
        "p_application_no": this.param
      }];

      this.dalservice.DownloadFileWithParam(dataParamOfferingLater, this.APIController, this.APIRouteForDownloadOfferingLater).subscribe(res => {

        this.showSpinner = false;
        var contentOfferingLater = res.headers.get('content-disposition');

        var filename = contentOfferingLater.split(';')[1].split('filename')[1].split('=')[1].trim();

        const blob = new Blob([res.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        this.showNotification('bottom', 'right', 'success');
        // $('#datatables').DataTable().ajax.reload();
        // window.open(url);

      },
        err => {
          this.showSpinner = false;
          const parse = JSON.parse(err);
          this.swalPopUpMsg(parse.data);
        });
    } else if (description == "LAMPIRAN KENDARAAN") {

      let filename = ""

      filename = "LAMPIRAN_KENDARAAN"

      const dataParamOfferingLater = [{
        "p_file_name": filename,
        "p_user_id": this.userId,
        "p_application_no": this.param
      }];

      this.dalservice.DownloadFileWithParam(dataParamOfferingLater, this.APIController, this.APIRouteForDownloadOfferingLater).subscribe(res => {

        this.showSpinner = false;
        var contentOfferingLater = res.headers.get('content-disposition');

        var filename = contentOfferingLater.split(';')[1].split('filename')[1].split('=')[1].trim();

        const blob = new Blob([res.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        this.showNotification('bottom', 'right', 'success');
        // $('#datatables').DataTable().ajax.reload();
        // window.open(url);

      },
        err => {
          this.showSpinner = false;
          const parse = JSON.parse(err);
          this.swalPopUpMsg(parse.data);
        });

    } else if (description == "LAMPIRAN LAIN-LAIN") {

      let filename = ""

      filename = "LAMPIRAN_LAIN-LAIN"

      const dataParamOfferingLater = [{
        "p_file_name": filename,
        "p_user_id": this.userId,
        "p_application_no": this.param
      }];

      this.dalservice.DownloadFileWithParam(dataParamOfferingLater, this.APIController, this.APIRouteForDownloadOfferingLater).subscribe(res => {

        this.showSpinner = false;
        var contentOfferingLater = res.headers.get('content-disposition');

        var filename = contentOfferingLater.split(';')[1].split('filename')[1].split('=')[1].trim();

        const blob = new Blob([res.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        this.showNotification('bottom', 'right', 'success');
        // $('#datatables').DataTable().ajax.reload();
        // window.open(url);

      },
        err => {
          this.showSpinner = false;
          const parse = JSON.parse(err);
          this.swalPopUpMsg(parse.data);
        });
      //#endregion print
    } else if (description == "LAMPIRAN SCHEDULE") {

      let filename = ""

      filename = "LAMPIRAN_SCHEDULE"

      const dataParamOfferingLater = [{
        "p_file_name": filename,
        "p_user_id": this.userId,
        "p_application_no": this.param
      }];

      this.dalservice.DownloadFileWithParam(dataParamOfferingLater, this.APIController, this.APIRouteForDownloadOfferingLater).subscribe(res => {

        this.showSpinner = false;
        var contentOfferingLater = res.headers.get('content-disposition');

        var filename = contentOfferingLater.split(';')[1].split('filename')[1].split('=')[1].trim();

        const blob = new Blob([res.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        this.showNotification('bottom', 'right', 'success');
        // $('#datatables').DataTable().ajax.reload();
        // window.open(url);

      },
        err => {
          this.showSpinner = false;
          const parse = JSON.parse(err);
          this.swalPopUpMsg(parse.data);
        });
      //#endregion print
    }
    else if (description == "PERNYATAAN PENERIMAAN BARANG") {

      let filename = ""

      filename = "PERNYATAAN_PENERIMAAN_BARANG"

      const dataParamOfferingLater = [{
        "p_file_name": filename,
        "p_user_id": this.userId,
        "p_application_no": this.param
      }];

      this.dalservice.DownloadFileWithParam(dataParamOfferingLater, this.APIController, this.APIRouteForDownloadOfferingLater).subscribe(res => {

        this.showSpinner = false;
        var contentOfferingLater = res.headers.get('content-disposition');

        var filename = contentOfferingLater.split(';')[1].split('filename')[1].split('=')[1].trim();

        const blob = new Blob([res.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        this.showNotification('bottom', 'right', 'success');
        // $('#datatables').DataTable().ajax.reload();
        // window.open(url);

      },
        err => {
          this.showSpinner = false;
          const parse = JSON.parse(err);
          this.swalPopUpMsg(parse.data);
        });
      //#endregion print
    }
  }
}