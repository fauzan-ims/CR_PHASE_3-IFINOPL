import { NgModule, ErrorHandler } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { DALService } from '../../../DALservice.service';
import { Electronic } from './electronic.routing';
import { AuthInterceptor } from '../../../auth-interceptor';
import { AuthGuard } from '../../../auth.guard';
import { SpinnerModule } from '../../spinner-ui/spinner/spinner.module';
import { CategorylistComponent } from './category/categorylist/categorylist.component';
import { CategorydetailComponent } from './category/categorydetail/categorydetail.component';
import { SubcategorylistComponent } from './subcategory/subcategorylist/subcategorylist.component';
import { SubcategorydetailComponent } from './subcategory/subcategorydetail/subcategorydetail.component';
import { MerklistComponent } from './merk/merklist/merklist.component';
import { MerkdetailComponent } from './merk/merkdetail/merkdetail.component';
import { ModellistComponent } from './model/modellist/modellist.component';
import { ModeldetailComponent } from './model/modeldetail/modeldetail.component';
import { UnitlistComponent } from './unit/unitlist/unitlist.component';
import { UnitdetailComponent } from './unit/unitdetail/unitdetail.component';
import { GlobalErrorHandler } from '../../../GlobalErrorHandler';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(Electronic),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule
    ],
    declarations: [
        CategorylistComponent,
        CategorydetailComponent,
        SubcategorylistComponent,
        SubcategorydetailComponent,
        MerklistComponent,
        MerkdetailComponent,
        ModellistComponent,
        ModeldetailComponent,
        UnitlistComponent,
        UnitdetailComponent
    ],
    providers: [
        DALService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // back to login if 401
        , AuthGuard // penjagaan apabila dari login langsung masuk ke dashboard atau ke halaman lain
    ]
})

export class SettingModule { }
