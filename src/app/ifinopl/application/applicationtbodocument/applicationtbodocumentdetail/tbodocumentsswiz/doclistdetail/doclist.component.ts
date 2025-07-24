import { OnInit, ViewChild, Component, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import { DALService } from '../../../../../../../DALservice.service';
import swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './doclist.component.html'
})

export class TboDoclistComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  applicationNo = this.getRouteparam.snapshot.paramMap.get('applicationNo');

  // variable
  public listdoc: any = [];
  public docData: any = [];
  public tempFile: any;
  public listdataDoc: any = [];
  public listID: any = [];
  public setStyle: any = [];
  public listExpDate: any = [];
  public valid: String;
  private dataTamp: any = [];
  private DocumentIframe: any;
  private dataTempThirdParty: any = [];
  private tempLiteDmsUser: any;
  private tempLiteDmsRole: any;
  private tempLiteDmsOption: any;

  private APIController: String = 'ApplicationDoc';
  private APIControllerTboDocument: String = 'TboDocument';
  private APIControllerSysGlobalparam: String = 'SysGlobalparam';

  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForGetThirddParty: String = 'ExecSpForGetThirddParty';
  private APIRouteForUpdateIsValid: String = 'ExecSpForUpdateIsValid';
  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForUpdate: String = 'Update';

  private RoleAccessCode = 'R00024730000001A'; // role access 

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = true;
  // end

  // ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  constructor(private dalservice: DALService,
    public route: Router,
    public getRouteparam: ActivatedRoute,
    private _elementRef: ElementRef) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.callGetrow();
    this.loadData();
    this.callGlobalParamForThirdPartyLiteDMS();
  }

  //#region getrow data
  callGetrow() {

    this.dataTamp = [{
      'p_id': this.param
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIControllerTboDocument, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

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

  //#region isValid
  isValid(event: any, remark: any, id: any) {
    this.showSpinner = true;

    if (event.target.checked === true) {
      this.valid = 'T'
    } else {
      this.valid = 'F'
    }

    this.dataTamp = [{
      'p_id': id,
      'p_application_no': this.param,
      'p_remarks': remark,
      'p_is_valid': this.valid,
      'action': 'default'
    }];

    this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForUpdateIsValid)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.showSpinner = false;
            this.showNotification('bottom', 'right', 'success');
            $('#datatableApplicationDocument').DataTable().ajax.reload();
          } else {
            this.showSpinner = false;
            this.swalPopUpMsg(parse.data);
            $('#datatableApplicationDocument').DataTable().ajax.reload();
          }
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data)
        });
  }
  //#endregion isValid

  //#region isValid
  saveRemarks(event: any, isValid: any, id: any) {
    this.showSpinner = true;

    this.dataTamp = [{
      'p_id': id,
      'p_application_no': this.param,
      'p_remarks': event.target.value,
      'p_is_valid': isValid,
      'action': 'default'
    }];

    this.dalservice.ExecSp(this.dataTamp, this.APIController, this.APIRouteForUpdateIsValid)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.showSpinner = false;
            this.showNotification('bottom', 'right', 'success');
            $('#datatableApplicationDocument').DataTable().ajax.reload();
          } else {
            this.showSpinner = false;
            this.swalPopUpMsg(parse.data);
            $('#datatableApplicationDocument').DataTable().ajax.reload();
          }
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data)
        });
  }
  //#endregion isValid

  //#region GlobalParam for Thirdparty
  callGlobalParamForThirdPartyLiteDMS() {

    this.dataTempThirdParty = [{
      'p_type': "CLIENT_IFRAME",
      'action': "getResponse"
    }];

    this.dalservice.ExecSp(this.dataTempThirdParty, this.APIControllerSysGlobalparam, this.APIRouteForGetThirddParty)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data);

          for (let i = 0; i < parsedata.length; i++) {
            if (parsedata[i].code === 'ENIFR03') {
              this.DocumentIframe = parsedata[i].value
            }
            else if (parsedata[i].code === 'ENIFR04') {
              this.tempLiteDmsUser = parsedata[i].value
            }
            else if (parsedata[i].code === 'ENIFR05') {
              this.tempLiteDmsRole = parsedata[i].value
            }
            else if (parsedata[i].code === 'ENIFR06') {
              this.tempLiteDmsOption = parsedata[i].value
            }
          }

          this.showSpinner = false;
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
  }
  //#endregion GlobalParam for Thirdparty

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
          'p_application_no': this.applicationNo,
          'p_is_tbo': '1'
        });

        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listdoc = parse.data;
          if (parse.data != null) {
            this.listdoc.numberIndex = dtParameters.start;
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
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion load all data

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

  //#region button save in list
  saveList() {

    this.showSpinner = true;
    this.listdataDoc = [];

    let i = 0;

    const getID = $('[name="p_id"]')
      .map(function () { return $(this).val(); }).get();

    const getReceivedDate = $('[name="p_received_date"]')
      .map(function () { return $(this).val(); }).get();

    const getPromiseDate = $('[name="p_promise_date"]')
      .map(function () { return $(this).val(); }).get();


    while (i < getID.length) {

      while (i < getReceivedDate.length) {

        while (i < getPromiseDate.length) {
          if (getReceivedDate[i] === '') {
            getReceivedDate[i] = undefined;
          }
          if (getPromiseDate[i] === '') {
            getPromiseDate[i] = undefined;
          }
          this.listdataDoc.push({
            p_id: getID[i],
            p_received_date: this.dateFormatList(getReceivedDate[i]),
            p_promise_date: this.dateFormatList(getPromiseDate[i]),
            p_is_tbo: '1'
          });

          i++;
        }

        i++;
      }

      i++;
    }

    //#region web service
    this.dalservice.Update(this.listdataDoc, this.APIController, this.APIRouteForUpdate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.showSpinner = false;
            $('#applicationDetail').click();
            this.showNotification('bottom', 'right', 'success');
            $('#datatableApplicationTboDocument').DataTable().ajax.reload();
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
    //#endregion web service

  }
  //#endregion button save in list

  //#region iframe lite dms
  btnOpenLD() {
    this.encryptUsingAES256();
  }

  encryptUsingAES256() {
    let tempEncrypted: any = "";
    let request: any = {};
    let MetadataParent: any = [];
    let MetadataObject: any = [];
    let Option: any = [];

    MetadataParent = [
      {
        label: "No Customer",
        value: this.model.client_no
      }
    ]
    MetadataObject = [
      {
        label: "No Application",
        value: this.model.application_external_no
      }
    ]
    Option = [
      {
        "label": "OverideSecurity",
        "value": this.tempLiteDmsOption
      }
    ]

    request = {
      "User": this.tempLiteDmsUser,
      "Role": this.tempLiteDmsRole,
      "ViewCode": "ConfinsIfin",
      "MetadataParent": MetadataParent,
      "MetadataObject": MetadataObject,
      "Option": Option
    }

    let _key = CryptoJS.enc.Utf8.parse("A2IVRJSTDHTP1CJV");
    let _iv = CryptoJS.enc.Utf8.parse("V56E7QYOGREMAIII");
    let encrypted = CryptoJS.AES.encrypt("js=" + JSON.stringify(request) + "&cftsv=" + this.sysDate, _key, {
      keySize: 128,
      iv: _iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    tempEncrypted = encrypted.toString();
    // const iframe = $('#iframeLiteDMS');

    // this.tempURL = this.domSanitizer.sanitize(SecurityContext.RESOURCE_URL, this.domSanitizer.bypassSecurityTrustResourceUrl(this.DocumentIframe + encodeURIComponent(tempEncrypted.toString())))

    // setTimeout(() => {
    //   iframe.attr('src', this.tempURL);
    //   this.showSpinner = false;
    // }, 300);
    window.open(this.DocumentIframe + encodeURIComponent(tempEncrypted.toString()))
  }
  //#endregion iframe lite dms
}