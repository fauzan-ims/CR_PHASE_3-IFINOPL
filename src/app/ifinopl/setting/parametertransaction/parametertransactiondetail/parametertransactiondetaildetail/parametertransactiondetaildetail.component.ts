import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { BaseComponent } from '../../../../../../base.component';
import { DataTableDirective } from 'angular-datatables';
import { DALService } from '../../../../../../DALservice.service';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './parametertransactiondetaildetail.component.html'
})

export class ParametertransactiondetaildetailComponent extends BaseComponent implements OnInit {
  // get param from url
  parametertransactioncode = this.getRouteparam.snapshot.paramMap.get('parametertransactioncode');
  parametertransactionid = this.getRouteparam.snapshot.paramMap.get('parametertransactionid');

  // variable
  public NumberOnlyPattern: string = this._numberonlyformat;
  public isReadOnly: Boolean = false;
  public lookupTransaction: any = [];
  public bysystem: any = [];
  public lookupGlLink: any = [];
  public lookupDiscountGlLink: any = [];
  public lookupPsakGlLink: any = [];
  public parametertransactiondetailData: any = [];
  private dataTamp: any = [];

  private APIController: String = 'MasterTransactionParameter';
  private APIControllerJournalGlLink: String = 'JournalGlLink';

  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForInsert: String = 'Insert';
  private APIRouteForUpdate: String = 'Update';
  private APIRouteForLookupMasterTransaction: String = 'GetRowsLookupForTransactionParameter';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private RoleAccessCode = 'R00020860000000A'; // role access 

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = true;
  // end

  //ini buat datatables
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  constructor(private dalservice: DALService,
    public getRouteparam: ActivatedRoute,
    public route: Router,
    private _elementRef: ElementRef
  ) { super(); }

  ngOnInit() {
    this.Delimiter(this._elementRef);
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);

    if (this.parametertransactionid !== null) {
      this.isReadOnly = true;

      // call web service
      this.callGetrow();
    } else {
      this.model.is_calculate_by_system = true;
      this.showSpinner = false;
    }
  }

  //#region getrow data
  callGetrow() {
    
    this.dataTamp = [{
      'p_id': this.parametertransactionid
    }];
    

    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parametertransactiondetailparse = JSON.parse(res);
          const parametertransactiondetailparsedata = this.getrowNgb(parametertransactiondetailparse.data[0]);

          // checkbox
          if (parametertransactiondetailparsedata.is_calculate_by_system === '1') {
            parametertransactiondetailparsedata.is_calculate_by_system = true;
          } else {
            parametertransactiondetailparsedata.is_calculate_by_system = false;
          }

          if (parametertransactiondetailparsedata.is_transaction === '1') {
            parametertransactiondetailparsedata.is_transaction = true;
          } else {
            parametertransactiondetailparsedata.is_transaction = false;
          }

          if (parametertransactiondetailparsedata.is_amount_editable === '1') {
            parametertransactiondetailparsedata.is_amount_editable = true;
          } else {
            parametertransactiondetailparsedata.is_amount_editable = false;
          }

          if (parametertransactiondetailparsedata.is_discount_editable === '1') {
            parametertransactiondetailparsedata.is_discount_editable = true;
          } else {
            parametertransactiondetailparsedata.is_discount_editable = false;
          }

          if (parametertransactiondetailparsedata.is_journal === '1') {
            parametertransactiondetailparsedata.is_journal = true;
          } else {
            parametertransactiondetailparsedata.is_journal = false;
          }

          if (parametertransactiondetailparsedata.is_discount_jurnal === '1') {
            parametertransactiondetailparsedata.is_discount_jurnal = true;
          } else {
            parametertransactiondetailparsedata.is_discount_jurnal = false;
          }

          if (parametertransactiondetailparsedata.is_reduce_transaction === '1') {
            parametertransactiondetailparsedata.is_reduce_transaction = true;
          } else {
            parametertransactiondetailparsedata.is_reduce_transaction = false;
          }

          if (parametertransactiondetailparsedata.is_fee_refinancing === '1') {
            parametertransactiondetailparsedata.is_fee_refinancing = true;
          } else {
            parametertransactiondetailparsedata.is_fee_refinancing = false;
          }

          if (parametertransactiondetailparsedata.is_psak === '1') {
            parametertransactiondetailparsedata.is_psak = true;
          } else {
            parametertransactiondetailparsedata.is_psak = false;
          }
          // end checkbox

          // mapper dbtoui
          Object.assign(this.model, parametertransactiondetailparsedata);
          // end mapper dbtoui

          this.showSpinner = false;
        },
        error => {
          console.log('There was an error while Retrieving Data(API) !!!' + error);
        });
  }
  //#endregion getrow data

  //#region ddl master module
  BySystem(event) {
    this.model.is_calculate_by_system = event.target.checked;

    if (this.model.is_calculate_by_system === true) {
      this.model.parameter_amount = 0;
    } else {
      $('#isAmountEditable').prop('checked', true);
    }
  }
  //#endregion ddl master module

  //#region  form submit
  onFormSubmit(parametertransactionForm: NgForm, isValid: boolean) {
    // validation form submit
    if (!isValid) {
      swal({
        title: 'Warning',
        text: 'Please Fill a Mandatory Field OR Format Is Invalid',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-warning',
        type: 'warning'
      }).catch(swal.noop)
      return;
    } else {
      this.showSpinner = true;
    }

    this.parametertransactiondetailData = parametertransactionForm;

    if (this.parametertransactiondetailData.p_is_calculate_by_system == null) {
      this.parametertransactiondetailData.p_is_calculate_by_system = false
    }

    if (this.parametertransactiondetailData.p_is_transaction == null) {
      this.parametertransactiondetailData.p_is_transaction = false
    }

    if (this.parametertransactiondetailData.p_is_discount_editable == null) {
      this.parametertransactiondetailData.p_is_discount_editable = false
    }

    if (this.parametertransactiondetailData.p_is_journal == null) {
      this.parametertransactiondetailData.p_is_journal = false
    }

    if (this.parametertransactiondetailData.p_is_discount_jurnal == null) {
      this.parametertransactiondetailData.p_is_discount_jurnal = false
    }

    if (this.parametertransactiondetailData.p_is_reduce_transaction == null) {
      this.parametertransactiondetailData.p_is_reduce_transaction = false
    }

    if (this.parametertransactiondetailData.p_is_fee_refinancing == null) {
      this.parametertransactiondetailData.p_is_fee_refinancing = false
    }

    if (this.parametertransactiondetailData.p_is_psak == null) {
      this.parametertransactiondetailData.p_is_psak = false
    }

    this.parametertransactiondetailData = this.JSToNumberFloats(parametertransactionForm);
    const usersJson: any[] = Array.of(this.parametertransactiondetailData);

    if (this.parametertransactioncode != null && this.parametertransactionid != null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
        .subscribe(
          res => { 
            const parametertransactiondetailparse = JSON.parse(res);
            if (parametertransactiondetailparse.result === 1) {
              this.showSpinner = false;
              this.showNotification('bottom', 'right', 'success')
              this.callGetrow();
            } else {
              this.showSpinner = false;
              this.swalPopUpMsg(parametertransactiondetailparse.data);
            }
          },
          error => {
            this.showSpinner = false;
            const parametertransactiondetailparse = JSON.parse(error);
            this.swalPopUpMsg(parametertransactiondetailparse.data);
          });
    } else {
      // call web service
      this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
        .subscribe(
          res => { 
            const parametertransactiondetailparse = JSON.parse(res);
            if (parametertransactiondetailparse.result === 1) {
              this.showSpinner = false;
              this.showNotification('bottom', 'right', 'success');
              this.route.navigate(['/setting/submastertransactionparameterlist/parametertransactiondetaildetail', this.parametertransactioncode, parametertransactiondetailparse.id]);
            } else {
              this.showSpinner = false;
              this.swalPopUpMsg(parametertransactiondetailparse.data);
            }
          },
          error => {
            this.showSpinner = false;
            const parse = JSON.parse(error);
            this.swalPopUpMsg(parse.data);
          });
    }
  }
  //#endregion form submit

  //#region button back
  btnBack() {
    $('#datatableParameterTransactionDetail').DataTable().ajax.reload();
    this.route.navigate(['/setting/submastertransactionparameterlist/parametertransactiondetail', this.parametertransactioncode]);
  }
  //#endregion button back

   //#region btnLookupTransaction
   btnLookupTransaction() {
    $('#datatableLookupTransaction').DataTable().clear().destroy();
    $('#datatableLookupTransaction').DataTable({
      'pagingType': 'first_last_numbers',
      'pageLength': 5,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false

      ajax: (dtParameters: any, callback) => {
        
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_process_code': this.parametertransactioncode
        });
        
        this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForLookupMasterTransaction).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupTransaction = parse.data;
          if (parse.data != null) {
            this.lookupTransaction.numberIndex = dtParameters.start;
          }
          console.log(parse);
          
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 4] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '

      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowTransaction(code: String, transaction_name: string) {
    this.model.transaction_code = code;
    this.model.transaction_name = transaction_name;
    $('#lookupModalTransaction').modal('hide');
  }
  //#endregion process name lookup

  //#region gl link lookup
  btnLookupGlLink() {
    $('#datatableLookupGlLink').DataTable().clear().destroy();
    $('#datatableLookupGlLink').DataTable({
      'pagingType': 'first_last_numbers',
      'pageLength': 5,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false

      ajax: (dtParameters: any, callback) => {
        
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          //'p_general_code': 'LMPRO'
        });
        
        this.dalservice.Getrows(dtParameters, this.APIControllerJournalGlLink, this.APIRouteForLookup).subscribe(resp => {
          const glinkparse = JSON.parse(resp);
          this.lookupGlLink = glinkparse.data;
          if (glinkparse.data != null) {
            this.lookupGlLink.numberIndex = dtParameters.start;
          }
          callback({
            draw: glinkparse.draw,
            recordsTotal: glinkparse.recordsTotal,
            recordsFiltered: glinkparse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 4] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '

      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowGlLink(code: String, description: string) {
    this.model.gl_link_code = code;
    this.model.gl_link_name = description;
    $('#lookupModalGlLink').modal('hide');
  }
  //#endregion gl link lookup

  //#region btnLookupDiscountGlLink
  btnLookupDiscountGlLink() {
    $('#datatableLookupDiscountGlLink').DataTable().clear().destroy();
    $('#datatableLookupDiscountGlLink').DataTable({
      'pagingType': 'first_last_numbers',
      'pageLength': 5,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false

      ajax: (dtParameters: any, callback) => {
        
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          //'p_general_code': 'LMPRO'
        });
        
        this.dalservice.Getrows(dtParameters, this.APIControllerJournalGlLink, this.APIRouteForLookup).subscribe(resp => {
          const DiscountGlLinkparse = JSON.parse(resp);
          this.lookupDiscountGlLink = DiscountGlLinkparse.data;
          if (DiscountGlLinkparse.data != null) {
            this.lookupDiscountGlLink.numberIndex = dtParameters.start;
          }
          callback({
            draw: DiscountGlLinkparse.draw,
            recordsTotal: DiscountGlLinkparse.recordsTotal,
            recordsFiltered: DiscountGlLinkparse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 4] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '

      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowDiscountGlLink(code: String, description: string) {
    this.model.discount_gl_link_code = code;
    this.model.discount_gl_link_name = description;
    $('#lookupModalDiscountGlLink').modal('hide');
  }
  //#endregion discount gl link lookup

  //#region btnLookupPsakGlLink
  btnLookupPsakGlLink() {
    $('#datatableLookupPsakGlLink').DataTable().clear().destroy();
    $('#datatableLookupPsakGlLink').DataTable({
      'pagingType': 'first_last_numbers',
      'pageLength': 5,
      'processing': true,
      'serverSide': true,
      responsive: true,
      lengthChange: false, // hide lengthmenu
      searching: true, // jika ingin hilangin search box nya maka false

      ajax: (dtParameters: any, callback) => {
        
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          //'p_general_code': 'LMPRO'
        });
        
        this.dalservice.Getrows(dtParameters, this.APIControllerJournalGlLink, this.APIRouteForLookup).subscribe(resp => {
          const PsakGlLinkparse = JSON.parse(resp);
          this.lookupPsakGlLink = PsakGlLinkparse.data;
          if (PsakGlLinkparse.data != null) {
            this.lookupPsakGlLink.numberIndex = dtParameters.start;
          }
          callback({
            draw: PsakGlLinkparse.draw,
            recordsTotal: PsakGlLinkparse.recordsTotal,
            recordsFiltered: PsakGlLinkparse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 4] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '

      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowPsakGlLink(code: String, description: string) {
    this.model.psak_gl_link_code = code;
    this.model.psak_gl_link_name = description;
    $('#lookupModalPsakGlLink').modal('hide');
  }
  //#endregion psak gl link lookup
}
