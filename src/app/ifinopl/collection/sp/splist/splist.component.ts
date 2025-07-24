import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '../../../../../base.component';
import { DALService } from '../../../../../DALservice.service';
import { Location } from '@angular/common';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './splist.component.html'
})
export class SplistComponent extends BaseComponent implements OnInit {
    // get param from url
    param = this.getRouteparam.snapshot.paramMap.get('id');

    // variable
    public deskcolltaskData: any = [];
    public isReadOnly: Boolean = false;
    private rolecode: any = [];
    private dataTamp: any = [];
    private dataRoleTamp: any = [];
    private RoleAccessCode = 'R00021010000000A';

    private APIController: String = 'WarningLetter';
    private APIRouteForGetRow: String = 'GETROW';
    private APIRouteForGetRole: String = 'ExecSpForGetRole';

    // form 2 way binding
    model: any = {};

    constructor(private dalservice: DALService,
        public getRouteparam: ActivatedRoute,
        public route: Router,
        private _location: Location,
        private _elementRef: ElementRef,
        private parserFormatter: NgbDateParserFormatter
    ) { super(); }

    ngOnInit() {
        this.callGetRole(this.userId, this._elementRef, this.dalservice, this.RoleAccessCode, this.route);

        // this.compoSide(this._location, this._elementRef, this.route); 
        this.wizard();
        this.sp1wiz();
    }
    //#region sp1 tabs
    sp1wiz() {
        this.route.navigate(['/collection/subsplist/subsp1list'], { skipLocationChange: true });
        // const iframe = $('#ifsp1list');
        // iframe.attr('src', (this.iframePublishPath + '/sp1wiz/subsp1list/' + this.param));
    }
    //#endregion sp1 tabs

    //#region sp2 tabs
    sp2wiz() {
        this.route.navigate(['/collection/subsplist/subsp2list'], { skipLocationChange: true });
    }
    //#endregion sp2 tabs

    //#region sp3 tabs
    sp3wiz() {
        this.route.navigate(['/collection/subsplist/subsp3list'], { skipLocationChange: true });
    }
    //#endregion sp3 tabs

    //#region sp3 tabs
    historywiz() {
        this.route.navigate(['/collection/subsplist/subhistorylist'], { skipLocationChange: true });
    }
    //#endregion sp3 tabs
}
