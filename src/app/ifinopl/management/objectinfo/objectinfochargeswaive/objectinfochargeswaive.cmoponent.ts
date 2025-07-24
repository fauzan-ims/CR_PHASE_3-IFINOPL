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
    templateUrl: './objectinfochargeswaive.component.html'
})

export class ObjectinfochargeswaiveComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');

    // variable
    public NumberOnlyPattern = this._numberonlyformat;
    public chargeswaivedData: any = [];
    public listwaivedetail: any = [];
    public listwaivedetaildata: any = [];
    public lookupbranch: any = [];
    public lookupagreement: any = [];
    public lookupapproval: any = [];
    public lookupagreementobligation: any = [];
    public isReadOnly: Boolean = false;
    public isButton: Boolean = false;
    private dataTamp: any = [];

    private APIController: String = 'WaivedObligation';
    private APIControllerWaivedObligationDetail: String = 'WaivedObligationDetail';

    private APIRouteForGetRows: String = 'GetRows';
    private APIRouteForGetRow: String = 'GetRow';

    private RoleAccessCode = 'R00022310000000A';

    // checklist
    public selectedAllLookup: any;
    public selectedAllTable: any;

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
        private _elementRef: ElementRef, private datePipe: DatePipe
    ) { super(); }

    ngOnInit() {
        //
        if (this.param != null) {
            this.isReadOnly = true;

            // call web service
            this.callGetrow();
            this.loadData();
            this.showSpinner = false;
        } else {
            this.model.waived_status = 'HOLD';
            this.showSpinner = false;
        }
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
                    const parsedata = this.getrowNgb(parse.data[0]);

                    if (parsedata.waived_status !== 'HOLD') {
                        this.isButton = true;
                    } else {
                        this.isButton = false;
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
                    'p_waived_obligation_code': this.param,
                })

                // tslint:disable-next-line:max-line-length
                this.dalservice.Getrows(dtParameters, this.APIControllerWaivedObligationDetail, this.APIRouteForGetRows).subscribe(resp => {
                    const parse = JSON.parse(resp)
                    this.listwaivedetail = parse.data;

                    if (parse.data != null) {
                        this.listwaivedetail.numberIndex = dtParameters.start;
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
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        }

    }
    //#endregion load all data

}
