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
import { Management } from './management.routing';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';

import { EarlyterminationlistComponent } from './earlytermination/earlyterminationlist/earlyterminationlist.component';
import { EarlyterminationdetailComponent } from './earlytermination/earlyterminationdetail/earlyterminationdetail.component';
import { EarlyterminationdetaillistComponent } from './earlytermination/earlyterminationdetail/earlyterminationdetailwiz/earlyterminationdetaillist/earlyterminationdetaillist.component';
import { EarlyterminationinformationlistComponent } from './earlytermination/earlyterminationdetail/earlyterminationinformationwiz/earlyterminationinformationlist/earlyterminationinformationlist.component';
import { EarlyterminationtransactionlistComponent } from './earlytermination/earlyterminationdetail/earlyterminationtransactionwiz/earlyterminationtransactionlist/earlyterminationtransactionlist.component';
import { WriteofflistComponent } from './writeoff/writeofflist/writeofflist.component';
import { WriteoffdetailComponent } from './writeoff/writeoffdetail/writeoffdetail.component';
import { WriteoffinformationlistComponent } from './writeoff/writeoffdetail/writeoffinformationwiz/writeoffinformationlist/writeoffinformationlist.component';
import { WriteoffrecoverylistComponent } from './writeoffrecovery/writeoffrecoverylist/writeoffrecoverylist.component';
import { WriteoffrecoverydetailComponent } from './writeoffrecovery/writeoffrecoverydetail/writeoffrecoverydetail.component';
import { WriteoffcandidatelistComponent } from './writeoffcandidate/writeoffcandidatelist/writeoffcandidatelist.component';
import { ChargeswaivelistComponent } from './chargeswaive/chargeswaivelist/chargeswaivelist.component';
import { ChargeswaivedetailComponent } from './chargeswaive/chargeswaivedetail/chargeswaivedetail.component';
import { WriteoffdetaillistComponent } from './writeoff/writeoffdetail/writeoffdetailwiz/writeoffdetaillist/writeoffdetaillist.component';
import { ObjectInfoEarlyterminationdetailComponent } from './objectinfo/objectinfoearlytermination/objectinfoearlytermination.component';
import { ObjectinfochargeswaiveComponent } from './objectinfo/objectinfochargeswaive/objectinfochargeswaive.cmoponent';
import { ObjectinfowriteoffComponent } from './objectinfo/objectinfowriteoff/objectinfowriteoff.component';
import { ChangeduedatelistComponent } from './changeduedate/changeduedatelist/changeduedatelist.component';
import { ChangeduedatedetailComponent } from './changeduedate/changeduedatedetail/changeduedatedetail.component';
import { ChangeduedateagreementamortizationhistorylistComponent } from './changeduedate/changeduedatedetail/changeduedateagreementamortizationhistorywiz/changeduedateagreementamortizationhistorylist/changeduedateagreementamortizationhistorylist.component';
import { ChangeduedateinformationlistComponent } from './changeduedate/changeduedatedetail/changeduedateinformationwiz/changeduedateinformationlist/changeduedateinformationlist.component';
import { ChangeduedatetransactionlistComponent } from './changeduedate/changeduedatedetail/changeduedatetransactionwiz/changeduedatetransactionlist/changeduedatetransactionlist.component';
import { ChangeduedatedetaillistComponent } from './changeduedate/changeduedatedetail/changeduedatedetailwiz/changeduedatedetaillist/cahngeduedatedetaillist.component';
import { ChangeduedateagreementassetamortizationlistComponent } from './changeduedate/changeduedatedetail/changeduedatedetailwiz/changeduedatedetaildetail/changeduedateagreementassetamortizationlist/changeduedateagreementassetamortizationlist.component';
import { ObjectinfochangeduedateComponent } from './objectinfo/objectinfochangeduedate/objctinfochangeduedate.component';
import { ObjectinfochangeduedatedetailComponent } from './objectinfo/objectinfochangeduedate/objectinfochangeduedatedetail/objectinfochangeduedatedetail.component';
import { EarlyterminationdetaildetailComponent } from './earlytermination/earlyterminationdetail/earlyterminationdetailwiz/earlyterminationdetaildetail/earlyterminationdetaildetail.component';


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(Management),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule
    ],
    declarations: [
        EarlyterminationlistComponent,
        EarlyterminationdetailComponent,
        EarlyterminationdetaillistComponent,
        EarlyterminationinformationlistComponent,
        EarlyterminationtransactionlistComponent,
        WriteofflistComponent,
        WriteoffdetailComponent,
        WriteoffdetaillistComponent,
        WriteoffinformationlistComponent,
        WriteoffrecoverylistComponent,
        WriteoffrecoverydetailComponent,
        WriteoffcandidatelistComponent,
        ChargeswaivelistComponent,
        ChargeswaivedetailComponent,
        ObjectInfoEarlyterminationdetailComponent,
        ObjectinfochargeswaiveComponent,
        ObjectinfowriteoffComponent,
        ChangeduedatelistComponent,
        ChangeduedatedetailComponent,
        ChangeduedateagreementamortizationhistorylistComponent,
        ChangeduedateinformationlistComponent,
        ChangeduedatetransactionlistComponent,
        ChangeduedatedetaillistComponent,
        ChangeduedateagreementassetamortizationlistComponent,
        ObjectinfochangeduedateComponent,
        ObjectinfochangeduedatedetailComponent,
        EarlyterminationdetaildetailComponent
    ],

    providers: [
        DALService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // back to login if 401
        , AuthGuard // penjagaan apabila dari login langsung masuk ke dashboard atau ke halaman lain
    ]
})

export class ManagementModule { }
