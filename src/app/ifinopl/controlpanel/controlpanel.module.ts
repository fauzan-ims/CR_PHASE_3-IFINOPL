import { NgModule, ErrorHandler } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { DALService } from '../../../DALservice.service';
import { ControlPanel } from './controlpanel.routing';
import { AuthInterceptor } from '../../../auth-interceptor';
import { AuthGuard } from '../../../auth.guard';
import { SpinnerModule } from '../../spinner-ui/spinner/spinner.module';
import { GlobalErrorHandler } from '../../../GlobalErrorHandler';
import { GlobalParamlistComponent } from './globalparam/globalparamlist/globalparamlist.component';
import { GlobalParamdetailComponent } from './globalparam/globalparamdetail/globalparamdetail.component';
import { EodlistComponent } from './eod/eodlist/eodlist.component';
import { EoddetailComponent } from './eod/eoddetail/eoddetail.component';
import { EodloglistComponent } from './eodlog/eodloglist/eodloglist.component';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { AuditTraillistComponent } from './audittrail/audittraillist/audittraillist.component';
import { AuditTraildetailComponent } from './audittrail/audittraildetail/audittraildetail.component';
import { SysErrorLoglistComponent } from './syserrorlog/syserrorloglist/syserrorloglist.component';
import { MasterjoblistComponent } from './masterjob/masterjoblist/masterjoblist.component';
import { MasterjobdetailComponent } from './masterjob/masterjobdetail/masterjobdetail.component';
import { MasterfaqlistComponent } from './masterfaq/masterfaqlist/masterfaqlist.component';
import { MasterfaqdetailComponent } from './masterfaq/masterfaqdetail/masterfaqdetail.component';
import { ReportLogComponent } from './sysreportlog/reportlog/reportlog.component';
import { LockinglistComponent } from './locking/lockinglist/lockinglist.component';
import { LockingdetailComponent } from './locking/lockingdetail/lockingdetail.component';
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ControlPanel),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule
    ],
    declarations: [
        GlobalParamlistComponent,
        GlobalParamdetailComponent,
        MasterjoblistComponent,
        MasterjobdetailComponent,
        EodlistComponent,
        EoddetailComponent,
        EodloglistComponent,
        AuditTraillistComponent,
        AuditTraildetailComponent,
        SysErrorLoglistComponent,
        MasterfaqlistComponent,
        MasterfaqdetailComponent,
        SysErrorLoglistComponent,
        ReportLogComponent,
        LockinglistComponent,
        LockingdetailComponent
    ],
    providers: [
        DALService,
        //[{ provide: ErrorHandler, useClass: GlobalErrorHandler }] // apabila error chunk sehabis publish
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // back to login if 401
        , AuthGuard // penjagaan apabila dari login langsung masuk ke dashboard atau ke halaman lain
    ]
})

export class SettingModule { }
