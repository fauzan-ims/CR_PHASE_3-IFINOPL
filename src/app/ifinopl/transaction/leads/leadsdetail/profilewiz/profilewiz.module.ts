import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { DALService } from '../../../../../../DALservice.service';
import { SpinnerModule } from '../../../../../spinner-ui/spinner/spinner.module';
import { ProfileWiz } from './profilewiz.routing';
import { ProfilelistComponent } from './profilelist/profilelist.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ProfileWiz),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule
    ],
    declarations: [
        ProfilelistComponent
    ]
    ,
    providers: [
        DALService
    ]
})

export class ProfileWizModule { }
