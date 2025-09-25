import { Routes } from '@angular/router';
import { ReportlistComponent } from './reports/reportlist/reportlist.component';
import { ReportProspectSuccessComponent } from './reports/reportprospectsuccess/reportprospectsuccess.component';
import { ReportProspectFollowUpComponent } from './reports/reportprospectfollowup/reportprospectfollowup.component';

import { AuthGuard } from '../../../auth.guard';
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

export const Report: Routes = [{
    path: '',
    children: [

        {
            path: 'subreportmanagementlist',
            component: ReportlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'reportprospectsuccess/:id/:page',
                    component: ReportProspectSuccessComponent
                },
                {
                    path: 'reportprospectfollowup/:id/:page',
                    component: ReportProspectFollowUpComponent
                },
                {
                    path: 'reportkontrakoverdue/:id/:page',
                    component: Reportkontrakoverdue
                },
                {
                    path: 'reportopencontract/:id/:page',
                    component: Reportopencontract
                },
                {
                    path: 'reportskdapproved/:id/:page',
                    component: ReportskdapprovedComponent
                },
                {
                    path: 'reportendcontract/:id/:page',
                    component: ReportendcontractComponent
                },
                {
                    path: 'reportdailyormonthlytransaction/:id/:page',
                    component: ReportdailyormonthlytransactionComponent
                },
                {
                    path: 'reportmonthlysales/:id/:page',
                    component: ReportmonthlysalesComponent
                },
                {
                    path: 'reportinvoicelist/:id/:page',
                    component: ReportinvoicelistComponent
                },
                {
                    path: 'reportoutstandinginvoice/:id/:page',
                    component: ReportoutstandinginvoiceComponent
                },
                {
                    path: 'reportoutstandingni/:id/:page',
                    component: ReportoutstandingniComponent
                },
                {
                    path: 'reportoverdue/:id/:page',
                    component: ReportoverdueComponent
                },
                {
                    path: 'reportpendingdocument/:id/:page',
                    component: ReportpendingdocumentComponent
                },
                {
                    path: 'reportexpenseasset/:id/:page',
                    component: ReportExpenseAsset
                },
                {
                    path: 'reportprofitlossasset/:id/:page',
                    component: ReportProfitLossAsset
                },
                {
                    path: 'reportdataasset/:id/:page',
                    component: ReportDataAsset
                },
                {
                    path: 'reportardailybalancing/:id/:page',
                    component: reportardailybalancinglistComponent
                },
                                {
                    path: 'reportdailyoverdue/:id/:page',
                    component: reportdailyoverduelistComponent
                },
                {
                    path: 'rptbillingduelist/:id/:page',
                    component: reportbillingduelistComponent
                },
                {
                    path: 'rptcancelinvoice/:id/:page',
                    component: reportcancelinvoiceComponent
                },
            ]
        },

        {
            path: 'subreporttransactionlist',
            component: ReportlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'reportprospectsuccess/:id/:page',
                    component: ReportProspectSuccessComponent
                },
                {
                    path: 'reportprospectfollowup/:id/:page',
                    component: ReportProspectFollowUpComponent
                },

                {
                    path: 'reportkontrakoverdue/:id/:page',
                    component: Reportkontrakoverdue
                },
                {
                    path: 'reportopencontract/:id/:page',
                    component: Reportopencontract
                },
                {
                    path: 'reportskdapproved/:id/:page',
                    component: ReportskdapprovedComponent
                },
                {
                    path: 'reportendcontract/:id/:page',
                    component: ReportendcontractComponent
                },
                {
                    path: 'reportdailyormonthlytransaction/:id/:page',
                    component: ReportdailyormonthlytransactionComponent
                },
                {
                    path: 'reportmonthlysales/:id/:page',
                    component: ReportmonthlysalesComponent
                },
                {
                    path: 'reportinvoicelist/:id/:page',
                    component: ReportinvoicelistComponent
                },
                {
                    path: 'reportoutstandinginvoice/:id/:page',
                    component: ReportoutstandinginvoiceComponent
                },
                {
                    path: 'reportoutstandingni/:id/:page',
                    component: ReportoutstandingniComponent
                },
                {
                    path: 'reportoverdue/:id/:page',
                    component: ReportoverdueComponent
                },
                {
                    path: 'reportpendingdocument/:id/:page',
                    component: ReportpendingdocumentComponent
                },
                {
                    path: 'reportexpenseasset/:id/:page',
                    component: ReportExpenseAsset
                },
                {
                    path: 'reportprofitlossasset/:id/:page',
                    component: ReportProfitLossAsset
                },
                {
                    path: 'reportdataasset/:id/:page',
                    component: ReportDataAsset
                },
                {
                    path: 'reportardailybalancing/:id/:page',
                    component: reportardailybalancinglistComponent
                },
                                {
                    path: 'reportdailyoverdue/:id/:page',
                    component: reportdailyoverduelistComponent
                },
                {
                    path: 'rptbillingduelist/:id/:page',
                    component: reportbillingduelistComponent
                },
                {
                    path: 'rptcancelinvoice/:id/:page',
                    component: reportcancelinvoiceComponent
                },
            ]
        },

        {
            path: 'subreportsetting',
            component: ReportsettinglistComponent,
            canActivate: [AuthGuard],
        },

    ]

}];
