import { NgModule, ErrorHandler } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { DALService } from '../../../DALservice.service';
import { Maintenance } from './maintenance.routing';
import { AuthGuard } from '../../../auth.guard';
import { AuthInterceptor } from '../../../auth-interceptor';
import { SpinnerModule } from '../../spinner-ui/spinner/spinner.module';
import { GlobalErrorHandler } from '../../../GlobalErrorHandler';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { AssetreplacemenetmainlistComponent } from './assetreplacementmain/assetreplacementmainlist/assetreplacementmainlist.component';
import { AssetreplacementmaindetailComponent } from './assetreplacementmain/assetreplacementmaindetail/assetreplacementmaindetail.component';
import { ReturnassetlistComponent } from './returnasset/returnassetlist/returnassetlist.component';
import { ReturnassetdetailComponent } from './returnasset/returnassetdetail/returnassetdetail.component';
import { ReturnassetdetaildetailComponent } from './returnasset/returnassetdetail/returnassetdetaildetail/returnassetdetaildetail.component';
import { ContractmaturitylistComponent } from './contractmaturity/contractmaturitylist/contractmaturitylist.component';
import { ContractmaturitydetailComponent } from './contractmaturity/contractmaturitydetail/contractmaturitydetail.component';
import { ContractmaturityrequestlistComponent } from './contractmaturityrequest/contractmaturityrequestlist.component';
import { ReschedulelistComponent } from './reschedule/reschedulelist/reschedulelist.component';
import { RescheduledetailComponent } from './reschedule/rescheduledetail/rescheduledetail.component';
import { ContractmaturitydetaillistComponent } from './contractmaturity/contractmaturitydetail/contactmaturitydetaillist/contractmaturitydetaillist.component';
import { MonitoringgtslistComponent } from './monitoringgts/monitoringgtslist/monitoringgtslist.component';
import { MonitoringgtsdetailComponent } from './monitoringgts/monitoringgtsdetail/monitoringgtsdetail.component';
import { objectinfomaturityComponent } from './contractmaturity/objectinfo/objectinfomaturity/objectinfomaturity.component';
import { ObjectinfomaturitydetaillistComponent } from './contractmaturity/objectinfo/objectinfomaturity/ojectinfomaturitydetail/objectinfomaturitydetaillist.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(Maintenance),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule,
    ],
    declarations: [
        AssetreplacemenetmainlistComponent,
        AssetreplacementmaindetailComponent,
        ReturnassetlistComponent,
        ReturnassetdetailComponent,
        ReturnassetdetaildetailComponent,
        ContractmaturitylistComponent,
        ContractmaturitydetailComponent,
        ContractmaturityrequestlistComponent,
        ReschedulelistComponent,
        RescheduledetailComponent,
        ContractmaturitydetaillistComponent,
        MonitoringgtslistComponent,
        MonitoringgtsdetailComponent,
        objectinfomaturityComponent,
        ObjectinfomaturitydetaillistComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        AuthGuard,
        DALService,
        { provide: ErrorHandler, useClass: GlobalErrorHandler } // apabila error chunk sehabis publish
    ]
})

export class MaintenanceModule { }
