import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { DALService } from '../../../../../../DALservice.service';
import { SpinnerModule } from '../../../../../spinner-ui/spinner/spinner.module';
import { ShareholderdetailComponent } from './shareholderdetail/shareholderdetail.component';
import { ShareholderlistComponent } from './shareholderlist/shareholderlist.component';
import { ShareHolderWiz } from './shareholderwiz.routing';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ShareHolderWiz),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule
    ],
    declarations: [
        ShareholderlistComponent,
        ShareholderdetailComponent
    ],
    providers: [
        DALService
    ]
})

export class ShareholderWizModule { }
