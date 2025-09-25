import { NgModule, ErrorHandler } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { DALService } from '../../../DALservice.service';
import { Golive } from './golive.routing';
import { AuthInterceptor } from '../../../auth-interceptor';
import { AuthGuard } from '../../../auth.guard';
import { SpinnerModule } from '../../spinner-ui/spinner/spinner.module';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { ApplicationmainlistComponent } from './application/applicationlist/applicationmainlist.component';
import { ApplicationmaindetailComponent } from './application/applicationmaindetail/applicationmaindetail.component';
import { DeliveryrequestlistComponent } from './deliveryrequest/deliveryrequestlist.component';
import { DeliverylistComponent } from './delivery/deliverylist/deliverylist.component';
import { DeliverydetailComponent } from './delivery/deliverydetail/deliverydetail.component';
import { DeliveryassetdetailComponent } from './delivery/deliverydetail/deliveryassetdetail/deliveryassetdetail.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(Golive),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule
    ],
    declarations: [
        ApplicationmainlistComponent,
        ApplicationmaindetailComponent,
        DeliveryrequestlistComponent,
        DeliverylistComponent,
        DeliverydetailComponent,
        DeliveryassetdetailComponent
    ],
    providers: [
        DALService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // back to login if 401
        , AuthGuard // penjagaan apabila dari login langsung masuk ke dashboard atau ke halaman lain
    ]
})

export class GoliveModule { }
