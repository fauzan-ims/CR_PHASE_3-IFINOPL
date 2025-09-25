import { Routes } from '@angular/router';
import { DocumentdetailComponent } from './documentdetail/documentdetail.component';
import { DoclistComponent } from './documentdetail/documentwiz/doclist/doclist.component';
import { DocdetailComponent } from './documentdetail/documentwiz/docdetail/docdetail.component';
import { NotariallistComponent } from './documentdetail/notarialwiz/notariallist/notariallist.component';
import { NotarialdetailComponent } from './documentdetail/notarialwiz/notarialdetail/notarialdetail.component';

export const DocumentWiz: Routes = [{
    path: '',
    children: [
        {
            path: 'documentdetail/:id/:type',
            component: DocumentdetailComponent
        },
        {
            path: 'doclist/:id',
            component: DoclistComponent
        },
        {
            path: 'docdetail/:id',
            component: DocdetailComponent
        },
        {
            path: 'docdetail/:id/:id2',
            component: DocdetailComponent
        },
        {
            path: 'notariallist/:id',
            component: NotariallistComponent
        },
        {
            path: 'notarialdetail/:id',
            component: NotarialdetailComponent
        },
        {
            path: 'notarialdetail/:id/:id2', // update
            component: NotarialdetailComponent
        },
    ]
}];
