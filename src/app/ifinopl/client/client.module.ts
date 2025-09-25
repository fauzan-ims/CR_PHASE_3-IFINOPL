import { NgModule, ErrorHandler } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { DALService } from '../../../DALservice.service';
import { Client } from './client.routing';
import { SpinnerModule } from '../../spinner-ui/spinner/spinner.module';
import { ClientpersonallistComponent } from './clientpersonal/clientpersonallist/clientpersonallist.component';
import { ClientpersonaldetailComponent } from './clientpersonal/clientpersonaldetail/clientpersonaldetail.component';
import { GlobalErrorHandler } from '../../../GlobalErrorHandler';
import { ClientmatchingdetailComponent } from './clientpersonal/clientmatching/clientmatchingdetail/clientmatchingdetail.component';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { AuthGuard } from '../../../auth.guard';
import { AuthInterceptor } from '../../../auth-interceptor';
import { AddressWizModule } from './clientpersonal/clientpersonaldetail/addresswiz/addresswiz.module';
import { AssetWizModule } from './clientpersonal/clientpersonaldetail/assetwiz/assetwiz.module';
import { ClientBankWizModule } from './clientpersonal/clientpersonaldetail/clientbankwiz/clientbankwiz.module';
import { DocumentWizModule } from './clientpersonal/clientpersonaldetail/documentswiz/documentswiz.module';
import { FamilyWizModule } from './clientpersonal/clientpersonaldetail/familywiz/familywiz.module';
import { LogWizModule } from './clientpersonal/clientpersonaldetail/logwiz/logwiz.module';
import { ReferenceWizModule } from './clientpersonal/clientpersonaldetail/referencewiz/referencewiz.module';
import { ShareholderWizModule } from './clientpersonal/clientpersonaldetail/shareholderwiz/shareholderwiz.module';
import { WorkWizModule } from './clientpersonal/clientpersonaldetail/workwiz/workwiz.module';
import { ClientKYCModule } from './clientpersonal/clientpersonaldetail/clientkyc/clientkyc.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(Client),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule,
        AddressWizModule,
        AssetWizModule,
        ClientBankWizModule,
        DocumentWizModule,
        FamilyWizModule,
        LogWizModule,
        ReferenceWizModule,
        ShareholderWizModule,
        WorkWizModule,
        ClientKYCModule
    ],
    declarations: [
        ClientpersonallistComponent,
        ClientpersonaldetailComponent,
        ClientmatchingdetailComponent
    ],
    providers: [
        DALService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // back to login if 401
        , AuthGuard // penjagaan apabila dari login langsung masuk ke dashboard atau ke halaman lain
    ]
})

export class SettingModule { }
