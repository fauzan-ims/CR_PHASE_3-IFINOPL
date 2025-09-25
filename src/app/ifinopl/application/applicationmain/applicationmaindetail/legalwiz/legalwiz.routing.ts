import { Routes } from '@angular/router';
import { LegaldetailComponent } from './legaldetail/legaldetail.component';
import { GuarantorlistComponent } from './legaldetail/guarantorwiz/guarantorlist/guarantorlist.component';
import { GuarantordetailComponent } from './legaldetail/guarantorwiz/guarantordetail/guarantordetail.component';
import { NotarylistComponent } from './legaldetail/notarywiz/notarylist/notarylist.component';
import { NotarydetailComponent } from './legaldetail/notarywiz/notarydetail/notarydetail.component';

export const LegalWiz: Routes = [{
    path: '',
    children: [
        {
            path: 'legaldetail/:id/:branch',
            component: LegaldetailComponent,
            children: [
                {
                    path: 'guarantorlist/:id',
                    component: GuarantorlistComponent
                },
                {
                    path: 'guarantordetail/:id',
                    component: GuarantordetailComponent
                },
                {
                    path: 'guarantordetail/:id/:id2',
                    component: GuarantordetailComponent
                },
                {
                    path: 'notarylist/:id/:branch',
                    component: NotarylistComponent
                },
                {
                    path: 'notarydetail/:id/:branch',
                    component: NotarydetailComponent
                },
                {
                    path: 'notarydetail/:id/:id2/:branch',
                    component: NotarydetailComponent
                },
            ]
        },
        {
            path: 'legaldetail/:id/:branch/:page',
            component: LegaldetailComponent,
            children: [
                {
                    path: 'guarantorlist/:id/:page',
                    component: GuarantorlistComponent
                },
                {
                    path: 'guarantordetail/:id/:page',
                    component: GuarantordetailComponent
                },
                {
                    path: 'guarantordetail/:id/:id2/:page',
                    component: GuarantordetailComponent
                },
                {
                    path: 'notarylist/:id/:branch/:page',
                    component: NotarylistComponent
                },
                {
                    path: 'notarydetail/:id/:id2/:branch/:page',
                    component: NotarydetailComponent
                },
            ]
        },
    ]
}];
