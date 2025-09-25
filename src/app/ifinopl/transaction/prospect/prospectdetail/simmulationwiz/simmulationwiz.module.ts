import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { DALService } from '../../../../../../DALservice.service';
import { SpinnerModule } from '../../../../../spinner-ui/spinner/spinner.module';
import { SimmulationWiz } from './simmulationwiz.routing';
import { SimmulationlistComponent } from './simmulationlist/simmulationlist.component';
import { SimmulationdetailComponent } from './simmulationdetail/simmulationdetail.component';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(SimmulationWiz),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule,
    ],
    declarations: [
        SimmulationlistComponent,
        SimmulationdetailComponent
    ],
    providers: [
        DALService
    ]
})

export class SimmulationWizModule { }
