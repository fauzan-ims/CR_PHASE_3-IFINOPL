import { Routes } from '@angular/router';
import { FamilylistComponent } from './familylist/familylist.component';
import { FamilydetailComponent } from './familydetail/familydetail.component';

export const AssetWiz: Routes = [{
    path: '',
    children: [
        {
            path: 'familylist/:id',
            component: FamilylistComponent
        },
        {
            path: 'familydetail/:id', // add
            component: FamilydetailComponent
        },
        {
            path: 'familydetail/:id/:id2', // update
            component: FamilydetailComponent
        }
    ]

}];
