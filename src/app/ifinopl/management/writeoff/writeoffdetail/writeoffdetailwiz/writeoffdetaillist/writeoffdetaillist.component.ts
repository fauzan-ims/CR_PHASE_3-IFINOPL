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
  templateUrl: './writeoffdetaillist.component.html'
})

export class WriteoffdetaillistComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public listwriteoffdetail: any = [];
  private dataTamp: any = [];

  private APIController: String = 'WriteOffDetail';
  private APIControllerWriteOffMain: String = 'WriteOffMain';

  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForUpdate: String = 'Update';

  private RoleAccessCode = 'R00020890000000A'; // role access 

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


    this.dalservice.Getrow(this.dataTamp, this.APIControllerWriteOffMain, this.APIRouteForGetRow)
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
          'p_write_off_code': this.param
        });

        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          for (let i = 0; i < parse.data.length; i++) {
            // checkbox
            if (parse.data[i].is_take_assets === '1') {
              parse.data[i].is_take_assets = true;
            } else {
              parse.data[i].is_take_assets = false;
            }
            // end checkbox

            this.listwriteoffdetail = parse.data;
          }

          // this.listwriteoffdetail = parse.data;
          if (parse.data != null) {
            this.listwriteoffdetail.numberIndex = dtParameters.start;
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
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion public serviceAddressList load all data

  //#region btnTakeAsset
  btnTakeAsset(id) {
    this.dataTamp = [];
    this.dataTamp = [{
      'p_id': id,
      'p_write_off_code': this.param
    }];

    // call web service
    this.dalservice.Update(this.dataTamp, this.APIController, this.APIRouteForUpdate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.showSpinner = false;
            $('#datatableWoDetailList').DataTable().ajax.reload();
          } else {
            this.showSpinner = false;
            this.swalPopUpMsg(parse.data);
            $('#datatableWoDetailList').DataTable().ajax.reload();
          }
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data)
        });
  }
  //#endregion btnTakeAsset 
}



