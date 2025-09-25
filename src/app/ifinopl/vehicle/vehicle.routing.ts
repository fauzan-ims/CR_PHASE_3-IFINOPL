import { Routes } from '@angular/router';
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
import { PriceuploadComponent } from './price/priceupload/priceupload.component';
import { MadeinlistComponent } from './madein/madeinlist/madeinlist.component';
import { MadeindetailComponent } from './madein/madeindetail/madeindetail.component';

import { AuthGuard } from '../../../auth.guard';

export const Vehicle: Routes = [{
    path: '',
    children: [
        {
            path: 'subcategorylist',
            component: CategorylistComponent,
            children: [
                {
                    path: 'categorydetail', /*add*/
                    component: CategorydetailComponent
                },
                {
                    path: 'categorydetail/:id', /*update*/
                    component: CategorydetailComponent
                },
            ],
            canActivate: [AuthGuard]
        },
        {
            path: 'subsubcategorylist',
            component: SubcategorylistComponent,
            children: [
                {
                    path: 'subcategorydetail', /*add*/
                    component: SubcategorydetailComponent
                },
                {
                    path: 'subcategorydetail/:id', /*update*/
                    component: SubcategorydetailComponent
                },
            ],
            canActivate: [AuthGuard]
        },
        {
            path: 'submerklist',
            component: MerklistComponent,
            children: [
                {
                    path: 'merkdetail', /*add*/
                    component: MerkdetailComponent
                },
                {
                    path: 'merkdetail/:id', /*update*/
                    component: MerkdetailComponent
                },
            ],
            canActivate: [AuthGuard]
        },
        {
            path: 'submodellist',
            component: ModellistComponent,
            children: [
                {
                    path: 'modeldetail', /*add*/
                    component: ModeldetailComponent
                },
                {
                    path: 'modeldetail/:id', /*update*/
                    component: ModeldetailComponent
                },
            ],
            canActivate: [AuthGuard]
        },
        {
            path: 'subtypelist',
            component: TypelistComponent,
            children: [
                {
                    path: 'typedetail', /*add*/
                    component: TypedetailComponent
                },
                {
                    path: 'typedetail/:id', /*update*/
                    component: TypedetailComponent
                },
            ],
            canActivate: [AuthGuard]
        },
        {
            path: 'subunitlist',
            component: UnitlistComponent,
            children: [
                {
                    path: 'unitdetail', /*add*/
                    component: UnitdetailComponent
                },
                {
                    path: 'unitdetail/:id', /*update*/
                    component: UnitdetailComponent
                },
            ],
            canActivate: [AuthGuard]
        },
        {
            path: 'subpricelist',
            component: PricelistComponent,
            children: [
                {
                    path: 'priceupload', /*add*/
                    component: PriceuploadComponent
                },
                {
                    path: 'priceupload/:id', /*update*/
                    component: PriceuploadComponent
                },
                {
                    path: 'pricedetail', /*add*/
                    component: PricedetailComponent
                },
                {
                    path: 'pricedetail/:id', /*update*/
                    component: PricedetailComponent
                },
                {
                    path: 'pricelistdetail/:id', /*add*/
                    component: PricelistdetailComponent
                },
                {
                    path: 'pricelistdetail/:id/:id2', /*update*/
                    component: PricelistdetailComponent
                },
            ],
            canActivate: [AuthGuard]
        },
        {
            path: 'submadeinlist',
            component: MadeinlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'madeindetail', /*add*/
                    component: MadeindetailComponent
                },
                {
                    path: 'madeindetail/:id', /*update*/
                    component: MadeindetailComponent
                },
            ]
        },
    ]

}];
