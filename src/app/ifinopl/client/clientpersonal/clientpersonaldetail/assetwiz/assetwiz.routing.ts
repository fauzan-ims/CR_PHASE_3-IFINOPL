import { Routes } from '@angular/router';
import { AssetlistComponent } from './assetlist/assetlist.component';
import { AssetdetailComponent } from './assetdetail/assetdetail.component';

export const AssetWiz: Routes = [{
    path: '',
    children: [
        {
            path: 'assetlist/:id',
            component: AssetlistComponent
        },
        {
            path: 'assetdetail/:id', // add
            component: AssetdetailComponent
        },
        {
            path: 'assetdetail/:id/:id2', // update
            component: AssetdetailComponent
        }
    ]

}];
