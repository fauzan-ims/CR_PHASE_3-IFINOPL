import { Routes } from '@angular/router';
import { ApprovaldetailComponent } from './approvaldetail/approvaldetail.component';
import { DeviationlistComponent } from './approvaldetail/deviationwiz/deviationlist/deviationlist.component';
import { DeviationdetailComponent } from './approvaldetail/deviationwiz/deviationdetail/deviationdetail.component';
import { ApprovalcommentlistComponent } from './approvaldetail/approvalcommentwiz/approvalcommentlist/approvalcommentlist.component';
import { RecomendationlistComponent } from './approvaldetail/recomendationwiz/recomendationlist/recomendationlist.component';
import { LoglistComponent } from './approvaldetail/logwiz/loglist/loglist.component';
import { RulesresultlistComponent } from './approvaldetail/rulesresultwiz/rulesresultlist/rulesresultlist.component';

export const ApprovalWiz: Routes = [{
    path: '',
    children: [
        {
            path: 'approvaldetail/:id/:status',
            component: ApprovaldetailComponent,
            children: [
                {
                    path: 'deviationlist/:id',
                    component: DeviationlistComponent
                },
                {
                    path: 'deviationdetail/:id',
                    component: DeviationdetailComponent
                },
                {
                    path: 'deviationdetail/:id/:id2',
                    component: DeviationdetailComponent
                },
                {
                    path: 'approvalcommentlist/:id',
                    component: ApprovalcommentlistComponent
                },
                {
                    path: 'rulesresultlist/:id',
                    component: RulesresultlistComponent
                },
                {
                    path: 'recomendationlist/:id',
                    component: RecomendationlistComponent
                },
                {
                    path: 'loglist/:id',
                    component: LoglistComponent
                },
            ]
        },
        {
            path: 'approvaldetail/:id/:status/:page',
            component: ApprovaldetailComponent,
            children: [
                {
                    path: 'deviationlist/:id/:page',
                    component: DeviationlistComponent
                },
                {
                    path: 'deviationdetail/:id/:page',
                    component: DeviationdetailComponent
                },
                {
                    path: 'deviationdetail/:id/:id2/:page',
                    component: DeviationdetailComponent
                },
                {
                    path: 'approvalcommentlist/:id/:page',
                    component: ApprovalcommentlistComponent
                },
                {
                    path: 'rulesresultlist/:id/:page',
                    component: RulesresultlistComponent
                },
                {
                    path: 'recomendationlist/:id/:page',
                    component: RecomendationlistComponent
                },
            ]
        },
    ]
}];
