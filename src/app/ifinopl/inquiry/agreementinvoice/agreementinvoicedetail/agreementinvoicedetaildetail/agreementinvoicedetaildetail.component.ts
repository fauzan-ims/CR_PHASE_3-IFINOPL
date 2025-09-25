import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../base.component';
import { DALService } from '../../../../../../DALservice.service';

@Component({
  selector: 'app-agreementinvoicedetaildetail',
  templateUrl: './agreementinvoicedetaildetail.component.html'
})
export class AgreementinvoicedetaildetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');
  // type = this.getRouteparam.snapshot.paramMap.get('type');
  // from = this.getRouteparam.snapshot.paramMap.get('from');

  // variable
  public agreementData: any = [];
  public listinvoicedetail: any = [];
  public isReadOnly: Boolean = false;
  private dataTamp: any = [];
  public setStyle: any = [];
  private APIController: String = 'InvoiceDetail';
  private APIRouteForGetRow: String = 'GETROW';
  private RoleAccessCode = 'R00020570000010A';

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
    public getRouteparam: ActivatedRoute,
    public route: Router,
    private _elementRef: ElementRef,
    private parserFormatter: NgbDateParserFormatter
  ) { super(); }

  ngOnInit() {
    // this.callGetRole('');
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    if (this.param != null) {
      this.isReadOnly = true;
      this.callGetrow();
      // call web service
    }

  }

  //#region getStyles
  getStyles(isTrue: Boolean) {

    if (isTrue) {
      this.setStyle = {
        'pointer-events': 'none',
      }
    } else {
      this.setStyle = {
        'pointer-events': 'auto',
      }
    }

    return this.setStyle;
  }
  //#endregion

  //#region getrow data
  callGetrow() {
    
    this.dataTamp = [{
      'p_id': this.params
    }]
    

    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
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
  //#region button back
  btnBack() {
    this.route.navigate(['/inquiry/subagreementinvoicelist/agreementinvoicedetail', this.param]);
    $('#datatableInvoiceDetail').DataTable().ajax.reload();
  }
  //#endregion button back
}
