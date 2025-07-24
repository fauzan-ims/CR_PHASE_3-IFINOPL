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
  templateUrl: './deskcolltaskpastduelist.component.html'
})

export class DeskcolltasktpastduelistComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // checklist
  public selectedAll: any;
  private checkedList: any = [];

  // variable
  public listdeskcolltask: any = [];
  public deskcollData: any = [];
  private dataTamp: any = [];
  private dataTampCore: any = [];
  public tampStatus: String;

  private APIController: String = 'TaskMain';
  private APIControllerDeskcollMain: String = 'DeskcollMain';
  private APIControllerDeskcollCustomer: String = 'DeskcollCustomerInfo';
  private APIControllerAgreementInvoiceLedgerMain: String = 'AgreementInvoiceLedgerMain';
  private APIRouteForPasDueGetrows: String = 'GetRowsForPastDue';
  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForGetInvoiceOverdueDay: String = 'ExecSpGetInvoiceOverdueDay';


  private RoleAccessCode = 'R00020970002098A';

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

    // call web service 
    this.loadData();
  }

  //#region ddl master module
  PageStatus(event: any) {
    this.tampStatus = event.target.value;
    $('#datatableDeskCollTaskpastDue').DataTable().ajax.reload();
  }
  //#endregion ddl master module

  //#region listdeskcolltask load all data
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


        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForPasDueGetrows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listdeskcolltask = parse.data;



          if (parse.data != null) {
            this.listdeskcolltask.numberIndex = dtParameters.start;
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
      columnDefs: [{ orderable: false, width: '5%', targets: [1, 8] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion listdeskcolltask load all data

  //#region checkbox all table
  selectAllTable() {
    for (let i = 0; i < this.listdeskcolltask.length; i++) {
      this.listdeskcolltask[i].selected = this.selectedAll;
    }
  }

  checkIfAllTableSelected() {
    this.selectedAll = this.listdeskcolltask.every(function (item: any) {
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
                    //   this.dalservice.ExecSpCore(this.dataTamp, this.APIControllerAgreementInvoiceLedgerMain, this.APIRouteForGetInvoiceOverdueDay)
                    //     .subscribe(
                    //       resAgreementInvoiceLedgerMain => {
                    //         const parseAgreementInvoiceLedgerMain = JSON.parse(resAgreementInvoiceLedgerMain);
                    //         const parseCoreDataLength = parseAgreementInvoiceLedgerMain.data.length;
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




