import { Routes } from '@angular/router';
import { ReferencedetailComponent } from './referencedetail/referencedetail.component';
import { ReferencelistComponent } from './referencelist/referencelist.component';

export const ReferenceWiz: Routes = [{
    path: '',
    children: [
        {
            path: 'referencelist/:id',
            component: ReferencelistComponent
        },
        {
            path: 'referencedetail/:id', // add
            component: ReferencedetailComponent
        },
        {
            path: 'referencedetail/:id/:id2', // update
            component: ReferencedetailComponent
        }
    ]

}];
