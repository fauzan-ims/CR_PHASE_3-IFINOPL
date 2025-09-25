import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { DALService } from '../../../../../../DALservice.service';
import { SpinnerModule } from '../../../../../spinner-ui/spinner/spinner.module';
import { LegalWiz } from './legalwiz.routing';
import { LegaldetailComponent } from './legaldetail/legaldetail.component';
import { GuarantorlistComponent } from './legaldetail/guarantorwiz/guarantorlist/guarantorlist.component';
import { GuarantordetailComponent } from './legaldetail/guarantorwiz/guarantordetail/guarantordetail.component';
import { NotarylistComponent } from './legaldetail/notarywiz/notarylist/notarylist.component';
import { NotarydetailComponent } from './legaldetail/notarywiz/notarydetail/notarydetail.component';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(LegalWiz),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule
    ],
    declarations: [
        LegaldetailComponent,
        GuarantorlistComponent,
        GuarantordetailComponent,
        NotarylistComponent,
        NotarydetailComponent
    ]
    ,
    providers: [
        DALService
    ]
})

export class ApplicationLegalWizModule { }
