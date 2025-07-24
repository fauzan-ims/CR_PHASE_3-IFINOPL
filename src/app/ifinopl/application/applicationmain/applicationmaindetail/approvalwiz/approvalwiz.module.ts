import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { DALService } from '../../../../../../DALservice.service';
import { SpinnerModule } from '../../../../../spinner-ui/spinner/spinner.module';
import { ApprovalWiz } from './approvalwiz.routing';
import { ApprovaldetailComponent } from './approvaldetail/approvaldetail.component';
import { DeviationdetailComponent } from './approvaldetail/deviationwiz/deviationdetail/deviationdetail.component';
import { DeviationlistComponent } from './approvaldetail/deviationwiz/deviationlist/deviationlist.component';
import { ApprovalcommentlistComponent } from './approvaldetail/approvalcommentwiz/approvalcommentlist/approvalcommentlist.component';
import { RecomendationlistComponent } from './approvaldetail/recomendationwiz/recomendationlist/recomendationlist.component';
import { LoglistComponent } from './approvaldetail/logwiz/loglist/loglist.component';
import { RulesresultlistComponent } from './approvaldetail/rulesresultwiz/rulesresultlist/rulesresultlist.component';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ApprovalWiz),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule
    ],
    declarations: [
        ApprovaldetailComponent,
        DeviationlistComponent,
        DeviationdetailComponent,
        ApprovalcommentlistComponent,
        RecomendationlistComponent,
        LoglistComponent,
        RulesresultlistComponent,
    ],
    providers: [
        DALService
    ]
})

export class ApplicationApprovalWizModule { }
