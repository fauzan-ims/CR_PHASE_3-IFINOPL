import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-cashierreceivedrequestlist',
    templateUrl: './cashierreceivedrequestlist.component.html'
})

export class CashierReceivedRequestlistComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');

    // form 2 way binding
    model: any = {};

    // variable
    public listCashierReceiveRequest: any = [];
    public request_status: String;
    public lookupsysbranch: any = [];
    public job_status: String;
    private RoleAccessCode = 'R00020940000000A';

    //API Controller
    private APIController: String = 'OplInterfaceCashierReceivedRequest';
    private APIControllerSysBranch: String = 'SysBranch';

    //API Function
    private APIRouteForGetRows: String = 'GetRows';
    private APIRouteForLookup: String = 'GetRowsForLookup';

    // ini buat datatables
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};

    constructor(private dalservice: DALService,
        public getRouteparam: ActivatedRoute,
        public route: Router,
        private _location: Location,
        private _elementRef: ElementRef
    ) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        this.job_status = 'ALL';
        this.request_status = 'HOLD';
        this.loadData();
        this.compoSide(this._location, this._elementRef, this.route);
    }

    //#region job Status
    PageJobStatus(event: any) {
        this.job_status = event.target.value;
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion job Status

    //#region ddl Status
    PageStatus(event: any) {
        this.request_status = event.target.value;
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion ddl Status

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
                    'p_status': 'ALL',
                    'p_branch_code': this.model.branch_code,
                    'p_request_status': this.request_status,
                    'p_job_status': this.job_status
                });
                
                this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.listCashierReceiveRequest = parse.data;
                    if (parse.data != null) {
                        this.listCashierReceiveRequest.numberIndex = dtParameters.start;
                    }

                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 10] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        }
    }
    //#endregion load all data

    //#region button edit
    btnEdit(codeEdit: string) {
        this.route.navigate(['/interface/subcashierreceivedrequestlist/cashierreceivedrequestdetail', codeEdit]);
    }
    //#endregion button edit

    //#region Lookup Branch
    btnLookupbranch() {
        $('#datatableLookupBranch').DataTable().clear().destroy();
        $('#datatableLookupBranch').DataTable({
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
                
                this.dalservice.GetrowsSys(dtParameters, this.APIControllerSysBranch, this.APIRouteForLookup).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    this.lookupsysbranch = parse.data;
                    this.lookupsysbranch.numberIndex = dtParameters.start;
                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });
                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [1, 4] }],
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        });
    }

    btnSelectRowLookupBranch(branch_code: String, branch_name: String) {
        this.model.branch_code = branch_code;
        this.model.branch_name = branch_name;
        $('#lookupModalbranch').modal('hide');
        $('#datatable').DataTable().ajax.reload();
    }

    btnClearLookupBranch() {
        this.model.branch_code = '';
        this.model.branch_name = '';
        $('#datatable').DataTable().ajax.reload();
    }
    //#endregion Lookup Branch


}
