import { NgModule, ErrorHandler } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { DALService } from '../../../DALservice.service';
import { Vehicle } from './vehicle.routing';
import { AuthInterceptor } from '../../../auth-interceptor';
import { AuthGuard } from '../../../auth.guard';
import { SpinnerModule } from '../../spinner-ui/spinner/spinner.module';
import { CategorydetailComponent } from './category/categorydetail/categorydetail.component';
import { CategorylistComponent } from './category/categorylist/categorylist.component';
import { SubcategorydetailComponent } from './subcategory/subcategorydetail/subcategorydetail.component';
import { SubcategorylistComponent } from './subcategory/subcategorylist/subcategorylist.component';
import { MerklistComponent } from './merk/merklist/merklist.component';
import { MerkdetailComponent } from './merk/merkdetail/merkdetail.component';
import { ModellistComponent } from './model/modellist/modellist.component';
import { ModeldetailComponent } from './model/modeldetail/modeldetail.component';
import { TypelistComponent } from './type/typelist/typelist.component';
import { TypedetailComponent } from './type/typedetail/typedetail.component';
import { UnitlistComponent } from './unit/unitlist/unitlist.component';
import { UnitdetailComponent } from './unit/unitdetail/unitdetail.component';
import { PricelistComponent } from './price/pricelist/pricelist.component';
import { PricedetailComponent } from './price/pricedetail/pricedetail.component';
import { PricelistdetailComponent } from './price/pricedetail/pricelist/pricelistdetail.component';
import { GlobalErrorHandler } from '../../../GlobalErrorHandler';
import { MadeinlistComponent } from './madein/madeinlist/madeinlist.component';
import { MadeindetailComponent } from './madein/madeindetail/madeindetail.component';
import { PriceuploadComponent } from './price/priceupload/priceupload.component';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(Vehicle),
        FormsModule,
        HttpClientModule,
        NgbModule,
        DataTablesModule,
        SpinnerModule,
        AngularMyDatePickerModule
    ],
    declarations: [
        SubcategorylistComponent,
        SubcategorydetailComponent,
        CategorylistComponent,
        CategorydetailComponent,
        MerklistComponent,
        MerkdetailComponent,
        ModellistComponent,
        ModeldetailComponent,
        TypelistComponent,
        TypedetailComponent,
        UnitlistComponent,
        UnitdetailComponent,
        PricelistComponent,
        PricedetailComponent,
        PricelistdetailComponent,
        PriceuploadComponent,
        MadeinlistComponent,
        MadeindetailComponent
    ],
    providers: [
        DALService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // back to login if 401
        , AuthGuard // penjagaan apabila dari login langsung masuk ke dashboard atau ke halaman lain
    ]
})

export class VehicleModule { }
