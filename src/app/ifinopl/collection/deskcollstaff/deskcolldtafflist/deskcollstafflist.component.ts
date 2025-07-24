import { OnInit, ViewChild, Component, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import swal from 'sweetalert2';
import { Location } from '@angular/common';


@Component({
    selector: 'app-agreementlist',
    templateUrl: './deskcollstafflist.component.html'
})
export class DeskcollstafflistComponent extends BaseComponent implements OnInit {
    // variable
    public lookupbranch: any = [];
    public listdeskcollstaff: any = [];
    public branch_code: String = '';
    public branch_name: String = '';
    public aggrement_no: String = '';
    public lookupStaff: any = [];
    public tampStatus: String;
    private APIController: String = 'AgreementMain';
    private APIControllerStaff: String = 'AgreementInformation';
    private APIControllerSysemployeemain: String = 'SysEmployeeMain';
    private APIRouteForLookup: String = 'GetRowsForLookup';
    private APIControllerSysBranch: String = 'SysBranch';
    private APIRouteForGetRowsDeskcollStaff: String = 'GetRowsDeskcollStaff';
    private APIRouteForUpdateDeskcollStaff: string = 'UpdateDeskcollStaff'
    private APIRouteForGetRowsSys: String = 'GetRowsForLookup';
    private RoleAccessCode = 'R00022690000001A';

    // form 2 way binding
    model: any = {};

    // ini buat datatables
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};

    constructor(private dalservice: DALService,
        public route: Router,
        private _location: Location,
        private _elementRef: ElementRef) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        this.tampStatus = 'GO LIVE';
        this.compoSide(this._location, this._elementRef, this.route);
        this.loadData();
    }

    //#region ddl master module
    PageStatus(event: any) {
        this.tampStatus = event.target.value;
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion ddl master module

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
                    'p_branch_code': this.branch_code,
                    'p_agreement_status': this.tampStatus
                });



                this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRowsDeskcollStaff).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.listdeskcollstaff = parse.data;
                    if (parse.data != null) {
                        this.listdeskcollstaff.numberIndex = dtParameters.start;
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
            columnDefs: [{ orderable: false, width: '5%', targets: [0] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;">No Data Available !</p>'
            },
            searchDelay: 800 // pake ini supaya gak bug search
        }
    }
    //#endregion load all data

    //#region button edit
    btnEdit(codeEdit: string) {
        this.route.navigate(['/inquiry/subagreementlist/agreementdetail', codeEdit]);
    }
    //#endregion button edit

    //#region LookupSysBranch
    btnLookupSysBranch() {
        $('#datatableLookupSysBranch').DataTable().clear().destroy();
        $('#datatableLookupSysBranch').DataTable({
            'pagingType': 'simple_numbers',
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
                this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBranch, this.APIRouteForGetRowsSys).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupbranch = parse.data;
                    if (parse.data != null) {
                        this.lookupbranch.numberIndex = dtParameters.start;
                    }
                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    })
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            'lengthMenu': [
                [5, 25, 50, 100],
                [5, 25, 50, 100]
            ],
            columnDefs: [{ orderable: false, width: '5%', targets: [4] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '

            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }
    btnClearLookupBranch() {
        this.branch_code = '';
        this.branch_name = '';
        $('#datatable').DataTable().ajax.reload();
    }
    btnSelectRowBranch(code: String, name: String) {
        this.branch_code = code;
        this.branch_name = name;
        $('#lookupModalbranch').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion LookupSysBranch

    //#region lookup staff
    btnLookupStaff(aggrement_no: string) {
        this.aggrement_no = aggrement_no
        $('#datatableLookupStaff').DataTable().clear().destroy();
        $('#datatableLookupStaff').DataTable({
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

                this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysemployeemain, this.APIRouteForLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupStaff = parse.data;
                    if (parse.data != null) {
                        this.lookupStaff.numberIndex = dtParameters.start;
                    }


                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [1, 4] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
        // } , 1000);
    }
    btnSelectRowStaff(deskcoll_staff_code: String, deskcoll_staff_name: String) {
         const listdataDetail = [{
            "p_code" : this.aggrement_no,
            "p_deskcoll_staff_code" : deskcoll_staff_code,
            'p_deskcoll_staff_name': deskcoll_staff_name
        }];

        this.dalservice.Update(listdataDetail, this.APIControllerStaff, this.APIRouteForUpdateDeskcollStaff)
        .subscribe(
          res => {
            const parse = JSON.parse(res);
            if (parse.result === 1) {
              $('#datatable').DataTable().ajax.reload();
              this.showNotification('bottom', 'right', 'success');
            } else {
              this.swalPopUpMsg(parse.data);
            }
          },
          error => {
            const parse = JSON.parse(error);
            this.swalPopUpMsg(parse.data);
          });

        this.model.deskcoll_staff_code = deskcoll_staff_code;
        this.model.deskcoll_staff_name = deskcoll_staff_name;
        $('#lookupModalStaff').modal('hide');
        $('#datatableLookupStaff').DataTable().ajax.reload();
    }
    //#endregion lookup staff
}
