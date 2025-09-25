import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Blacklist } from './blacklist.routing';
import { SpinnerModule } from '../../spinner-ui/spinner/spinner.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { DALService } from '../../../DALservice.service';
import { AuthInterceptor } from '../../../auth-interceptor';
import { AuthGuard } from '../../../auth.guard';
import { AreablacklistlistComponent } from './areablacklist/areablacklistlist/areablacklistlist.component';
import { AreablacklistdetailComponent } from './areablacklist/areablacklistdetail/areablacklistdetail.component';
import { AreainquirylistComponent } from './areainquiry/areainquirylist/areainquirylist.component';
import { AreainquirydetailComponent } from './areainquiry/areainquirydetail/areainquirydetail.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(Blacklist),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule,
    ],
    declarations: [
        AreablacklistlistComponent,
        AreablacklistdetailComponent,
        AreainquirylistComponent,
        AreainquirydetailComponent,
    ],
    providers: [
        DALService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // back to login if 401
        , AuthGuard // penjagaan apabila dari login langsung masuk ke dashboard atau ke halaman lain
    ]
})

export class BlacklistModule { }
