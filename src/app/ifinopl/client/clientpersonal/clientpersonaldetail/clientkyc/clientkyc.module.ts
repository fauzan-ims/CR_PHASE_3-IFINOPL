import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { DALService } from '../../../../../../DALservice.service';
import { SpinnerModule } from '../../../../../spinner-ui/spinner/spinner.module';
import { ClientKYC } from './clientkyc.routing';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { ClientkycdetailComponent } from './clientkycdetail/clientkycdetail.component';
import { ClientkycdetailinfoComponent } from './clientkycdetail/clientkycdetailinfo/clientkycdetailinfo.component';
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ClientKYC),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule
    ],
    declarations: [
        ClientkycdetailComponent,
        ClientkycdetailinfoComponent
    ],
    providers: [
        DALService
    ]
})

export class ClientKYCModule { }
