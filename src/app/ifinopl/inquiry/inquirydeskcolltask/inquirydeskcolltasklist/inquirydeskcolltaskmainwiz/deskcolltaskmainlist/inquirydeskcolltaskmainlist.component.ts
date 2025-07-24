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
  templateUrl: './inquirydeskcolltaskmainlist.component.html'
})

export class InquiryDeskcolltaskmainlistComponent extends BaseComponent implements OnInit {
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
  private RoleAccessCode = 'R00024780000001A';

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
              'action': 'getResponse'
            })];
            this.route.navigate(['/inquiry/inquirydeskcolltaskdetailpast/', parsedataTaskMain.id], { skipLocationChange: true });       
          } else {
            this.route.navigate(['/inquiry/inquirydeskcolltaskdetailpast/', parsedataTaskMain.deskcoll_main_id], { skipLocationChange: true });
          }
          
          // if (parsedataTaskMain.deskcoll_main_id == null || parsedataTaskMain.deskcoll_main_id == '') {

          //   this.dataTamp = [this.JSToNumberFloats({
          //     'p_id_task_main': codeEdit,
          //     'action': 'getResponse'
          //   })];          
          //   // call web service
          //   this.dalservice.Insert(this.dataTamp, this.APIControllerDeskcollMain, this.APIRouteForInsert)
          //     .subscribe(
          //       resDeskCollMain => {
          //         const parseDeskCollMain = JSON.parse(resDeskCollMain);
          //         if (parseDeskCollMain.result === 1) {
          //           const deskcollId = parseDeskCollMain.id;
          //           this.route.navigate(['/inquiry/inquirydeskcolltaskdetailpast/', deskcollId], { skipLocationChange: true });
          //           // }
          //         } else {
          //           this.swalPopUpMsg(parseDeskCollMain.data);
          //         }
          //       },
          //       error => {
          //         const parseDeskCollMain = JSON.parse(error);
          //         this.swalPopUpMsg(parseDeskCollMain.data);
          //       });
          // } else {
          //   this.route.navigate(['/inquiry/inquirydeskcolltaskdetailpast/', parsedataTaskMain.deskcoll_main_id], { skipLocationChange: true });
          // }
        },
        error => {
          const parseTaskMain = JSON.parse(error);
          this.swalPopUpMsg(parseTaskMain.data);
        });
  }
  //#endregion button edit
}




