import { Routes } from '@angular/router';
import { ApplicationmainlistComponent } from './applicationmain/applicationmainlist/applicationmainlist.component';
import { ApplicationmaindetailComponent } from './applicationmain/applicationmaindetail/applicationmaindetail.component';
import { ApplicationTboDocumentlistComponent } from './applicationtbodocument/applicationtbodocumentlist/applicationtbodocumentlist.component';
import { ApplicationtbodocumentdetailComponent } from './applicationtbodocument/applicationtbodocumentdetail/applicationtbodocumentdetail.component';
import { TboDoclistComponent } from './applicationtbodocument/applicationtbodocumentdetail/tbodocumentsswiz/doclistdetail/doclist.component';
import { AuthGuard } from '../../../auth.guard';
import { SurveydetailComponent } from './applicationmain/applicationmaindetail/surveywiz/surveydetail/surveydetail.component';
import { ScoringrequestlistComponent } from './applicationmain/applicationmaindetail/surveywiz/surveydetail/scoringrequestwiz/scoringrequestlist/scoringrequestlist.component';
import { ScoringrequestdetailComponent } from './applicationmain/applicationmaindetail/surveywiz/surveydetail/scoringrequestwiz/scoringrequestdetail/scoringrequestdetail.component';
import { SurveyrequestlistComponent } from './applicationmain/applicationmaindetail/surveywiz/surveydetail/surveyrequestwiz/surveyrequestlist/surveyrequestlist.component';
import { SurveyrequestdetailComponent } from './applicationmain/applicationmaindetail/surveywiz/surveydetail/surveyrequestwiz/surveyrequestdetail/surveyrequestdetail.component';
import { AdministrationdetailComponent } from './applicationmain/applicationmaindetail/administrationwiz/administrationdetail/administrationdetail.component';
import { FeelistComponent } from './applicationmain/applicationmaindetail/administrationwiz/administrationdetail/feewiz/feelist/feelist.component';
import { FeedetailComponent } from './applicationmain/applicationmaindetail/administrationwiz/administrationdetail/feewiz/feedetail/feedetail.component';
import { ChargeslistComponent } from './applicationmain/applicationmaindetail/administrationwiz/administrationdetail/chargeswiz/chargeslist/chargeslist.component';
import { ChargesdetailComponent } from './applicationmain/applicationmaindetail/administrationwiz/administrationdetail/chargeswiz/chargesdetail/chargesdetail.component';
import { LegaldetailComponent } from './applicationmain/applicationmaindetail/legalwiz/legaldetail/legaldetail.component';
import { GuarantorlistComponent } from './applicationmain/applicationmaindetail/legalwiz/legaldetail/guarantorwiz/guarantorlist/guarantorlist.component';
import { GuarantordetailComponent } from './applicationmain/applicationmaindetail/legalwiz/legaldetail/guarantorwiz/guarantordetail/guarantordetail.component';
import { NotarylistComponent } from './applicationmain/applicationmaindetail/legalwiz/legaldetail/notarywiz/notarylist/notarylist.component';
import { NotarydetailComponent } from './applicationmain/applicationmaindetail/legalwiz/legaldetail/notarywiz/notarydetail/notarydetail.component';
import { ApprovaldetailComponent } from './applicationmain/applicationmaindetail/approvalwiz/approvaldetail/approvaldetail.component';
import { DeviationlistComponent } from './applicationmain/applicationmaindetail/approvalwiz/approvaldetail/deviationwiz/deviationlist/deviationlist.component';
import { DeviationdetailComponent } from './applicationmain/applicationmaindetail/approvalwiz/approvaldetail/deviationwiz/deviationdetail/deviationdetail.component';
import { ApprovalcommentlistComponent } from './applicationmain/applicationmaindetail/approvalwiz/approvaldetail/approvalcommentwiz/approvalcommentlist/approvalcommentlist.component';
import { RulesresultlistComponent } from './applicationmain/applicationmaindetail/approvalwiz/approvaldetail/rulesresultwiz/rulesresultlist/rulesresultlist.component';
import { RecomendationlistComponent } from './applicationmain/applicationmaindetail/approvalwiz/approvaldetail/recomendationwiz/recomendationlist/recomendationlist.component';
import { LoglistComponent } from './applicationmain/applicationmaindetail/approvalwiz/approvaldetail/logwiz/loglist/loglist.component';
import { ApplicationPdcRegisterdetailComponent } from './applicationpdcregister/applicationpdcregisterdetail/applicationpdcregisterdetail.component';
import { PdcregisterdetaillistComponent } from './applicationpdcregister/applicationpdcregisterdetail/pdcregisterdetailwiz/pdcregisterdetaillist/pdcregisterdetaillist.component';
import { AmortizationPdclistComponent } from './applicationpdcregister/applicationpdcregisterdetail/amortizationpdcwiz/amortizationpdclist/amortizationpdclist.component';
import { AssetlistComponent } from './applicationmain/applicationmaindetail/assetwiz/assetlist/assetlist.component';
import { AssetdetailComponent } from './applicationmain/applicationmaindetail/assetwiz/assetdetail/assetdetail.component';
import { FinancialanalysislistComponent } from './applicationmain/applicationmaindetail/surveywiz/surveydetail/financialanalysiswiz/financialanalysislist/financialanalysislist.component';
import { FinancialanalysisdetailComponent } from './applicationmain/applicationmaindetail/surveywiz/surveydetail/financialanalysiswiz/financialanalysisdetail/financialanalysisdetail.component';
import { IncomelistComponent } from './applicationmain/applicationmaindetail/surveywiz/surveydetail/financialanalysiswiz/financialanalysisdetail/incomewiz/incomelist/incomelist.component';
import { ExpenselistComponent } from './applicationmain/applicationmaindetail/surveywiz/surveydetail/financialanalysiswiz/financialanalysisdetail/expensewiz/expenselist/expenselist.component';
import { FinancialrecapitulationlistComponent } from './applicationmain/applicationmaindetail/surveywiz/surveydetail/financialrecapitulationwiz/financialrecapitulationlist/financialrecapitulationlist.component';
import { FinancialrecapitulationdetailComponent } from './applicationmain/applicationmaindetail/surveywiz/surveydetail/financialrecapitulationwiz/financialrecapitulationdetail/financialrecapitulationdetail.component';
import { AmortizationlistComponent } from './applicationmain/applicationmaindetail/assetwiz/assetdetail/amortizationlist/amortizationlist.component';
import { DoclistComponent } from './applicationmain/applicationmaindetail/administrationwiz/administrationdetail/documentwiz/doclist/doclist.component';
import { ReservationassetlistComponent } from './reservationasset/reservationassetlist/reservationassetlist.component';
import { ReservationassetdetailComponent } from './reservationasset/reservationassetdetail/reservationassetdetail.component';
import { GolivelistComponent } from './golive/golivelist/golivelist.component';
import { GolivedetailComponent } from './golive/golivedetail/golivedetail.component';
import { BudgetapprovallistComponent } from './budgetapproval/budgetapprovallist/budgetapprovallist.component';
import { BudgetapprovaldetailComponent } from './budgetapproval/budgetapprovaldetail/budgetapprovaldetail.component';
import { ApplicationPdcRegisterlistComponent } from './applicationpdcregister/applicationpdcregisterlist/applicationpdcregisterlist.component';
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
import { MasterContractChargeslistComponent } from './mastercontract/mastercontractdetail/chargeswiz/chargeslist/chargeslist.component';
import { MasterContractChargesdetailComponent } from './mastercontract/mastercontractdetail/chargeswiz/chargesdetail/chargesdetail.component';
import { tclistComponent } from './mastercontract/mastercontractdetail/tc/tclist/tclist.component';
import { DocumentlistComponent } from './mastercontract/mastercontractdetail/documentwiz/documentlist/documentlist.component';

export const Application: Routes = [{
    path: '',
    children: [
        {
            path: 'subapplicationmainlist',
            component: ApplicationmainlistComponent,
            children: [
                {
                    path: 'applicationmaindetail', // add
                    component: ApplicationmaindetailComponent
                },
                {
                    path: 'applicationmaindetail/:id', // update
                    component: ApplicationmaindetailComponent,
                    children: [
                        {
                            path: 'assetlist/:id',
                            component: AssetlistComponent,
                            children: [
                                {
                                    path: 'assetdetail/:id',
                                    component: AssetdetailComponent
                                },
                                {
                                    path: 'assetdetail/:id/:id2',
                                    component: AssetdetailComponent,
                                    children: [
                                        {
                                            path: 'amortizationlist/:id',
                                            component: AmortizationlistComponent,
                                        },
                                    ]
                                },
                                {
                                    path: 'karoseriaccessorieslist/:id/:id2/:id3',
                                    component: KaroseriaccessorieslistComponent,
                                },
                                {
                                    path: 'assetinsurancedetaildetail/:id/:id2',
                                    component: AssetinsurancedetaildetailComponent,
                                },
                            ]
                        },
                        {
                            path: 'administrationdetail/:id',
                            component: AdministrationdetailComponent,
                            children: [
                                {
                                    path: 'feelist/:id',
                                    component: FeelistComponent
                                },
                                {
                                    path: 'feedetail/:id',
                                    component: FeedetailComponent
                                },
                                {
                                    path: 'feedetail/:id/:id2',
                                    component: FeedetailComponent
                                },
                                {
                                    path: 'chargeslist/:id',
                                    component: ChargeslistComponent
                                },
                                {
                                    path: 'chargesdetail/:id',
                                    component: ChargesdetailComponent
                                },
                                {
                                    path: 'chargesdetail/:id/:id2',
                                    component: ChargesdetailComponent
                                },
                                {
                                    path: 'doclist/:id',
                                    component: DoclistComponent
                                },
                            ]
                        },
                        {
                            path: 'legaldetail/:id/:branch',
                            component: LegaldetailComponent,
                            children: [
                                {
                                    path: 'guarantorlist/:id',
                                    component: GuarantorlistComponent
                                },
                                {
                                    path: 'guarantordetail/:id',
                                    component: GuarantordetailComponent
                                },
                                {
                                    path: 'guarantordetail/:id/:id2',
                                    component: GuarantordetailComponent
                                },
                                {
                                    path: 'notarylist/:id/:branch',
                                    component: NotarylistComponent
                                },
                                {
                                    path: 'notarydetail/:id/:branch',
                                    component: NotarydetailComponent
                                },
                                {
                                    path: 'notarydetail/:id/:id2/:branch',
                                    component: NotarydetailComponent
                                },
                            ]
                        },
                        {
                            path: 'surveydetail/:id',
                            component: SurveydetailComponent,
                            children: [
                                {
                                    path: 'scoringrequestlist/:id',
                                    component: ScoringrequestlistComponent
                                },
                                {
                                    path: 'scoringrequestdetail/:id',
                                    component: ScoringrequestdetailComponent
                                },
                                {
                                    path: 'scoringrequestdetail/:id/:id2',
                                    component: ScoringrequestdetailComponent
                                },
                                {
                                    path: 'surveyrequestlist/:id',
                                    component: SurveyrequestlistComponent
                                },
                                {
                                    path: 'surveyrequestdetail/:id',
                                    component: SurveyrequestdetailComponent
                                },
                                {
                                    path: 'surveyrequestdetail/:id/:id2',
                                    component: SurveyrequestdetailComponent
                                },
                                {
                                    path: 'financialrecapitulationlist/:id',
                                    component: FinancialrecapitulationlistComponent
                                },
                                {
                                    path: 'financialrecapitulationdetail/:id',
                                    component: FinancialrecapitulationdetailComponent
                                },
                                {
                                    path: 'financialrecapitulationdetail/:id/:id2',
                                    component: FinancialrecapitulationdetailComponent
                                },
                                {
                                    path: 'financialanalysislist/:id',
                                    component: FinancialanalysislistComponent
                                },
                                {
                                    path: 'financialanalysisdetail/:id',
                                    component: FinancialanalysisdetailComponent
                                },
                                {
                                    path: 'financialanalysisdetail/:id/:id2',
                                    component: FinancialanalysisdetailComponent,
                                    children: [
                                        {
                                            path: 'incomelist/:id',
                                            component: IncomelistComponent
                                        },
                                        {
                                            path: 'expenselist/:id',
                                            component: ExpenselistComponent
                                        },
                                    ]
                                },
                            ]
                        },
                        {
                            path: 'approvaldetail/:id/:status',
                            component: ApprovaldetailComponent,
                            children: [
                                {
                                    path: 'deviationlist/:id',
                                    component: DeviationlistComponent
                                },
                                {
                                    path: 'deviationdetail/:id',
                                    component: DeviationdetailComponent
                                },
                                {
                                    path: 'deviationdetail/:id/:id2',
                                    component: DeviationdetailComponent
                                },
                                {
                                    path: 'approvalcommentlist/:id',
                                    component: ApprovalcommentlistComponent
                                },
                                {
                                    path: 'rulesresultlist/:id',
                                    component: RulesresultlistComponent
                                },
                                {
                                    path: 'recomendationlist/:id',
                                    component: RecomendationlistComponent
                                },
                                {
                                    path: 'loglist/:id',
                                    component: LoglistComponent
                                },
                            ]
                        },
                    ]
                },
            ],
            canActivate: [AuthGuard]
        },

        {
            path: 'banberjalanapplicationmain',
            component: ApplicationapprovallistComponent,
            children: [
                {
                    path: 'applicationmaindetail/:id/:page',
                    component: ApplicationapprovaldetailComponent,
                    children: [
                        {
                            path: 'assetlist/:id/:page',
                            component: ApprovalassetlistComponent,
                            children: [
                                {
                                    path: 'assetdetail/:id/:page',
                                    component: ApprovalassetdetailComponent
                                },
                                {
                                    path: 'assetdetail/:id/:id2/:page',
                                    component: ApprovalassetdetailComponent,
                                    children: [
                                        {
                                            path: 'amortizationlist/:id/:page',
                                            component: AssetApprovalamortizationlistComponent,
                                        },
                                    ]
                                },
                                {
                                    path: 'karoseriaccessorieslistavp/:id/:id2/:id3',
                                    component: KaroseriaccessorieslistApvComponent,
                                },
                                {
                                    path: 'assetinsurancedetaildetail/:id/:id2',
                                    component: AssetinsurancedetaildetailapvComponent,
                                },
                            ]
                        },
                        {
                            path: 'administrationdetail/:id/:page',
                            component: ApprovaladministrationdetailComponent,
                            children: [
                                {
                                    path: 'feelist/:id/:page',
                                    component: ApprovalfeelistComponent
                                },
                                {
                                    path: 'feedetail/:id/:id2/:page',
                                    component: ApprovalfeedetailComponent
                                },
                                {
                                    path: 'chargeslist/:id/:page',
                                    component: ApprovalchargeslistComponent
                                },
                                {
                                    path: 'chargesdetail/:id/:page',
                                    component: ApprovalchargesdetailComponent
                                },
                                {
                                    path: 'chargesdetail/:id/:id2/:page',
                                    component: ApprovalchargesdetailComponent
                                },
                                {
                                    path: 'doclist/:id/:page',
                                    component: ApprovaldoclistComponent
                                },
                            ]
                        },
                        {
                            path: 'legaldetail/:id/:branch/:page',
                            component: ApprovallegaldetailComponent,
                            children: [
                                {
                                    path: 'guarantorlist/:id/:page',
                                    component: ApprovalguarantorlistComponent
                                },
                                {
                                    path: 'guarantordetail/:id/:page',
                                    component: ApprovalguarantordetailComponent
                                },
                                {
                                    path: 'guarantordetail/:id/:id2/:page',
                                    component: ApprovalguarantordetailComponent
                                },
                            ]
                        },
                        {
                            path: 'surveydetail/:id/:page',
                            component: ApprovalsurveydetailComponent,
                            children: [
                                {
                                    path: 'scoringrequestlist/:id/:page',
                                    component: ApprovalscoringrequestlistComponent
                                },
                                {
                                    path: 'scoringrequestdetail/:id/:id2/:page',
                                    component: ApprovalscoringrequestdetailComponent
                                },
                                // {
                                //     path: 'surveyrequestlist/:id/:page',
                                //     component: ApprovalsurveyrequestlistComponent
                                // },
                                // {
                                //     path: 'surveyrequestdetail/:id/:id2/:page',
                                //     component: ApprovalsurveyrequestdetailComponent
                                // },
                                // {
                                //     path: 'surveyrequestlist/:id',
                                //     component: ApprovalsurveyrequestlistComponent
                                // },
                                {
                                    path: 'surveyrequestdetail/:id',
                                    component: ApprovalsurveyrequestdetailComponent
                                },
                                {
                                    path: 'surveyrequestdetail/:id/:id2',
                                    component: ApprovalsurveyrequestdetailComponent
                                },
                                {
                                    path: 'financialrecapitulationlist/:id/:page',
                                    component: ApprovalfinancialrecapitulationlistComponent
                                },
                                {
                                    path: 'financialrecapitulationdetail/:id/:page',
                                    component: ApprovalfinancialrecapitulationdetailComponent
                                },
                                {
                                    path: 'financialrecapitulationdetail/:id/:id2/:page',
                                    component: ApprovalfinancialrecapitulationdetailComponent
                                },
                                {
                                    path: 'financialanalysislist/:id/:page',
                                    component: ApprovalfinancialanalysislistComponent
                                },
                                {
                                    path: 'financialanalysisdetail/:id/:page',
                                    component: ApprovalfinancialanalysisdetailComponent
                                },
                                {
                                    path: 'financialanalysisdetail/:id/:id2/:page',
                                    component: ApprovalfinancialanalysisdetailComponent,
                                    children: [
                                        {
                                            path: 'incomelist/:id/:page',
                                            component: ApprovalincomelistComponent
                                        },
                                        {
                                            path: 'expenselist/:id/:page',
                                            component: ApprovalexpenselistComponent
                                        },
                                    ]
                                },
                            ]
                        },
                        {
                            path: 'approvaldetail/:id/:status/:page',
                            component: ApprovalapprovaldetailComponent,
                            children: [
                                {
                                    path: 'loglist/:id/:page',
                                    component: ApprovalloglistComponent
                                },
                                {
                                    path: 'deviationlist/:id/:page',
                                    component: ApprovaldeviationlistComponent
                                },
                                {
                                    path: 'deviationdetail/:id/:page',
                                    component: ApprovaldeviationdetailComponent
                                },
                                {
                                    path: 'deviationdetail/:id/:id2/:page',
                                    component: ApprovaldeviationdetailComponent
                                },
                                {
                                    path: 'approvalcommentlist/:id/:page',
                                    component: ApprovalapprovalcommentlistComponent
                                },
                                {
                                    path: 'rulesresultlist/:id/:page',
                                    component: ApprovalrulesresultlistComponent
                                },
                                {
                                    path: 'recomendationlist/:id/:page',
                                    component: ApprovalrecomendationlistComponent
                                },
                                {
                                    path: 'approvalcreditprocesslist/:id',
                                    component: ApprovalcreditprocesslistComponent
                                },
                                {
                                    path: 'approvalcreditanalystlist/:id',
                                    component: ApprovalcreditanalystlistComponent
                                },
                                {
                                    path: 'approvalfinalchecklist/:id',
                                    component: ApprovalfinalchecklistComponent
                                },
                                {
                                    path: 'approvalprinting/:id',
                                    component: ApprovalprintingComponent
                                },
                                {
                                    path: 'approvalsignerlist/:id',
                                    component: ApprovalsignerlistComponent
                                },
                                {
                                    path: 'approvalpurchaseorderlist/:id',
                                    component: ApprovalpurchaseorderlistComponent
                                },
                            ]
                        },
                    ]
                },
            ],
            canActivate: [AuthGuard]
        },

        {
            path: 'subapplicationtbodocumentlist',
            component: MastercontractlistComponent,
            children: [
                {
                    path: 'applicationtbodocumentdetail/:id', // update
                    component: MastercontractdetailComponent,
                    children: [
                        {
                            path: 'chargeslist/:id',
                            component: MasterContractChargeslistComponent
                        },
                        {
                            path: 'chargesdetail/:id',
                            component: MasterContractChargesdetailComponent,
                        },
                        {
                            path: 'chargesdetail/:id/:id2',
                            component: MasterContractChargesdetailComponent,
                        },
                        {
                            path: 'tclist/:id',
                            component: tclistComponent
                        },
                        {
                            path: 'documentlist/:id',
                            component: DocumentlistComponent
                        },
                    ]
                },
            ],
            canActivate: [AuthGuard]
        },

        {
            path: 'subtbodocumentlist',
            component: ApplicationTboDocumentlistComponent,
            children: [
                {
                    path: 'tbodocumentdetail/:id', // update
                    component: ApplicationtbodocumentdetailComponent,
                    children: [
                        {
                            path: 'doclist/:id/:applicationNo',
                            component: TboDoclistComponent
                        }
                    ]
                },
            ],
            canActivate: [AuthGuard]
        },

        {
            path: 'subapplicationpdclist',
            component: ApplicationPdcRegisterlistComponent,
            children: [
                {
                    path: 'applicationpdcregisterdetail/:id', // update
                    component: ApplicationPdcRegisterdetailComponent,
                    children: [
                        {
                            path: 'pdcregisterdetaillist/:id',
                            component: PdcregisterdetaillistComponent
                        },
                        {
                            path: 'amortizationpdclist/:id',
                            component: AmortizationPdclistComponent
                        },
                    ]
                },
            ],
            canActivate: [AuthGuard]
        },

        {
            path: 'subreservationassetlist',
            component: ReservationassetlistComponent,
            children: [
                {
                    path: 'reservationassetdetail', // add
                    component: ReservationassetdetailComponent,
                },
                {
                    path: 'reservationassetdetail/:id', // update
                    component: ReservationassetdetailComponent,
                },
            ],
            canActivate: [AuthGuard]
        },

        {
            path: 'subgolivelist',
            component: GolivelistComponent,
            children: [
                {
                    path: 'golivedetail/:id', // update
                    component: GolivedetailComponent,
                },
            ],
            canActivate: [AuthGuard]
        },

        {
            path: 'subbudgetapprovallist',
            component: BudgetapprovallistComponent,
            children: [
                {
                    path: 'budgetapprovaldetail/:id', // update
                    component: BudgetapprovaldetailComponent,
                },
            ],
            canActivate: [AuthGuard]
        },
        //Object info application main
        {
            path: 'objectinfoapplicationmain/:id/:pagetype',
            component: ObjectInfoApplicationmaindetailComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'assetlist/:id/:page',
                    component: ObjectInfoAssetlistComponent,
                    children: [
                        {
                            path: 'assetdetail/:id/:id2/:page',
                            component: ObjectInfoAssetdetailComponent,
                            children: [
                                {
                                    path: 'amortizationlist/:id/:page',
                                    component: ObjectInfoAssetAmortizationlistComponent,
                                },
                            ]
                        },
                        {
                            path: 'karoseriaccessorieslistinquiry/:id/:id2/:id3',
                            component: ObjectInfoKaroseriaccessorieslistinquiryComponent,
                        },
                        {
                            path: 'assetinsurancedetaildetail/:id/:id2',
                            component: ObjectInfoAssetinsurancedetaildetailinquiryComponent,
                        },
                    ]
                },
                {
                    path: 'administrationdetail/:id/:page',
                    component: ObjectInfoAdministrationdetailComponent,
                    children: [
                        {
                            path: 'feelist/:id/:page',
                            component: ObjectInfoFeelistComponent,
                        },
                        {
                            path: 'feedetail/:id/:id2/:page',
                            component: ObjectInfoFeedetailComponent,
                        },
                        {
                            path: 'chargeslist/:id/:page',
                            component: ObjectInfoChargeslistComponent,
                        },
                        {
                            path: 'chargesdetail/:id/:id2/:page',
                            component: ObjectInfoChargesdetailComponent,
                        },
                        {
                            path: 'doclist/:id/:page',
                            component: ObjectInfoDoclistComponent,
                        },
                    ]
                },
                {
                    path: 'legaldetail/:id/:branch/:page',
                    component: ObjectInfoLegaldetailComponent,
                    children: [
                        {
                            path: 'guarantorlist/:id/:page',
                            component: ObjectInfoGuarantorlistComponent,
                        },
                        {
                            path: 'guarantordetail/:id/:id2/:page',
                            component: ObjectInfoGuarantordetailComponent,
                        },
                        {
                            path: 'notarylist/:id/:branch/:page',
                            component: ObjectInfoNotarylistComponent,
                        },
                        {
                            path: 'notarydetail/:id/:id2/:branch/:page',
                            component: ObjectInfoNotarydetailComponent,
                        },
                    ]
                },
                {
                    path: 'surveydetail/:id/:page',
                    component: ObjectInfoSurveydetailComponent,
                    children: [
                        {
                            path: 'scoringrequestlist/:id/:page',
                            component: ObjectInfoScoringrequestlistComponent,
                        },
                        {
                            path: 'scoringrequestdetail/:id/:id2/:page',
                            component: ObjectInfoScoringrequestdetailComponent,
                        },
                        // {
                        //     path: 'surveyrequestlist/:id/:page',
                        //     component: SurveyrequestlistComponent
                        // },
                        // {
                        //     path: 'surveyrequestdetail/:id/:id2/:page',
                        //     component: SurveyrequestdetailComponent
                        // },
                        {
                            path: 'surveyrequestdetail/:id',
                            component: ObjectInfoSurveyrequestdetailComponent,
                        },
                        {
                            path: 'surveyrequestdetail/:id/:id2',
                            component: ObjectInfoSurveyrequestdetailComponent,
                        },
                        {
                            path: 'financialrecapitulationlist/:id/:page',
                            component: ObjectInfoFinancialrecapitulationlistComponent,
                        },
                        {
                            path: 'financialrecapitulationdetail/:id/:id2/:page',
                            component: ObjectInfoFinancialrecapitulationdetailComponent,
                        },
                        {
                            path: 'financialanalysislist/:id/:page',
                            component: ObjectInfoFinancialanalysislistComponent,
                        },
                        {
                            path: 'financialanalysisdetail/:id/:id2/:page',
                            component: ObjectInfoFinancialanalysisdetailComponent,
                            children: [
                                {
                                    path: 'incomelist/:id/:page',
                                    component: ObjectInfoIncomelistComponent,
                                },
                                {
                                    path: 'expenselist/:id/:page',
                                    component: ObjectInfoExpenselistComponent,
                                },
                            ]
                        },
                    ]
                },
                {
                    path: 'approvaldetail/:id/:status/:page',
                    component: ObjectInfoApprovaldetailComponent,
                    children: [
                        {
                            path: 'loglist/:id/:page',
                            component: ObjectInfoAssetLoglistComponent,
                        },
                        {
                            path: 'deviationlist/:id/:page',
                            component: ObjectInfoDeviationlistComponent,
                        },
                        {
                            path: 'deviationdetail/:id/:id2/:page',
                            component: ObjectInfoDeviationdetailComponent,
                        },
                        {
                            path: 'approvalcommentlist/:id/:page',
                            component: ObjectInfoApprovalcommentlistComponent,
                        },
                        {
                            path: 'rulesresultlist/:id/:page',
                            component: ObjectInfoRulesresultlistComponent,
                        },
                        {
                            path: 'recomendationlist/:id/:page',
                            component: ObjectInfoRecomendationlistComponent,
                        },
                        {
                            path: 'approvalcreditprocesslist/:id',
                            component: ObjectInfoApprovalcreditprocesslistComponent,
                        },
                        {
                            path: 'approvalcreditanalystlist/:id',
                            component: ObjectInfoApprovalcreditanalystlistComponent,
                        },
                        {
                            path: 'approvalfinalchecklist/:id',
                            component: ObjectInfoApprovalfinalchecklistComponent,
                        },
                        {
                            path: 'approvalprinting/:id',
                            component: ObjectInfoApprovalprintingComponent,
                        },
                        {
                            path: 'approvalsignerlist/:id',
                            component: ObjectInfoApprovalsignerlistComponent,
                        },
                        {
                            path: 'approvalpurchaseorderlist/:id',
                            component: ObjectInfoApprovalpurchaseorderlistComponent,
                        },
                    ]
                },
            ],
        },
        //Object info application main

    ]
}];

