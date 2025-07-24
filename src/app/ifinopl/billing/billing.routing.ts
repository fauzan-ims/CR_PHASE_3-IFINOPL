import { Routes } from '@angular/router';
import { AuthGuard } from '../../../auth.guard';
import { AdditionalinvoicedetailComponent } from './additionalinvoice/additionalinvoicedetail/additionalinvoicedetail.component';
import { AdditionalinvoicedetaildetailComponent } from './additionalinvoice/additionalinvoicedetail/additionalinvoicedetaildetail/additionalinvoicedetaildetail.component';
import { AdditionalinvoicelistComponent } from './additionalinvoice/additionalinvoicelist/additionalinvoicelist.component';
import { BillingschemedetailComponent } from './billingscheme/billingschemedetail/billingschemedetail.component';
import { BillingschemelistComponent } from './billingscheme/billingschemelist/billingschemelist.component';
import { CreditNotedetailComponent } from './creditnote/creditnotedetail/creditnotedetail.componetn';
import { CreditNotelistComponent } from './creditnote/creditnotelist/creditnotelist.component';
import { DeliveryRequestlistComponent } from './deliveryrequest/deliveryrequestlist/deliveryrequestlist.component';
import { FakturlistComponent } from './fakturlist/fakturlist.component';
import { FakturregistrationdetailComponent } from './fakturregistration/fakturregistrationdetail/fakturregistrationdetail.component';
import { FakturregistrationlistComponent } from './fakturregistration/fakturregistrationlist/fakturregistrationlist.component';
import { InvoiceDeliverydetailComponent } from './invoicedelivery/invoicedeliverydetail/invoicedeliverydetail.component';
import { InvoiceDeliveryDetaildetailComponent } from './invoicedelivery/invoicedeliverydetail/invoicedeliverydetaildetail/invoicedeliverydetaildetail.component';
import { InvoiceDeliverylistComponent } from './invoicedelivery/invoicedeliverylist/invoicedeliverylist.component';
import { GenerateinvoicedetailComponent } from './generateinvoice/generateinvoicedetail/generateinvoicedetail.component';
import { GenerateinvoicelistComponent } from './generateinvoice/generateinvoicelist/generateinvoicelist.component';
import { SettlementpphdetailComponent } from './settlementpph/settlementpphdetail/settlementpphdetail.component';
import { SettlementpphlistComponent } from './settlementpph/settlementpphlist/settlementpphlist.component';
import { InvoicelistComponent } from './invoice/invoicelist/invoicelist.component';
import { InvoicedetailComponent } from './invoice/invoicedetail/invoicedetail.component';
import { VatpaymentrequestlistComponent } from './vatpaymentrequest/vatpaymentrequestlist/vatpaymentrequestlist.component';
import { vatpaymentlistComponent } from './vatpayment/vatpaymentlist/vatpaymentlist.component';
import { vatpaymentdetailComponent } from './vatpayment/vatpaymentdetail/vatpaymentdetail.component';
import { FakturallocationlistComponent } from './fakturallocation/fakturallocationlist/fakturallocationlist.component';
import { FakturallocationdetailComponent } from './fakturallocation/fakturallocationdetail/fakturallocationdetail.component';
import { FakturcancelationlistComponent } from './fakturcancelation/fakturcancelationlist/fakturcancelationlist.component';
import { FakturcancelationdetailComponent } from './fakturcancelation/fakturcancelationdetail/fakturcancelationdetail.component';
import { WithholdingpaymentrequestlistComponent } from './withholdingpaymentrequest/withholdingpaymentrequestlist/withholdingpaymentrequestlist.component';
import { WithholdingpaymentlistComponent } from './withholdingpayment/withholdingpaymentlist/withholdingpaymentlist.component';
import { WithholdingpaymentdetailComponent } from './withholdingpayment/withholdingpaymentdetail/withholdingpaymentdetail.component';
import { StopbillingagreementlistComponent } from './stopbillingagreement/stopbillingagreementlist/stopbillingagreementlist.component';
import { StopbillingagreementdetailComponent } from './stopbillingagreement/stopbillingagreementdetail/stopbillingagreementdetail.component';
import { StopbillingagreementassetdetailComponent } from './stopbillingagreement/stopbillingagreementdetail/stopbillingagreementassetwiz/stopbillingagreementassetdetail/stopbillingagreementassetdetail.component';
import { StopbillingagreementamortizationlistComponent } from './stopbillingagreement/stopbillingagreementdetail/stopbillingagreementassetwiz/stopbillingagreementassetdetail/stopbillingagreementamortizationwiz/stopbillingagreementamortizationlist/stopbillingagreementamortizationlist.component';
import { PendingbillingagreementlistComponent } from './pendingbillingagreement/pendingbillingagreementlist/pendingbillingagreementlist.component';
import { PendingbillingagreementdetailComponent } from './pendingbillingagreement/pendingbillingagreementdetail/pendingbillingagreementdetail.component';
import { PendingbillingagreementassetdetailComponent } from './pendingbillingagreement/pendingbillingagreementdetail/pendingbillingagreementasset/pendingbillingagreementassetdetail/pendingbillingagreementassetdetail.component';
import { PendingbillingagreementamortizationlistComponent } from './pendingbillingagreement/pendingbillingagreementdetail/pendingbillingagreementasset/pendingbillingagreementassetdetail/pendingbillingagreementamortizationwiz/pendingagreementamortizationwizlis/pendingbillingagreementamortizationlist.component';
import { ChangebillingcontractsettinglistComponent } from './changebillingcontractsetting/changebillingcontractsettinglist/changebillingcontractsettinglist.component';
import { ChangebillingcontractsettingdetailComponent } from './changebillingcontractsetting/changebillingcontractsettingdetail/changebillingcontractsettingdetail.component';
import { AdditionalinvoicerequestlistComponent } from './additionalinvoicerequest/additionalinvoicerequestlist/additionalinvoicerequestlist.component';
import { SettlementpphauditlistComponent } from './settlementpphaudit/settlementpphauditlist/settlementpphauditlist.component';
import { SettlementpphauditdetailComponent } from './settlementpphaudit/settlementpphauditdetail/settlementpphauditdetail.component';
import { StopbillingrequestlistComponent } from './stopbillingrequest/stopbillingrequestlist/stopbillingrequestlist.component';
import { StopbillingrequestdetailComponent } from './stopbillingrequest/stopbillingrequestdetail/stopbillingrequestdetail.component';
import { StopbillingrequestapprovalComponent } from './stopbillingrequest/stopbillingrequestapproval/stopbillingrequestapproval.component';
import { SettlementpphauditapprovalComponent } from './settlementpphaudit/settlementpphauditapproval/settlementpphauditapproval.component';
import { InvoiceHoldlistComponent } from './invoicehold/invoiceholdlist/invoiceholdlist.component';
import { MonitoringlatereturnlistComponent } from './monitoringlatereturn/monitoringlatereturnlist/monitoringlatereturnlist.component';
// import { PendingbillingagreementamortizationlistComponent } from './pendingbillingagreement/pendingbillingagreementdetail/pendingbillingagreementasset/pendingbillingagreementassetdetail/pendingbillingagreementamortizationwiz/pendingaagreementamortizationwizlis/pendingbillingagreementamortizationlist.component';
import { FakturNoReplacementListComponent } from './fakturnoreplacement/fakturnoreplacementlist/fakturnoreplacementlist.component';
import { FakturNoReplacementDetailComponent } from './fakturnoreplacement/fakturnoreplacementdetail/fakturnoreplacementdetail.component';

export const Client: Routes = [{
    path: '',
    children: [
        {
            path: 'subfakturregistrationlist',
            component: FakturregistrationlistComponent,
            children: [
                {
                    path: 'fakturregistrationdetail', /*add*/
                    component: FakturregistrationdetailComponent
                },
                {
                    path: 'fakturregistrationdetail/:id', /*update*/
                    component: FakturregistrationdetailComponent
                },
            ],
            canActivate: [AuthGuard]
        },
        {
            path: 'subfakturlist',
            component: FakturlistComponent,
            canActivate: [AuthGuard]
        },
        {
            path: 'subbillingschemelist',
            component: BillingschemelistComponent,
            children: [
                {
                    path: 'billingschemedetail', /*add*/
                    component: BillingschemedetailComponent
                },
                {
                    path: 'billingschemedetail/:id', /*update*/
                    component: BillingschemedetailComponent
                },
            ],
            canActivate: [AuthGuard]
        },
        {
            path: 'subdeliveryinvoice',
            component: DeliveryRequestlistComponent,
            canActivate: [AuthGuard]
        },
        {
            path: 'subdeliverylist',
            component: InvoiceDeliverylistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'deliverydetail',
                    component: InvoiceDeliverydetailComponent
                },
                {
                    path: 'deliverydetail/:id',
                    component: InvoiceDeliverydetailComponent
                },
                {
                    path: 'deliverydetaildetail/:id/:id2',
                    component: InvoiceDeliveryDetaildetailComponent
                }
            ]
        },
        {
            path: 'subcreditnotelist',
            component: CreditNotelistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'creditnotedetail',
                    component: CreditNotedetailComponent
                },
                {
                    path: 'creditnotedetail/:creditnotecode',
                    component: CreditNotedetailComponent
                }
            ]
        },
        {
            path: 'subgenerateinvoicelist',
            component: GenerateinvoicelistComponent,
            children: [
                {
                    path: 'generateinvoicedetail', /*add*/
                    component: GenerateinvoicedetailComponent
                },
                {
                    path: 'generateinvoicedetail/:id', /*update*/
                    component: GenerateinvoicedetailComponent
                },
            ],
            canActivate: [AuthGuard]
        },
        {
            path: 'subsettlementpphlist',
            component: SettlementpphlistComponent,
            children: [
                {
                    path: 'settlementpphdetail', /*add*/
                    component: SettlementpphdetailComponent
                },
                {
                    path: 'settlementpphdetail/:id', /*update*/
                    component: SettlementpphdetailComponent
                },
            ],
            canActivate: [AuthGuard]
        },
        {
            path: 'subadditionalinvoicelist',
            component: AdditionalinvoicelistComponent,
            children: [
                {
                    path: 'additionalinvoicedetail', /*add*/
                    component: AdditionalinvoicedetailComponent
                },
                {
                    path: 'additionalinvoicedetail/:id', /*update*/
                    component: AdditionalinvoicedetailComponent
                },
                {
                    path: 'additionalinvoicedetaildetail/:id', /*update*/
                    component: AdditionalinvoicedetaildetailComponent
                },
                {
                    path: 'additionalinvoicedetaildetail/:id/:id2', /*update*/
                    component: AdditionalinvoicedetaildetailComponent
                },
            ],
            canActivate: [AuthGuard]
        },
        {
            path: 'subinvoicelist',
            component: InvoicelistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'invoicedetail', // update
                    component: InvoicedetailComponent,
                },
                {
                    path: 'invoicedetail/:id', // update
                    component: InvoicedetailComponent,

                },
                // {
                //     path: 'agreementinvoicedetaildetail/:id/:id2', // update
                //     component: AgreementinvoicedetaildetailComponent,

                // },
            ]
        },
        {
            path: 'subvatpaymentrequestlist',
            component: VatpaymentrequestlistComponent,
            canActivate: [AuthGuard]
        },
        {
            path: 'subvatpaymentlist',
            component: vatpaymentlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'vatpaymentdetail',
                    component: vatpaymentdetailComponent
                },
                {
                    path: 'vatpaymentdetail/:id',
                    component: vatpaymentdetailComponent
                }
            ]
        },
        /* Faktur Allocation */
        {
            path: 'subfakturallocationlist',
            component: FakturallocationlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'fakturallocationdetail',
                    component: FakturallocationdetailComponent
                },
                {
                    path: 'fakturallocationdetail/:fakturallocationcode',
                    component: FakturallocationdetailComponent
                }
            ]
        },
        /* Faktur Allocation */

        /* Faktur Cancelation */
        {
            path: 'subfakturcancelationlist',
            component: FakturcancelationlistComponent,
            children: [
                {
                    path: 'fakturcancelationdetail', /*add*/
                    component: FakturcancelationdetailComponent
                },
                {
                    path: 'fakturcancelationdetail/:fakturcancelationCode', /*update*/
                    component: FakturcancelationdetailComponent
                },
            ],
            canActivate: [AuthGuard]
        },
        /* Faktur Cancelation */

        /*With holding payment request*/
        {
            path: 'subwithholdingpaymentrequestlist',
            component: WithholdingpaymentrequestlistComponent,
            canActivate: [AuthGuard]
        },
        /*With holding payment request*/

        /*With Holding Payment*/
        {
            path: 'subwihholdingpaymentlist',
            component: WithholdingpaymentlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'withholdingpaymentdetail/:id',
                    component: WithholdingpaymentdetailComponent
                }
            ]
        },
        /*With Holding Payment*/

        /**stop billing */
        {
            path: 'substopbillingagreementlist',
            component: StopbillingagreementlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'stopbillingagreementdetail', // update
                    component: StopbillingagreementdetailComponent,
                },
                {
                    path: 'stopbillingagreementdetail/:id', // update
                    component: StopbillingagreementdetailComponent,

                },
                {
                    path: 'stopbillingagreementassetdetail/:id/:id2', // update
                    component: StopbillingagreementassetdetailComponent,
                    children: [
                        {
                            path: 'stopbillingagreementamortizationlist/:id/:id2',
                            component: StopbillingagreementamortizationlistComponent,
                        }
                    ]
                },
            ]

        },
        /**stop billing */

        /**pending billing */
        {
            path: 'subpendingbillingagreementlist',
            component: PendingbillingagreementlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'Pendingbillingagreementdetail', // update
                    component: PendingbillingagreementdetailComponent,
                },
                {
                    path: 'pendingbillingagreementdetail/:id', // update
                    component: PendingbillingagreementdetailComponent,

                },
                {
                    path: 'pendingbillingagreementassetdetail/:id/:id2', // update
                    component: PendingbillingagreementassetdetailComponent,
                    children: [
                        {
                            path: 'pendingbillingagreementamortizationlist/:id/:id2',
                            component: PendingbillingagreementamortizationlistComponent,
                        }
                    ]
                },
            ]

        },
        /**pending billing */

        /**change billing contract setting */
        {
            path: 'subchangebillingcontractsettinglist',
            component: ChangebillingcontractsettinglistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'changebillingcontractsettingdetail/:id/:id2',
                    component: ChangebillingcontractsettingdetailComponent,
                }
            ]
        },
        /**change billing contract setting */

        /**change additional invoice request */
        {
            path: 'subadditionalinvoicerequestlist',
            component: AdditionalinvoicerequestlistComponent,
            children: [
            ],
            canActivate: [AuthGuard]
        },
        /**change additional invoice request */

        /**change Withholding Settlement Audit */
        {
            path: 'subsettlementpphauditlist',
            component: SettlementpphauditlistComponent,
            children: [
                {
                    path: 'settlementpphauditdetail', // update
                    component: SettlementpphauditdetailComponent,
                },
                {
                    path: 'settlementpphauditdetail/:settlementpphauditcode', // update
                    component: SettlementpphauditdetailComponent,

                },
            ],
            canActivate: [AuthGuard]
        },
        /**change Withholding Settlement Audit */

        /**change Withholding Settlement Audit */
        {
            path: 'substopbillinglist',
            component: StopbillingrequestlistComponent,
            children: [
                {
                    path: 'substopbillingdetail', // update
                    component: StopbillingrequestdetailComponent,
                },
                {
                    path: 'substopbillingdetail/:substopbillingdetailcode', // update
                    component: StopbillingrequestdetailComponent,

                },
            ],
            canActivate: [AuthGuard]
        },
        /**change Withholding Settlement Audit */

        /**object info stop billing */
        {
            path: 'stopbillingapproval/:id',
            component: StopbillingrequestapprovalComponent
        },
        /**object info stop billing */

        /**object info with holding statement audit */
        {
            path: 'settlementpphauditapproval/:id',
            component: SettlementpphauditapprovalComponent
        },
        /**object info with holding statement audit */


        {
            path: 'subinvoicehold',
            component: InvoiceHoldlistComponent,
            canActivate: [AuthGuard]
        },

        {
            path: 'submonitoringlatereturn',
            component: MonitoringlatereturnlistComponent,
            canActivate: [AuthGuard]
        },


        {
            path: 'subfakturnoreplacementlist',
            component: FakturNoReplacementListComponent,
            children: [
                {
                    path: 'fakturnoreplacementdetail', /*add*/
                    component: FakturNoReplacementDetailComponent
                },
                {
                    path: 'fakturnoreplacementdetail/:id', /*update*/
                    component: FakturNoReplacementDetailComponent
                },
            ],
            canActivate: [AuthGuard]
        },
    ]
}];
