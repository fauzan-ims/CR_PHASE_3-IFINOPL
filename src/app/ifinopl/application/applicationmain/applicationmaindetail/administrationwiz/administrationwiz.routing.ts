import { Routes } from '@angular/router';
import { AdministrationdetailComponent } from './administrationdetail/administrationdetail.component';
import { FeelistComponent } from './administrationdetail/feewiz/feelist/feelist.component';
import { FeedetailComponent } from './administrationdetail/feewiz/feedetail/feedetail.component';
import { ChargesdetailComponent } from './administrationdetail/chargeswiz/chargesdetail/chargesdetail.component';
import { ChargeslistComponent } from './administrationdetail/chargeswiz/chargeslist/chargeslist.component';
import { DoclistComponent } from './administrationdetail/documentwiz/doclist/doclist.component';

export const AssetdanCollateralWiz: Routes = [{
    path: '',
    children: [
        {
            path: 'administrationdetail/:id/:id2',
            component: AdministrationdetailComponent,
            children: [
                {
                    path: 'feelist/:id',
                    component: FeelistComponent
                },
                {
                    path: 'feedetail/:id',
                    component: FeedetailComponent
                },
                {
                    path: 'feedetail/:id/:id2',
                    component: FeedetailComponent
                },
                {
                    path: 'chargeslist/:id',
                    component: ChargeslistComponent
                },
                {
                    path: 'chargesdetail/:id',
                    component: ChargesdetailComponent
                },
                {
                    path: 'chargesdetail/:id/:id2',
                    component: ChargesdetailComponent
                },
            ]
        },
        {
            path: 'administrationdetail/:id/:id2/:page',
            component: AdministrationdetailComponent,
            children: [
                {
                    path: 'feelist/:id/:page',
                    component: FeelistComponent
                },
                {
                    path: 'feedetail/:id/:id2/:page',
                    component: FeedetailComponent
                },
                {
                    path: 'chargeslist/:id/:page',
                    component: ChargeslistComponent
                },
                {
                    path: 'chargesdetail/:id/:page',
                    component: ChargesdetailComponent
                },
                {
                    path: 'chargesdetail/:id/:id2/:page',
                    component: ChargesdetailComponent
                }
            ]
        },
        {
            path: 'doclist/:id',
            component: DoclistComponent
        },
    ]
}];
