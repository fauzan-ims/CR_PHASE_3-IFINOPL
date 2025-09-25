import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { DatePipe } from '@angular/common';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './deskcollectionresultdetail.component.html'
})

export class DeskcollectionresultdetailComponent extends BaseComponent implements OnInit {

  // get param from url
  param = this.getRouteparam.snapshot.paramMap.get('id');

  // variable
  public deskcollresultData: any = [];
  public listdeskcollresultdetail: any = [];
  public isReadOnly: Boolean = false;
  public isBreak: Boolean = false;  
  private dataTamp: any = [];
  private RoleAccessCode = 'R00020950000000A';

  // API Controller
  private APIController: String = 'MasterDeskcollResult';
  private APIControllerMasterDeskcollResultDetail: String = 'MasterDeskcollResultDetail';
  private APIRouteForGetRows: String = 'GetRows';
  private APIRouteForGetRow: String = 'GetRow';
  private APIRouteForInsert: String = 'Insert';
  private APIRouteForUpdate: String = 'Update';
  private APIRouteForDelete: String = 'Delete'; 

  // form 2 way binding
  model: any = {};

  // checklist
  public selectedAll: any;
  private checkedList: any = [];


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
    private _elementRef: ElementRef, private datePipe: DatePipe
  ) { super(); }

  ngOnInit() {
    this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);

    if (this.param != null) {
      this.isReadOnly = true;

      // call web service
      this.callGetrow();
      this.loadData();
    } else {
      this.showSpinner = false;
    }
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
        
        dtParameters.paramTamp = [];
        dtParameters.paramTamp.push({
          'p_result_code': this.param,
        });
        

        this.dalservice.Getrows(dtParameters, this.APIControllerMasterDeskcollResultDetail, this.APIRouteForGetRows)
          .subscribe(resp => {
            const parse = JSON.parse(resp)
            this.listdeskcollresultdetail = parse.data;
            if (parse.data != null) {
              this.listdeskcollresultdetail.numberIndex = dtParameters.start;
            }


            // if use checkAll use this
            $('#checkalltable').prop('checked', false);
            // end checkall

            callback({
              draw: parse.draw,
              recordsTotal: parse.recordsTotal,
              recordsFiltered: parse.recordsFiltered,
              data: []
            });
          }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
      },
      columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 5] }], // for disabled coloumn
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
        infoEmpty: '<p style="color:red;" > No Data Available !</p> '
      },
      searchDelay: 800 // pake ini supaya gak bug search
    }
  }
  //#endregion load all data

  //#region getrow data
  callGetrow() {
    
    this.dataTamp = [{
      'p_code': this.param,
    }];
    

    this.dalservice.Getrow(this.dataTamp, this.APIController, this.APIRouteForGetRow)
      .subscribe(
        res => {
          const parse = JSON.parse(res);
          const parsedata = parse.data[0];

          // checkbox
          if (parsedata.is_active === '1') {
            parsedata.is_active = true;
          } else {
            parsedata.is_active = false;
          }
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

  //#region  form submit
  onFormSubmit(deskcollresultForm: NgForm, isValid: boolean) {
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

    this.deskcollresultData = deskcollresultForm;
    if (this.deskcollresultData.p_is_active == null) {
      this.deskcollresultData.p_is_active = false;
    }
    const usersJson: any[] = Array.of(this.deskcollresultData);
    if (this.param != null) {
      this.deskcollresultData.p_code = this.param;
      // call web service
      this.dalservice.Update(usersJson, this.APIController, this.APIRouteForUpdate)
        .subscribe(
          res => {
            this.showSpinner = false;
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showNotification('bottom', 'right', 'success');
              this.callGetrow()
            } else {
              this.swalPopUpMsg(parse.data);
            }
          },
          error => {
            const parse = JSON.parse(error);
            this.swalPopUpMsg(parse.data);
          });
    } else {
      // call web service
      this.dalservice.Insert(usersJson, this.APIController, this.APIRouteForInsert)
        .subscribe(
          res => {
            this.showSpinner = false;
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              this.showNotification('bottom', 'right', 'success');
              this.route.navigate(['/setting/subdeskcollectionresultlist/deskcollectionresultdetail', this.deskcollresultData.p_code]);
            } else {
              this.swalPopUpMsg(parse.data);
            }
          },
          error => {
            const parse = JSON.parse(error);
            this.swalPopUpMsg(parse.data);
          });


    }
  }
  //#endregion form submit

  //#region button back
  btnBack() {
    this.route.navigate(['/setting/subdeskcollectionresultlist']);
    $('#datatableDesk').DataTable().ajax.reload();
  }
  //#endregion button back

  //#region button add
  btnAdd() {
    this.route.navigate(['/setting/subdeskcollectionresultlist/deskcollectionresultdetaildetail', this.param]);
  }
  //#endregion button add

  //#region button edit
  btnEdit(codeEdit: string) {
    this.route.navigate(['/setting/subdeskcollectionresultlist/deskcollectionresultdetaildetail', this.param, codeEdit]);
  }
  //#endregion button edit


  //#region checkbox all table
  btnDeleteAll() {
    this.isBreak = false;
    this.checkedList = [];
    for (let i = 0; i < this.listdeskcollresultdetail.length; i++) {
      if (this.listdeskcollresultdetail[i].selected) {
        this.checkedList.push(this.listdeskcollresultdetail[i].code);
      }
    }

    // jika tidak di checklist
    if (this.checkedList.length === 0) {
      swal({
        title: this._listdialogconf,
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-danger'
      }).catch(swal.noop)
      return
    }

    swal({
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: this._deleteconf,
      buttonsStyling: false
    }).then((result) => {
      this.showSpinner = true;
      if (result.value) {
        this.dataTamp = [];
        for (let J = 0; J < this.checkedList.length; J++) {
          
          this.dataTamp = [{
            'p_code': this.checkedList[J]
          }];
          
          this.dalservice.Delete(this.dataTamp, this.APIControllerMasterDeskcollResultDetail, this.APIRouteForDelete)
            .subscribe(
              res => {
                const parse = JSON.parse(res);
                if (parse.result === 1) {
                  if (J + 1 === this.checkedList.length) {
                    $('#datatableResult').DataTable().ajax.reload();
                    this.showSpinner = false;
                    this.showNotification('bottom', 'right', 'success');
                  }
                } else {
                  this.isBreak = true;
                  this.showSpinner = false;
                  $('#datatableResult').DataTable().ajax.reload();
                  this.swalPopUpMsg(parse.data)
                }
              },
              error => {
                this.isBreak = true;
                this.showSpinner = false;
                const parse = JSON.parse(error);
                this.swalPopUpMsg(parse.data)
              });
          if (this.isBreak) {
            break;
          }
        }

      } else {
        this.showSpinner = false;
      }
    });
  }

  selectAllTable() {
    for (let i = 0; i < this.listdeskcollresultdetail.length; i++) {
      this.listdeskcollresultdetail[i].selected = this.selectedAll;
    }
  }

  checkIfAllTableSelected() {
    this.selectedAll = this.listdeskcollresultdetail.every(function (item: any) {
      return item.selected === true;
    })
  }
  //#endregion checkbox all table
}



