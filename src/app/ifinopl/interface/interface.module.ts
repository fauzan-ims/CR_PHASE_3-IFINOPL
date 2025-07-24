import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { Interface } from './interface.routing';
import { DALService } from '../../../DALservice.service';
import { AuthInterceptor } from '../../../auth-interceptor';
import { AuthGuard } from '../../../auth.guard';
import { SpinnerModule } from '../../spinner-ui/spinner/spinner.module';
import { RequestlistComponent } from './request/requestlist/requestlist.component';
import { CheckinglistComponent } from './checking/checkinglist/checkinglist.component';
import { ScoringlistComponent } from './scoring/scoringlist/scoringlist.component';
import { SaleslistComponent } from './sales/saleslist/saleslist.component';
import { ProspectmainlistComponent } from './prospectmain/prospectmainlist/prospectmainlist.component';
import { ProspectmaindetailComponent } from './prospectmain/prospectmaindetail/prospectmaindetail.component';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { PurchaserequestlistComponent } from './purchaserequest/purchaserequestlist/purchaserequestlist.component';
import { PurchaserequestdetailComponent } from './purchaserequest/purchaserequestdetail/purchaserequestdetail.component';
import { PaymentRequestlistComponent } from './paymentrequest/paymentrequestlist/paymentrequestlist.component';
import { PaymentrequestdetailComponent } from './paymentrequest/paymentrequestdetail/paymentrequestdetail.component';
import { CashierReceivedRequestlistComponent } from './cashierreceivedrequest/cashierreceivedrequestlist/cashierreceivedrequestlist.component';
import { CashierreceivedrequestdetailComponent } from './cashierreceivedrequest/cashierreceivedrequesetdetail/cashierreceivedrequestdetail.component';
import { interfacejournalgllinklistComponent } from './interfacejournalgllink/interfacejournalgllinklist/interfacejournalgllinklist.component';
import { interfacejournalgllinkdetailComponent } from './interfacejournalgllink/interfacejournalgllinkdetail/interfacejournalgllinkdetail.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(Interface),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule,
    ],
    declarations: [
        RequestlistComponent,
        CheckinglistComponent,
        ScoringlistComponent,
        SaleslistComponent,
        ProspectmainlistComponent,
        ProspectmaindetailComponent,
        PurchaserequestlistComponent,
        PurchaserequestdetailComponent,
        PaymentRequestlistComponent,
        PaymentrequestdetailComponent,
        CashierReceivedRequestlistComponent,
        CashierreceivedrequestdetailComponent,
        interfacejournalgllinklistComponent,
        interfacejournalgllinkdetailComponent,
    ],
    providers: [
        DALService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // back to login if 401
        , AuthGuard // penjagaan apabila dari login langsung masuk ke dashboard atau ke halaman lain
    ]
})

export class InterfaceModule { }
