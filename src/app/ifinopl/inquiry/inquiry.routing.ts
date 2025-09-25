import { Routes } from '@angular/router';
import { AuthGuard } from '../../../auth.guard';
import { AgreementlistComponent } from './agreement/agreementlist/agreementlist.component';
import { AgreementassetdetailComponent } from './agreement/agreementdetail/agreementassetwiz/agreementassetdetail/agreementassetdetail.component';
import { AssetvehicledetailComponent } from './agreement/agreementdetail/agreementassetwiz/agreementassetdetail/assetinfo/assetvehiclewiz/vehicledetail/assetvehicledetail.component';
import { AssetmachinedetailComponent } from './agreement/agreementdetail/agreementassetwiz/agreementassetdetail/assetinfo/assetmachinewiz/machinedetail/assetmachinedetail.component';
import { AssetheavyequipmentdetailComponent } from './agreement/agreementdetail/agreementassetwiz/agreementassetdetail/assetinfo/assetheavyequipmentwiz/heavyequipmentdetail/assetheavyequipmentdetail.component';
import { AssetelectronicdetailComponent } from './agreement/agreementdetail/agreementassetwiz/agreementassetdetail/assetinfo/assetelectronicwiz/electronicdetail/assetelectronicdetail.component';
import { AmortizationlistComponent } from './agreement/agreementdetail/agreementassetwiz/agreementassetdetail/amortizationwiz/amortizationlist/amortizationlist.component';
import { AgreementassetreplacementlistComponent } from './agreement/agreementdetail/agreementassetwiz/agreementassetdetail/agreementassetreplacementwiz/agreementassetreplacementlist/agreementassetreplacementlist.component';
import { AgreementinvoicelistComponent } from './agreementinvoice/agreementinvoicelist/agreementinvoicelist.component';
import { AgreementinvoicedetailComponent } from './agreementinvoice/agreementinvoicedetail/agreementinvoicedetail.component';
import { AgreementinvoicedetaildetailComponent } from './agreementinvoice/agreementinvoicedetail/agreementinvoicedetaildetail/agreementinvoicedetaildetail.component';
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
import { AssetLoglistComponent } from './applicationmain/applicationmaindetail/approvalwiz/approvaldetail/logwiz/loglist/loglist.component';
import { ApprovaldetailComponent } from './applicationmain/applicationmaindetail/approvalwiz/approvaldetail/approvaldetail.component';
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
import { WriteoffcandidatelistComponent } from '../management/writeoffcandidate/writeoffcandidatelist/writeoffcandidatelist.component';
import { AmortizedeferredincomelistComponent } from './amortizedeferredincome/amortizedeferredincomelist/amortizedeferredincomelist.component';
import { AmortizedeferredincomedetailComponent } from './amortizedeferredincome/amortizedeferredincomedetail/amortizedeferredincomedetail.component';
import { AmortizedeferredincomedetaildetailComponent } from './amortizedeferredincome/amortizedeferredincomedetail/amortizedeferredincomedetaildetail/amortizedeferredincomedetaildetail.component';
import { combineAll } from 'rxjs/operators';
import { AgreementassetlistComponent } from './agreement/agreementdetail/agreementassetwiz/agreementassetlist/agreementassetlist.component';
import { AgreementdetailComponent } from './agreement/agreementdetail/agreementdetail.component';
import { DepositlistComponent } from './agreement/agreementdetail/depositwiz/depositlist/depositlist.component';
import { DepositdetailComponent } from './agreement/agreementdetail/depositwiz/depositdetail/depositdetail.component';
import { WriteOfflistComponent } from './agreement/agreementdetail/agreementwriteoffwiz/agreementwriteofflist/writeofflist.component';
import { KaroseriaccessorieslistinquiryComponent } from './applicationmain/applicationmaindetail/assetwiz/assetdetail/karoseriaccessories/karoseriaccessorieslist/karoseriaccessorieslist.component';
import { AssetinsurancedetaildetailinquiryComponent } from './applicationmain/applicationmaindetail/assetwiz/assetdetail/assetinsurancedetail/assetinsurancedetaildetail/assetinsurancedetaildetail.component';
import { InvoicelistwizComponent } from './agreement/agreementdetail/invoicewiz/invoicelist/invoicelistwiz.component';
import { InquiryAmortizationdetailComponent } from './inquirydeskcolltask/inquirydeskcolldetail/inquiryamortizationwiz/inquiryamortizationdetail/inquiryamortizationdetail.component';
import { InquiryAmortizationlistComponent } from './inquirydeskcolltask/inquirydeskcolldetail/inquiryamortizationwiz/inquiryamortizationlist/inquiryamortizationlist.component';
import { InquiryAgreementloglistComponent } from './inquirydeskcolltask/inquirydeskcolldetail/inquiryagreementlogwiz/inquiryagreementloglist/inquiryagreementloglist.component';
import { InquiryDeskColltaskdetailComponent } from './inquirydeskcolltask/inquirydeskcolldetail/inquirydeskcolldetail.component';
import { InquiryDeskcolltasktpastduelistComponent } from './inquirydeskcolltask/inquirydeskcolltasklist/inquirydeskcolltaskpastduewiz/deskcolltaskpastduelist/inquirydeskcolltasktpastduelist.component';
import { InquiryDeskcolltaskmainlistComponent } from './inquirydeskcolltask/inquirydeskcolltasklist/inquirydeskcolltaskmainwiz/deskcolltaskmainlist/inquirydeskcolltaskmainlist.component';
import { InquiryDeskcolltasklistComponent } from './inquirydeskcolltask/inquirydeskcolltasklist/inquirydeskcolltasklist.component';

export const Inquiry: Routes = [{
    path: '',
    children: [
        {
            path: 'subagreementlist',
            component: AgreementlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'agreementdetail/:id', // update
                    component: AgreementdetailComponent,
                    children: [
                        {
                            path: 'agreementassetlist/:id', // update
                            component: AgreementassetlistComponent,
                            children: [
                                {
                                    path: 'agreementassetdetail/:id/:id2', // update
                                    component: AgreementassetdetailComponent,
                                    children: [
                                        {
                                            path: 'amortizationlistwiz/:id/:id2',
                                            component: AmortizationlistComponent,
                                        },
                                        {
                                            path: 'agreementassetreplacementlistwiz/:id',
                                            component: AgreementassetreplacementlistComponent,
                                        },
                                        {
                                            path: 'agreementobligationlistwiz/:id/:id2',
                                            component: AgreementobligationlistComponent,
                                        },

                                        {
                                            path: 'agreementobligationdetailwiz/:id/:id2/:id3',
                                            component: AgreementobligationdetailComponent,
                                        },

                                    ]
                                },
                                {
                                    path: 'karoseriaccessorieslistinquiry/:id/:id2/:id3',
                                    component: KaroseriaccessorieslistinquiryComponent,
                                },
                                {
                                    path: 'assetinsurancedetaildetail/:id/:id2',
                                    component: AssetinsurancedetaildetailinquiryComponent,
                                },
                            ]
                        },

                        {
                            path: 'depositlist/:id',
                            component: DepositlistComponent,
                            children: [
                                {
                                    path: 'depositdetail/:id/:id2',
                                    component: DepositdetailComponent,
                                },
                            ]
                        },
                        {
                            path: 'agreementwriteofflist/:id',
                            component: WriteOfflistComponent,
                        },
                        {
                            path: 'invoicelistwiz/:id',
                            component: InvoicelistwizComponent,
                        },
                    ]
                },

            ]

        },


        {
            path: 'inquiryapplicationmain',
            component: ApplicationmainlistComponent,
            children: [
                {
                    path: 'applicationmaindetail/:id/:page',
                    component: ApplicationmaindetailComponent,
                    children: [
                        {
                            path: 'assetlist/:id/:page',
                            component: AssetlistComponent,
                            children: [
                                {
                                    path: 'assetdetail/:id/:id2/:page',
                                    component: AssetdetailComponent,
                                    children: [
                                        {
                                            path: 'amortizationlist/:id/:page',
                                            component: AssetAmortizationlistComponent,
                                        },
                                    ]
                                },
                                {
                                    path: 'karoseriaccessorieslistinquiry/:id/:id2/:id3',
                                    component: KaroseriaccessorieslistinquiryComponent,
                                },
                                {
                                    path: 'assetinsurancedetaildetail/:id/:id2',
                                    component: AssetinsurancedetaildetailinquiryComponent,
                                },
                            ]
                        },
                        {
                            path: 'administrationdetail/:id/:page',
                            component: AdministrationdetailComponent,
                            children: [
                                {
                                    path: 'feelist/:id/:page',
                                    component: FeelistComponent
                                },
                                {
                                    path: 'feedetail/:id/:id2/:page',
                                    component: FeedetailComponent
                                },
                                {
                                    path: 'chargeslist/:id/:page',
                                    component: ChargeslistComponent
                                },
                                {
                                    path: 'chargesdetail/:id/:id2/:page',
                                    component: ChargesdetailComponent
                                },
                                {
                                    path: 'doclist/:id/:page',
                                    component: DoclistComponent
                                },
                            ]
                        },
                        {
                            path: 'legaldetail/:id/:branch/:page',
                            component: LegaldetailComponent,
                            children: [
                                {
                                    path: 'guarantorlist/:id/:page',
                                    component: GuarantorlistComponent
                                },
                                {
                                    path: 'guarantordetail/:id/:id2/:page',
                                    component: GuarantordetailComponent
                                },
                                {
                                    path: 'notarylist/:id/:branch/:page',
                                    component: NotarylistComponent
                                },
                                {
                                    path: 'notarydetail/:id/:id2/:branch/:page',
                                    component: NotarydetailComponent
                                },
                            ]
                        },
                        {
                            path: 'surveydetail/:id/:page',
                            component: SurveydetailComponent,
                            children: [
                                {
                                    path: 'scoringrequestlist/:id/:page',
                                    component: ScoringrequestlistComponent
                                },
                                {
                                    path: 'scoringrequestdetail/:id/:id2/:page',
                                    component: ScoringrequestdetailComponent
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
                                    component: SurveyrequestdetailComponent
                                },
                                {
                                    path: 'surveyrequestdetail/:id/:id2',
                                    component: SurveyrequestdetailComponent
                                },
                                {
                                    path: 'financialrecapitulationlist/:id/:page',
                                    component: FinancialrecapitulationlistComponent
                                },
                                {
                                    path: 'financialrecapitulationdetail/:id/:id2/:page',
                                    component: FinancialrecapitulationdetailComponent
                                },
                                {
                                    path: 'financialanalysislist/:id/:page',
                                    component: FinancialanalysislistComponent
                                },
                                {
                                    path: 'financialanalysisdetail/:id/:id2/:page',
                                    component: FinancialanalysisdetailComponent,
                                    children: [
                                        {
                                            path: 'incomelist/:id/:page',
                                            component: IncomelistComponent
                                        },
                                        {
                                            path: 'expenselist/:id/:page',
                                            component: ExpenselistComponent
                                        },
                                    ]
                                },
                            ]
                        },
                        {
                            path: 'approvaldetail/:id/:status/:page',
                            component: ApprovaldetailComponent,
                            children: [
                                {
                                    path: 'loglist/:id/:page',
                                    component: AssetLoglistComponent
                                },
                                {
                                    path: 'deviationlist/:id/:page',
                                    component: DeviationlistComponent
                                },
                                {
                                    path: 'deviationdetail/:id/:id2/:page',
                                    component: DeviationdetailComponent
                                },
                                {
                                    path: 'approvalcommentlist/:id/:page',
                                    component: ApprovalcommentlistComponent
                                },
                                {
                                    path: 'rulesresultlist/:id/:page',
                                    component: RulesresultlistComponent
                                },
                                {
                                    path: 'recomendationlist/:id/:page',
                                    component: RecomendationlistComponent
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
            path: 'subagreementinvoicelist',
            component: AgreementinvoicelistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'agreementinvoicedetail', // update
                    component: AgreementinvoicedetailComponent,
                },
                {
                    path: 'agreementinvoicedetail/:id', // update
                    component: AgreementinvoicedetailComponent,
                },
                {
                    path: 'agreementinvoicedetaildetail/:id/:id2', // update
                    component: AgreementinvoicedetaildetailComponent,
                },
            ]
        },

        /**amortiz diferred income */
        {
            path: 'subamortizedeferredincomelist',
            component: AmortizedeferredincomelistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'amortizedeferredincomedetail/:id',
                    component: AmortizedeferredincomedetailComponent,
                },
                {
                    path: 'amortizedeferredincomedetaildetail/:id/:id2',
                    component: AmortizedeferredincomedetaildetailComponent,
                }
            ]
        },

        /**deskcoll task list*/
        {
            path: 'subinquirydeskcolltasklist',
            component: InquiryDeskcolltasklistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'inquirydeskcolltaskmainlist',
                    component: InquiryDeskcolltaskmainlistComponent,
                    // outlet: "register"
                },

                {
                    path: 'inquirydeskcolltasktpastduelist',
                    component: InquiryDeskcolltasktpastduelistComponent,
                    // outlet: "register"
                },
            ]

        },

        {
            path: 'inquirydeskcolltaskdetailpast/:id', /*update*/
            component: InquiryDeskColltaskdetailComponent,
            children: [
                {
                    path: 'inquiryagreementloglist/:id', /*update*/
                    component: InquiryAgreementloglistComponent,
                },
                {
                    path: 'inquiryamortizationlist/:id', /*update*/
                    component: InquiryAmortizationlistComponent,
                },
                {
                    path: 'inquiryamortizationdetail/:id/:id2',
                    component: InquiryAmortizationdetailComponent
                }
            ]
        },
    ]
}];
