import { NgModule, ErrorHandler } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { DALService } from '../../../DALservice.service';
import { Report } from './report.routing';
import { AuthInterceptor } from '../../../auth-interceptor';
import { AuthGuard } from '../../../auth.guard';
import { SpinnerModule } from '../../spinner-ui/spinner/spinner.module';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { ReportlistComponent } from './reports/reportlist/reportlist.component';
import { ReportProspectSuccessComponent } from './reports/reportprospectsuccess/reportprospectsuccess.component';
import { ReportProspectFollowUpComponent } from './reports/reportprospectfollowup/reportprospectfollowup.component';
import { Reportkontrakoverdue } from './reports/reportkontrakoverdue/reportkontrakoverdue.component';
import { Reportopencontract } from './reports/reportopencontract/reportopencontract.component';
import { ReportskdapprovedComponent } from './reports/reportskdapproved/reportskdapproved.component';
import { ReportendcontractComponent } from './reports/reportendcontract/reportendcontract.component';
import { ReportdailyormonthlytransactionComponent } from './reports/reportdailyormonthlytransaction/reportdailyormonthlytransaction.component';
import { ReportmonthlysalesComponent } from './reports/reportmonthlysales/reportmonthlysales.component';
import { ReportinvoicelistComponent } from './reports/reportinvoicelist/reportinvoicelist.component';
import { ReportoutstandinginvoiceComponent } from './reports/reportoutstandinginvoice/reportoutstandinginvoice.component';
import { ReportoutstandingniComponent } from './reports/reportoutstandingni/reportoutstandingni.component';
import { ReportoverdueComponent } from './reports/reportoverdue/reportoverdue.component';
import { ReportpendingdocumentComponent } from './reports/reportpendingdocument/reportpendingdocument.component';
import { ReportExpenseAsset } from './reports/reportexpenseasset/reportexpenseasset.component';
import { ReportProfitLossAsset } from './reports/reportprofitlossasset/reportprofitlossasset.component';
import { ReportDataAsset } from './reports/reportdataasset/reportdataasset.component';
import { ReportsettinglistComponent } from './reportsettinglist/reportsettinglist.component';
import { reportardailybalancinglistComponent } from './reports/reportardailybalancing/reportardailybalancinglist.component';
import { reportdailyoverduelistComponent } from './reports/reportdailyoverdue/reportdailyoverduelist.component';
import { reportbillingduelistComponent } from './reports/reportbillingduelist/reportbillingduelist.component';
import { reportcancelinvoiceComponent } from './reports/reportcancelinvoice/reportcancelinvoice.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(Report),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule
    ],
    declarations: [
        ReportsettinglistComponent,
        ReportlistComponent,
        ReportProspectSuccessComponent,
        ReportProspectFollowUpComponent,
        Reportkontrakoverdue,
        Reportopencontract,
        ReportskdapprovedComponent,
        ReportendcontractComponent,
        ReportdailyormonthlytransactionComponent,
        ReportmonthlysalesComponent,
        ReportinvoicelistComponent,
        ReportoutstandinginvoiceComponent,
        ReportoutstandingniComponent,
        ReportoverdueComponent,
        ReportpendingdocumentComponent,
        ReportExpenseAsset,
        ReportProfitLossAsset,
        ReportDataAsset,
        reportardailybalancinglistComponent,
        reportdailyoverduelistComponent,
        reportbillingduelistComponent,
        reportcancelinvoiceComponent
    ],
    providers: [
        DALService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // back to login if 401
        , AuthGuard // penjagaan apabila dari login langsung masuk ke dashboard atau ke halaman lain
    ]
})

export class SettingModule { }
