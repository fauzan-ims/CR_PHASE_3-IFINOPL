import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { DALService } from '../../../../../../DALservice.service';
import { SpinnerModule } from '../../../../../spinner-ui/spinner/spinner.module';
import { ClientBankWiz } from './clientbankwiz.routing';
import { ClientbanklistComponent } from './clientbanklist/clientbanklist.component';
import { ClientbankdetailComponent } from './clientbankdetail/clientbankdetail.component';
import { BankbookdetailComponent } from './clientbankdetail/bankbookdetail/bankbookdetail.component';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ClientBankWiz),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule
    ],
    declarations: [
        ClientbanklistComponent,
        ClientbankdetailComponent,
        BankbookdetailComponent
    ],
    providers: [
        DALService
    ]
})

export class ClientBankWizModule { }
