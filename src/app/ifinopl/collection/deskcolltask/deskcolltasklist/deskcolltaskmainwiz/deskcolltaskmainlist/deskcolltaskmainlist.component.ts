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
  templateUrl: './deskcolltaskmainlist.component.html'
})

export class DeskcolltaskmainlistComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // checklist
  public selectedAll: any;
  private checkedList: any = [];

  // variable
  public listdeskcolltaskmain: any = [];
  public deskcollData: any = [];
  private rolecode: any = [];
  private dataRoleTamp: any = [];
  private dataTamp: any = [];
  private dataTampCore: any = [];
  public isBreak: Boolean = false;
  public tampStatus: String;
  private RoleAccessCode = 'R00020970002098A';

  private APIController: String = 'TaskMain';
  private APIControllerDeskcollMain: String = 'DeskcollMain';
  private APIControllerAgreementInvoiceLedgerMain: String = 'AgreementInvoiceLedgerMain';
  private APIControllerDeskcollCustomer: String = 'DeskcollCustomerInfo';
  private APIRouteForNotDueGetrows: String = 'GetRowsForNotDue';
  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForGetInvoiceOverdueDay: String = 'ExecSpGetInvoiceOverdueDay';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForGetDelete: String = 'Delete';

  // form 2 way binding
  model: any = {};

  // ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  // spinner
  showSpinner: Boolean = true;
  // end

  constructor(private dalservice: DALService,
    public route: Router,
    private _location: Location,
    public getRouteparam: ActivatedRoute,
    private _elementRef: ElementRef) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    // this.compoSide(this._location, this._elementRef, this.route);
    this.tampStatus = 'NEW';
    this.loadData();
  }

  //#region ddl master module
  PageStatus(event: any) {
    this.tampStatus = event.target.value;
    $('#datatableDeskCollTaskMainList').DataTable().ajax.reload();
  }
  //#endregion ddl master module

  //#region listdeskcolltaskmain load all data
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
          'p_collector_code': this.userId,
          'p_desk_status': this.tampStatus
        });


        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForNotDueGetrows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listdeskcolltaskmain = parse.data;
          if (parse.data != null) {
            this.listdeskcolltaskmain.numberIndex = dtParameters.start;
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
          this.showSpinner = false;
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [1, 9] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion listdeskcolltaskmain load all data

  //#region checkbox all table
  btnDeleteAll() {
    this.isBreak = false;
    this.checkedList = [];
    for (let i = 0; i < this.listdeskcolltaskmain.length; i++) {
      if (this.listdeskcolltaskmain[i].selected) {
        this.checkedList.push(this.listdeskcolltaskmain[i].id);
      }
    }

    // jika tidak di checklist
    if (this.checkedList.length === 0) {
      swal({
        title: 'No one selected',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-danger'
      }).catch(swal.noop)
      return
    }

    swal({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Yes, delete it',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        this.dataTamp = [];
        for (let J = 0; J < this.checkedList.length; J++) {
          const code = this.checkedList[J];

          this.dataTamp = [{
            'p_id': code
          }];

          this.dalservice.Delete(this.dataTamp, this.APIController, this.APIRouteForGetDelete)
            .subscribe(
              res => {
                const parse = JSON.parse(res);
                if (parse.result === 1) {
                  if (J + 1 === this.checkedList.length) {
                    this.showNotification('bottom', 'right', 'success');
                    $('#datatableDeskCollTaskMainList').DataTable().ajax.reload();
                  }
                } else {
                  this.isBreak = true;
                  $('#datatableDeskCollTaskMainList').DataTable().ajax.reload();
                  this.swalPopUpMsg(parse.data);
                }
              },
              error => {
                this.isBreak = true;
                const parse = JSON.parse(error);
                this.swalPopUpMsg(parse.data);
              });
          if (this.isBreak) {
            break;
          }
        }
      }
    });
  }

  selectAllTable() {
    for (let i = 0; i < this.listdeskcolltaskmain.length; i++) {
      this.listdeskcolltaskmain[i].selected = this.selectedAll;
    }
  }

  checkIfAllTableSelected() {
    this.selectedAll = this.listdeskcolltaskmain.every(function (item: any) {
      return item.selected === true;
    })
  }
  //#endregion checkbox all table

  //#region button edit
  btnEdit(codeEdit: string) {
    this.dataTamp = [{
      'p_id': codeEdit,
    }];

    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        resTaskMain => {
          const parseTaskMain = JSON.parse(resTaskMain);
          const parsedataTaskMain = parseTaskMain.data[0];

          if (parsedataTaskMain.deskcoll_main_id == null || parsedataTaskMain.deskcoll_main_id == '') {

            this.dataTamp = [this.JSToNumberFloats({
              'p_id_task_main': codeEdit,
              // 'p_agreement_no': agreementNo,
              // 'p_overdue_day': overdueDays,
              'action': 'getResponse'
            })];


            // call web service
            this.dalservice.Insert(this.dataTamp, this.APIControllerDeskcollMain, this.APIRouteForInsert)
              .subscribe(
                resDeskCollMain => {
                  const parseDeskCollMain = JSON.parse(resDeskCollMain);
                  if (parseDeskCollMain.result === 1) {
                    const deskcollId = parseDeskCollMain.id;
                    // if (isRecourse === '0') {
                    //   // call web service
                    //   console.log('masuk descoll main');

                    //   this.dalservice.ExecSpCore(this.dataTamp, this.APIControllerAgreementInvoiceLedgerMain, this.APIRouteForGetInvoiceOverdueDay)
                    //     .subscribe(
                    //       resAgreementInvoiceLedgerMain => {
                    //         const parseAgreementInvoiceLedgerMain = JSON.parse(resAgreementInvoiceLedgerMain);
                    //         const parseCoreDataLength = parseAgreementInvoiceLedgerMain.data.length;
                    //         console.log('masuk execspcore');
                    //         console.log(parseAgreementInvoiceLedgerMain);


                    //         if (parseAgreementInvoiceLedgerMain.result === 1 && parseCoreDataLength > 0) {
                    //           for (var i = 0; i < parseAgreementInvoiceLedgerMain.data.length; i++) {

                    //             this.dataTampCore = [this.JSToNumberFloats({
                    //               'p_deskcoll_id': deskcollId,
                    //               'p_customer_client_no': parseAgreementInvoiceLedgerMain.data[i].customer_client_no,
                    //               'p_invoice_no': parseAgreementInvoiceLedgerMain.data[i].invoice_no,
                    //               'p_transaction_amount': parseAgreementInvoiceLedgerMain.data[i].net_amount,
                    //               'p_os_invoice_amount': parseAgreementInvoiceLedgerMain.data[i].transaction_amount,
                    //               'p_invoice_due_date': parseAgreementInvoiceLedgerMain.data[i].invoice_due_date
                    //             })];
                    //             console.log('masuk ke dalam deskcoll');

                    //             this.dalservice.Insert(this.dataTampCore, this.APIControllerDeskcollCustomer, this.APIRouteForInsert)
                    //               .subscribe(
                    //                 resDeskcollCustomer => {
                    //                   const parseDeskcollCustomer = JSON.parse(resDeskcollCustomer);

                    //                   if (parseDeskcollCustomer.result === 1 && parseCoreDataLength == i) {
                    //                     this.route.navigate(['/collection/deskcolltaskdetailpast/', deskcollId, agreementNo], { skipLocationChange: true });
                    //                     this.showNotification('bottom', 'right', 'success');
                    //                   } else {
                    //                     this.swalPopUpMsg(parseDeskcollCustomer.data);
                    //                   }
                    //                 },
                    //                 error => {
                    //                   const parseDeskcollCustomer = JSON.parse(error);
                    //                   this.swalPopUpMsg(parseDeskcollCustomer.data);
                    //                 });
                    //           }

                    //         } else {
                    //           this.swalPopUpMsg(parseAgreementInvoiceLedgerMain.data);
                    //         }
                    //       },
                    //       error => {
                    //         const parseAgreementInvoiceLedgerMain = JSON.parse(error);
                    //         this.swalPopUpMsg(parseAgreementInvoiceLedgerMain.data);
                    //       });
                    // } else {
                    this.route.navigate(['/collection/deskcolltaskdetailpast/', deskcollId], { skipLocationChange: true });
                    // }
                  } else {
                    this.swalPopUpMsg(parseDeskCollMain.data);
                  }
                },
                error => {
                  const parseDeskCollMain = JSON.parse(error);
                  this.swalPopUpMsg(parseDeskCollMain.data);
                });
          } else {
            this.route.navigate(['/collection/deskcolltaskdetailpast/', parsedataTaskMain.deskcoll_main_id], { skipLocationChange: true });
          }
        },
        error => {
          const parseTaskMain = JSON.parse(error);
          this.swalPopUpMsg(parseTaskMain.data);
        });
  }
  //#endregion button edit
}




