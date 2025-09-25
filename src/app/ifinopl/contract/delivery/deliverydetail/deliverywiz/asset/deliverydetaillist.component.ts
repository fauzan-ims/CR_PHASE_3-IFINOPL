import { OnInit, ViewChild, Component, ElementRef, SecurityContext } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import { DALService } from '../../../../../../../DALservice.service';
import swal from 'sweetalert2';
// import * as CryptoJS from "crypto-js";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './deliverydetaillist.component.html'
})

export class DeliverydetaillistComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public listapplicationasset: any = [];
  private dataTamp: any = [];

  private APIControllerRealizationDetail: String = 'RealizationDetail';


  private APIRouteForDelete: String = 'Delete';
  private APIRouteForGetRows: String = 'GetRows';

  private RoleAccessCode = 'R00020670000000A'; // role access 

  // form 2 way binding
  model: any = {};

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
    public route: Router,
    public getRouteparam: ActivatedRoute,
    private _elementRef: ElementRef,
    private domSanitizer: DomSanitizer) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.compoSide('', this._elementRef, this.route);
    this.loadData();
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
          'p_realization_code': this.param
        })

        this.dalservice.Getrows(dtParameters, this.APIControllerRealizationDetail, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp)
          this.listapplicationasset = parse.data;
          if (parse.data != null) {
            this.listapplicationasset.numberIndex = dtParameters.start;
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
  //#endregion load all data

  //#region btnDeleteAll
  btnDeleteAll() {
    this.checkedList = [];
    for (let i = 0; i < this.listapplicationasset.length; i++) {
      if (this.listapplicationasset[i].selected) {
        this.checkedList.push(this.listapplicationasset[i].id);
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
        let th = this;
        var i = 0;
        (function loopDeliveryRequestProceed() {
          if (i < th.checkedList.length) {
            th.dataTamp = [{
              'p_id': th.checkedList[i],
              'p_application_no': th.param
            }];
            th.dalservice.Delete(th.dataTamp, th.APIControllerRealizationDetail, th.APIRouteForDelete)
              .subscribe(
                resDelete => {
                  const parseDelete = JSON.parse(resDelete);
                  if (parseDelete.result === 1) {
                    if (th.checkedList.length == i + 1) {
                      th.showSpinner = false;
                      $('#applicationDetail').click();
                      th.showNotification('bottom', 'right', 'success');
                      $('#datatableApplicationAsset').DataTable().ajax.reload();
                    } else {
                      i++;
                      loopDeliveryRequestProceed();
                    }
                  } else {
                    th.showSpinner = false;
                    th.swalPopUpMsg(parseDelete.data);
                    $('#datatableApplicationAsset').DataTable().ajax.reload();
                  }
                },
                errorDelete => {
                  th.showSpinner = false;
                  const parseDelete = JSON.parse(errorDelete);
                  th.swalPopUpMsg(parseDelete.data);
                  $('#datatableApplicationAsset').DataTable().ajax.reload();
                });
          }
        })();
      } else {
        this.showSpinner = false;
      }
    });
  }
  //#endregion btn btnDeleteAll 

  //#region btn selectAllTable, checkIfAllTableSelected
  selectAllTable() {
    for (let i = 0; i < this.listapplicationasset.length; i++) {
      this.listapplicationasset[i].selected = this.selectedAll;
    }
  }

  checkIfAllTableSelected() {
    this.selectedAll = this.listapplicationasset.every(function (item: any) {
      return item.selected === true;
    })
  }
  //#endregion selectAllTable, checkIfAllTableSelected

  //#region button edit
  btnEdit(codeEdit: String) {
    this.route.navigate(['/contract/subdeliverylist/deliverydetail/' + this.param + '/deliveryassetdetail', this.param, codeEdit]);
  }
  //#endregion button edit
}