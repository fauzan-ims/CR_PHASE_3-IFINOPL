import { Routes } from '@angular/router';
import { AddresslistComponent } from './addresslist/addresslist.component';
import { AddressdetailComponent } from './addressdetail/addressdetail.component';

export const AddressWiz: Routes = [{
    path: '',
    children: [
        {
            path: 'addresslist/:id',
            component: AddresslistComponent
        },
        {
            path: 'addressdetail/:id', // add
            component: AddressdetailComponent
        },
        {
            path: 'addressdetail/:id/:id2', // update
            component: AddressdetailComponent
        }
    ]

}];
