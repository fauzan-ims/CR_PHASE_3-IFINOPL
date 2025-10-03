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
    templateUrl: './inquirydeskcolltasklist.component.html'
})
export class InquiryDeskcolltasklistComponent extends BaseComponent implements OnInit {

    // variable
    public deskcolltaskData: any = [];
    public isReadOnly: Boolean = false;
    private RoleAccessCode = 'R00024780000001A';


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
        this.wizard();
        this.deskcolltasktwiz();
    }

    redirectTo(uri: string) {
        this.route.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.route.navigate([uri]));
    }

    //#region deskcolltasklist tabs deskcolltasktwiz
    deskcollpromisewiz() {
        this.route.navigate(['/inquiry/subinquirydeskcolltasklist/inquirydeskcolltaskmainlist/'], { skipLocationChange: true });
    }
    //#endregion deskcolltasklist tabs

    //#region deskcolltaskmainlist tabs
    deskcolltasktwiz() {
        this.route.navigate(['/inquiry/subinquirydeskcolltasklist/inquirydeskcolltasktpastduelist/']);
    }
    //#endregion deskcolltaskmainlist tabs
}
