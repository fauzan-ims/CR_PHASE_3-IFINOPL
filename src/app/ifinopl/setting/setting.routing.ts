import { Routes } from '@angular/router';

import { DimensionlistComponent } from './dimension/dimensionlist/dimensionlist.component';
import { DimensiondetailComponent } from './dimension/dimensiondetail/dimensiondetail.component';
import { DimensiondetaildetailComponent } from './dimension/dimensiondetail/dimensiondetaildetail/dimensiondetaildetail.component';
import { NumberlistComponent } from './number/numberlist/numberlist.component';
import { NumberdetailComponent } from './number/numberdetail/numberdetail.component';
import { CodelistComponent } from './code/codelist/codelist.component';
import { CodedetailComponent } from './code/codedetail/codedetail.component';
import { SubcodedetailComponent } from './code/codedetail/subcode/subcodedetail.component';
import { DetailComponent } from './code/codedetail/subcode/detail/detail.component';
import { DocumentlistComponent } from './document/documentlist/documentlist.component';
import { DocumentdetailComponent } from './document/documentdetail/documentdetail.component';
import { ReportlistComponent } from './sysreport/reports/reportlist/reportlist.component';
import { ReportdetailComponent } from './sysreport/reports/reportdetail/reportdetail.component';
import { MasterapprovallistComponent } from './masterapproval/masterapprovallist/masterapprovallist.component';
import { MasterapprovaldetailComponent } from './masterapproval/masterapprovaldetail/masterapprovaldetail.component';
import { MastersurveylistComponent } from './mastersurvey/mastersurveylist/mastersurveylist.component';
import { MastersurveydetailComponent } from './mastersurvey/mastersurveydetail/mastersurveydetail.component';
import { MasterscoringlistComponent } from './masterscoring/masterscoringlist/masterscoringlist.component';
import { MasterscoringdetailComponent } from './masterscoring/masterscoringdetail/masterscoringdetail.component';
import { RuleslistComponent } from './rules/ruleslist/ruleslist.component';
import { RulesdetailComponent } from './rules/rulesdetail/rulesdetail.component';
import { MastertransactionlistComponent } from './mastertransaction/mastertransactionlist/mastertransactionlist.component';
import { MastertransactiondetailComponent } from './mastertransaction/mastertransactiondetail/mastertransactiondetail.component';
import { WorkflowlistComponent } from './workflow/workflowlist/workflowlist.component';
import { WorkflowdetailComponent } from './workflow/workflowdetail/workflowdetail.component';
import { GllinklistComponent } from './gllink/gllinklist/gllinklist.component';
import { GllinkdetailComponent } from './gllink/gllinkdetail/gllinkdetail.component';
import { BillingtypelistComponent } from './billingtype/billingtypelist/billingtypelist.component';
import { BillingtypedetailComponent } from './billingtype/billingtypedetail/billingtypedetail.component';

import { AuthGuard } from '../../../auth.guard';
import { AppworkflowlistComponent } from './appworkflow/appworkflowlist/appworkflowlist.component';
import { AppworkflowdetailComponent } from './appworkflow/appworkflowdetail/appworkflowdetail.component';
import { ParametertransactionlistComponent } from './parametertransaction/parametertransactionlist/parametertransactionlist.component';
import { ParametertransactiondetailComponent } from './parametertransaction/parametertransactiondetail/parametertransactiondetail.component';
import { ParametertransactiondetaildetailComponent } from './parametertransaction/parametertransactiondetail/parametertransactiondetaildetail/parametertransactiondetaildetail.component';
import { DeskcollectionresultlistComponent } from './deskcollectionresult/deskcollectionresultlist/deskcollectionresultlist.component';
import { DeskcollectionresultdetailComponent } from './deskcollectionresult/deskcollectionresultdetail/deskcollectionresultdetail.component';
import { DeskcollectionresultdetaildetailComponent } from './deskcollectionresult/deskcollectionresultdetail/deskcollectionresultdetaildetail/deskcollectionresultdetaildetail.component';
import { MasterdashboardlistComponent } from './masterdashboard/masterdashboardlist/masterdashboardlist.component';
import { MasterdashboarddetailComponent } from './masterdashboard/masterdashboarddetail/masterdashboarddetail.component';
import { MasterdashboarduserlistComponent } from './masterdashboarduser/masterdashboarduserlist/masterdashboarduserlist.component';
import { MasterdashboarduserdetailComponent } from './masterdashboarduser/masterdashboarduserdetail/masterdashboarduserdetail.component';


export const Setting: Routes = [{
    path: '',
    children: [
        {
            path: 'subdimensionlist',
            component: DimensionlistComponent,
            children: [
                {
                    path: 'dimensiondetail', /*add*/
                    component: DimensiondetailComponent
                },
                {
                    path: 'dimensiondetail/:id', /*update*/
                    component: DimensiondetailComponent
                }
            ],
            canActivate: [AuthGuard]
        },
        {
            path: 'subdimensionlist',
            component: DimensionlistComponent,
            children: [
                {
                    path: 'dimensiondetail', /*add*/
                    component: DimensiondetailComponent
                },
                {
                    path: 'dimensiondetail/:id', /*update*/
                    component: DimensiondetailComponent
                },
                {
                    path: 'dimensiondetaildetail/:id', /*add*/
                    component: DimensiondetaildetailComponent
                },
                {
                    path: 'dimensiondetaildetail/:id/:id2', /*update*/
                    component: DimensiondetaildetailComponent
                }
            ],
            canActivate: [AuthGuard]
        },
        {
            path: 'subnumberlist',
            component: NumberlistComponent,
            children: [
                {
                    path: 'numberdetail', /*add*/
                    component: NumberdetailComponent
                },
                {
                    path: 'numberdetail/:id', /*update*/
                    component: NumberdetailComponent
                },
            ],
            canActivate: [AuthGuard]
        },
        {
            path: 'subdocumentlist',
            component: DocumentlistComponent,
            children: [
                {
                    path: 'documentdetail', /*add*/
                    component: DocumentdetailComponent
                },
                {
                    path: 'documentdetail/:id', /*update*/
                    component: DocumentdetailComponent
                },
            ],
            canActivate: [AuthGuard]
        },
        {
            path: 'subcodelist',
            component: CodelistComponent,
            children: [

                {
                    path: 'codedetail', /*add*/
                    component: CodedetailComponent
                },
                {
                    path: 'codedetail/:id', /*update*/
                    component: CodedetailComponent
                },
                {
                    path: 'subcodedetail/:id', /*add*/
                    component: SubcodedetailComponent
                },
                {
                    path: 'subcodedetail/:id/:id2', /*update*/
                    component: SubcodedetailComponent
                },
                {
                    path: 'detail/:id/:id2', /*add*/
                    component: DetailComponent
                },
                {
                    path: 'detail/:id/:id2/:id3', /*update*/
                    component: DetailComponent
                },
            ],
            canActivate: [AuthGuard]
        },
        {
            path: 'subgllinklist',
            component: GllinklistComponent,
            children: [
                {
                    path: 'gllinkdetail', /*add*/
                    component: GllinkdetailComponent
                },
                {
                    path: 'gllinkdetail/:id', /*update*/
                    component: GllinkdetailComponent
                },
            ],
            canActivate: [AuthGuard]
        },
        {
            path: 'subreportlist',
            component: ReportlistComponent,
            children: [
                {
                    path: 'reportsdetail', /*add*/
                    component: ReportdetailComponent
                },
                {
                    path: 'reportsdetail/:id', /*update*/
                    component: ReportdetailComponent
                },
            ],
            canActivate: [AuthGuard]
        },
        {
            path: 'submasterapprovallist',
            component: MasterapprovallistComponent,
            children: [
                {
                    path: 'masterapprovaldetail', /*add*/
                    component: MasterapprovaldetailComponent
                },
                {
                    path: 'masterapprovaldetail/:id', /*update*/
                    component: MasterapprovaldetailComponent
                },
            ],
            canActivate: [AuthGuard]
        },
        {
            path: 'submastersurveylist',
            component: MastersurveylistComponent,
            children: [
                {
                    path: 'mastersurveydetail', /*add*/
                    component: MastersurveydetailComponent
                },
                {
                    path: 'mastersurveydetail/:id', /*update*/
                    component: MastersurveydetailComponent
                },
            ],
            canActivate: [AuthGuard]
        },
        {
            path: 'submasterscoringlist',
            component: MasterscoringlistComponent,
            children: [
                {
                    path: 'masterscoringdetail', /*add*/
                    component: MasterscoringdetailComponent
                },
                {
                    path: 'masterscoringdetail/:id', /*update*/
                    component: MasterscoringdetailComponent
                },
            ],
            canActivate: [AuthGuard]
        },
        {
            path: 'subruleslist',
            component: RuleslistComponent,
            children: [
                {
                    path: 'rulesdetail', /*add*/
                    component: RulesdetailComponent
                },
                {
                    path: 'rulesdetail/:id', /*update*/
                    component: RulesdetailComponent
                },
            ],
            canActivate: [AuthGuard]
        },
        {
            path: 'submastertransactionlist',
            component: MastertransactionlistComponent,
            children: [
                {
                    path: 'mastertransactiondetail', /*add*/
                    component: MastertransactiondetailComponent
                },
                {
                    path: 'mastertransactiondetail/:id', /*update*/
                    component: MastertransactiondetailComponent
                },
            ],
            canActivate: [AuthGuard]
        },
        {
            path: 'subruleslist',
            component: RuleslistComponent,
            children: [
                {
                    path: 'rulesdetail', /*add*/
                    component: RulesdetailComponent
                },
                {
                    path: 'rulesdetail/:id', /*update*/
                    component: RulesdetailComponent
                },
            ],
            canActivate: [AuthGuard]
        },
        {
            path: 'subworkflowlist',
            component: WorkflowlistComponent,
            children: [
                {
                    path: 'workflowdetail', /*add*/
                    component: WorkflowdetailComponent
                },
                {
                    path: 'workflowdetail/:id', /*update*/
                    component: WorkflowdetailComponent
                }
            ],
            canActivate: [AuthGuard]
        },
        {
            path: 'subappworkflowlist',
            component: AppworkflowlistComponent,
            children: [
                {
                    path: 'appworkflowdetail', /*add*/
                    component: AppworkflowdetailComponent
                },
                {
                    path: 'appworkflowdetail/:id', /*update*/
                    component: AppworkflowdetailComponent
                },
            ],
            canActivate: [AuthGuard]
        },
        {
            path: 'subbillingtypelist',
            component: BillingtypelistComponent,
            children: [
                {
                    path: 'billingtypedetail', /*add*/
                    component: BillingtypedetailComponent
                },
                {
                    path: 'billingtypedetail/:id', /*update*/
                    component: BillingtypedetailComponent
                },
            ],
            canActivate: [AuthGuard]
        },
        //mastertransactionparameter
        {
            path: 'submastertransactionparameterlist',
            component: ParametertransactionlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'parametertransactiondetail', /*add*/
                    component: ParametertransactiondetailComponent
                },
                {
                    path: 'parametertransactiondetail/:parametertransactioncode', /*update*/
                    component: ParametertransactiondetailComponent
                },
                {
                    path: 'parametertransactiondetaildetail/:parametertransactioncode', /*add*/
                    component: ParametertransactiondetaildetailComponent
                },
                {
                    path: 'parametertransactiondetaildetail/:parametertransactioncode/:parametertransactionid', /*update*/
                    component: ParametertransactiondetaildetailComponent
                },
            ]

        },
        //mastertransactionparameter

        //masterdeskcollresult
        {
            path: 'subdeskcollectionresultlist',
            component: DeskcollectionresultlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'deskcollectionresultdetail', /*add*/
                    component: DeskcollectionresultdetailComponent,
                    canActivate: [AuthGuard],
                },
                {
                    path: 'deskcollectionresultdetail/:id', /*update*/
                    component: DeskcollectionresultdetailComponent,
                    canActivate: [AuthGuard],
                },
                {
                    path: 'deskcollectionresultdetaildetail/:id', /*add*/
                    component: DeskcollectionresultdetaildetailComponent,
                    canActivate: [AuthGuard],
                },
                {
                    path: 'deskcollectionresultdetaildetail/:id/:id2', /*update*/
                    component: DeskcollectionresultdetaildetailComponent,
                    canActivate: [AuthGuard],
                },
            ]
        },

        //master dashboard
        {
            path: 'submasterdashboardlist',
            component: MasterdashboardlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'masterdashboarddetail', /*add*/
                    component: MasterdashboarddetailComponent
                },
                {
                    path: 'masterdashboarddetail/:id', /*update*/
                    component: MasterdashboarddetailComponent
                },
            ]
        },
        //master dashboard

        //master dashboard User
        {
            path: 'submasterdashboarduserlist',
            component: MasterdashboarduserlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'masterdashboarduserdetail', /*add*/
                    component: MasterdashboarduserdetailComponent
                },
                {
                    path: 'masterdashboarduserdetail/:id', /*update*/
                    component: MasterdashboarduserdetailComponent
                },
            ]
        },
        //master dashboard User
    ]

}];
