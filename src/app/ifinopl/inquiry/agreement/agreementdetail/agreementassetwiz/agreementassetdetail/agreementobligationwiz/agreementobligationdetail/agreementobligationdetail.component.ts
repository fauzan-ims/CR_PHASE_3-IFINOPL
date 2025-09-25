import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../../../base.component';
import { DALService } from '../../../../../../../../../DALservice.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-agreementobligationdetail',
  templateUrl: './agreementobligationdetail.component.html'
})
export class AgreementobligationdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  installment_no = this.getRouteparam.snapshot.paramMap.get('id2');
  params = this.getRouteparam.snapshot.paramMap.get('id3');



  // variable
  public listagreementdetail: any = [];
  public lookupGeneral: any = [];
  private APIController: String = 'AgreementObligationPayment';
  private APIControllerObligation: String = 'AgreementObligation';
  private APIRouteLookup: String = 'GetRowsForLookup';
  private APIRouteForGetRows: String = 'GetRows';
  private RoleAccessCode = 'R00020560000000A'; // role access 

  // ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  // spinner
  showSpinner: Boolean = true;
  // end

  // form 2 way binding
  model: any = {};

  constructor(private dalservice: DALService,
    public getRouteparam: ActivatedRoute,
    public route: Router,
    private _elementRef: ElementRef) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
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
        // param tambahan untuk getrows dynamic
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_agreement_no': this.param,
          'p_installment_no': this.installment_no,
          'p_asset_no' : this.params // (+) Ari 2023-10-10 ket : add asset
        });
        
        // end param tambahan untuk getrows dynamic
        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.listagreementdetail = parse.data;

          if (parse.data != null) {
            this.listagreementdetail.numberIndex = dtParameters.start;
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
        infoEmpty: '<p style="color:red;">No Data Available !</p>'
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion load all data

  //#region button back
  btnBack() {
    this.route.navigate(['/inquiry/subagreementlist/agreementdetail/' + this.param + '/agreementassetlist/' + this.param + '/agreementassetdetail/' + this.param + '/' + this.params + '/agreementobligationlistwiz/', this.param, this.params], { skipLocationChange: true });
  }
  //#endregion button back

}
