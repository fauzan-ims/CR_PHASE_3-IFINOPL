import { Routes } from '@angular/router';
import { AuthGuard } from '../../../auth.guard';
import { EarlyterminationlistComponent } from './earlytermination/earlyterminationlist/earlyterminationlist.component';
import { EarlyterminationdetailComponent } from './earlytermination/earlyterminationdetail/earlyterminationdetail.component';
import { EarlyterminationdetaillistComponent } from './earlytermination/earlyterminationdetail/earlyterminationdetailwiz/earlyterminationdetaillist/earlyterminationdetaillist.component';
import { EarlyterminationinformationlistComponent } from './earlytermination/earlyterminationdetail/earlyterminationinformationwiz/earlyterminationinformationlist/earlyterminationinformationlist.component';
import { EarlyterminationtransactionlistComponent } from './earlytermination/earlyterminationdetail/earlyterminationtransactionwiz/earlyterminationtransactionlist/earlyterminationtransactionlist.component';
import { WriteofflistComponent } from './writeoff/writeofflist/writeofflist.component';
import { WriteoffdetailComponent } from './writeoff/writeoffdetail/writeoffdetail.component';
import { WriteoffinformationlistComponent } from './writeoff/writeoffdetail/writeoffinformationwiz/writeoffinformationlist/writeoffinformationlist.component';
import { WriteoffrecoverylistComponent } from './writeoffrecovery/writeoffrecoverylist/writeoffrecoverylist.component';
import { WriteoffrecoverydetailComponent } from './writeoffrecovery/writeoffrecoverydetail/writeoffrecoverydetail.component';
import { WriteoffcandidatelistComponent } from './writeoffcandidate/writeoffcandidatelist/writeoffcandidatelist.component';
import { ChargeswaivelistComponent } from './chargeswaive/chargeswaivelist/chargeswaivelist.component';
import { ChargeswaivedetailComponent } from './chargeswaive/chargeswaivedetail/chargeswaivedetail.component';
import { WriteoffdetaillistComponent } from './writeoff/writeoffdetail/writeoffdetailwiz/writeoffdetaillist/writeoffdetaillist.component';
import { ObjectInfoEarlyterminationdetailComponent } from './objectinfo/objectinfoearlytermination/objectinfoearlytermination.component';
import { ObjectinfochargeswaiveComponent } from './objectinfo/objectinfochargeswaive/objectinfochargeswaive.cmoponent';
import { ObjectinfowriteoffComponent } from './objectinfo/objectinfowriteoff/objectinfowriteoff.component';
import { ChangeduedatelistComponent } from './changeduedate/changeduedatelist/changeduedatelist.component';
import { ChangeduedatedetailComponent } from './changeduedate/changeduedatedetail/changeduedatedetail.component';
import { ChangeduedateagreementamortizationhistorylistComponent } from './changeduedate/changeduedatedetail/changeduedateagreementamortizationhistorywiz/changeduedateagreementamortizationhistorylist/changeduedateagreementamortizationhistorylist.component';
import { ChangeduedateinformationlistComponent } from './changeduedate/changeduedatedetail/changeduedateinformationwiz/changeduedateinformationlist/changeduedateinformationlist.component';
import { ChangeduedatetransactionlistComponent } from './changeduedate/changeduedatedetail/changeduedatetransactionwiz/changeduedatetransactionlist/changeduedatetransactionlist.component';
import { ChangeduedatedetaillistComponent } from './changeduedate/changeduedatedetail/changeduedatedetailwiz/changeduedatedetaillist/cahngeduedatedetaillist.component';
import { ChangeduedateagreementassetamortizationlistComponent } from './changeduedate/changeduedatedetail/changeduedatedetailwiz/changeduedatedetaildetail/changeduedateagreementassetamortizationlist/changeduedateagreementassetamortizationlist.component';
import { ObjectinfochangeduedateComponent } from './objectinfo/objectinfochangeduedate/objctinfochangeduedate.component';
import { ObjectinfochangeduedatedetailComponent } from './objectinfo/objectinfochangeduedate/objectinfochangeduedatedetail/objectinfochangeduedatedetail.component';
import { EarlyterminationdetaildetailComponent } from './earlytermination/earlyterminationdetail/earlyterminationdetailwiz/earlyterminationdetaildetail/earlyterminationdetaildetail.component';

export const Management: Routes = [{
    path: '',
    children: [
        {
            path: 'subearlyterminationlist',
            component: EarlyterminationlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'earlyterminationdetail', /*add*/
                    component: EarlyterminationdetailComponent
                },
                {
                    path: 'earlyterminationdetail/:id', /*update*/
                    component: EarlyterminationdetailComponent,
                    children: [
                        //asset
                        {
                            path: 'earlyterminationdetaillist/:id',
                            component: EarlyterminationdetaillistComponent,
                            children: [
                                {
                                    path: 'earlyterminationdetaildetail/:id/:id2',
                                    component: EarlyterminationdetaildetailComponent,
                                }
                            ]
                        },

                        //information
                        {
                            path: 'earlyterminationinformationlist/:id',
                            component: EarlyterminationinformationlistComponent
                        },

                        //transaction
                        {
                            path: 'earlyterminationtransactionlist/:id',
                            component: EarlyterminationtransactionlistComponent
                        }
                    ]
                },
            ]
        },
        {
            path: 'subwriteofflist',
            component: WriteofflistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'writeoffdetail',
                    component: WriteoffdetailComponent
                },
                {
                    path: 'writeoffdetail/:id',
                    component: WriteoffdetailComponent,
                    children: [
                        //asset
                        {
                            path: 'writeoffdetaillist/:id',
                            component: WriteoffdetaillistComponent
                        },

                        //information
                        {
                            path: 'writeoffinformationlist/:id',
                            component: WriteoffinformationlistComponent
                        },
                    ]
                },
            ]
        },
        {
            path: 'subwriteoffrecoverylist',
            component: WriteoffrecoverylistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'writeoffrecoverydetail',
                    component: WriteoffrecoverydetailComponent
                },
                {
                    path: 'writeoffrecoverydetail/:id',
                    component: WriteoffrecoverydetailComponent
                },
            ]
        },


        {
            path: 'subwriteoffcandidatelist',
            component: WriteoffcandidatelistComponent,
            canActivate: [AuthGuard],
        },

        {
            path: 'subchargeswaivelist',
            component: ChargeswaivelistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'chargeswaivedetail',
                    component: ChargeswaivedetailComponent
                },
                {
                    path: 'chargeswaivedetail/:id',
                    component: ChargeswaivedetailComponent
                },
            ]
        },

        /**object info et */
        {
            path: 'objectinfoearlytermination/:id',
            component: ObjectInfoEarlyterminationdetailComponent,
        },
        /**object info et */

        /**object info waive */
        {
            path: 'objectinfochargeswaive/:id',
            component: ObjectinfochargeswaiveComponent,
        },
        /**object info waive */

        /**object info WO */
        {
            path: 'objectinfowriteoff/:id',
            component: ObjectinfowriteoffComponent,
        },
        /**object info WO */

        /**object info change due date */
        {
            path: 'objectinfochangeduedate/:id',
            component: ObjectinfochangeduedateComponent,
        },
        {
            path: 'objectinfochangeduedatedetail/:id1/:id2',
            component: ObjectinfochangeduedatedetailComponent,
        },
        /**object info change due date */

        /**change due date */
        {
            path: 'subchangeduedatelistifinopl',
            component: ChangeduedatelistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'changeduedatedetail', /*add*/
                    component: ChangeduedatedetailComponent
                },
                {
                    path: 'changeduedatedetail/:id', /*update*/
                    component: ChangeduedatedetailComponent,
                    children: [
                        {
                            path: 'changeduedateagreementamortizationhistorylist/:id/:id2',
                            component: ChangeduedateagreementamortizationhistorylistComponent
                        },

                        {
                            path: 'changeduedateinformationlist/:id',
                            component: ChangeduedateinformationlistComponent
                        },

                        {
                            path: 'changeduedatetransactionlist/:id',
                            component: ChangeduedatetransactionlistComponent
                        },
                        {
                            path: 'changeduedatedetaillistwiz/:id',
                            component: ChangeduedatedetaillistComponent,
                        },
                        {
                            path: 'changeduedateagreementassetamortization/:id/:id2/:id3',
                            component: ChangeduedateagreementassetamortizationlistComponent,
                        },
                    ]
                },
            ]
        },
        /**change due date */
    ]
}];
