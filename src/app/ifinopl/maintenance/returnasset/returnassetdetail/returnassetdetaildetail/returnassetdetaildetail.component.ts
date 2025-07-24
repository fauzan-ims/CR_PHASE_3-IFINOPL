import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../base.component';
import swal from 'sweetalert2';
import { DALService } from '../../../../../../DALservice.service';
import { NgForm } from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './returnassetdetaildetail.component.html'
})

export class ReturnassetdetaildetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public returnassetdetaildetailData: any = [];
  public setStyle: any = [];
  private dataTamp: any = [];

  private APIController: String = 'AgreementAsset';

  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForUpdate: String = 'Update';

  private RoleAccessCode = 'R00020680000000A'; // role access 

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = false;
  // end 

  // datatable
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  constructor(private dalservice: DALService,
    public getRouteparam: ActivatedRoute,
    public route: Router,
    private _elementRef: ElementRef
  ) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.Delimiter(this._elementRef);
    // call web service
    this.callGetrow();
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
      'p_asset_no': this.params
    }];
    
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
          this.showSpinner = false;
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
        });
  }
  //#endregion getrow data 

  //#region button back
  btnBack() {
    this.route.navigate(['/maintenance/subreturnassetlist/returnassetdetail', this.param]);
    $('#datatableAgreementAssetList').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region  form submit
  onFormSubmit(returnassetdetaildetailForm: NgForm, isValid: boolean) {
    // validation form submit
    if (!isValid) {
      swal({
        allowOutsideClick: false,
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

    this.returnassetdetaildetailData = this.JSToNumberFloats(returnassetdetaildetailForm);
    const usersJson: any[] = Array.of(this.returnassetdetaildetailData);
    // call web service
    this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          if (parse.result === 1) {
            this.callGetrow();
            this.showNotification('bottom', 'right', 'success');
            this.showSpinner = false;
          } else {
            this.swalPopUpMsg(parse.data);
            this.showSpinner = false;
          }
        },
        error => {
          const parse = JSON.parse(error);
          this.swalPopUpMsg(parse.data);
          this.showSpinner = false;
        });
  }
  //#endregion form submit 

  btnPost(code: any) {

  }
}