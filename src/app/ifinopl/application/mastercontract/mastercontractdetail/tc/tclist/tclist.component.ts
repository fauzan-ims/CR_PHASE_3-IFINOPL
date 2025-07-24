import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import { Location } from '@angular/common';
import { DALService } from '../../../../../../../DALservice.service';
import swal from 'sweetalert2';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './tclist.component.html'
})

export class tclistComponent extends BaseComponent implements OnInit {

  // get param from url
  appNo = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public listtc: any = [];
  public dataTamp: any = [];
  public dataTampDelete: any = [];

  //controller
  private APIController: String = 'MainContractTc';
  private APIControllerApplicationExtention: String = 'ApplicationExtention';

  //route
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForInsert: String = 'Insert';
  private APIRouteForDelete: String = 'Delete';
  private APIRouteForUpdate: String = 'Update';

  private RoleAccessCode = 'R00022360000000A'; // role access 

  // form 2 way binding
  model: any = {};
  modelApplicationExtention: any = {};

  public selectedAll: any;
  public checkedList: any = [];

  // checklist
  public selectedAllTable: any;

  // ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  constructor(private dalservice: DALService, public route: Router,
    public getRouteparam: ActivatedRoute,
    private _location: Location,
    private _elementRef: ElementRef) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.loadData();
    this.callGetrowAppExtentio();
  }

  //#region callGetrowAppExtentio
  callGetrowAppExtentio() {

    this.dataTamp = [{
      'p_application_no': this.appNo
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIControllerApplicationExtention, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = this.getrowNgb(parse.data[0]);

          // mapper dbtoui
          Object.assign(this.modelApplicationExtention, parsedata);
          // end mapper dbtoui

          setTimeout(() => {
            $('#datatableTC').DataTable().ajax.reload();
          }, 250);

          this.showSpinner = false;
        },
        error => {
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
  }
  //#endregion callGetrowAppExtentio

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
          'p_main_contract_no': this.modelApplicationExtention.main_contract_no,
          'default': '',
        });

        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);

          this.listtc = parse.data;

          if (parse.data != null) {
            this.listtc.numberIndex = dtParameters.start;
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
  //#endregion load all data

  //#region btn delete
  btnDeleteAll() {
    this.checkedList = [];
    for (let i = 0; i < this.listtc.length; i++) {
      if (this.listtc[i].selected) {
        this.checkedList.push(this.listtc[i].id);
      }
    }

    // jika tidak di checklist
    if (this.checkedList.length === 0) {
      swal({
        title: this._listdialogconf,
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-danger'
      }).catch(swal.noop)
      return
    }

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
        let th = this;
        var i = 0;
        (function loopDeleteTc() {
          if (i < th.checkedList.length) {
            th.dataTampDelete = [{
              'p_id': th.checkedList[i],
              'p_main_contract_no': th.modelApplicationExtention.main_contract_no,
              'action': ''
            }];
            th.dalservice.ExecSp(th.dataTampDelete, th.APIController, th.APIRouteForDelete)
              .subscribe(
                res => {
                  const parse = JSON.parse(res);
                  if (parse.result === 1) {
                    if (th.checkedList.length == i + 1) {
                      $('#MasterContractReload').click();
                      th.showNotification('bottom', 'right', 'success');
                      $('#datatableTC').DataTable().ajax.reload();
                      th.showSpinner = false;
                    } else {
                      i++;
                      loopDeleteTc();
                    }
                  } else {
                    $('#MasterContractReload').click();
                    th.swalPopUpMsg(parse.data);
                    th.showSpinner = false;
                  }
                },
                error => {
                  const parse = JSON.parse(error);
                  th.swalPopUpMsg(parse.data);
                  th.showSpinner = false;
                });
          }
        })();
      } else {
        this.showSpinner = false;
      }
    });
  }

  selectAllTable() {
    for (let i = 0; i < this.listtc.length; i++) {
      this.listtc[i].selected = this.selectedAll;
    }
  }

  checkIfAllTableSelected() {
    this.selectedAll = this.listtc.every(function (item: any) {
      return item.selected === true;
    })
  }
  //#endregion btn delete

  //#region btnAdd()
  btnAdd() {
    var dataTempTc = [];
    dataTempTc = [{
      'p_main_contract_no': this.modelApplicationExtention.main_contract_no,
      'p_application_no': this.appNo,
      'action': ''
    }];
    // call web service
    this.dalservice.Insert(dataTempTc, this.APIController, this.APIRouteForInsert)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            $('#MasterContractReload').click();
            $('#datatableTC').DataTable().ajax.reload();
            this.showNotification('bottom', 'right', 'success');
            this.showSpinner = false;
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
  //#endregion btnAdd()

  //#region button saveDescription
  saveDescription() {
    this.showSpinner = true;
    this.listtc = [];

    let i = 0;

    const getID = $('[name="p_id_tc"]')
      .map(function () { return $(this).val(); }).get();

    const getDescription = $('[name="p_description"]')
      .map(function () { return $(this).val(); }).get();

    while (i < getID.length) {

      while (i < getDescription.length) {

        if (getDescription[i] === '') {
          getDescription[i] = undefined;
        }
        this.listtc.push(this.JSToNumberFloats({
          p_id: getID[i],
          p_description: getDescription[i],
          p_main_contract_no: this.modelApplicationExtention.main_contract_no
        }));

        i++;
      }

      i++;
    }

    //#region web service
    this.dalservice.Update(this.listtc, this.APIController, this.APIRouteForUpdate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            $('#MasterContractReload').click();
            $('#datatableTC').DataTable().ajax.reload();
            this.showNotification('bottom', 'right', 'success');
            this.showSpinner = false;
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
  //#endregion button saveDescription

}
