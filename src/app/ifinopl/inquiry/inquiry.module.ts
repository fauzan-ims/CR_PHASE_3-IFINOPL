import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { Inquiry } from './inquiry.routing';
import { DALService } from '../../../DALservice.service';
import { AuthInterceptor } from '../../../auth-interceptor';
import { AuthGuard } from '../../../auth.guard';
import { SpinnerModule } from '../../spinner-ui/spinner/spinner.module';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { AgreementlistComponent } from './agreement/agreementlist/agreementlist.component';
import { AgreementdetailComponent } from './agreement/agreementdetail/agreementdetail.component';
import { AssetvehicledetailComponent } from './agreement/agreementdetail/agreementassetwiz/agreementassetdetail/assetinfo/assetvehiclewiz/vehicledetail/assetvehicledetail.component';
import { AssetmachinedetailComponent } from './agreement/agreementdetail/agreementassetwiz/agreementassetdetail/assetinfo/assetmachinewiz/machinedetail/assetmachinedetail.component';
import { AssetheavyequipmentdetailComponent } from './agreement/agreementdetail/agreementassetwiz/agreementassetdetail/assetinfo/assetheavyequipmentwiz/heavyequipmentdetail/assetheavyequipmentdetail.component';
import { AssetelectronicdetailComponent } from './agreement/agreementdetail/agreementassetwiz/agreementassetdetail/assetinfo/assetelectronicwiz/electronicdetail/assetelectronicdetail.component';
import { AgreementinvoicelistComponent } from './agreementinvoice/agreementinvoicelist/agreementinvoicelist.component';
import { AgreementinvoicedetailComponent } from './agreementinvoice/agreementinvoicedetail/agreementinvoicedetail.component';
import { AgreementinvoicedetaildetailComponent } from './agreementinvoice/agreementinvoicedetail/agreementinvoicedetaildetail/agreementinvoicedetaildetail.component';
import { AgreementassetdetailComponent } from './agreement/agreementdetail/agreementassetwiz/agreementassetdetail/agreementassetdetail.component';
import { AmortizationlistComponent } from './agreement/agreementdetail/agreementassetwiz/agreementassetdetail/amortizationwiz/amortizationlist/amortizationlist.component';
import { AgreementassetreplacementlistComponent } from './agreement/agreementdetail/agreementassetwiz/agreementassetdetail/agreementassetreplacementwiz/agreementassetreplacementlist/agreementassetreplacementlist.component';
import { ApplicationmainlistComponent } from './applicationmain/applicationmainlist/applicationmainlist.component';
import { ApplicationmaindetailComponent } from './applicationmain/applicationmaindetail/applicationmaindetail.component';
import { AssetlistComponent } from './applicationmain/applicationmaindetail/assetwiz/assetlist/assetlist.component';
import { AssetdetailComponent } from './applicationmain/applicationmaindetail/assetwiz/assetdetail/assetdetail.component';
import { AssetAmortizationlistComponent } from './applicationmain/applicationmaindetail/assetwiz/assetdetail/amortizationlist/amortizationlist.component';
import { AdministrationdetailComponent } from './applicationmain/applicationmaindetail/administrationwiz/administrationdetail/administrationdetail.component';
import { FeelistComponent } from './applicationmain/applicationmaindetail/administrationwiz/administrationdetail/feewiz/feelist/feelist.component';
import { FeedetailComponent } from './applicationmain/applicationmaindetail/administrationwiz/administrationdetail/feewiz/feedetail/feedetail.component';
import { ChargeslistComponent } from './applicationmain/applicationmaindetail/administrationwiz/administrationdetail/chargeswiz/chargeslist/chargeslist.component';
import { ChargesdetailComponent } from './applicationmain/applicationmaindetail/administrationwiz/administrationdetail/chargeswiz/chargesdetail/chargesdetail.component';
import { DoclistComponent } from './applicationmain/applicationmaindetail/administrationwiz/administrationdetail/documentwiz/doclist/doclist.component';
import { LegaldetailComponent } from './applicationmain/applicationmaindetail/legalwiz/legaldetail/legaldetail.component';
import { GuarantorlistComponent } from './applicationmain/applicationmaindetail/legalwiz/legaldetail/guarantorwiz/guarantorlist/guarantorlist.component';
import { GuarantordetailComponent } from './applicationmain/applicationmaindetail/legalwiz/legaldetail/guarantorwiz/guarantordetail/guarantordetail.component';
import { NotarylistComponent } from './applicationmain/applicationmaindetail/legalwiz/legaldetail/notarywiz/notarylist/notarylist.component';
import { NotarydetailComponent } from './applicationmain/applicationmaindetail/legalwiz/legaldetail/notarywiz/notarydetail/notarydetail.component';
import { SurveydetailComponent } from './applicationmain/applicationmaindetail/surveywiz/surveydetail/surveydetail.component';
import { ScoringrequestlistComponent } from './applicationmain/applicationmaindetail/surveywiz/surveydetail/scoringrequestwiz/scoringrequestlist/scoringrequestlist.component';
import { ScoringrequestdetailComponent } from './applicationmain/applicationmaindetail/surveywiz/surveydetail/scoringrequestwiz/scoringrequestdetail/scoringrequestdetail.component';
import { SurveyrequestlistComponent } from './applicationmain/applicationmaindetail/surveywiz/surveydetail/surveyrequestwiz/surveyrequestlist/surveyrequestlist.component';
import { SurveyrequestdetailComponent } from './applicationmain/applicationmaindetail/surveywiz/surveydetail/surveyrequestwiz/surveyrequestdetail/surveyrequestdetail.component';
import { FinancialrecapitulationlistComponent } from './applicationmain/applicationmaindetail/surveywiz/surveydetail/financialrecapitulationwiz/financialrecapitulationlist/financialrecapitulationlist.component';
import { FinancialrecapitulationdetailComponent } from './applicationmain/applicationmaindetail/surveywiz/surveydetail/financialrecapitulationwiz/financialrecapitulationdetail/financialrecapitulationdetail.component';
import { FinancialanalysislistComponent } from './applicationmain/applicationmaindetail/surveywiz/surveydetail/financialanalysiswiz/financialanalysislist/financialanalysislist.component';
import { FinancialanalysisdetailComponent } from './applicationmain/applicationmaindetail/surveywiz/surveydetail/financialanalysiswiz/financialanalysisdetail/financialanalysisdetail.component';
import { IncomelistComponent } from './applicationmain/applicationmaindetail/surveywiz/surveydetail/financialanalysiswiz/financialanalysisdetail/incomewiz/incomelist/incomelist.component';
import { ExpenselistComponent } from './applicationmain/applicationmaindetail/surveywiz/surveydetail/financialanalysiswiz/financialanalysisdetail/expensewiz/expenselist/expenselist.component';
import { ApprovaldetailComponent } from './applicationmain/applicationmaindetail/approvalwiz/approvaldetail/approvaldetail.component';
import { AssetLoglistComponent } from './applicationmain/applicationmaindetail/approvalwiz/approvaldetail/logwiz/loglist/loglist.component';
import { DeviationlistComponent } from './applicationmain/applicationmaindetail/approvalwiz/approvaldetail/deviationwiz/deviationlist/deviationlist.component';
import { DeviationdetailComponent } from './applicationmain/applicationmaindetail/approvalwiz/approvaldetail/deviationwiz/deviationdetail/deviationdetail.component';
import { ApprovalcommentlistComponent } from './applicationmain/applicationmaindetail/approvalwiz/approvaldetail/approvalcommentwiz/approvalcommentlist/approvalcommentlist.component';
import { RulesresultlistComponent } from './applicationmain/applicationmaindetail/approvalwiz/approvaldetail/rulesresultwiz/rulesresultlist/rulesresultlist.component';
import { RecomendationlistComponent } from './applicationmain/applicationmaindetail/approvalwiz/approvaldetail/recomendationwiz/recomendationlist/recomendationlist.component';
import { ApprovalcreditprocesslistComponent } from './applicationmain/applicationmaindetail/approvalwiz/approvaldetail/dynamicscreen/approvalcreditprocess/approvalcreditprocesslist.component';
import { ApprovalcreditanalystlistComponent } from './applicationmain/applicationmaindetail/approvalwiz/approvaldetail/dynamicscreen/approvalcreditanalystlist/approvalcreditanalystlist.component';
import { ApprovalfinalchecklistComponent } from './applicationmain/applicationmaindetail/approvalwiz/approvaldetail/dynamicscreen/approvalfinalchecklist/approvalfinalchecklist.component';
import { ApprovalprintingComponent } from './applicationmain/applicationmaindetail/approvalwiz/approvaldetail/dynamicscreen/approvalprinting/approvalprinting.component';
import { ApprovalsignerlistComponent } from './applicationmain/applicationmaindetail/approvalwiz/approvaldetail/dynamicscreen/approvalsigner/approvalsignerlist.component';
import { ApprovalpurchaseorderlistComponent } from './applicationmain/applicationmaindetail/approvalwiz/approvaldetail/dynamicscreen/approvalpurchaseorder/approvalpurchaseorderlist.component';
import { AgreementobligationlistComponent } from './agreement/agreementdetail/agreementassetwiz/agreementassetdetail/agreementobligationwiz/agreementobligationlist/agreementobligationlist.component';
import { AgreementobligationdetailComponent } from './agreement/agreementdetail/agreementassetwiz/agreementassetdetail/agreementobligationwiz/agreementobligationdetail/agreementobligationdetail.component';
import { AmortizedeferredincomelistComponent } from './amortizedeferredincome/amortizedeferredincomelist/amortizedeferredincomelist.component';
import { AmortizedeferredincomedetailComponent } from './amortizedeferredincome/amortizedeferredincomedetail/amortizedeferredincomedetail.component';
import { AmortizedeferredincomedetaildetailComponent } from './amortizedeferredincome/amortizedeferredincomedetail/amortizedeferredincomedetaildetail/amortizedeferredincomedetaildetail.component';
import { AgreementassetlistComponent } from './agreement/agreementdetail/agreementassetwiz/agreementassetlist/agreementassetlist.component';
import { DepositlistComponent } from './agreement/agreementdetail/depositwiz/depositlist/depositlist.component';
import { DepositdetailComponent } from './agreement/agreementdetail/depositwiz/depositdetail/depositdetail.component';
import { WriteOfflistComponent } from './agreement/agreementdetail/agreementwriteoffwiz/agreementwriteofflist/writeofflist.component';
import { WriteOfflistwizComponent } from './agreement/agreementdetail/agreementassetwiz/agreementassetdetail/agreementwriteoffwiz/agreementwriteofflist/writeofflist.component';
import { DepositdetailwizComponent } from './agreement/agreementdetail/agreementassetwiz/agreementassetdetail/depositwiz/depositdetail/depositdetail.component';
import { DepositlistwizComponent } from './agreement/agreementdetail/agreementassetwiz/agreementassetdetail/depositwiz/depositlist/depositlist.component';
import { KaroseriaccessorieslistinquiryComponent } from './applicationmain/applicationmaindetail/assetwiz/assetdetail/karoseriaccessories/karoseriaccessorieslist/karoseriaccessorieslist.component';
import { AssetinsurancedetaildetailinquiryComponent } from './applicationmain/applicationmaindetail/assetwiz/assetdetail/assetinsurancedetail/assetinsurancedetaildetail/assetinsurancedetaildetail.component';
import { InvoicelistwizComponent } from './agreement/agreementdetail/invoicewiz/invoicelist/invoicelistwiz.component';
import { InquiryDeskcolltasklistComponent } from './inquirydeskcolltask/inquirydeskcolltasklist/inquirydeskcolltasklist.component';
import { InquiryDeskcolltaskmainlistComponent } from './inquirydeskcolltask/inquirydeskcolltasklist/inquirydeskcolltaskmainwiz/deskcolltaskmainlist/inquirydeskcolltaskmainlist.component';
import { InquiryDeskcolltasktpastduelistComponent } from './inquirydeskcolltask/inquirydeskcolltasklist/inquirydeskcolltaskpastduewiz/deskcolltaskpastduelist/inquirydeskcolltasktpastduelist.component';
import { InquiryDeskColltaskdetailComponent } from './inquirydeskcolltask/inquirydeskcolldetail/inquirydeskcolldetail.component';
import { InquiryAgreementloglistComponent } from './inquirydeskcolltask/inquirydeskcolldetail/inquiryagreementlogwiz/inquiryagreementloglist/inquiryagreementloglist.component';
import { InquiryAmortizationlistComponent } from './inquirydeskcolltask/inquirydeskcolldetail/inquiryamortizationwiz/inquiryamortizationlist/inquiryamortizationlist.component';
import { InquiryAmortizationdetailComponent } from './inquirydeskcolltask/inquirydeskcolldetail/inquiryamortizationwiz/inquiryamortizationdetail/inquiryamortizationdetail.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(Inquiry),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule
    ],
    declarations: [
        AgreementlistComponent,
        AgreementdetailComponent,
        AssetvehicledetailComponent,
        AssetmachinedetailComponent,
        AssetheavyequipmentdetailComponent,
        AssetelectronicdetailComponent,
        AgreementinvoicelistComponent,
        AgreementinvoicedetailComponent,
        AgreementinvoicedetaildetailComponent,
        AgreementassetdetailComponent,
        AmortizationlistComponent,
        AgreementassetreplacementlistComponent,
        ApplicationmainlistComponent,
        ApplicationmaindetailComponent,
        AssetlistComponent,
        AssetdetailComponent,
        AssetAmortizationlistComponent,
        AdministrationdetailComponent,
        FeelistComponent,
        FeedetailComponent,
        ChargeslistComponent,
        ChargesdetailComponent,
        DoclistComponent,
        LegaldetailComponent,
        GuarantorlistComponent,
        GuarantordetailComponent,
        NotarylistComponent,
        NotarydetailComponent,
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
        ExpenselistComponent,
        ApprovaldetailComponent,
        AssetLoglistComponent,
        DeviationlistComponent,
        DeviationdetailComponent,
        ApprovalcommentlistComponent,
        RulesresultlistComponent,
        RecomendationlistComponent,
        ApprovalcreditprocesslistComponent,
        ApprovalcreditanalystlistComponent,
        ApprovalfinalchecklistComponent,
        ApprovalprintingComponent,
        ApprovalsignerlistComponent,
        ApprovalpurchaseorderlistComponent,
        AgreementobligationlistComponent,
        AgreementobligationdetailComponent,
        WriteOfflistComponent,
        DepositlistComponent,
        DepositdetailComponent,
        AmortizedeferredincomelistComponent,
        AmortizedeferredincomedetailComponent,
        AmortizedeferredincomedetaildetailComponent,
        AgreementassetlistComponent,
        WriteOfflistwizComponent,
        DepositlistwizComponent,
        DepositdetailwizComponent,
        KaroseriaccessorieslistinquiryComponent,
        AssetinsurancedetaildetailinquiryComponent,
        InvoicelistwizComponent,
        InquiryDeskcolltasklistComponent,
        InquiryDeskcolltaskmainlistComponent,
        InquiryDeskcolltasktpastduelistComponent,
        InquiryDeskColltaskdetailComponent,
        InquiryAgreementloglistComponent,
        InquiryAmortizationlistComponent,
        InquiryAmortizationdetailComponent
    ],
    providers: [
        DALService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // back to login if 401
        , AuthGuard // penjagaan apabila dari login langsung masuk ke dashboard atau ke halaman lain
    ]
})

export class InquiryModule { }
