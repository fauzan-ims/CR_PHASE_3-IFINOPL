import { Routes } from '@angular/router';
import { AuthGuard } from '../../../auth.guard';
import { AssetallocationdetailComponent } from './assetallocation/assetallocationdetail/assetallocationdetail.component';
import { AssetallocationlistComponent } from './assetallocation/assetallocationlist/assetallocationlist.component';
import { DeliveryassetdetailComponent } from './delivery/deliverydetail/deliverywiz/asset/deliveryassetdetail/deliveryassetdetail.component';
import { DeliverydetailComponent } from './delivery/deliverydetail/deliverydetail.component';
import { DeliverylistComponent } from './delivery/deliverylist/deliverylist.component';
import { DeliveryrequestlistComponent } from './deliveryrequest/deliveryrequestlist.component';
import { PurchaserequestdetailComponent } from './purchaserequest/purchaserequestdetail/purchaserequestdetail.component';
import { PurchaserequestlistComponent } from './purchaserequest/purchaserequestlist/purchaserequestlist.component';
import { RequestgtslistComponent } from './requestgts/requestgtslist/requestgtslist.component';
import { RequestgtsdetailComponent } from './requestgts/requestgtsdetail/requestgtsdetail.component';
import { DeliverydetaillistComponent } from './delivery/deliverydetail/deliverywiz/asset/deliverydetaillist.component';
import { DocumentlistComponent } from './delivery/deliverydetail/deliverywiz/document/documentlist.component';
// import { DocumentTBOlistComponent } from './documenttbo/documentbolist/documenttbolist.component';
// import { DocumentTBOdetailComponent } from './documenttbo/documenttbodetail/documenttbodetail.component';
// import { DocumenttbodetailcontractwizlistComponent } from './documenttbo/documenttbodetail/documenttbodetailcontractwiz/documenttbodetailcontractwizlist/documenttbodetailcontractwizlist.component';
// import { DocumenttbodetailtbowizlistComponent } from './documenttbo/documenttbodetail/documenttbodetailtbowiz/documenttbodetailtbowizlist/documenttbodetailtbowizlist.component';
import { MonitoringassetallocationComponent } from './monitoring/monitoringassetallocation.component';
import { LoglistComponent } from './delivery/deliverydetail/deliverywiz/logwiz/loglist/loglist.component';

export const Contract: Routes = [{
    path: '',
    children: [
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
                    children: [
                        {
                            path: 'documentlist/:id',
                            component: DocumentlistComponent,
                        },
                        {
                            path: 'deliverydetaillist/:id',
                            component: DeliverydetaillistComponent,
                        },
                        {
                            path: 'deliveryassetdetail/:id/:id2',
                            component: DeliveryassetdetailComponent,
                        },
                        {
                            path: 'loglist/:id',
                            component: LoglistComponent,
                        },
                    ]
                }
            ],
            canActivate: [AuthGuard]
        },

        {
            path: 'subassetallocationlist',
            component: AssetallocationlistComponent,
            children: [
                {
                    path: 'assetallocationdetail/:id', // update
                    component: AssetallocationdetailComponent,
                },
            ],
            canActivate: [AuthGuard]
        },

        {
            path: 'subpurchaserequestlist',
            component: PurchaserequestlistComponent,
            children: [
                {
                    path: 'purchaserequestdetail/:id', // update
                    component: PurchaserequestdetailComponent,
                },
            ],
            canActivate: [AuthGuard]
        },

        {
            path: 'subrequestgtslist',
            component: RequestgtslistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'requestgtsdetail/:id',
                    component: RequestgtsdetailComponent,
                }
            ],
        },
        {
            path: 'submonitoringassetallocation',
            component: MonitoringassetallocationComponent,
            children: [
                {
                    path: 'assetallocationdetail/:id', // update
                    component: AssetallocationdetailComponent,
                },
            ],
            canActivate: [AuthGuard]
        },
        // {
        //     path: 'subdocumenttbolist',
        //     component: DocumentTBOlistComponent,
        //     children: [
        //         {
        //             path: 'documenttbodetail/:id',
        //             component : DocumentTBOdetailComponent,
        //             children: [
        //                 {
        //                     path: 'documenttbocontract/:id',
        //                     component: DocumenttbodetailcontractwizlistComponent
        //                 },
        //                 {
        //                     path: 'documenttbotbo/:id',
        //                     component: DocumenttbodetailtbowizlistComponent
        //                 }
        //             ]
        //         }
        //     ]
        // }
    ]

}];
