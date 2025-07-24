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
  templateUrl: './assetlist.component.html'
})

export class AssetlistComponent extends BaseComponent implements OnInit {
  // get param from url

  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');
  type = this.getRouteparam.snapshot.paramMap.get('type');
  from = this.getRouteparam.snapshot.paramMap.get('from');
  page = this.getRouteparam.snapshot.paramMap.get('page');

  // variable
  public plafond_status: String;
  public listasset: any = [];
  private rolecode: any = [];
  private dataRoleTamp: any = [];
  private dataTampPush: any = [];
  private APIController: String = 'ClientAsset';
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForGetDelete: String = 'Delete';
  private APIRouteForGetRole: String = 'ExecSpForGetRole';
  private RoleAccessCode = 'R00022550000010A';

  // checklist
  public selectedAll: any;
  private checkedList: any = [];

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
    this.compoSide('', this._elementRef, this.route);
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.plafond_status = $('#plafondStatus').val();
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
          'p_client_code': this.param
        });

        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listasset = parse.data;

          if (parse.data != null) {
            this.listasset.numberIndex = dtParameters.start;
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
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 5] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
    }
  }
  //#endregion load all data

  //#region button add
  btnAdd() {
    this.route.navigate(['/client/subclientpersonallist/clientpersonaldetail/' + this.param + '/' + this.params + '/' + this.type + '/' + this.from + '/' + this.page + '/assetdetail', this.param, this.params, this.type, this.from, this.page], { skipLocationChange: true });
  }
  //#endregion button add

  //#region button edit
  btnEdit(codeEdit: string) {
    this.route.navigate(['/client/subclientpersonallist/clientpersonaldetail/' + this.param + '/' + this.params + '/' + this.type + '/' + this.from + '/' + this.page + '/assetdetail', this.param, this.params, this.type, this.from, this.page, codeEdit], { skipLocationChange: true });
  }
  //#endregion button edit

  //#region checkbox all table
  btnDeleteAll() {
    this.checkedList = [];
    for (let i = 0; i < this.listasset.length; i++) {
      if (this.listasset[i].selected) {
        this.checkedList.push(this.listasset[i].id);
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
    this.dataTampPush = [];
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
        for (let J = 0; J < this.checkedList.length; J++) {

          this.dataTampPush.push({
            'p_id': this.checkedList[J]
          });

          this.dalservice.Delete(this.dataTampPush, this.APIController, this.APIRouteForGetDelete)
            .subscribe(
              res => {
                if (this.checkedList.length == J + 1) {
                  $('#clientDetail').click();
                  this.showSpinner = false;
                  this.showNotification('bottom', 'right', 'success');
                  $('#datatableClientAsset').DataTable().ajax.reload();
                }
              },
              error => {
                const parse = JSON.parse(error);
                this.swalPopUpMsg(parse.data);
              });
        }
      } else {
        this.showSpinner = false;
      }
    });
  }

  selectAllTable() {
    for (let i = 0; i < this.listasset.length; i++) {
      this.listasset[i].selected = this.selectedAll;
    }
  }

  checkIfAllTableSelected() {
    this.selectedAll = this.listasset.every(function (item: any) {
      return item.selected === true;
    })
  }
  //#endregion checkbox all table

}
