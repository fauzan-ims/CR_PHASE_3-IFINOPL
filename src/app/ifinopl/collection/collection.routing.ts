import { Routes } from '@angular/router';
import { AuthGuard } from '../../../auth.guard';
import { DeskCollinquirydetailComponent } from './deskcollinquiry/deskcollinquirydetail/deskcollinquirydetail.component';
import { DeskcollInquirylistComponent } from './deskcollinquiry/deskcollinquirylist/deskcollinquirylist.component';
import { DeskcollstafflistComponent } from './deskcollstaff/deskcolldtafflist/deskcollstafflist.component';
import { AgreementloglistComponent } from './deskcolltask/deskcolldetail/agreementlogwiz/agreementloglist/agreementloglist.component';
import { AmortizationlistComponent } from './deskcolltask/deskcolldetail/amortizationwiz/amortizationlist/amortizationlist.component';
import { DeskColltaskdetailComponent } from './deskcolltask/deskcolldetail/deskcolldetail.component';
import { DeskcolltasklistComponent } from './deskcolltask/deskcolltasklist/deskcolltasklist.component';
import { DeskcolltaskmainlistComponent } from './deskcolltask/deskcolltasklist/deskcolltaskmainwiz/deskcolltaskmainlist/deskcolltaskmainlist.component';
import { DeskcolltasktpastduelistComponent } from './deskcolltask/deskcolltasklist/deskcolltaskpastduewiz/deskcolltaskpastduelist/deskcolltasktpastduelist.component';
import { SktdetailComponent } from './skt/sktdetail/sktdetail.component';
import { SktlistComponent } from './skt/sktlist/sktlist.component';
import { SktsettlementdetailComponent } from './sktsettlement/sktsettlementdetail/sktsettlementdetail.component';
import { SktsettlementlistComponent } from './sktsettlement/sktsettlementlist/sktsettlementlist.component';
import { HistorylistComponent } from './sp/splist/historywiz/historylist/historylist.component';
import { Sp1listComponent } from './sp/splist/sp1wiz/sp1list/sp1list.component';
import { Sp2listComponent } from './sp/splist/sp2wiz/sp2list/sp2list.component';
import { Sp3listComponent } from './sp/splist/sp3wiz/sp3list/sp3list.component';
import { SplistComponent } from './sp/splist/splist.component';
import { SpdeliverydetailComponent } from './spdelivery/spdeliverydetail/spdeliverydetail.component';
import { SpdeliverylistComponent } from './spdelivery/spdeliverylist/spdeliverylist.component';
import { SpdeliveryprocesslistComponent } from './spdeliveryprocess/spdeliveryprocesslist/spdeliveryprocesslist.component';
import { SpdeliverysettlementdetailComponent } from './spdeliverysettlement/spdeliverysettlementdetail/spdeliverysettlementdetail.component';
import { SpdeliverysettlementlistComponent } from './spdeliverysettlement/spdeliverysettlementlist/spdeliverysettlementlist.component';
import { SpmanualdetailComponent } from './spmanual/spmanualdetail/spmanualdetail.component';
import { SpmanuallistComponent } from './spmanual/spmanuallist/spmanuallist.component';
import { AmortizationdetailComponent } from './deskcolltask/deskcolldetail/amortizationwiz/amortizationdetail/amortizationdetail.component';

export const Collection: Routes = [{
    path: '',
    children: [
        {
            path: 'subdeskcolltasklist',
            component: DeskcolltasklistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'deskcolltaskmainlist',
                    component: DeskcolltaskmainlistComponent,
                    // outlet: "register"
                },

                {
                    path: 'deskcolltasktpastduelist',
                    component: DeskcolltasktpastduelistComponent,
                    // outlet: "register"
                },
            ]



        },

        {
            path: 'deskcolltaskdetailpast/:id', /*update*/
            component: DeskColltaskdetailComponent,
            children: [
                {
                    path: 'agreementloglist/:id', /*update*/
                    component: AgreementloglistComponent,
                },
                {
                    path: 'amortizationlist/:id', /*update*/
                    component: AmortizationlistComponent,
                },
                {
                    path: 'amortizationdetail/:id/:id2',
                    component: AmortizationdetailComponent
                }
            ]
        },

        {
            path: 'subdeskcollinquerylist',
            component: DeskcollInquirylistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'deskcollinquirydetail/:id', /*update*/
                    component: DeskCollinquirydetailComponent,
                },
            ]
        },

        {
            path: 'subspmanuallist',
            component: SpmanuallistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'spmanualdetail', /*add*/
                    component: SpmanualdetailComponent
                },
                {
                    path: 'spmanualdetail/:id', /*update*/
                    component: SpmanualdetailComponent
                },
            ]
        },

        {
            path: 'subsplist',
            component: SplistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'subhistorylist', /*wiz history*/
                    component: HistorylistComponent
                },
                {
                    path: 'subsp1list', /*wiz sp1*/
                    component: Sp1listComponent
                },
                {
                    path: 'subsp2list', /*wiz sp3*/
                    component: Sp2listComponent
                },
                {
                    path: 'subsp3list', /*wiz sp3*/
                    component: Sp3listComponent
                },
            ]
        },

        {
            path: 'subspdeliverylist',
            component: SpdeliverylistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'spdeliverydetail/:id', /*detail*/
                    component: SpdeliverydetailComponent,
                }
            ]
        },

        {
            path: 'subspdeliverysettlementlist',
            component: SpdeliverysettlementlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'spdeliverysettlementdetail/:id',
                    component: SpdeliverysettlementdetailComponent
                }
            ]
        },

        {
            path: 'subspdeliveryprocesslist',
            component: SpdeliveryprocesslistComponent,
        },

        {
            path: 'subdeskcollstaff',
            component: DeskcollstafflistComponent
        },

        /**skt */
        {
            path: 'subsktlist',
            component: SktlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'sktdetail', /*add*/
                    component: SktdetailComponent
                },
                {
                    path: 'sktdetail/:id', /*update*/
                    component: SktdetailComponent
                },
            ]
        },
        /**skt */

        /**sktsettlement */
        {
            path: 'sublistsettlementsktifincoll',
            component: SktsettlementlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'settlementsktdetailifincoll/:id', /*edit*/
                    component: SktsettlementdetailComponent
                },
            ]
        },
        /**sktsettlement */
    ]

}];