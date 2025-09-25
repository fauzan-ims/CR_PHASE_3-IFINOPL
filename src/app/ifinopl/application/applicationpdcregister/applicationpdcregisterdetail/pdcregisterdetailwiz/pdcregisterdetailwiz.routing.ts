import { Routes } from '@angular/router';
import { PdcregisterdetaillistComponent } from './pdcregisterdetaillist/pdcregisterdetaillist.component';

export const PdcRegisterDetailWizRoutes: Routes = [{
    path: '',
    children: [
        {
            path: 'pdcregisterdetaillist/:id',
            component: PdcregisterdetaillistComponent
        },
        {
            path: 'pdcregisterdetaillist/:id/:status',
            component: PdcregisterdetaillistComponent
        }
    ]
}];
