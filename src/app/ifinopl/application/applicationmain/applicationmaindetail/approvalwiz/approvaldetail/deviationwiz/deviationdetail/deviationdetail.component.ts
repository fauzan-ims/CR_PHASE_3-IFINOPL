import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../../../base.component';
import { DALService } from '../../../../../../../../../DALservice.service';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './deviationdetail.component.html'
})

export class DeviationdetailComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  params = this.getRouteparam.snapshot.paramMap.get('id2');
  pageType = this.getRouteparam.snapshot.paramMap.get('page');

  // variable
  public deviationdetailData: any = [];
  public isReadOnly: Boolean = false;
  public lookupdeviation: any = [];
  private dataTamp: any = [];

  private APIController: String = 'ApplicationDeviation';
  private APIControllerMasterDeviation: String = 'MasterDeviation';
  private APIControllerApplicationMain: String = 'ApplicationMain';

  private APIRouteForGetRow: String = 'GETROW';
  private APIRouteForInsert: String = 'INSERT';
  private APIRouteForUpdate: String = 'UPDATE';
  private APIRouteForLookup: String = 'GetRowsForLookup';

  private RoleAccessCode = 'R00019900000000A'; // role access 

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
    this.callGetrowApplicationMain();
    if (this.params != null) {
      // call web service
      this.callGetrow();
    } else {
      this.model.is_manual = true;
      this.showSpinner = false;
    }
  }

  //#region getrow data
  callGetrowApplicationMain() {
     
    this.dataTamp = [{
      'p_application_no': this.param
    }];
    
    this.dalservice.Getrow(this.dataTamp, this.APIControllerApplicationMain, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];

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

  //#region getrow data
  callGetrow() {
     
    this.dataTamp = [{
      'p_id': this.params
    }];
    
    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];

          if (parsedata.is_manual === '1') {
            parsedata.is_manual = true;
            this.isReadOnly = false;
          } else {
            parsedata.is_manual = false;
            this.isReadOnly = true;
          }

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

  //#region  form submit
  onFormSubmit(deviationdetailForm: NgForm, isValid: boolean) {
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

    this.deviationdetailData = deviationdetailForm;
    const usersJson: any[] = Array.of(this.deviationdetailData);
    if (this.params != null) {
      // call web service
      this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showSpinner = false;
              $('#applicationDetail').click();
              this.callGetrow();
              this.showNotification('bottom', 'right', 'success');
            } else {
              this.showSpinner = false;
              this.swalPopUpMsg(parse.data);
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
              $('#applicationDetail').click();
              this.showNotification('bottom', 'right', 'success');
              this.route.navigate(['/application/subapplicationmainlist/applicationmaindetail/' + this.param + '/approvaldetail/' + this.param + '/' + 'this.levelStatus' + '/deviationdetail/', this.param, parse.id, 'banberjalan'], { skipLocationChange: true });
            } else {
              this.showSpinner = false;
              this.swalPopUpMsg(parse.data);
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
    if (this.pageType != null) {
      this.route.navigate(['/application/banberjalanapplicationmain/applicationmaindetail/' + this.param + '/' + this.pageType + '/approvaldetail/' + this.param + '/' + 'this.levelStatus' + '/' + 'banberjalan' + '/deviationlist/', this.param, 'banberjalan'], { skipLocationChange: true });
    } else {
      this.route.navigate(['/application/subapplicationmainlist/applicationmaindetail/' + this.param + '/approvaldetail/' + this.param + '/' + 'this.levelStatus' + '/deviationlist/', this.param], { skipLocationChange: true });
    }
  }
  //#endregion button back

  //#region Deviation Lookup
  btnLookupDeviation() {
    $('#datatableLookupDeviation').DataTable().clear().destroy();
    $('#datatableLookupDeviation').DataTable({
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
          'p_facility_code': this.model.facility_code,
          'p_type': 'APPLICATION'
        });
        
        this.dalservice.Getrows(dtParameters, this.APIControllerMasterDeviation, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupdeviation = parse.data;
          callback({
            draw: parse.draw,
            recordsTotal: parse.recordsTotal,
            recordsFiltered: parse.recordsFiltered,
            data: []
          });
        }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [3] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    });
  }

  btnSelectRowDeviation(code: String, description: String, position_code: String, position_name: String) {
    this.model.deviation_code = code;
    this.model.deviation_desc = description;
    this.model.position_code = position_code;
    this.model.position_name = position_name;
    $('#lookupModalDeviation').modal('hide');
  }
  //#endregion Deviation lookup
}
