import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { DALService } from '../../../../../../DALservice.service';
import { SpinnerModule } from '../../../../../spinner-ui/spinner/spinner.module';
import { AssetWiz } from './assetwiz.routing';
import { AssetlistComponent } from './assetlist/assetlist.component';
import { AssetdetailComponent } from './assetdetail/assetdetail.component';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AssetWiz),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule
    ],
    declarations: [
        AssetlistComponent,
        AssetdetailComponent
    ],
    providers: [
        DALService
    ]
})

export class AssetWizModule { }
