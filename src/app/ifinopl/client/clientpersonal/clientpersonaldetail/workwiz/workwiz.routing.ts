import { Routes } from '@angular/router';
import { WorklistComponent } from './worklist/worklist.component';
import { WorkdetailComponent } from './workdetail/workdetail.component';

export const WorkWiz: Routes = [{
    path: '',
    children: [
        {
            path: 'worklist/:id',
            component: WorklistComponent
        },
        {
            path: 'workdetail/:id', // add
            component: WorkdetailComponent
        },
        {
            path: 'workdetail/:id/:id2', // update
            component: WorkdetailComponent
        }
    ]

}];
