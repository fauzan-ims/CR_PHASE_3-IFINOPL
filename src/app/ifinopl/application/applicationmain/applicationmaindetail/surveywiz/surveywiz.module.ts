import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { DALService } from '../../../../../../DALservice.service';
import { SurveyWiz } from './surveywiz.routing';
import { SpinnerModule } from '../../../../../spinner-ui/spinner/spinner.module';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { SurveydetailComponent } from './surveydetail/surveydetail.component';
import { ScoringrequestlistComponent } from './surveydetail/scoringrequestwiz/scoringrequestlist/scoringrequestlist.component';
import { ScoringrequestdetailComponent } from './surveydetail/scoringrequestwiz/scoringrequestdetail/scoringrequestdetail.component';
import { SurveyrequestlistComponent } from './surveydetail/surveyrequestwiz/surveyrequestlist/surveyrequestlist.component';
import { SurveyrequestdetailComponent } from './surveydetail/surveyrequestwiz/surveyrequestdetail/surveyrequestdetail.component';
import { FinancialrecapitulationlistComponent } from './surveydetail/financialrecapitulationwiz/financialrecapitulationlist/financialrecapitulationlist.component';
import { FinancialrecapitulationdetailComponent } from './surveydetail/financialrecapitulationwiz/financialrecapitulationdetail/financialrecapitulationdetail.component';
import { FinancialanalysislistComponent } from './surveydetail/financialanalysiswiz/financialanalysislist/financialanalysislist.component';
import { FinancialanalysisdetailComponent } from './surveydetail/financialanalysiswiz/financialanalysisdetail/financialanalysisdetail.component';
import { IncomelistComponent } from './surveydetail/financialanalysiswiz/financialanalysisdetail/incomewiz/incomelist/incomelist.component';
import { ExpenselistComponent } from './surveydetail/financialanalysiswiz/financialanalysisdetail/expensewiz/expenselist/expenselist.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(SurveyWiz),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule
    ],
    declarations: [
        SurveydetailComponent,
        ScoringrequestlistComponent,
        ScoringrequestdetailComponent,
        SurveyrequestlistComponent,
        SurveyrequestdetailComponent,
        FinancialrecapitulationlistComponent,
        FinancialrecapitulationdetailComponent,
        FinancialanalysislistComponent,
        FinancialanalysisdetailComponent,
        IncomelistComponent,
        ExpenselistComponent
    ],
    providers: [
        DALService
    ]
})

export class ApplicationSurveyWizModule { }
