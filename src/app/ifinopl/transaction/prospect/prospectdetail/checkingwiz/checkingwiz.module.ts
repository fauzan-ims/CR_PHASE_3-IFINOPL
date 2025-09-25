import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { DALService } from '../../../../../../DALservice.service';
import { SpinnerModule } from '../../../../../spinner-ui/spinner/spinner.module';
import { CheckingWiz } from './checkingwiz.routing';
import { CheckinglistComponent } from './checkinglist/checkinglist.component';
import { CheckingdetailComponent } from './checkingdetail/checkingdetail.component';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(CheckingWiz),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule,

    ],
    declarations: [
        CheckinglistComponent,
        CheckingdetailComponent
    ],
    providers: [
        DALService
    ]
})

export class CheckingWizModule { }
