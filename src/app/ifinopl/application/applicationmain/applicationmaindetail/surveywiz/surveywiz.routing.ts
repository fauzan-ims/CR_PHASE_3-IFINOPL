import { Routes } from '@angular/router';
import { SurveydetailComponent } from './surveydetail/surveydetail.component';
import { ScoringrequestlistComponent } from './surveydetail/scoringrequestwiz/scoringrequestlist/scoringrequestlist.component';
import { ScoringrequestdetailComponent } from './surveydetail/scoringrequestwiz/scoringrequestdetail/scoringrequestdetail.component';
import { SurveyrequestlistComponent } from './surveydetail/surveyrequestwiz/surveyrequestlist/surveyrequestlist.component';
import { SurveyrequestdetailComponent } from './surveydetail/surveyrequestwiz/surveyrequestdetail/surveyrequestdetail.component';

export const SurveyWiz: Routes = [{
    path: '',
    children: [
        {
            path: 'surveydetail/:id',
            component: SurveydetailComponent,
            children: [
                {
                    path: 'scoringrequestlist/:id',
                    component: ScoringrequestlistComponent
                },
                {
                    path: 'scoringrequestdetail/:id',
                    component: ScoringrequestdetailComponent
                },
                {
                    path: 'scoringrequestdetail/:id/:id2',
                    component: ScoringrequestdetailComponent
                },
                {
                    path: 'surveyrequestlist/:id',
                    component: SurveyrequestlistComponent
                },
                {
                    path: 'surveyrequestdetail/:id',
                    component: SurveyrequestdetailComponent
                },
                {
                    path: 'surveyrequestdetail/:id/:id2',
                    component: SurveyrequestdetailComponent
                },
            ]
        },
        {
            path: 'surveydetail/:id/:page',
            component: SurveydetailComponent,
            children: [
                {
                    path: 'scoringrequestlist/:id/:page',
                    component: ScoringrequestlistComponent
                },
                {
                    path: 'scoringrequestdetail/:id/:id2/:page',
                    component: ScoringrequestdetailComponent
                },
                {
                    path: 'surveyrequestlist/:id/:page',
                    component: SurveyrequestlistComponent
                },
                {
                    path: 'surveyrequestdetail/:id/:id2/:page',
                    component: SurveyrequestdetailComponent
                },
            ]
        },
    ]
}];
