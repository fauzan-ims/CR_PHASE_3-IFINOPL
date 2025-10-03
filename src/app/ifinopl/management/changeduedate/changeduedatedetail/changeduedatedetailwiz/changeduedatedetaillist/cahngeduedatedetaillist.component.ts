import { OnInit, ViewChild, Component, ElementRef } from '@angular/core';
import 'rxjs/add/operator/map'
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { BaseComponent } from '../../../../../../../base.component';
import { DALService } from '../../../../../../../DALservice.service';
import swal from 'sweetalert2';
import { Location } from '@angular/common';


@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './changeduedatedetaillist.component.html'
})

export class ChangeduedatedetaillistComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');

    // variable
    public listduedatechangedetail: any = [];
    private dataTamp: any = [];
    public setStyle: any = [];
    public agreementNo: String;
    public NumberOnlyPattern = this._numberonlyformat;
    public pageNumber: any;
    public pagenumber_temp: any;

    private APIController: String = 'DueDateChangeDetail';
    private APIControllerMain: String = 'DueDateChangeMain';
    private APIControllerTransaction: String = 'DueDateChangeTransaction';

    private APIRouteForGetRows: String = 'GetRows';
    private APIRouteForGetRow: String = 'GetRow';
    private APIRouteForUpdate: String = 'Update';
    private APIRouteForUpdate2: String = 'Update2';

    private RoleAccessCode = 'R00023870000001A'; // role access 

    // form 2 way binding
    model: any = {};

    // spinner
    showSpinner: Boolean = false;
    // end

    // ini buat datatables
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};

    constructor(private dalservice: DALService,
        private _location: Location,
        public route: Router,
        public getRouteparam: ActivatedRoute,
        private _elementRef: ElementRef) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);
        this.compoSide('', this._elementRef, this.route);
        this.loadData();
        this.callGetrow()
    }

    //#region load all data
    loadData() {
        this.dtOptions = {
            'pagingType': 'first_last_numbers',
            'pageLength': 100,
            'processing': true,
            'serverSide': true,
            responsive: true,
            lengthChange: false, // hide lengthmenu
            searching: true, // jika ingin hilangin search box nya maka false 
            ajax: (dtParameters: any, callback) => {

                dtParameters.paramTamp = [];
                dtParameters.paramTamp.push({
                    'p_due_date_change_code': this.param
                });

                this.dalservice.Getrows(dtParameters, this.APIController, this.APIRouteForGetRows).subscribe(resp => {
                    const parse = JSON.parse(resp);
                    for (let i = 0; i < parse.data.length; i++) {
                        // checkbox
                        if (parse.data[i].is_change === '1') {
                            parse.data[i].is_change = true;
                        } else {
                            parse.data[i].is_change = false;
                        }
                        if (parse.data[i].is_change_billing_date === '1') {
                            parse.data[i].is_change_billing_date = true;
                        } else {
                            parse.data[i].is_change_billing_date = false;
                        }

                        if (parse.data[i].is_every_eom === '1') {
                            parse.data[i].is_every_eom = true;
                        } else {
                            parse.data[i].is_every_eom = false;
                        }

                        // end checkbox

                        this.listduedatechangedetail = parse.data;
                    }

                    this.listduedatechangedetail = parse.data;
                    if (parse.data != null) {
                        this.listduedatechangedetail.numberIndex = dtParameters.start;
                    }
                    // this.pageNumber = parse.draw;

                    callback({
                        draw: parse.draw,
                        recordsTotal: parse.recordsTotal,
                        recordsFiltered: parse.recordsFiltered,
                        data: []
                    });

                }, err => console.log('There was an error while retrieving Data(API) !!!' + err));
            },
            columnDefs: [{ orderable: false, width: '5%', targets: [0, 1, 7, 8, 9] }], // for disabled coloumn
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search records',
                infoEmpty: '<p style="color:red;" > No Data Available !</p> '
            },
            searchDelay: 800 // pake ini supaya gak bug search
        }
    }
    //#endregion public serviceAddressList load all data

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
        // param tambahan untuk getrow dynamic
        this.dataTamp = [{
            'p_code': this.param,
        }];
        // end param tambahan untuk getrow dynamic

        this.dalservice.Getrow(this.dataTamp, this.APIControllerMain, this.APIRouteForGetRow)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    const parsedata = this.getrowNgb(parse.data[0]);

                    this.agreementNo = parsedata.agreement_no

                    this.showSpinner = false;
                },
                error => {
                    console.log('There was an error while Retrieving Data(API) !!!' + error);
                });
    }
    //#endregion getrow data

    //#region btnChange
    btnChange(id: any, i: any, p_is_change: any) {
        this.showSpinner = true;
        this.dataTamp = [];

        const getNewDueDateDay = $('[name="p_new_due_date_day"]')
            .map(function () { return $(this).val(); }).get();
        const getNewBillingDateDay = $('[name="p_old_billing_date_day"]')
            .map(function () { return $(this).val(); }).get();

        i = i % 100;

        if (getNewDueDateDay[i] == '' || getNewDueDateDay[i] == null) {
            getNewDueDateDay[i] = undefined;
        }


        this.dataTamp.push(
            this.JSToNumberFloats({
                p_id: id,
                p_due_date_change_code: this.param,
                p_new_due_date_day: this.dateFormatList(getNewDueDateDay[i]),
                p_new_billing_date_day: this.dateFormatList(getNewBillingDateDay[i]),
                // p_is_change: '1',
                p_is_change: p_is_change == '1' ? '0' : '1'
            }))


        this.dalservice.Update(this.dataTamp, this.APIController, this.APIRouteForUpdate)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                        this.showSpinner = false;
                        this.showNotification('bottom', 'right', 'success');
                        $('#datatabledetail').DataTable().ajax.reload(null, false);
                    } else {
                        this.showSpinner = false;
                        this.swalPopUpMsg(parse.data);
                        $('#datatabledetail').DataTable().ajax.reload(null, false);
                    }
                },
                error => {
                    this.showSpinner = false;
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data)
                });
    }
    //#endregion btnChange
    //#region btnChangeBilingDate
    btnChangeBillingDate(id: any, i: any, p_is_change_billing_date: any) {
        this.showSpinner = true;
        this.dataTamp = [];

        const getNewDueDateDay = $('[name="p_old_due_date_day"]')
            .map(function () { return $(this).val(); }).get();
        const getNewBillingDateDay = $('[name="p_new_billing_date_day"]')
            .map(function () { return $(this).val(); }).get();


        i = i % 100;

        if (getNewBillingDateDay[i] == '' || getNewBillingDateDay[i] == null) {
            getNewBillingDateDay[i] = undefined;
        }


        this.dataTamp.push(
            this.JSToNumberFloats({
                p_id: id,
                p_due_date_change_code: this.param,
                p_new_due_date_day: this.dateFormatList(getNewDueDateDay[i]),
                p_new_billing_date_day: this.dateFormatList(getNewBillingDateDay[i]),
                // p_is_change_billing_date: '1',
                p_is_change_billing_date: p_is_change_billing_date == '1' ? '0' : '1'

            }))


        this.dalservice.Update(this.dataTamp, this.APIController, this.APIRouteForUpdate2)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                        this.showSpinner = false;
                        this.showNotification('bottom', 'right', 'success');
                        $('#datatabledetail').DataTable().ajax.reload(null, false);
                    } else {
                        this.showSpinner = false;
                        this.swalPopUpMsg(parse.data);
                        $('#datatabledetail').DataTable().ajax.reload(null, false);
                    }
                },
                error => {
                    this.showSpinner = false;
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data)
                });
    }
    //#endregion btnChangeBilingDate

    //#region isEveryEom
    isEveryEom(event: any, id: any, i: any) {
        this.dataTamp = [];
        this.showSpinner = true;


        const getNewDueDateDay = $('[name="p_new_due_date_day"]')
            .map(function () { return $(this).val(); }).get();
        const getNewBillingDateDay = $('[name="p_new_billing_date_day"]')
            .map(function () { return $(this).val(); }).get();

        i = i % 100;

        if (getNewDueDateDay[i] == '' || getNewDueDateDay[i] == null) {
            getNewDueDateDay[i] = undefined;
        }
        if (getNewBillingDateDay[i] == '' || getNewBillingDateDay[i] == null) {
            getNewBillingDateDay[i] = undefined;
        }

        this.dataTamp.push(
            this.JSToNumberFloats({
                p_id: id,
                p_due_date_change_code: this.param,
                p_new_due_date_day: this.dateFormatList(getNewDueDateDay[i]),
                p_new_billing_date_day: this.dateFormatList(getNewBillingDateDay[i]),
                p_is_every_eom: event.target.checked
            }))

        this.dalservice.Update(this.dataTamp, this.APIControllerTransaction, this.APIRouteForUpdate)
            .subscribe(
                res => {
                    const parse = JSON.parse(res);
                    if (parse.result === 1) {
                        this.showNotification('bottom', 'right', 'success');
                        $('#datatabledetail').DataTable().ajax.reload(null, false);
                        this.showSpinner = false;
                    } else {
                        this.swalPopUpMsg(parse.data);
                        $('#datatabledetail').DataTable().ajax.reload(null, false);
                        this.showSpinner = false;
                    }
                },
                error => {
                    this.showSpinner = false;
                    const parse = JSON.parse(error);
                    this.swalPopUpMsg(parse.data)
                });
    }
    //#endregion isEveryEom

    //#region button edit
    btnEdit(codeEdit: string) {
        this.route.navigate(['/management/subchangeduedatelistifinopl/changeduedatedetail/' + this.param + '/changeduedateagreementassetamortization', this.agreementNo, codeEdit, this.param]);
    }
    //#endregion button edit
}



