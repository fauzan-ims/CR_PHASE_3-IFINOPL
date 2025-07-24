import { NgModule, ErrorHandler } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { DALService } from '../../../DALservice.service';
import { Application } from './application.routing';
import { AuthGuard } from '../../../auth.guard';
import { AuthInterceptor } from '../../../auth-interceptor';
import { SpinnerModule } from '../../spinner-ui/spinner/spinner.module';
import { GlobalErrorHandler } from '../../../GlobalErrorHandler';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';

import { ApplicationmainlistComponent } from './applicationmain/applicationmainlist/applicationmainlist.component';
import { ApplicationmaindetailComponent } from './applicationmain/applicationmaindetail/applicationmaindetail.component';
import { ApplicationTboDocumentlistComponent } from './applicationtbodocument/applicationtbodocumentlist/applicationtbodocumentlist.component';
import { ApplicationtbodocumentdetailComponent } from './applicationtbodocument/applicationtbodocumentdetail/applicationtbodocumentdetail.component';
import { ApplicationAdministrationWizModule } from './applicationmain/applicationmaindetail/administrationwiz/administrationwiz.module';
import { ApplicationSurveyWizModule } from './applicationmain/applicationmaindetail/surveywiz/surveywiz.module';
import { ApplicationLegalWizModule } from './applicationmain/applicationmaindetail/legalwiz/legalwiz.module';
import { ApplicationApprovalWizModule } from './applicationmain/applicationmaindetail/approvalwiz/approvalwiz.module';
// import { ApplicationTboDocumentWizModule } from './applicationtbodocument/applicationtbodocumentdetail/tbodocumentsswiz/tbodocumentsswiz.module';
import { ApplicationPdcRegisterlistComponent } from './applicationpdcregister/applicationpdcregisterlist/applicationpdcregisterlist.component';
import { ApplicationPdcRegisterdetailComponent } from './applicationpdcregister/applicationpdcregisterdetail/applicationpdcregisterdetail.component';
import { PdcRegisterDetailWizModule } from './applicationpdcregister/applicationpdcregisterdetail/pdcregisterdetailwiz/pdcregisterdetailwiz.module';
import { AmortizationPdcWizModule } from './applicationpdcregister/applicationpdcregisterdetail/amortizationpdcwiz/amortizationpdcwiz.module';

// asset
import { AssetlistComponent } from './applicationmain/applicationmaindetail/assetwiz/assetlist/assetlist.component';
import { AssetdetailComponent } from './applicationmain/applicationmaindetail/assetwiz/assetdetail/assetdetail.component';
import { AmortizationlistComponent } from './applicationmain/applicationmaindetail/assetwiz/assetdetail/amortizationlist/amortizationlist.component';
import { ReservationassetlistComponent } from './reservationasset/reservationassetlist/reservationassetlist.component';
import { ReservationassetdetailComponent } from './reservationasset/reservationassetdetail/reservationassetdetail.component';
import { GolivelistComponent } from './golive/golivelist/golivelist.component';
import { GolivedetailComponent } from './golive/golivedetail/golivedetail.component';
import { BudgetapprovallistComponent } from './budgetapproval/budgetapprovallist/budgetapprovallist.component';
import { BudgetapprovaldetailComponent } from './budgetapproval/budgetapprovaldetail/budgetapprovaldetail.component';

//approval
import { ApplicationapprovallistComponent } from './applicationapproval/applicationapprovallist/applicationapprovallist.component';
import { ApplicationapprovaldetailComponent } from './applicationapproval/applicationapprovaldetail/applicationapprovaldetail.component';
import { ApprovalassetlistComponent } from './applicationapproval/applicationapprovaldetail/assetwiz/assetlist/assetlist.component';
import { ApprovalassetdetailComponent } from './applicationapproval/applicationapprovaldetail/assetwiz/assetdetail/assetdetail.component';
import { AssetApprovalamortizationlistComponent } from './applicationapproval/applicationapprovaldetail/assetwiz/assetdetail/amortizationlist/amortizationlist.component';
import { ApprovaladministrationdetailComponent } from './applicationapproval/applicationapprovaldetail/administrationwiz/administrationdetail/administrationdetail.component';
import { ApprovalfeelistComponent } from './applicationapproval/applicationapprovaldetail/administrationwiz/administrationdetail/feewiz/feelist/feelist.component';
import { ApprovalfeedetailComponent } from './applicationapproval/applicationapprovaldetail/administrationwiz/administrationdetail/feewiz/feedetail/feedetail.component';
import { ApprovalchargeslistComponent } from './applicationapproval/applicationapprovaldetail/administrationwiz/administrationdetail/chargeswiz/chargeslist/chargeslist.component';
import { ApprovalchargesdetailComponent } from './applicationapproval/applicationapprovaldetail/administrationwiz/administrationdetail/chargeswiz/chargesdetail/chargesdetail.component';
import { ApprovaldoclistComponent } from './applicationapproval/applicationapprovaldetail/administrationwiz/administrationdetail/documentwiz/doclist/doclist.component';
import { ApprovallegaldetailComponent } from './applicationapproval/applicationapprovaldetail/legalwiz/legaldetail/legaldetail.component';
import { ApprovalguarantorlistComponent } from './applicationapproval/applicationapprovaldetail/legalwiz/legaldetail/guarantorwiz/guarantorlist/guarantorlist.component';
import { ApprovalguarantordetailComponent } from './applicationapproval/applicationapprovaldetail/legalwiz/legaldetail/guarantorwiz/guarantordetail/guarantordetail.component';
import { ApprovalsurveydetailComponent } from './applicationapproval/applicationapprovaldetail/surveywiz/surveydetail/surveydetail.component';
import { ApprovalscoringrequestlistComponent } from './applicationapproval/applicationapprovaldetail/surveywiz/surveydetail/scoringrequestwiz/scoringrequestlist/scoringrequestlist.component';
import { ApprovalscoringrequestdetailComponent } from './applicationapproval/applicationapprovaldetail/surveywiz/surveydetail/scoringrequestwiz/scoringrequestdetail/scoringrequestdetail.component';
import { ApprovalsurveyrequestlistComponent } from './applicationapproval/applicationapprovaldetail/surveywiz/surveydetail/surveyrequestwiz/surveyrequestlist/surveyrequestlist.component';
import { ApprovalsurveyrequestdetailComponent } from './applicationapproval/applicationapprovaldetail/surveywiz/surveydetail/surveyrequestwiz/surveyrequestdetail/surveyrequestdetail.component';
import { ApprovalfinancialrecapitulationlistComponent } from './applicationapproval/applicationapprovaldetail/surveywiz/surveydetail/financialrecapitulationwiz/financialrecapitulationlist/financialrecapitulationlist.component';
import { ApprovalfinancialrecapitulationdetailComponent } from './applicationapproval/applicationapprovaldetail/surveywiz/surveydetail/financialrecapitulationwiz/financialrecapitulationdetail/financialrecapitulationdetail.component';
import { ApprovalfinancialanalysislistComponent } from './applicationapproval/applicationapprovaldetail/surveywiz/surveydetail/financialanalysiswiz/financialanalysislist/financialanalysislist.component';
import { ApprovalfinancialanalysisdetailComponent } from './applicationapproval/applicationapprovaldetail/surveywiz/surveydetail/financialanalysiswiz/financialanalysisdetail/financialanalysisdetail.component';
import { ApprovalincomelistComponent } from './applicationapproval/applicationapprovaldetail/surveywiz/surveydetail/financialanalysiswiz/financialanalysisdetail/incomewiz/incomelist/incomelist.component';
import { ApprovalexpenselistComponent } from './applicationapproval/applicationapprovaldetail/surveywiz/surveydetail/financialanalysiswiz/financialanalysisdetail/expensewiz/expenselist/expenselist.component';
import { ApprovalloglistComponent } from './applicationapproval/applicationapprovaldetail/approvalwiz/approvaldetail/logwiz/loglist/loglist.component';
import { ApprovaldeviationlistComponent } from './applicationapproval/applicationapprovaldetail/approvalwiz/approvaldetail/deviationwiz/deviationlist/deviationlist.component';
import { ApprovaldeviationdetailComponent } from './applicationapproval/applicationapprovaldetail/approvalwiz/approvaldetail/deviationwiz/deviationdetail/deviationdetail.component';
import { ApprovalapprovalcommentlistComponent } from './applicationapproval/applicationapprovaldetail/approvalwiz/approvaldetail/approvalcommentwiz/approvalcommentlist/approvalcommentlist.component';
import { ApprovalrulesresultlistComponent } from './applicationapproval/applicationapprovaldetail/approvalwiz/approvaldetail/rulesresultwiz/rulesresultlist/rulesresultlist.component';
import { ApprovalapprovaldetailComponent } from './applicationapproval/applicationapprovaldetail/approvalwiz/approvaldetail/approvaldetail.component';
import { ApprovalrecomendationlistComponent } from './applicationapproval/applicationapprovaldetail/approvalwiz/approvaldetail/recomendationwiz/recomendationlist/recomendationlist.component';
import { ApprovalcreditprocesslistComponent } from './applicationapproval/applicationapprovaldetail/approvalwiz/approvaldetail/dynamicscreen/approvalcreditprocess/approvalcreditprocesslist.component';
import { ApprovalcreditanalystlistComponent } from './applicationapproval/applicationapprovaldetail/approvalwiz/approvaldetail/dynamicscreen/approvalcreditanalystlist/approvalcreditanalystlist.component';
import { ApprovalfinalchecklistComponent } from './applicationapproval/applicationapprovaldetail/approvalwiz/approvaldetail/dynamicscreen/approvalfinalchecklist/approvalfinalchecklist.component';
import { ApprovalprintingComponent } from './applicationapproval/applicationapprovaldetail/approvalwiz/approvaldetail/dynamicscreen/approvalprinting/approvalprinting.component';
import { ApprovalsignerlistComponent } from './applicationapproval/applicationapprovaldetail/approvalwiz/approvaldetail/dynamicscreen/approvalsigner/approvalsignerlist.component';
import { ApprovalpurchaseorderlistComponent } from './applicationapproval/applicationapprovaldetail/approvalwiz/approvaldetail/dynamicscreen/approvalpurchaseorder/approvalpurchaseorderlist.component';
import { KaroseriaccessorieslistComponent } from './applicationmain/applicationmaindetail/assetwiz/assetdetail/karoseriaccessories/karoseriaccessorieslist/karoseriaccessorieslist.component';
import { MastercontractlistComponent } from './mastercontract/mastercontractlist/mastercontractlist.component';
import { MastercontractdetailComponent } from './mastercontract/mastercontractdetail/mastercontractdetail.component';
import { AssetinsurancedetaildetailComponent } from './applicationmain/applicationmaindetail/assetwiz/assetdetail/assetinsurancedetail/assetinsurancedetaildetail/assetinsurancedetaildetail.component';
import { KaroseriaccessorieslistApvComponent } from './applicationapproval/applicationapprovaldetail/assetwiz/assetdetail/karoseriaccessories/karoseriaccessorieslist/karoseriaccessorieslist.component';
import { AssetinsurancedetaildetailapvComponent } from './applicationapproval/applicationapprovaldetail/assetwiz/assetdetail/assetinsurancedetail/assetinsurancedetaildetail/assetinsurancedetaildetail.component';
import { ObjectInfoApplicationmaindetailComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/applicationmaindetail.component';
import { ObjectInfoAssetlistComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/assetwiz/assetlist/assetlist.component';
import { ObjectInfoAssetdetailComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/assetwiz/assetdetail/assetdetail.component';
import { ObjectInfoAssetAmortizationlistComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/assetwiz/assetdetail/amortizationlist/amortizationlist.component';
import { ObjectInfoKaroseriaccessorieslistinquiryComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/assetwiz/assetdetail/karoseriaccessories/karoseriaccessorieslist/karoseriaccessorieslist.component';
import { ObjectInfoAssetinsurancedetaildetailinquiryComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/assetwiz/assetdetail/assetinsurancedetail/assetinsurancedetaildetail/assetinsurancedetaildetail.component';
import { ObjectInfoAdministrationdetailComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/administrationwiz/administrationdetail/administrationdetail.component';
import { ObjectInfoFeelistComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/administrationwiz/administrationdetail/feewiz/feelist/feelist.component';
import { ObjectInfoFeedetailComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/administrationwiz/administrationdetail/feewiz/feedetail/feedetail.component';
import { ObjectInfoChargeslistComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/administrationwiz/administrationdetail/chargeswiz/chargeslist/chargeslist.component';
import { ObjectInfoChargesdetailComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/administrationwiz/administrationdetail/chargeswiz/chargesdetail/chargesdetail.component';
import { ObjectInfoDoclistComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/administrationwiz/administrationdetail/documentwiz/doclist/doclist.component';
import { ObjectInfoLegaldetailComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/legalwiz/legaldetail/legaldetail.component';
import { ObjectInfoGuarantorlistComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/legalwiz/legaldetail/guarantorwiz/guarantorlist/guarantorlist.component';
import { ObjectInfoGuarantordetailComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/legalwiz/legaldetail/guarantorwiz/guarantordetail/guarantordetail.component';
import { ObjectInfoNotarylistComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/legalwiz/legaldetail/notarywiz/notarylist/notarylist.component';
import { ObjectInfoNotarydetailComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/legalwiz/legaldetail/notarywiz/notarydetail/notarydetail.component';
import { ObjectInfoSurveydetailComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/surveywiz/surveydetail/surveydetail.component';
import { ObjectInfoScoringrequestlistComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/surveywiz/surveydetail/scoringrequestwiz/scoringrequestlist/scoringrequestlist.component';
import { ObjectInfoScoringrequestdetailComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/surveywiz/surveydetail/scoringrequestwiz/scoringrequestdetail/scoringrequestdetail.component';
import { ObjectInfoSurveyrequestdetailComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/surveywiz/surveydetail/surveyrequestwiz/surveyrequestdetail/surveyrequestdetail.component';
import { ObjectInfoFinancialrecapitulationlistComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/surveywiz/surveydetail/financialrecapitulationwiz/financialrecapitulationlist/financialrecapitulationlist.component';
import { ObjectInfoFinancialrecapitulationdetailComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/surveywiz/surveydetail/financialrecapitulationwiz/financialrecapitulationdetail/financialrecapitulationdetail.component';
import { ObjectInfoFinancialanalysislistComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/surveywiz/surveydetail/financialanalysiswiz/financialanalysislist/financialanalysislist.component';
import { ObjectInfoFinancialanalysisdetailComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/surveywiz/surveydetail/financialanalysiswiz/financialanalysisdetail/financialanalysisdetail.component';
import { ObjectInfoIncomelistComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/surveywiz/surveydetail/financialanalysiswiz/financialanalysisdetail/incomewiz/incomelist/incomelist.component';
import { ObjectInfoExpenselistComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/surveywiz/surveydetail/financialanalysiswiz/financialanalysisdetail/expensewiz/expenselist/expenselist.component';
import { ObjectInfoApprovaldetailComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/approvalwiz/approvaldetail/approvaldetail.component';
import { ObjectInfoAssetLoglistComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/approvalwiz/approvaldetail/logwiz/loglist/loglist.component';
import { ObjectInfoDeviationlistComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/approvalwiz/approvaldetail/deviationwiz/deviationlist/deviationlist.component';
import { ObjectInfoDeviationdetailComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/approvalwiz/approvaldetail/deviationwiz/deviationdetail/deviationdetail.component';
import { ObjectInfoApprovalcommentlistComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/approvalwiz/approvaldetail/approvalcommentwiz/approvalcommentlist/approvalcommentlist.component';
import { ObjectInfoRulesresultlistComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/approvalwiz/approvaldetail/rulesresultwiz/rulesresultlist/rulesresultlist.component';
import { ObjectInfoRecomendationlistComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/approvalwiz/approvaldetail/recomendationwiz/recomendationlist/recomendationlist.component';
import { ObjectInfoApprovalcreditprocesslistComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/approvalwiz/approvaldetail/dynamicscreen/approvalcreditprocess/approvalcreditprocesslist.component';
import { ObjectInfoApprovalcreditanalystlistComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/approvalwiz/approvaldetail/dynamicscreen/approvalcreditanalystlist/approvalcreditanalystlist.component';
import { ObjectInfoApprovalfinalchecklistComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/approvalwiz/approvaldetail/dynamicscreen/approvalfinalchecklist/approvalfinalchecklist.component';
import { ObjectInfoApprovalprintingComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/approvalwiz/approvaldetail/dynamicscreen/approvalprinting/approvalprinting.component';
import { ObjectInfoApprovalsignerlistComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/approvalwiz/approvaldetail/dynamicscreen/approvalsigner/approvalsignerlist.component';
import { ObjectInfoApprovalpurchaseorderlistComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/approvalwiz/approvaldetail/dynamicscreen/approvalpurchaseorder/approvalpurchaseorderlist.component';
import { ObjectInfoSurveyrequestlistComponent } from './objectinfo/objectinfoapplicationmain/applicationmain/applicationmaindetail/surveywiz/surveydetail/surveyrequestwiz/surveyrequestlist/surveyrequestlist.component';
import { MasterContractChargeslistComponent } from './mastercontract/mastercontractdetail/chargeswiz/chargeslist/chargeslist.component';
import { MasterContractChargesdetailComponent } from './mastercontract/mastercontractdetail/chargeswiz/chargesdetail/chargesdetail.component';
import { tclistComponent } from './mastercontract/mastercontractdetail/tc/tclist/tclist.component';
import { TboDoclistComponent } from './applicationtbodocument/applicationtbodocumentdetail/tbodocumentsswiz/doclistdetail/doclist.component';


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(Application),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule,

        ApplicationAdministrationWizModule,
        ApplicationSurveyWizModule,
        ApplicationLegalWizModule,
        ApplicationApprovalWizModule,
        // ApplicationTboDocumentWizModule,
        PdcRegisterDetailWizModule,
        AmortizationPdcWizModule,
    ],
    declarations: [
        ApplicationmainlistComponent,
        ApplicationmaindetailComponent,
        MastercontractlistComponent,
        MastercontractdetailComponent,
        ApplicationPdcRegisterlistComponent,
        ApplicationPdcRegisterdetailComponent,
        AssetlistComponent,
        AssetdetailComponent,
        AmortizationlistComponent,
        ReservationassetlistComponent,
        ReservationassetdetailComponent,
        GolivelistComponent,
        GolivedetailComponent,
        BudgetapprovallistComponent,
        BudgetapprovaldetailComponent,
        ApplicationTboDocumentlistComponent,
        ApplicationtbodocumentdetailComponent,
        TboDoclistComponent,


        ApplicationapprovallistComponent,
        ApplicationapprovaldetailComponent,
        ApprovalassetlistComponent,
        ApprovalassetdetailComponent,
        AssetApprovalamortizationlistComponent,
        ApprovaladministrationdetailComponent,
        ApprovalfeelistComponent,
        ApprovalfeedetailComponent,
        ApprovalchargeslistComponent,
        ApprovalchargesdetailComponent,
        ApprovaldoclistComponent,
        ApprovallegaldetailComponent,
        ApprovalguarantorlistComponent,
        ApprovalguarantordetailComponent,
        ApprovalsurveydetailComponent,
        ApprovalscoringrequestlistComponent,
        ApprovalscoringrequestdetailComponent,
        ApprovalsurveyrequestlistComponent,
        ApprovalsurveyrequestdetailComponent,
        ApprovalfinancialrecapitulationlistComponent,
        ApprovalfinancialrecapitulationdetailComponent,
        ApprovalfinancialanalysislistComponent,
        ApprovalfinancialanalysisdetailComponent,
        ApprovalincomelistComponent,
        ApprovalexpenselistComponent,
        ApprovalapprovaldetailComponent,
        ApprovalloglistComponent,
        ApprovaldeviationlistComponent,
        ApprovaldeviationdetailComponent,
        ApprovalapprovalcommentlistComponent,
        ApprovalrulesresultlistComponent,
        ApprovalrecomendationlistComponent,
        ApprovalcreditprocesslistComponent,
        ApprovalcreditanalystlistComponent,
        ApprovalfinalchecklistComponent,
        ApprovalprintingComponent,
        ApprovalsignerlistComponent,
        ApprovalpurchaseorderlistComponent,
        ObjectInfoApplicationmaindetailComponent,
        KaroseriaccessorieslistComponent,
        AssetinsurancedetaildetailComponent,
        KaroseriaccessorieslistApvComponent,
        AssetinsurancedetaildetailapvComponent,
        ObjectInfoApplicationmaindetailComponent,
        ObjectInfoAssetlistComponent,
        ObjectInfoAssetdetailComponent,
        ObjectInfoAssetAmortizationlistComponent,
        ObjectInfoKaroseriaccessorieslistinquiryComponent,
        ObjectInfoAssetinsurancedetaildetailinquiryComponent,
        ObjectInfoAdministrationdetailComponent,
        ObjectInfoFeelistComponent,
        ObjectInfoFeedetailComponent,
        ObjectInfoChargeslistComponent,
        ObjectInfoChargesdetailComponent,
        ObjectInfoDoclistComponent,
        ObjectInfoLegaldetailComponent,
        ObjectInfoGuarantorlistComponent,
        ObjectInfoGuarantordetailComponent,
        ObjectInfoNotarylistComponent,
        ObjectInfoNotarydetailComponent,
        ObjectInfoSurveydetailComponent,
        ObjectInfoScoringrequestlistComponent,
        ObjectInfoScoringrequestdetailComponent,
        ObjectInfoSurveyrequestdetailComponent,
        ObjectInfoFinancialrecapitulationlistComponent,
        ObjectInfoFinancialrecapitulationdetailComponent,
        ObjectInfoFinancialanalysislistComponent,
        ObjectInfoFinancialanalysisdetailComponent,
        ObjectInfoSurveyrequestlistComponent,
        ObjectInfoIncomelistComponent,
        ObjectInfoExpenselistComponent,
        ObjectInfoApprovaldetailComponent,
        ObjectInfoAssetLoglistComponent,
        ObjectInfoDeviationlistComponent,
        ObjectInfoDeviationdetailComponent,
        ObjectInfoApprovalcommentlistComponent,
        ObjectInfoRulesresultlistComponent,
        ObjectInfoRecomendationlistComponent,
        ObjectInfoApprovalcreditprocesslistComponent,
        ObjectInfoApprovalcreditanalystlistComponent,
        ObjectInfoApprovalfinalchecklistComponent,
        ObjectInfoApprovalprintingComponent,
        ObjectInfoApprovalsignerlistComponent,
        ObjectInfoApprovalpurchaseorderlistComponent,
        MasterContractChargeslistComponent,
        MasterContractChargesdetailComponent,
        tclistComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        AuthGuard,
        DALService,
        { provide: ErrorHandler, useClass: GlobalErrorHandler } // apabila error chunk sehabis publish
    ]
})

export class SettingModule { }
