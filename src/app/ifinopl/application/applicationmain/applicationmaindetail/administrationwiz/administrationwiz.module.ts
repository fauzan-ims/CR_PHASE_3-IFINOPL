import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { DALService } from '../../../../../../DALservice.service';
import { SpinnerModule } from '../../../../../spinner-ui/spinner/spinner.module';
import { AssetdanCollateralWiz } from './administrationwiz.routing';
import { AdministrationdetailComponent } from './administrationdetail/administrationdetail.component';
import { FeelistComponent } from './administrationdetail/feewiz/feelist/feelist.component';
import { FeedetailComponent } from './administrationdetail/feewiz/feedetail/feedetail.component';
import { ChargeslistComponent } from './administrationdetail/chargeswiz/chargeslist/chargeslist.component';
import { ChargesdetailComponent } from './administrationdetail/chargeswiz/chargesdetail/chargesdetail.component';
import { DoclistComponent } from './administrationdetail/documentwiz/doclist/doclist.component';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AssetdanCollateralWiz),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        AngularMyDatePickerModule,
        SpinnerModule
    ],
    declarations: [
        AdministrationdetailComponent,
        FeelistComponent,
        FeedetailComponent,
        ChargeslistComponent,
        ChargesdetailComponent,
        DoclistComponent
    ],
    providers: [
        DALService
    ]
})

export class ApplicationAdministrationWizModule { }
