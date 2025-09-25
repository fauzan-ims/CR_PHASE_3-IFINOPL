import { NgModule, ErrorHandler } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { DALService } from '../../../DALservice.service';
import { Setting } from './setting.routing';
import { AuthInterceptor } from '../../../auth-interceptor';
import { AuthGuard } from '../../../auth.guard';
import { SpinnerModule } from '../../spinner-ui/spinner/spinner.module';
import { DimensionlistComponent } from './dimension/dimensionlist/dimensionlist.component';
import { DimensiondetailComponent } from './dimension/dimensiondetail/dimensiondetail.component';
import { DimensiondetaildetailComponent } from './dimension/dimensiondetail/dimensiondetaildetail/dimensiondetaildetail.component';
import { NumberlistComponent } from './number/numberlist/numberlist.component';
import { NumberdetailComponent } from './number/numberdetail/numberdetail.component';
import { CodelistComponent } from './code/codelist/codelist.component';
import { CodedetailComponent } from './code/codedetail/codedetail.component';
import { DocumentlistComponent } from './document/documentlist/documentlist.component';
import { DocumentdetailComponent } from './document/documentdetail/documentdetail.component';
import { SubcodedetailComponent } from './code/codedetail/subcode/subcodedetail.component';
import { DetailComponent } from './code/codedetail/subcode/detail/detail.component';
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


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(Setting),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule
    ],
    declarations: [
        DimensionlistComponent,
        DimensiondetailComponent,
        DimensiondetaildetailComponent,
        NumberlistComponent,
        NumberdetailComponent,
        CodelistComponent,
        CodedetailComponent,
        SubcodedetailComponent,
        DetailComponent,
        DocumentlistComponent,
        DocumentdetailComponent,
        ReportlistComponent,
        ReportdetailComponent,
        MasterapprovallistComponent,
        MasterapprovaldetailComponent,
        MastersurveylistComponent,
        MastersurveydetailComponent,
        MasterscoringlistComponent,
        MasterscoringdetailComponent,
        RuleslistComponent,
        RulesdetailComponent,
        MastertransactionlistComponent,
        MastertransactiondetailComponent,
        RuleslistComponent,
        RulesdetailComponent,
        WorkflowlistComponent,
        WorkflowdetailComponent,
        GllinklistComponent,
        GllinkdetailComponent,
        BillingtypelistComponent,
        BillingtypedetailComponent,
        AppworkflowlistComponent,
        AppworkflowdetailComponent,
        ParametertransactionlistComponent,
        ParametertransactiondetailComponent,
        ParametertransactiondetaildetailComponent,
        DeskcollectionresultlistComponent,
        DeskcollectionresultdetailComponent,
        DeskcollectionresultdetaildetailComponent,
        MasterdashboardlistComponent,
        MasterdashboarddetailComponent,
        MasterdashboarduserlistComponent,
        MasterdashboarduserdetailComponent

    ],
    providers: [
        DALService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // back to login if 401
        , AuthGuard // penjagaan apabila dari login langsung masuk ke dashboard atau ke halaman lain
    ]
})

export class SettingModule { }
