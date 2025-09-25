import { Routes } from '@angular/router';
// import { PackagelistComponent } from './package/packagelist/packagelist.component';
// import { PackagedetailComponent } from './package/packagedetail/packagedetail.component';
import { FacilitylistComponent } from './facility/facilitylist/facilitylist.component';
import { FacilitydetailComponent } from './facility/facilitydetail/facilitydetail.component';
import { MasterFeelistComponent } from './fee/feelist/feelist.component';
import { MasterFeedetailComponent } from './fee/feedetail/feedetail.component';
import { FeeamountdetailComponent } from './fee/feedetail/feeamount/feeamountdetail/feeamountdetail.component';
import { ChargelistComponent } from './charge/chargelist/chargelist.component';
import { ChargedetailComponent } from './charge/chargedetail/chargedetail.component';
import { ChargeamountdetailComponent } from './charge/chargedetail/chargeamount/chargeamountdetail/chargeamountdetail.component';
import { MasterRefundlistComponent } from './refund/refundlist/refundlist.component';
import { MasterRefunddetailComponent } from './refund/refunddetail/refunddetail.component';
import { RoundinglistComponent } from './rounding/roundinglist/roundinglist.component';
import { RoundingdetailComponent } from './rounding/roundingdetail/roundingdetail.component';
// tslint:disable-next-line:max-line-length
import { RoundingdetaildetailComponent } from './rounding/roundingdetail/roundingdetails/roundingdetaildetail/roundingdetaildetail.component';
// import { NotarylistComponent } from './notary/notarylist/notarylist.component';
// import { NotarydetailComponent } from './notary/notarydetail/notarydetail.component';
import { DeviationlistComponent } from './deviation/deviationlist/deviationlist.component';
import { DeviationdetailComponent } from './deviation/deviationdetail/deviationdetail.component';
import { AppcontractlistComponent } from './appcontract/appcontractlist/appcontractlist.component';
import { AppcontractdetailComponent } from './appcontract/appcontractdetail/appcontractdetail.component';
import { DocgrouplistComponent } from './docgroup/docgrouplist/docgrouplist.component';
import { DocgroupdetailComponent } from './docgroup/docgroupdetail/docgroupdetail.component';
import { AppgrouplistComponent } from './appgroup/appgrouplist/appgrouplist.component';
import { AppgroupdetailComponent } from './appgroup/appgroupdetail/appgroupdetail.component';
// import { BranchlistComponent } from './package/packagedetail/branchwiz/branchlist/branchlist.component';
// import { ChargeslistComponent } from './package/packagedetail/chargeswiz/chargeslist/chargeslist.component';
// import { ChargesdetailComponent } from './package/packagedetail/chargeswiz/chargesdetail/chargesdetail.component';
// import { FeelistComponent } from './package/packagedetail/feewiz/feelist/feelist.component';
// import { FeedetailComponent } from './package/packagedetail/feewiz/feedetail/feedetail.component';
// import { RefundlistComponent } from './package/packagedetail/refundwiz/refundlist/refundlist.component';
// import { RefunddetailComponent } from './package/packagedetail/refundwiz/refunddetail/refunddetail.component';
// import { InsurancelistComponent } from './package/packagedetail/insurancewiz/insurancelist/insurancelist.component';

import { AuthGuard } from '../../../auth.guard';
import { BudgetcostdetailComponent } from './budgetcost/budgetcostdetail/budgetcostdetail.component';
import { BudgetcostlistComponent } from './budgetcost/budgetcostlist/budgetcostlist.component';
import { MasterbudgetreplacementlistComponent } from './masterbudgetreplacement/masterbudgetreplacementlist/masterbudgetreplacementlist.component';
import { MasterbudgetreplacementdetailComponent } from './masterbudgetreplacement/masterbudgetreplacementdetail/masterbudgetreplacementdetail.component';
import { MasterbudgetreplacementdetaildetailComponent } from './masterbudgetreplacement/masterbudgetreplacementdetail/masterbudgetreplacementdetaildetail/masterbudgetreplacementdetaildetail.component';
import { MasterbudgetregistrationdetailComponent } from './masterbudgetregistration/masterbudgetregistrationdetail/masterbudgetregistrationdetail.component';
import { MasterbudgetregistrationdetaildetailComponent } from './masterbudgetregistration/masterbudgetregistrationdetail/masterbudgetdetaildetail/masterbudgetregistrationdetaildetail.component';
import { MasterbudgetregistrationlistComponent } from './masterbudgetregistration/masterbudgetregistrationlist/masterbudgetregistrationlist.component';
import { MasterbudgetmaintenancelistComponent } from './masterbudgetmaintenance/masterbudgetmaintenancelist/masterbudgetmaintenancelist.component';
import { MasterbudgetmaintenancedetailComponent } from './masterbudgetmaintenance/masterbudgetmaintenancedetail/masterbudgetmaintenancedetail.component';
import { MasterbudgetmaintenancegrouplistComponent } from './masterbudgetmaintenance/masterbudgetmaintenancedetail/masterbudgetmaintenancegroupwiz/masterbudgetmaintenancegrouplist/masterbudgetmaintenancegrouplist.component';
import { MasterbudgetmaintenancegroupservicelistComponent } from './masterbudgetmaintenance/masterbudgetmaintenancedetail/masterbudgemaintenancegroupservicewiz/masterbudgetmaintenancegroupservicelist/masterbudgetmaintenancegroupservicelist.component';
import { MasterbudgetinsuranceratelistComponent } from './masterbudgetinsurancerate/masterbudgetinsuranceratelist/masterbudgetinsuranceratelist.component';
import { MasterbudgetinsuranceratedetailComponent } from './masterbudgetinsurancerate/masterbudgetinsuranceratedetail/masterbudgetinsuranceratedetail.component';
import { MasterbudgetinsuranceratedetaildetailComponent } from './masterbudgetinsurancerate/masterbudgetinsuranceratedetail/masterbudgetinsuranceratedetaildetail/masterbudgetinsuranceratedetaildetail.component';
import { MasterbudgetinsurancerateextentionlistComponent } from './masterbudgetinsurancerateextention/masterbudgetinsurancerateextentionlist/masterbudgetinsurancerateextentionlist.component';
import { MasterbudgetinsurancerateextentiondetailComponent } from './masterbudgetinsurancerateextention/masterbudgetinsurancerateextentiondetail/masterbudgetinsurancerateextentiondetail.component';
import { MasterbudgetinsurancerateliabilitylistComponent } from './masterbudgetinsurancerateliability/masterbudgetinsurancerateliabilitylist/masterbudgetinsurancerateliabilitylist.component';
import { MasterbudgetinsurancerateliabilitydetailComponent } from './masterbudgetinsurancerateliability/masterbudgetinsurancerateliabilitydetail/masterbudgetinsurancerateliabilitydetail.component';
import { MasterbudgetmaintenancesimulationlistComponent } from './masterbudgetmaintenance/masterbudgetmaintenancedetail/masterbudgetmaintenancesimulationwiz/masterbudgetmaintenancesimulationlist/masterbudgetmaintenancesimulationlist.component';

// import { InsurancecoveragelistComponent } from './package/packagedetail/insurancecoveragewiz/insurancecoveragelist/insurancecoveragelist.component';
// import { UnitlistComponent } from './package/packagedetail/unitwiz/unitlist/unitlist.component';
// import { TcdetailComponent } from './package/packagedetail/tcwiz/tcdetail/tcdetail.component';

export const GeneralPolicy: Routes = [{
    path: '',
    children: [
        // {
        //     path: 'subpackagelist',
        //     component: PackagelistComponent,
        //     children: [
        //         {
        //             path: 'packagedetail', // add
        //             component: PackagedetailComponent
        //         },
        //         {
        //             path: 'packagedetail/:id', // update
        //             component: PackagedetailComponent,
        //             children: [
        //                 {
        //                     path: 'branchlist/:id',
        //                     component: BranchlistComponent
        //                 },
        //                 {
        //                     path: 'chargeslist/:id',
        //                     component: ChargeslistComponent,
        //                     children: [
        //                         {
        //                             path: 'chargesdetail/:id', // add
        //                             component: ChargesdetailComponent
        //                         },
        //                         {
        //                             path: 'chargesdetail/:id/:id2', // update
        //                             component: ChargesdetailComponent
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     path: 'feelist/:id',
        //                     component: FeelistComponent,
        //                     children: [
        //                         {
        //                             path: 'feedetail/:id', // add
        //                             component: FeedetailComponent
        //                         },
        //                         {
        //                             path: 'feedetail/:id/:id2', // update
        //                             component: FeedetailComponent
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     path: 'refundlist/:id',
        //                     component: RefundlistComponent,
        //                     children: [
        //                         {
        //                             path: 'refunddetail/:id', // add
        //                             component: RefunddetailComponent
        //                         },
        //                         {
        //                             path: 'refunddetail/:id/:id2', // update
        //                             component: RefunddetailComponent
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     path: 'insurancelist/:id',
        //                     component: InsurancelistComponent
        //                 },
        //                 {
        //                     path: 'insurancecoveragelist/:id',
        //                     component: InsurancecoveragelistComponent
        //                 },
        //                 {
        //                     path: 'unitlist/:id',
        //                     component: UnitlistComponent
        //                 },
        //                 {
        //                     path: 'tcdetail/:id',
        //                     component: TcdetailComponent
        //                 },
        //             ]
        //         },
        //     ],
        //     canActivate: [AuthGuard]
        // },
        {
            path: 'subfacilitylist',
            component: FacilitylistComponent,
            children: [
                {
                    path: 'facilitydetail', // add
                    component: FacilitydetailComponent
                },
                {
                    path: 'facilitydetail/:id', // update
                    component: FacilitydetailComponent
                },
            ],
            canActivate: [AuthGuard]
        },
        {
            path: 'subfeelist',
            component: MasterFeelistComponent,
            children: [
                {
                    path: 'feedetail', // add
                    component: MasterFeedetailComponent
                },
                {
                    path: 'feedetail/:id', // update
                    component: MasterFeedetailComponent
                },
                {
                    path: 'feeamountdetail/:id', // add
                    component: FeeamountdetailComponent
                },
                {
                    path: 'feeamountdetail/:id/:id2', // update
                    component: FeeamountdetailComponent
                },
            ],
            canActivate: [AuthGuard]
        },
        {
            path: 'subchargelist',
            component: ChargelistComponent,
            children: [
                {
                    path: 'chargedetail', // add
                    component: ChargedetailComponent
                },
                {
                    path: 'chargedetail/:id', // update
                    component: ChargedetailComponent
                },
                {
                    path: 'chargeamountdetail/:id', // add
                    component: ChargeamountdetailComponent
                },
                {
                    path: 'chargeamountdetail/:id/:id2', // update
                    component: ChargeamountdetailComponent
                },
            ],
            canActivate: [AuthGuard]
        },
        {
            path: 'subrefundlist',
            component: MasterRefundlistComponent,
            children: [
                {
                    path: 'refunddetail', // add
                    component: MasterRefunddetailComponent
                },
                {
                    path: 'refunddetail/:id', // update
                    component: MasterRefunddetailComponent
                },
            ],
            canActivate: [AuthGuard]
        },
        {
            path: 'subroundinglist',
            component: RoundinglistComponent,
            children: [
                {
                    path: 'roundingdetail', // add
                    component: RoundingdetailComponent
                },
                {
                    path: 'roundingdetail/:id', // update
                    component: RoundingdetailComponent
                },
                {
                    path: 'roundingdetaildetail/:id', // add
                    component: RoundingdetaildetailComponent
                },
                {
                    path: 'roundingdetaildetail/:id/:id2', // update
                    component: RoundingdetaildetailComponent
                },
            ],
            canActivate: [AuthGuard]
        },
        // {
        //     path: 'subnotarylist',
        //     component: NotarylistComponent,
        //     children: [
        //         {
        //             path: 'notarydetail', // add
        //             component: NotarydetailComponent
        //         },
        //         {
        //             path: 'notarydetail/:id', // update
        //             component: NotarydetailComponent
        //         },
        //     ],
        //     canActivate: [AuthGuard]
        // },
        {
            path: 'subdeviationlist',
            component: DeviationlistComponent,
            children: [
                {
                    path: 'deviationdetail', // add
                    component: DeviationdetailComponent
                },
                {
                    path: 'deviationdetail/:id', // update
                    component: DeviationdetailComponent
                },
            ],
            canActivate: [AuthGuard]
        },
        {
            path: 'subappcontractlist',
            component: AppcontractlistComponent,
            children: [
                {
                    path: 'appcontractdetail', // add
                    component: AppcontractdetailComponent
                },
                {
                    path: 'appcontractdetail/:id', // update
                    component: AppcontractdetailComponent
                },
            ],
            canActivate: [AuthGuard]
        },
        {
            path: 'subdocgrouplist',
            component: DocgrouplistComponent,
            children: [
                {
                    path: 'docgroupdetail', // add
                    component: DocgroupdetailComponent
                },
                {
                    path: 'docgroupdetail/:id', // update
                    component: DocgroupdetailComponent
                },
            ],
            canActivate: [AuthGuard]
        },
        {
            path: 'subappgrouplist',
            component: AppgrouplistComponent,
            children: [
                {
                    path: 'appgroupdetail', // add
                    component: AppgroupdetailComponent
                },
                {
                    path: 'appgroupdetail/:id', // update
                    component: AppgroupdetailComponent
                },
            ],
            canActivate: [AuthGuard]
        },
        {
            path: 'subbudgetcostlist',
            component: BudgetcostlistComponent,
            children: [
                {
                    path: 'budgetcostdetail', // add
                    component: BudgetcostdetailComponent
                },
                {
                    path: 'budgetcostdetail/:id', // update
                    component: BudgetcostdetailComponent
                },
            ],
            canActivate: [AuthGuard]
        },
        {
            path: 'subbudgetreplacementlist',
            component: MasterbudgetreplacementlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'budgetreplacementdetail', //add
                    component: MasterbudgetreplacementdetailComponent,
                },
                {
                    path: 'budgetreplacementdetail/:id', //update
                    component: MasterbudgetreplacementdetailComponent,
                },
                {
                    path: 'budgetreplacementdetaildetail/:id', //add
                    component: MasterbudgetreplacementdetaildetailComponent,
                },
                {
                    path: 'budgetreplacementdetaildetail/:id/:id2', //update
                    component: MasterbudgetreplacementdetaildetailComponent,
                },
            ],
        },
        {
            path: 'subbudgetregistrationlist',
            component: MasterbudgetregistrationlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'budgetregistrationdetail', //add
                    component: MasterbudgetregistrationdetailComponent,
                },
                {
                    path: 'budgetregistrationdetail/:id', //update
                    component: MasterbudgetregistrationdetailComponent,
                },
                {
                    path: 'budgetregistrationdetaildetail/:id', //add
                    component: MasterbudgetregistrationdetaildetailComponent,
                },
                {
                    path: 'budgetregistrationdetaildetail/:id/:id2', //add
                    component: MasterbudgetregistrationdetaildetailComponent,
                },
            ]
        },
        {
            path: 'subbudgetmaintenancelist',
            component: MasterbudgetmaintenancelistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'budgetmaintenancedetail', //add
                    component: MasterbudgetmaintenancedetailComponent
                },
                {
                    path: 'budgetmaintenancedetail/:id', //update
                    component: MasterbudgetmaintenancedetailComponent,
                    children: [
                        {
                            path: 'masterbudgetmaintenancegrouplistwiz/:id',
                            component: MasterbudgetmaintenancegrouplistComponent,
                        },
                        {
                            path: 'masterbudgetmaintenancegroupservicelistwiz/:id',
                            component: MasterbudgetmaintenancegroupservicelistComponent,
                        },
                        {
                            path: 'masterbudgetmaintenancesimulationlistwiz/:id',
                            component: MasterbudgetmaintenancesimulationlistComponent,
                        },
                    ]
                },
            ]
        },
        {
            path: 'submasterbudgetinsuranceratelist',
            component: MasterbudgetinsuranceratelistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'budgetinsuranceratedetail',
                    component: MasterbudgetinsuranceratedetailComponent,
                },
                {
                    path: 'budgetinsuranceratedetail/:id',
                    component: MasterbudgetinsuranceratedetailComponent,
                },
                {
                    path: 'budgetinsuranceratedetaildetail/:id',
                    component: MasterbudgetinsuranceratedetaildetailComponent
                },
                {
                    path: 'budgetinsuranceratedetaildetail/:id/:id2',
                    component: MasterbudgetinsuranceratedetaildetailComponent
                },
            ]
        },
        {
            path: 'submasterbudgetinsurancerateextentionlist',
            component: MasterbudgetinsurancerateextentionlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'masterbudgetinsurancerateextentiondetail',
                    component: MasterbudgetinsurancerateextentiondetailComponent
                },
                {
                    path: 'masterbudgetinsurancerateextentiondetail/:id',
                    component: MasterbudgetinsurancerateextentiondetailComponent
                },
            ]
        },
        {
            path: 'submasterbudgetinsurancerateliabilitylist',
            component: MasterbudgetinsurancerateliabilitylistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'masterbudgetinsurancerateliabilitydetail',
                    component: MasterbudgetinsurancerateliabilitydetailComponent
                },
                {
                    path: 'masterbudgetinsurancerateliabilitydetail/:id',
                    component: MasterbudgetinsurancerateliabilitydetailComponent
                },
            ]
        },
    ]
}];
