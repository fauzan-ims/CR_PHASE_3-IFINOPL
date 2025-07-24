import { Routes } from '@angular/router';
import { AmortizationPdclistComponent } from './amortizationpdclist/amortizationpdclist.component';

export const AmortizationPdcWizRoutes: Routes = [{
    path: '',
    children: [
        {
            path: 'amortizationpdclist/:id',
            component: AmortizationPdclistComponent
        },
        {
            path: 'amortizationpdclist/:id/:status',
            component: AmortizationPdclistComponent
        }
    ]
}];
