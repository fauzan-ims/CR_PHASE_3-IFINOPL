import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { Transaction } from './transaction.routing';
import { DALService } from '../../../DALservice.service';
import { AuthInterceptor } from '../../../auth-interceptor';
import { AuthGuard } from '../../../auth.guard';
import { SpinnerModule } from '../../spinner-ui/spinner/spinner.module';
import { ProspectlistComponent } from './prospect/prospectlist/prospectlist.component';
import { ProspectdetailComponent } from './prospect/prospectdetail/prospectdetail.component';
import { RequestlistComponent } from './request/requestlist/requestlist.component';
import { LeadslistComponent } from './leads/leadslist/leadslist.component';
import { LeadsdetailComponent } from './leads/leadsdetail/leadsdetail.component';

//wizard
import { CheckingWizModule } from './prospect/prospectdetail/checkingwiz/checkingwiz.module';
import { FollowupWizModule } from './prospect/prospectdetail/followupwiz/followupwiz.module';
import { LogWizModule } from './prospect/prospectdetail/logwiz/logwiz.module';
import { ScoringWizModule } from './prospect/prospectdetail/scoringwiz/scoringwiz.module';
import { SimmulationWizModule } from './prospect/prospectdetail/simmulationwiz/simmulationwiz.module';
import { LogLeadsWizModule } from './leads/leadsdetail/logwiz/logwiz.module';
import { OfferWizModule } from './leads/leadsdetail/offerwiz/offerwiz.module';
import { ManualswitchlistComponent } from '../transaction/manualswitch/manualswitchlist/manualswitchlist.component';
import { ManualswitchdetailComponent } from '../transaction/manualswitch/manualswitchdetail/manualswitchdetail.component';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(Transaction),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule,
        CheckingWizModule,
        FollowupWizModule,
        LogWizModule,
        ScoringWizModule,
        SimmulationWizModule,
        LogLeadsWizModule,
        OfferWizModule
    ],
    declarations: [
        ProspectlistComponent,
        ProspectdetailComponent,
        RequestlistComponent,
        LeadslistComponent,
        LeadsdetailComponent,
        ManualswitchlistComponent,
        ManualswitchdetailComponent
    ],
    providers: [
        DALService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // back to login if 401
        , AuthGuard // penjagaan apabila dari login langsung masuk ke dashboard atau ke halaman lain
    ]
})

export class TransactionModule { }
