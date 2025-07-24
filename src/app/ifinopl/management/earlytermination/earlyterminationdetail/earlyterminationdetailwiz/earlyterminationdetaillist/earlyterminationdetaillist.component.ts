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
  templateUrl: './earlyterminationdetaillist.component.html'
})

export class EarlyterminationdetaillistComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public listearlyterminationdetail: any = [];
  private dataTamp: any = [];

  private APIController: String = 'EtDetail';
  private APIControllerEtMain: String = 'EtMain';

  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForUpdate: String = 'Update';
  private APIRouteForUpdateApproveToSell: String = 'ExecSpForUpdateApproveToSell';

  private RoleAccessCode = 'R00020880000000A'; // role access 

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
    this.compoSide('', this._elementRef, this.route);
    this.callGetrow();
    this.loadData();
  }

  //#region getrow data
  callGetrow() {

    this.dataTamp = [{
      'p_code': this.param,
    }];


    this.dalservice.Getrow(this.dataTamp, this.APIControllerEtMain, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          if (parsedata.is_simulation === '1') {
            parsedata.is_simulation = true;
          } else {
            parsedata.is_simulation = false;
          }
          if (parsedata.is_insurance_terminate === '1') {
            parsedata.is_insurance_terminate = true;
          } else {
            parsedata.is_insurance_terminate = false;
          }

          // mapper dbtoui
          Object.assign(this.model, parsedata);
          // end mapper dbtoui

          this.showSpinner = false;
        },
        error => {
          console.log('There was an error while Retrieving Data(API) !!!' + error);
        });
  }
  //#endregion getrow data

  //#region load all data
  loadData() {
    this.dtOptions = {
      'pagingType': 'first_last_numbers',
      'pageLength': 50,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false 
      ajax: (dtParameters: any, callback) => {

        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_et_code': this.param
        });

        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          for (let i = 0; i < parse.data.length; i++) {
            // checkbox
            if (parse.data[i].is_terminate === '1') {
              parse.data[i].is_terminate = true;
            } else {
              parse.data[i].is_terminate = false;
            }

            if (parse.data[i].is_approve_to_sell === '1') {
              parse.data[i].is_approve_to_sell = true;
            } else {
              parse.data[i].is_approve_to_sell = false;
            }
            // end checkbox

            this.listearlyterminationdetail = parse.data;
          }

          this.listearlyterminationdetail = parse.data;
          if (parse.data != null) {
            this.listearlyterminationdetail.numberIndex = dtParameters.start;
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
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 11] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion public serviceAddressList load all data

  //#region btnTerminate
  btnTerminate(id) {
    this.showSpinner = true;
    this.dataTamp = [];
    this.dataTamp = [{
      'p_id': id,
      'p_et_code': this.param
    }];

    // call web service
    this.dalservice.Update(this.dataTamp, this.APIController, this.APIRouteForUpdate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            $('#datatabledetail').DataTable().ajax.reload();
            this.showSpinner = false;
          } else {
            this.showSpinner = false;
            this.swalPopUpMsg(parse.data);
            $('#datatabledetail').DataTable().ajax.reload();
          }
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data)
        });
  }
  //#endregion btnTerminate

  //#region btnApproveToSell
  btnApproveToSell(id) {
    this.showSpinner = true;
    this.dataTamp = [];
    this.dataTamp = [{
      'p_id': id,
      'p_et_code': this.param
    }];

    // call web service
    this.dalservice.Update(this.dataTamp, this.APIController, this.APIRouteForUpdateApproveToSell)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            $('#datatabledetail').DataTable().ajax.reload();
            this.showSpinner = false;
          } else {
            this.showSpinner = false;
            this.swalPopUpMsg(parse.data);
            $('#datatabledetail').DataTable().ajax.reload();
          }
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data)
        });
  }
  //#endregion btnApproveToSell 

  //#region button edit
  btnEdit(codeEdit: string) {
    this.route.navigate(['/management/subearlyterminationlist/earlyterminationdetail/' + this.param + '/earlyterminationdetaillist/' + this.param + '/earlyterminationdetaildetail/', this.param, codeEdit]);
  }
  //#endregion button edit
}



