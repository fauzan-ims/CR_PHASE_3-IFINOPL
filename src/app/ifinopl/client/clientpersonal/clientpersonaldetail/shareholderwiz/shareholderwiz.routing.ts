import { Routes } from '@angular/router';
import { ShareholderdetailComponent } from './shareholderdetail/shareholderdetail.component';
import { ShareholderlistComponent } from './shareholderlist/shareholderlist.component';

export const ShareHolderWiz: Routes = [{
    path: '',
    children: [
        {
            path: 'shareholderlist/:id',
            component: ShareholderlistComponent
        },
        {
            path: 'shareholderdetail/:id',
            component: ShareholderdetailComponent
        },
        {
            path: 'shareholderdetail/:id/:id2',
            component: ShareholderdetailComponent
        },
    ]

}];
