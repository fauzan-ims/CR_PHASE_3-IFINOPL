import { OnInit, ViewChild, Component, ElementRef, SecurityContext } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import { DALService } from '../../../../../../../DALservice.service';
import swal from 'sweetalert2';
import * as CryptoJS from "crypto-js";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './documentrealizationlist.component.html'
})

export class DocumentrealizationlistComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public listdataDoc: any = [];
  public valid: String;
  private dataTamp: any = [];
  private dataTempThirdParty: any = [];
  private DocumentIframe: any;
  private tempURL: any;
  private tempLiteDmsUser: any;
  private tempLiteDmsRole: any;
  private tempLiteDmsOptionAllRole: any;
  private tempLiteDmsOptionViewRole: any;
  private tempLiteDmsOption: any;
  public tempTransactionNo: any;
  public transactionName: any;

  private APIController: String = 'RealizationDoc';
  private APIControllerSysGlobalparam: String = 'SysGlobalparam';
  private APIControllerRealization: String = 'Realization';


  private APIRouteForGetThirddParty: String = 'ExecSpForGetThirddParty';
  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForUpdateIsValid: String = 'ExecSpForUpdateIsValid';
  private APIRouteForUpdate: String = 'Update';

  private RoleAccessCode = 'R00020670000000A'; // role access 

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
    private _elementRef: ElementRef,
    private domSanitizer: DomSanitizer) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.compoSide('', this._elementRef, this.route);
    this.loadData();
    this.callGetrowRealization();
    this.callGlobalParamForThirdPartyLiteDMS();
  }

  //#region callGetrowRealization
  callGetrowRealization() {

    this.dataTamp = [{
      'p_code': this.param
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIControllerRealization, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];

          // mapper dbtoui
          Object.assign(this.model, parsedata);
          // end mapper dbtoui

          $('#datatableRealizationDocument').DataTable().ajax.reload();
          this.transactionName= parsedata.transaction_name;

          this.showSpinner = false;
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
  }
  //#endregion callGetrowRealization

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
              this.tempLiteDmsOptionAllRole = parsedata[i].value
            }
            else if (parsedata[i].code === 'ENIFR07') {
              this.tempLiteDmsOptionViewRole = parsedata[i].value
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
      'pageLength': 100,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false
      ajax: (dtParameters: any, callback) => {

        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_realization_code': this.param
        });

        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          for (let i = 0; i < parse.data.length; i++) {
            // checkbox
            if (parse.data[i].is_valid === '1') {
              parse.data[i].is_valid = true;
            } else {
              parse.data[i].is_valid = false;
            }

            if (parse.data[i].is_received === '1') {
              parse.data[i].is_received = true;
            } else {
              parse.data[i].is_received = false;
            }
            // end checkbox

          }
          this.listdataDoc = parse.data;
          if (parse.data != null) {
            this.listdataDoc.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 4, 6] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion load all data

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
            $('#datatableRealizationDocument').DataTable().ajax.reload();
          } else {
            this.showSpinner = false;
            this.swalPopUpMsg(parse.data);
            $('#datatableRealizationDocument').DataTable().ajax.reload();
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
            $('#datatableRealizationDocument').DataTable().ajax.reload();
          } else {
            this.showSpinner = false;
            this.swalPopUpMsg(parse.data);
            $('#datatableRealizationDocument').DataTable().ajax.reload();
          }
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data)
        });
  }
  //#endregion isValid

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

    if (this.model.status === 'HOLD') {
      this.tempLiteDmsOption = this.tempLiteDmsOptionAllRole
    } else {
      this.tempLiteDmsOption = this.tempLiteDmsOptionViewRole
    }

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

  //#region button save in list
  // saveList() {

  //   this.showSpinner = true;
  //   this.listdataDoc = [];

  //   let i = 0;

  //   const getID = $('[name="p_id"]')
  //     .map(function () { return $(this).val(); }).get();

  //   const getPromiseDate = $('[name="p_promise_date"]')
  //     .map(function () { return $(this).val(); }).get();

  //   const getIsReceived = $('[name="p_is_received"]')
  //     .map(function () { return $(this).val(); }).get();

  //   const getRemarks = $('[name="p_remarks"]')
  //     .map(function () { return $(this).val(); }).get();

  //   const getIsValid = $('[name="p_is_valid"]')
  //     .map(function () { return $(this).val(); }).get();  

    
  //   while (i < getIsReceived.length) {

  //     while (i < getIsValid.length) {

  //       while (i < getRemarks.length) {

  //         while (i < getID.length) {

  //           while (i < getPromiseDate.length) {
  //             if (getPromiseDate[i] === '') {
  //               getPromiseDate[i] = undefined;
  //             }
  //             this.listdataDoc.push(this.JSToNumberFloats({
  //               p_id: getID[i],
  //               p_promise_date: this.dateFormatList(getPromiseDate[i]),
  //               p_is_received: getIsReceived[i],
  //               p_remarks: getRemarks[i],
  //               p_is_valid: getIsValid[i]
  //             }));
  //             //#region web service
  //             this.dalservice.Update(this.listdataDoc, this.APIController, this.APIRouteForUpdate)
  //               .subscribe(
  //                 res => {
  //                   const parse = JSON.parse(res);
  //                   if (parse.result === 1) {
  //                     this.showSpinner = false;
  //                     this.showNotification('bottom', 'right', 'success');
  //                     $('#datatableRealizationDocument').DataTable().ajax.reload();
  //                   } else {
  //                     this.showSpinner = false;
  //                     this.swalPopUpMsg(parse.data);
  //                   }
  //                 },
  //                 error => {
  //                   this.showSpinner = false;
  //                   const parse = JSON.parse(error);
  //                   this.swalPopUpMsg(parse.data);
  //                 });
  //             //#endregion web service
  //             i++;
  //           }
  //           i++;
  //         }
  //         i++;
  //       }
  //       i++;
  //     }
  //   i++;
  //   }


  // }
  //#endregion button save in list

  btnSavelist() {
  this.showSpinner = true;
  this.listdataDoc = [];

  // Ambil semua nilai input
  const getID         = $('[name="p_id_tbo"]').map((_, el) => $(el).val()).get();
  const getRemarks    = $('[name="p_remarks"]').map((_, el) => $(el).val()).get();
  const getIsValid    = $('[name="p_is_valid"]').map((_, el) => $(el).prop("checked")? 1 : 0).get();
  const getIsReceived = $('[name="p_is_received"]').map((_, el) => $(el).prop("checked")? 1 : 0).get();
  const getReffDate   = $('[name="p_promise_date"]').map((_, el) => $(el).val()).get();

  // Loop satu kali saja
  for (let i = 0; i < getID.length; i++) {
    let reffDate = getReffDate[i] || undefined; // kosong → undefined
    this.listdataDoc.push({
      p_id: getID[i],
      p_promise_date: this.dateFormatList(reffDate),
      p_remarks: getRemarks[i],
      p_is_received: getIsReceived[i], // boolean
      p_is_valid: getIsValid[i],        // boolean
      p_transaction_name: this.transactionName
    });
  }

  // Web service
  this.dalservice.Update(this.listdataDoc, this.APIController, this.APIRouteForUpdate)
    .subscribe(
      res => {
        const parse = JSON.parse(res);
        if (parse.result === 1) {
          this.showNotification('bottom', 'right', 'success');
          $('#datatableRealizationDocument').DataTable().ajax.reload();
        } else {
          this.swalPopUpMsg(parse.data);
          $('#datatableRealizationDocument').DataTable().ajax.reload();
        }
        this.showSpinner = false;
      },
      error => {
        const parse = JSON.parse(error);
        this.swalPopUpMsg(parse.data);
        $('#datatableRealizationDocument').DataTable().ajax.reload();
        this.showSpinner = false;
      }
    );
  }
}