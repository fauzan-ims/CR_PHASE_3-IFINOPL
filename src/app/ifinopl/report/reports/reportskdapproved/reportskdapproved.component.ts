import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';

@Component({
  selector: 'app-reportskdapproved',
  templateUrl: './reportskdapproved.component.html'
})
export class ReportskdapprovedComponent extends BaseComponent implements OnInit {
  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');
  pageType = this.getRouteparam.snapshot.paramMap.get('page');

  // variable
  public reportData: any = [];
  public lookupsysbranch: any = [];
  public lookupmarketing: any = [];
  public dataTamp: any = [];
  
  private APIController: String = 'SysReport';
  private APIRouteForGetRow: String = 'GETROW';
  private APIControllerSysBranch: String = 'SysBranch';
  private APIRouteForLookup: String = 'GetRowsForLookup';
  private APIControllerMarketing: String = 'MasterMarketing';
  private RoleAccessCode = 'R00003500000000A';

  // report
  private APIControllerReport: String = 'Report';
  private APIRouteForDownload: String = 'getReport';

  // form 2 way binding
  model: any = {};

  // spinner
  showSpinner: Boolean = true;
  // end

  // datatable
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  // showNotification: any;

  constructor(private dalservice: DALService,
    public getRouteparam: ActivatedRoute,
    public route: Router,
    private _elementRef: ElementRef
  ) { super(); }

  ngOnInit() {
    // this.callGetRole(this.userId);
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
    this.model.from_date = new Date();
    this.model.to_date = new Date();
    // this.callGetRole(this.userId);
    this.model.from_date.setMonth(this.model.from_date.getMonth() - 1);
    this.model.print_option = 'Excel';
    // call web service
    this.callGetrow();
  }

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

  //#region onFormSubmit
  onFormSubmit(rptForm: NgForm, isValid: boolean, print_option: any) {
    if (!isValid) {
      swal({
        allowOutsideClick: false,
        title: 'Warning!',
        text: 'Please Fill a Mandatory Field OR Format Is Invalid!!',
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-danger',
        type: 'warning'
      }).catch(swal.noop)
      return;
    } else {
      this.showSpinner = true;
    }

    var is_condition = '';

    if (print_option === 'ExcelRecord'){
        is_condition = '0';
    }
    else if (print_option === 'Excel'){
        is_condition = '1';
    }
    else{
        is_condition = '1';
    }

    this.reportData = this.JSToNumberFloats(rptForm);
    this.reportData.p_user_id = this.userId;

    this.reportData.p_report_name = this.model.name;
    this.reportData.p_is_condition = is_condition;

    const dataParam = {
      TableName: this.model.table_name,
      SpName: this.model.sp_name,
      reportparameters: this.reportData
    };

    this.dalservice.ReportFile(dataParam, this.APIControllerReport, this.APIRouteForDownload).subscribe(res => {
      this.showSpinner = false;
      this.printRptNonCore(res);
    }, err => {
      this.showSpinner = false;
      const parse = JSON.parse(err);
      this.swalPopUpMsg(parse.data);
    });
  }
  //#endregion onFormSubmit

  //#region button back
  btnBack() {
    this.route.navigate(['/report/' + this.pageType]);
  }
  //#endregion button back

  //#region SysBranch Lookup
  btnLookupSysBranch() {
    $('#datatableLookupSysBranch').DataTable().clear().destroy();
    $('#datatableLookupSysBranch').DataTable({
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
          'p_for_all': '1'
        });
        
        this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBranch, this.APIRouteForLookup).subscribe(resp => {
          const parse = JSON.parse(resp);
          this.lookupsysbranch = parse.data;
          if (parse.data != null) {
            this.lookupsysbranch.numberIndex = dtParameters.start;
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

  btnSelectRowSysBranch(code: String, name: String) {
    this.model.branch_code = code;
    this.model.branch_name = name;
    $('#lookupModalSysBranch').modal('hide');
  }
  //#endregion SysBranch lookup

  //#region Marketing Lookup
    btnLookupMarketing() {
      $('#datatableLookupMarketing').DataTable().clear().destroy();
      $('#datatableLookupMarketing').DataTable({
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
            'p_branch_code': this.model.branch_code,
            'p_for_all': '1'
          });
          
          this.dalservice.Getrows(dtParameters, this.APIControllerMarketing, this.APIRouteForLookup).subscribe(resp => {
            const parse = JSON.parse(resp);
            this.lookupmarketing = parse.data;
            if (parse.data != null) {
              this.lookupmarketing.numberIndex = dtParameters.start;
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
  
    btnSelectRowMarketing(code: String, description: String) {
      this.model.marketing_code = code;
      this.model.marketing_name = description;
      $('#lookupModalMarketingProspect').modal('hide');
    }
    //#endregion Marketing lookup
}

