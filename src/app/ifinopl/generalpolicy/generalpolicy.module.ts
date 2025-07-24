import { NgModule, ErrorHandler } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../../../auth-interceptor';
import { AuthGuard } from '../../../auth.guard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { DALService } from '../../../DALservice.service';
import { GeneralPolicy } from './generalpolicy.routing';
// import { PackagelistComponent } from './package/packagelist/packagelist.component';
// import { PackagedetailComponent } from './package/packagedetail/packagedetail.component';
import { FacilitylistComponent } from './facility/facilitylist/facilitylist.component';
import { FacilitydetailComponent } from './facility/facilitydetail/facilitydetail.component';
import { MasterFeelistComponent } from './fee/feelist/feelist.component';
import { MasterFeedetailComponent } from './fee/feedetail/feedetail.component';
import { FeeamountdetailComponent } from './fee/feedetail/feeamount/feeamountdetail/feeamountdetail.component';
// import { ChargelistComponent } from './charge/chargelist/chargelist.component';
// import { ChargedetailComponent } from './charge/chargedetail/chargedetail.component';
// import { ChargeamountdetailComponent } from './charge/chargedetail/chargeamount/chargeamountdetail/chargeamountdetail.component';
import { MasterRefundlistComponent } from './refund/refundlist/refundlist.component';
import { MasterRefunddetailComponent } from './refund/refunddetail/refunddetail.component';
import { RoundinglistComponent } from './rounding/roundinglist/roundinglist.component';
import { RoundingdetailComponent } from './rounding/roundingdetail/roundingdetail.component';
import { SpinnerModule } from '../../spinner-ui/spinner/spinner.module';
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
// import { PackageBranchWizModule } from './package/packagedetail/branchwiz/branchwiz.module';
// import { PackageChargesWizModule } from './package/packagedetail/chargeswiz/chargeswiz.module';
// import { PackageFeeWizModule } from './package/packagedetail/feewiz/feewiz.module';
// import { PackageRefundWizModule } from './package/packagedetail/refundwiz/refundwiz.module';
// import { PackageInsuranceWizModule } from './package/packagedetail/insurancewiz/insurancewiz.module';
// import { PackageInsuranceCoverageWizModule } from './package/packagedetail/insurancecoveragewiz/insurancecoveragewiz.module';
// import { PackageUnitWizModule } from './package/packagedetail/unitwiz/unitwiz.module';
// import { PackageTcWizModule } from './package/packagedetail/tcwiz/tcwiz.module';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { ChargelistComponent } from './charge/chargelist/chargelist.component';
import { ChargedetailComponent } from './charge/chargedetail/chargedetail.component';
import { ChargeamountdetailComponent } from './charge/chargedetail/chargeamount/chargeamountdetail/chargeamountdetail.component';
import { BudgetcostlistComponent } from './budgetcost/budgetcostlist/budgetcostlist.component';
import { BudgetcostdetailComponent } from './budgetcost/budgetcostdetail/budgetcostdetail.component';
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
import { MasterbudgetlistComponent } from './masterbudget/masterbudgetlist/masterbudgetlist.component';
import { MasterbudgetdetailComponent } from './masterbudget/masterbudgetdetail/masterbudgetdetail.component';
import { MasterbudgetdetaildetailComponent } from './masterbudget/masterbudgetdetail/masterbudgetdetaildetail/masterbudgetdetaildetail.component';
import { MasterbudgetinsuranceratelistComponent } from './masterbudgetinsurancerate/masterbudgetinsuranceratelist/masterbudgetinsuranceratelist.component';
import { MasterbudgetinsuranceratedetailComponent } from './masterbudgetinsurancerate/masterbudgetinsuranceratedetail/masterbudgetinsuranceratedetail.component';
import { MasterbudgetinsuranceratedetaildetailComponent } from './masterbudgetinsurancerate/masterbudgetinsuranceratedetail/masterbudgetinsuranceratedetaildetail/masterbudgetinsuranceratedetaildetail.component';
import { MasterbudgetinsurancerateextentionlistComponent } from './masterbudgetinsurancerateextention/masterbudgetinsurancerateextentionlist/masterbudgetinsurancerateextentionlist.component';
import { MasterbudgetinsurancerateextentiondetailComponent } from './masterbudgetinsurancerateextention/masterbudgetinsurancerateextentiondetail/masterbudgetinsurancerateextentiondetail.component';
import { MasterbudgetinsurancerateliabilitylistComponent } from './masterbudgetinsurancerateliability/masterbudgetinsurancerateliabilitylist/masterbudgetinsurancerateliabilitylist.component';
import { MasterbudgetinsurancerateliabilitydetailComponent } from './masterbudgetinsurancerateliability/masterbudgetinsurancerateliabilitydetail/masterbudgetinsurancerateliabilitydetail.component';
// import { MasterbudgetlistComponent } from './masterbudget/masterbudgetlist/masterbudgetlist.component';
// import { MasterbudgetdetailComponent } from './masterbudget/masterbudgetdetail/masterbudgetdetail.component';
// import { MasterbudgetdetaildetailComponent } from './masterbudget/masterbudgetdetail/masterbudgetdetaildetail/masterbudgetdetaildetail.component';
import { MasterbudgetmaintenancesimulationlistComponent } from './masterbudgetmaintenance/masterbudgetmaintenancedetail/masterbudgetmaintenancesimulationwiz/masterbudgetmaintenancesimulationlist/masterbudgetmaintenancesimulationlist.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(GeneralPolicy),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule,

        // PackageBranchWizModule,
        // PackageChargesWizModule,
        // PackageFeeWizModule,
        // PackageRefundWizModule,
        // PackageInsuranceWizModule,
        // PackageInsuranceCoverageWizModule,
        // PackageUnitWizModule,
        // PackageTcWizModule
    ],
    declarations: [
        // PackagelistComponent,
        // PackagedetailComponent,
        FacilitylistComponent,
        FacilitydetailComponent,
        MasterFeelistComponent,
        MasterFeedetailComponent,
        FeeamountdetailComponent,
        ChargelistComponent,
        ChargedetailComponent,
        ChargeamountdetailComponent,
        MasterRefundlistComponent,
        MasterRefunddetailComponent,
        RoundinglistComponent,
        RoundingdetailComponent,
        RoundingdetaildetailComponent,
        // NotarylistComponent,
        // NotarydetailComponent,
        DeviationlistComponent,
        DeviationdetailComponent,
        AppcontractlistComponent,
        AppcontractdetailComponent,
        DocgrouplistComponent,
        DocgroupdetailComponent,
        AppgrouplistComponent,
        AppgroupdetailComponent,
        BudgetcostlistComponent,
        BudgetcostdetailComponent,
        MasterbudgetreplacementlistComponent,
        MasterbudgetreplacementdetailComponent,
        MasterbudgetreplacementdetaildetailComponent,
        MasterbudgetregistrationlistComponent,
        MasterbudgetregistrationdetailComponent,
        MasterbudgetregistrationdetaildetailComponent,
        MasterbudgetmaintenancelistComponent,
        MasterbudgetmaintenancedetailComponent,
        MasterbudgetmaintenancegrouplistComponent,
        MasterbudgetmaintenancegroupservicelistComponent,
        MasterbudgetlistComponent,
        MasterbudgetdetailComponent,
        MasterbudgetdetaildetailComponent,
        MasterbudgetinsuranceratelistComponent,
        MasterbudgetinsuranceratedetailComponent,
        MasterbudgetinsuranceratedetaildetailComponent,
        MasterbudgetinsurancerateextentionlistComponent,
        MasterbudgetinsurancerateextentiondetailComponent,
        MasterbudgetinsurancerateliabilitylistComponent,
        MasterbudgetinsurancerateliabilitydetailComponent,
        MasterbudgetmaintenancesimulationlistComponent,
    ],
    providers: [
        DALService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // back to login if 401
        , AuthGuard // penjagaan apabila dari login langsung masuk ke dashboard atau ke halaman lain
    ]
})

export class SettingModule { }
