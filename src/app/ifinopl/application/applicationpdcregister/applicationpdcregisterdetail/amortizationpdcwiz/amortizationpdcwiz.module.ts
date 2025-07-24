import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { DALService } from '../../../../../../DALservice.service';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { AmortizationPdcWizRoutes } from './amortizationpdcwiz.routing';
import { AmortizationPdclistComponent } from './amortizationpdclist/amortizationpdclist.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AmortizationPdcWizRoutes),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        AngularMyDatePickerModule
    ],
    declarations: [
        AmortizationPdclistComponent,
    ],
    providers: [
        DALService
    ]
})

export class AmortizationPdcWizModule { }
