import { NgModule, ErrorHandler } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { DALService } from '../../../DALservice.service';
import { Contract } from './contract.routing';
import { AuthInterceptor } from '../../../auth-interceptor';
import { AuthGuard } from '../../../auth.guard';
import { SpinnerModule } from '../../spinner-ui/spinner/spinner.module';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { DeliveryrequestlistComponent } from './deliveryrequest/deliveryrequestlist.component';
import { DeliverylistComponent } from './delivery/deliverylist/deliverylist.component';
import { DeliverydetailComponent } from './delivery/deliverydetail/deliverydetail.component';
import { AssetallocationlistComponent } from './assetallocation/assetallocationlist/assetallocationlist.component';
import { AssetallocationdetailComponent } from './assetallocation/assetallocationdetail/assetallocationdetail.component';
import { PurchaserequestlistComponent } from './purchaserequest/purchaserequestlist/purchaserequestlist.component';
import { PurchaserequestdetailComponent } from './purchaserequest/purchaserequestdetail/purchaserequestdetail.component';
import { RequestgtslistComponent } from './requestgts/requestgtslist/requestgtslist.component';
import { RequestgtsdetailComponent } from './requestgts/requestgtsdetail/requestgtsdetail.component';
import { DeliverydetaillistComponent } from './delivery/deliverydetail/deliverywiz/asset/deliverydetaillist.component';
import { DocumentrealizationlistComponent } from './delivery/deliverydetail/deliverywiz/documentrealization/documentrealizationlist.component';
import { DeliveryassetdetailComponent } from './delivery/deliverydetail/deliverywiz/asset/deliveryassetdetail/deliveryassetdetail.component';
// import { DocumentTBOlistComponent } from './documenttbo/documentbolist/documenttbolist.component';
// import { DocumentTBOdetailComponent } from './documenttbo/documenttbodetail/documenttbodetail.component';
// import { DocumenttbodetailcontractwizlistComponent } from './documenttbo/documenttbodetail/documenttbodetailcontractwiz/documenttbodetailcontractwizlist/documenttbodetailcontractwizlist.component';
// import { DocumenttbodetailtbowizlistComponent } from './documenttbo/documenttbodetail/documenttbodetailtbowiz/documenttbodetailtbowizlist/documenttbodetailtbowizlist.component';
import { MonitoringassetallocationComponent } from './monitoring/monitoringassetallocation.component';
import { LoglistComponent } from './delivery/deliverydetail/deliverywiz/logwiz/loglist/loglist.component';
import { DocumentlistComponent } from './delivery/deliverydetail/deliverywiz/document/documentlist.component';


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(Contract),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule
    ],
    declarations: [
        DeliveryrequestlistComponent,
        DeliverylistComponent,
        DeliverydetailComponent,
        DeliveryassetdetailComponent,
        AssetallocationlistComponent,
        AssetallocationdetailComponent,
        PurchaserequestlistComponent,
        PurchaserequestdetailComponent,
        RequestgtslistComponent,
        RequestgtsdetailComponent,
        DeliverydetaillistComponent,
        DocumentlistComponent,
        LoglistComponent,
        // DocumentTBOlistComponent,
        // DocumentTBOdetailComponent,
        // DocumenttbodetailcontractwizlistComponent,
        // DocumenttbodetailtbowizlistComponent,
        MonitoringassetallocationComponent,
        DocumentrealizationlistComponent
    ],
    providers: [
        DALService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // back to login if 401
        , AuthGuard // penjagaan apabila dari login langsung masuk ke dashboard atau ke halaman lain
    ]
})

export class ContractModule { }
