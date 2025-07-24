import { NgModule, ErrorHandler } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { DALService } from '../../../DALservice.service';
import { Client } from './billing.routing';
import { SpinnerModule } from '../../spinner-ui/spinner/spinner.module';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { AuthGuard } from '../../../auth.guard';
import { AuthInterceptor } from '../../../auth-interceptor';
import { FakturregistrationlistComponent } from './fakturregistration/fakturregistrationlist/fakturregistrationlist.component';
import { FakturregistrationdetailComponent } from './fakturregistration/fakturregistrationdetail/fakturregistrationdetail.component';
import { FakturlistComponent } from './fakturlist/fakturlist.component';
import { BillingschemelistComponent } from './billingscheme/billingschemelist/billingschemelist.component';
import { BillingschemedetailComponent } from './billingscheme/billingschemedetail/billingschemedetail.component';
import { GenerateinvoicelistComponent } from './generateinvoice/generateinvoicelist/generateinvoicelist.component';
import { GenerateinvoicedetailComponent } from './generateinvoice/generateinvoicedetail/generateinvoicedetail.component';
import { SettlementpphlistComponent } from './settlementpph/settlementpphlist/settlementpphlist.component';
import { SettlementpphdetailComponent } from './settlementpph/settlementpphdetail/settlementpphdetail.component';
import { AdditionalinvoicelistComponent } from './additionalinvoice/additionalinvoicelist/additionalinvoicelist.component';
import { AdditionalinvoicedetailComponent } from './additionalinvoice/additionalinvoicedetail/additionalinvoicedetail.component';
import { AdditionalinvoicedetaildetailComponent } from './additionalinvoice/additionalinvoicedetail/additionalinvoicedetaildetail/additionalinvoicedetaildetail.component';
import { InvoicelistComponent } from './invoice/invoicelist/invoicelist.component';
import { InvoicedetailComponent } from './invoice/invoicedetail/invoicedetail.component';
import { InvoiceDeliverylistComponent } from './invoicedelivery/invoicedeliverylist/invoicedeliverylist.component';
import { InvoiceDeliverydetailComponent } from './invoicedelivery/invoicedeliverydetail/invoicedeliverydetail.component';
import { InvoiceDeliveryDetaildetailComponent } from './invoicedelivery/invoicedeliverydetail/invoicedeliverydetaildetail/invoicedeliverydetaildetail.component';
import { CreditNotelistComponent } from './creditnote/creditnotelist/creditnotelist.component';
import { CreditNotedetailComponent } from './creditnote/creditnotedetail/creditnotedetail.componetn';
import { DeliveryRequestlistComponent } from './deliveryrequest/deliveryrequestlist/deliveryrequestlist.component';
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

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(Client),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule,
    ],
    declarations: [
        FakturregistrationlistComponent,
        FakturregistrationdetailComponent,
        FakturlistComponent,
        BillingschemelistComponent,
        BillingschemedetailComponent,
        InvoiceDeliverylistComponent,
        InvoiceDeliverydetailComponent,
        InvoiceDeliveryDetaildetailComponent,
        GenerateinvoicelistComponent,
        GenerateinvoicedetailComponent,
        SettlementpphlistComponent,
        CreditNotelistComponent,
        CreditNotedetailComponent,
        SettlementpphdetailComponent,
        AdditionalinvoicelistComponent,
        DeliveryRequestlistComponent,
        AdditionalinvoicedetailComponent,
        AdditionalinvoicedetaildetailComponent,
        InvoicelistComponent,
        InvoicedetailComponent,
        VatpaymentrequestlistComponent,
        vatpaymentlistComponent,
        vatpaymentdetailComponent,
        FakturallocationlistComponent,
        FakturallocationdetailComponent,
        FakturcancelationlistComponent,
        FakturcancelationdetailComponent,
        WithholdingpaymentrequestlistComponent,
        WithholdingpaymentlistComponent,
        WithholdingpaymentdetailComponent,
        StopbillingagreementlistComponent,
        StopbillingagreementdetailComponent,
        StopbillingagreementassetdetailComponent,
        StopbillingagreementamortizationlistComponent,
        PendingbillingagreementlistComponent,
        PendingbillingagreementdetailComponent,
        PendingbillingagreementassetdetailComponent,
        PendingbillingagreementamortizationlistComponent,
        ChangebillingcontractsettinglistComponent,
        ChangebillingcontractsettingdetailComponent,
        AdditionalinvoicerequestlistComponent,
        SettlementpphauditlistComponent,
        SettlementpphauditdetailComponent,
        StopbillingrequestlistComponent,
        StopbillingrequestdetailComponent,
        StopbillingrequestapprovalComponent,
        SettlementpphauditapprovalComponent,
        FakturNoReplacementListComponent,
        FakturNoReplacementDetailComponent,
        InvoiceHoldlistComponent,
        MonitoringlatereturnlistComponent
    ],
    providers: [
        DALService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // back to login if 401
        , AuthGuard // penjagaan apabila dari login langsung masuk ke dashboard atau ke halaman lain
    ]
})

export class SettingModule { }
