import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { Upload } from './upload.routing';
import { DALService } from '../../../DALservice.service';
import { AuthInterceptor } from '../../../auth-interceptor';
import { AuthGuard } from '../../../auth.guard';
import { SpinnerModule } from '../../spinner-ui/spinner/spinner.module';
import { MasterUploadTablelistComponent } from './masteruploadtable/masteruploadtablelist/masteruploadtablelist.component';
import { MasterUploadTabledetailComponent } from './masteruploadtable/masteruploadtabledetail/masteruploadtabledetail.component';
import { MasterUploadValidationlistComponent } from './masteruploadvalidation/masteruploadvalidationlist/masteruploadvalidationlist.component';
import { MasterUploadValidationdetailComponent } from './masteruploadvalidation/masteruploadvalidationdetail/masteruploadvalidationdetail.component';
import { UploadInterfacelistComponent } from './uploadinterface/uploadinterfacelist/uploadinterfacelist.component';
import { UploadInterfacedetailComponent } from './uploadinterface/uploadinterfacedetail/uploadinterfacedetail.component';
import { MasterUploadTabledetaildetailComponent } from './masteruploadtable/masteruploadtabledetail/masteruploadtabledetaildetail/masteruploadtabledetaildetail.component';
//import { MasterUploadValidationdetaildetailComponent } from './masteruploadvalidation/masteruploadvalidationdetail/masteruploadvalidationdetaildetail/masteruploadvalidationdetaildetail.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(Upload),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule
    ],
    declarations: [
        MasterUploadTablelistComponent,
        MasterUploadTabledetailComponent,
        MasterUploadTabledetaildetailComponent,
        MasterUploadValidationlistComponent,
        MasterUploadValidationdetailComponent,
        UploadInterfacelistComponent,
        UploadInterfacedetailComponent,
        //MasterUploadValidationdetaildetailComponent,

    ],
    providers: [
        DALService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // back to login if 401
        , AuthGuard // penjagaan apabila dari login langsung masuk ke dashboard atau ke halaman lain
    ]
})

export class UploadModule { }
