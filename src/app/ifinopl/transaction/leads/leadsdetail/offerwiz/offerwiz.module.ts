import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { DALService } from '../../../../../../DALservice.service';
import { SpinnerModule } from '../../../../../spinner-ui/spinner/spinner.module';
import { OfferdetailComponent } from './offerdetail/offerdetail.component';
import { OfferWiz } from './offerwiz.routing';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(OfferWiz),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule
    ],
    declarations: [
        OfferdetailComponent
    ]
    ,
    providers: [
        DALService
    ]
})

export class OfferWizModule { }
