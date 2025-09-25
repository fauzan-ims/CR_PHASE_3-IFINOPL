import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { DALService } from '../../../../../../DALservice.service';
import { SpinnerModule } from '../../../../../spinner-ui/spinner/spinner.module';
import { DocumentWiz } from './documentswiz.routing';
import { DocumentdetailComponent } from './documentdetail/documentdetail.component';
import { DoclistComponent } from './documentdetail/documentwiz/doclist/doclist.component';
import { DocdetailComponent } from './documentdetail/documentwiz/docdetail/docdetail.component';
import { NotariallistComponent } from './documentdetail/notarialwiz/notariallist/notariallist.component';
import { NotarialdetailComponent } from './documentdetail/notarialwiz/notarialdetail/notarialdetail.component';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DocumentWiz),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule
    ],
    declarations: [
        DocumentdetailComponent,
        DoclistComponent,
        DocdetailComponent,
        NotariallistComponent,
        NotarialdetailComponent,
    ],
    providers: [
        DALService
    ]
})

export class DocumentWizModule { }

