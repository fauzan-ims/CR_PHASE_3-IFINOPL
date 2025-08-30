import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { DALService } from '../../../DALservice.service';
import { SpinnerModule } from '../../spinner-ui/spinner/spinner.module';
import { AuthInterceptor } from '../../../auth-interceptor';
import { AuthGuard } from '../../../auth.guard';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { Collection } from './collection.routing';
import { DeskcolltasklistComponent } from './deskcolltask/deskcolltasklist/deskcolltasklist.component';
import { DeskcolltaskmainlistComponent } from './deskcolltask/deskcolltasklist/deskcolltaskmainwiz/deskcolltaskmainlist/deskcolltaskmainlist.component';
import { DeskcolltasktpastduelistComponent } from './deskcolltask/deskcolltasklist/deskcolltaskpastduewiz/deskcolltaskpastduelist/deskcolltasktpastduelist.component';
import { DeskcollInquirylistComponent } from './deskcollinquiry/deskcollinquirylist/deskcollinquirylist.component';
import { DeskCollinquirydetailComponent } from './deskcollinquiry/deskcollinquirydetail/deskcollinquirydetail.component';
import { DeskColltaskdetailComponent } from './deskcolltask/deskcolldetail/deskcolldetail.component';
import { AmortizationlistComponent } from './deskcolltask/deskcolldetail/amortizationwiz/amortizationlist/amortizationlist.component';
import { AgreementloglistComponent } from './deskcolltask/deskcolldetail/agreementlogwiz/agreementloglist/agreementloglist.component';
import { SpmanuallistComponent } from './spmanual/spmanuallist/spmanuallist.component';
import { SpmanualdetailComponent } from './spmanual/spmanualdetail/spmanualdetail.component';
import { SplistComponent } from './sp/splist/splist.component';
import { HistorylistComponent } from './sp/splist/historywiz/historylist/historylist.component';
import { Sp1listComponent } from './sp/splist/sp1wiz/sp1list/sp1list.component';
import { Sp2listComponent } from './sp/splist/sp2wiz/sp2list/sp2list.component';
import { Sp3listComponent } from './sp/splist/sp3wiz/sp3list/sp3list.component';
import { SpdeliverylistComponent } from './spdelivery/spdeliverylist/spdeliverylist.component';
import { SpdeliverydetailComponent } from './spdelivery/spdeliverydetail/spdeliverydetail.component';
import { SpdeliverysettlementlistComponent } from './spdeliverysettlement/spdeliverysettlementlist/spdeliverysettlementlist.component';
import { SpdeliverysettlementdetailComponent } from './spdeliverysettlement/spdeliverysettlementdetail/spdeliverysettlementdetail.component';
import { SpdeliveryprocesslistComponent } from './spdeliveryprocess/spdeliveryprocesslist/spdeliveryprocesslist.component';
import { DeskcollstafflistComponent } from './deskcollstaff/deskcolldtafflist/deskcollstafflist.component';
import { SktlistComponent } from './skt/sktlist/sktlist.component';
import { SktdetailComponent } from './skt/sktdetail/sktdetail.component';
import { SktsettlementlistComponent } from './sktsettlement/sktsettlementlist/sktsettlementlist.component';
import { SktsettlementdetailComponent } from './sktsettlement/sktsettlementdetail/sktsettlementdetail.component';
import { AmortizationdetailComponent } from './deskcolltask/deskcolldetail/amortizationwiz/amortizationdetail/amortizationdetail.component';
import { SpAmortizationlistComponent } from './spdelivery/spdeliverydetail/spamortizationwiz/spamortizationlist/spamortizationlist.component';
import { SpAmortizationdetailComponent } from './spdelivery/spdeliverydetail/spamortizationwiz/spamortizationdetail/spamortizationdetail.component';
import { SpSettlementAmortizationdetailComponent } from './spdeliverysettlement/spdeliverysettlementdetail/spsettlementamortizationwiz/spsettlementamortizationdetail/spsettlementamortizationdetail.component';
import { SpSettlementAmortizationlistComponent } from './spdeliverysettlement/spdeliverysettlementdetail/spsettlementamortizationwiz/spsettlementamortizationlist/spsettlementamortizationlist.component';
import { SpAmortizationManuallistComponent } from './spmanual/spmanualdetail/spamortizationwiz/spamortizationlist/spamortizationmanuallist.component';
import { SpAmortizationManualdetailComponent } from './spmanual/spmanualdetail/spamortizationwiz/spamortizationdetail/spamortizationmanualdetail.component';
// import { AmortizationdetailComponent } from './deskcolltask/deskcolldetail/amortizationwiz/amortizationdetail/amortizationdetail.component';


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(Collection),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule,
    ],
    declarations: [
        DeskcolltasklistComponent,
        DeskcolltaskmainlistComponent,
        DeskcolltasktpastduelistComponent,
        DeskcollInquirylistComponent,
        DeskCollinquirydetailComponent,
        DeskColltaskdetailComponent,
        AmortizationlistComponent,
        AgreementloglistComponent,
        SpmanuallistComponent,
        SpmanualdetailComponent,
        SplistComponent,
        HistorylistComponent,
        Sp1listComponent,
        Sp2listComponent,
        Sp3listComponent,
        SpdeliverylistComponent,
        SpdeliverydetailComponent,
        SpdeliverysettlementlistComponent,
        SpdeliverysettlementdetailComponent,
        SpdeliveryprocesslistComponent,
        DeskcollstafflistComponent,
        SktlistComponent,
        SktdetailComponent,
        SktsettlementlistComponent,
        SktsettlementdetailComponent,
        AmortizationdetailComponent,
        SpAmortizationlistComponent,
        SpAmortizationdetailComponent,
        SpSettlementAmortizationlistComponent,
        SpSettlementAmortizationdetailComponent,
        SpAmortizationManuallistComponent,
        SpAmortizationManualdetailComponent
    ],

    providers: [
        DALService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // back to login if 401
        , AuthGuard // penjagaan apabila dari login langsung masuk ke dashboard atau ke halaman lain
    ]
})

export class CollectionModule { }