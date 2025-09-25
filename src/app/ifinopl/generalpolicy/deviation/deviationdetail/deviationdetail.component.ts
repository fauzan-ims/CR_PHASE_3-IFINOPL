import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';


@Component({
  selector: 'app-deviationdetail',
  templateUrl: './deviationdetail.component.html'
})
export class DeviationdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public NumberOnlyPattern = this._numberonlyformat;
  public deviationData: any = [];
  public isReadOnly: Boolean = false;
  public lookupfacility: any = [];
  public lookupDeviationPosition: any = [];
  public dataTamp: any = [];

  private APIController: String = 'MasterDeviation';
  private APIControllerSysPosition: String = 'SysPosition';
  private APIControllerFacility: String = 'MasterFacility';

  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForLookup: String = 'GetRowsForLookup';

  private RoleAccessCode = 'R00016820000000A'; // role access 

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = true;
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
    if (this.param !== null) {
      this.isReadOnly = true;

      // call web service
      this.callGetrow();
    } else {
      this.model.is_manual = true;
      this.model.type = 'APPLICATION';
      this.showSpinner = false;
    }
  }

  //#region Facility Lookup
  btnLookupFacility() {
    $('#datatableLookupFacility').DataTable().clear().destroy();
    $('#datatableLookupFacility').DataTable({
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
          'default': ''
        });
        
        this.dalservice.Getrows(dtParameters, this.APIControllerFacility, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupfacility = parse.data;
          if (parse.data != null) {
            this.lookupfacility.numberIndex = dtParameters.start;
          }
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

  btnSelectRowFacility(code: String, description: String) {
    this.model.facility_code = code;
    this.model.facility_desc = description;
    $('#lookupModalFacility').modal('hide');
  }
  //#endregion Facility lookup

  //#region DeviationPosition
  btnLookupDeviationPosition() {
    $('#datatableLookupDeviationPosition').DataTable().clear().destroy();
    $('#datatableLookupDeviationPosition').DataTable({
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
          'default': ''
        });
        
        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysPosition, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupDeviationPosition = parse.data;
          if (parse.data != null) {
            this.lookupDeviationPosition.numberIndex = dtParameters.start;
          }
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          })
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

  btnSelectRowDeviationPosition(code: String, description: String) {
    this.model.position_code = code;
    this.model.position_name = description;
    $('#lookupModalDeviationPosition').modal('hide');
  }
  //#endregion Currency

  //#region getrow data
  callGetrow() {
    
    this.dataTamp = [{
      'p_code': this.param
    }];
    
    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];
          // checkbox is_manual
          if (parsedata.is_manual === '1') {
            parsedata.is_manual = true;
          } else {
            parsedata.is_manual = false;
          }
          // end checkbox is_manual

          // checkbox is active
          if (parsedata.is_active === '1') {
            parsedata.is_active = true;
          } else {
            parsedata.is_active = false;
          }
          // end checkbox is active

          // checkbox is_fn_override
          if (parsedata.is_fn_override === '1') {
            parsedata.is_fn_override = true;
          } else {
            parsedata.is_fn_override = false;
          }
          // end checkbox is_fn_override
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

  //#region isManual
  isManual(event) {
    this.model.is_manual = event.target.checked;
  }
  //#endregion isManual

  //#region fnOverride
  fnOverride(event) {
    this.model.is_fn_override = event.target.checked;
  }
  //#endregion fnOverride

  //#region  form submit
  onFormSubmit(deviationForm: NgForm, isValid: boolean) {
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

    this.deviationData = deviationForm;
    if (this.deviationData.p_is_manual == null) {
      this.deviationData.p_is_manual = false;
    }
    if (this.deviationData.p_is_active == null) {
      this.deviationData.p_is_active = false;
    }
    if (this.deviationData.p_is_fn_override == null) {
      this.deviationData.p_is_fn_override = false;
    }
    const usersJson: any[] = Array.of(this.deviationData);
    if (this.param != null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showSpinner = false;
              this.callGetrow();
              this.showNotification('bottom', 'right', 'success');
            } else {
              this.showSpinner = false;
              this.swalPopUpMsg(parse.data)
            }
          },
          error => {
            this.showSpinner = false;
            const parse = JSON.parse(error);
            this.swalPopUpMsg(parse.data)
          });
    } else {
      // call web service
      this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showSpinner = false;
              this.showNotification('bottom', 'right', 'success');
              this.route.navigate(['/generalpolicy/subdeviationlist/deviationdetail', parse.code]);
            } else {
              this.showSpinner = false;
              this.swalPopUpMsg(parse.data)
            }
          },
          error => {
            this.showSpinner = false;
            const parse = JSON.parse(error);
            this.swalPopUpMsg(parse.data)
          });
    }
  }
  //#endregion form submit

  //#region button back
  btnBack() {
    this.route.navigate(['/generalpolicy/subdeviationlist']);
    $('#datatableDeviationList').DataTable().ajax.reload();
  }
  //#endregion button back
}
