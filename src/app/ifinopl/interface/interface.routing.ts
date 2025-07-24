import { Routes } from '@angular/router';
import { CheckinglistComponent } from './checking/checkinglist/checkinglist.component';
import { ProspectmainlistComponent } from './prospectmain/prospectmainlist/prospectmainlist.component';
import { RequestlistComponent } from './request/requestlist/requestlist.component';
import { SaleslistComponent } from './sales/saleslist/saleslist.component';
import { ScoringlistComponent } from './scoring/scoringlist/scoringlist.component';
import { AuthGuard } from '../../../auth.guard';
import { ProspectmaindetailComponent } from './prospectmain/prospectmaindetail/prospectmaindetail.component';
import { PurchaserequestlistComponent } from './purchaserequest/purchaserequestlist/purchaserequestlist.component';
import { PurchaserequestdetailComponent } from './purchaserequest/purchaserequestdetail/purchaserequestdetail.component';
import { PaymentRequestlistComponent } from './paymentrequest/paymentrequestlist/paymentrequestlist.component';
import { PaymentrequestdetailComponent } from './paymentrequest/paymentrequestdetail/paymentrequestdetail.component';
import { CashierReceivedRequestlistComponent } from './cashierreceivedrequest/cashierreceivedrequestlist/cashierreceivedrequestlist.component';
import { CashierreceivedrequestdetailComponent } from './cashierreceivedrequest/cashierreceivedrequesetdetail/cashierreceivedrequestdetail.component';
import { interfacejournalgllinklistComponent } from './interfacejournalgllink/interfacejournalgllinklist/interfacejournalgllinklist.component';
import { interfacejournalgllinkdetailComponent } from './interfacejournalgllink/interfacejournalgllinkdetail/interfacejournalgllinkdetail.component';

export const Interface: Routes = [{
    path: '',
    children: [
        {
            path: 'subinterfacerequestlist',
            component: RequestlistComponent,
            canActivate: [AuthGuard],
            children: [

            ]
        },

        {
            path: 'subinterfacecheckinglist',
            component: CheckinglistComponent,
            canActivate: [AuthGuard],
            children: [

            ]
        },

        {
            path: 'subinterfacescoringlist',
            component: ScoringlistComponent,
            canActivate: [AuthGuard],
            children: [

            ]
        },

        {
            path: 'subinterfacesaleslist',
            component: SaleslistComponent,
            canActivate: [AuthGuard],
            children: [

            ]
        },

        {
            path: 'subinterfaceprospectmainlist',
            component: ProspectmainlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'prospectmaindetail', /*add*/
                    component: ProspectmaindetailComponent
                },
                {
                    path: 'prospectmaindetail/:id', /*update*/
                    component: ProspectmaindetailComponent
                },
            ]
        },

        {
            path: 'subinterfacepurchaserequestlist',
            component: PurchaserequestlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'purchaserequestdetail/:id', // update
                    component: PurchaserequestdetailComponent,
                },
            ]
        },

        {
            path: 'subpaymentrequestlist',
            component: PaymentRequestlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'paymentrequestdetail/:id',
                    component: PaymentrequestdetailComponent
                }
            ]
        },

        {
            path: 'subcashierreceivedrequestlist',
            component: CashierReceivedRequestlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'cashierreceivedrequestdetail/:id',
                    component: CashierreceivedrequestdetailComponent
                }
            ]
        },
        {
            path: 'subinterfacejournalgllinklist',
            component: interfacejournalgllinklistComponent,
            children: [
                {
                    path: 'interfacejournalgllinkdetail/:id/:id2',
                    component: interfacejournalgllinkdetailComponent,
                    canActivate: [AuthGuard]
                },
            ],
            canActivate: [AuthGuard]
        },
    ]

}];
