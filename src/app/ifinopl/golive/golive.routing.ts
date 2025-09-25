import { Routes } from '@angular/router';
import { AuthGuard } from '../../../auth.guard';
import { ApplicationmainlistComponent } from './application/applicationlist/applicationmainlist.component';
import { ApplicationmaindetailComponent } from './application/applicationmaindetail/applicationmaindetail.component';
import { DeliveryassetdetailComponent } from './delivery/deliverydetail/deliveryassetdetail/deliveryassetdetail.component';
import { DeliverydetailComponent } from './delivery/deliverydetail/deliverydetail.component';
import { DeliverylistComponent } from './delivery/deliverylist/deliverylist.component';
import { DeliveryrequestlistComponent } from './deliveryrequest/deliveryrequestlist.component';

export const Golive: Routes = [{
    path: '',
    children: [
        {
            path: 'subapplicationmainlist',
            component: ApplicationmainlistComponent,
            children: [
                {
                    path: 'applicationmaindetail/:id', // update
                    component: ApplicationmaindetailComponent,
                },
            ],
            canActivate: [AuthGuard]
        },

        {
            path: 'subdeliveryrequestlist',
            component: DeliveryrequestlistComponent,
            children: [
            ],
            canActivate: [AuthGuard]
        },

        {
            path: 'subdeliverylist',
            component: DeliverylistComponent,
            children: [
                {
                    path: 'deliverydetail/:id',
                    component: DeliverydetailComponent,
                },
                {
                    path: 'deliveryassetdetail/:id/:id2',
                    component: DeliveryassetdetailComponent,
                }
            ],
            canActivate: [AuthGuard]
        },
    ]

}];
