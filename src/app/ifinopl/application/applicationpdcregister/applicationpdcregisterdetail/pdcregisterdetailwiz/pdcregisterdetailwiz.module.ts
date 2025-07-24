import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { DALService } from '../../../../../../DALservice.service';
import { PdcRegisterDetailWizRoutes } from './pdcregisterdetailwiz.routing';
import { PdcregisterdetaillistComponent } from './pdcregisterdetaillist/pdcregisterdetaillist.component';


//date
import { AngularMyDatePickerModule } from 'angular-mydatepicker';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(PdcRegisterDetailWizRoutes),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        AngularMyDatePickerModule
    ],
    declarations: [
        PdcregisterdetaillistComponent,
    ],
    providers: [
        DALService
    ]
})

export class PdcRegisterDetailWizModule { }
