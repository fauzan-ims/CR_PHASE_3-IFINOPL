import { Routes } from '@angular/router';
import { AuthGuard } from '../../../auth.guard';
import { AssetreplacementmaindetailComponent } from './assetreplacementmain/assetreplacementmaindetail/assetreplacementmaindetail.component';
import { AssetreplacemenetmainlistComponent } from './assetreplacementmain/assetreplacementmainlist/assetreplacementmainlist.component';
import { ContractmaturitydetaillistComponent } from './contractmaturity/contractmaturitydetail/contactmaturitydetaillist/contractmaturitydetaillist.component';
import { ContractmaturitydetailComponent } from './contractmaturity/contractmaturitydetail/contractmaturitydetail.component';
import { ContractmaturitylistComponent } from './contractmaturity/contractmaturitylist/contractmaturitylist.component';
import { ContractmaturityrequestlistComponent } from './contractmaturityrequest/contractmaturityrequestlist.component';
import { RescheduledetailComponent } from './reschedule/rescheduledetail/rescheduledetail.component';
import { ReschedulelistComponent } from './reschedule/reschedulelist/reschedulelist.component';
import { ReturnassetdetailComponent } from './returnasset/returnassetdetail/returnassetdetail.component';
import { ReturnassetdetaildetailComponent } from './returnasset/returnassetdetail/returnassetdetaildetail/returnassetdetaildetail.component';
import { ReturnassetlistComponent } from './returnasset/returnassetlist/returnassetlist.component';
import { MonitoringgtslistComponent } from './monitoringgts/monitoringgtslist/monitoringgtslist.component';
import { MonitoringgtsdetailComponent } from './monitoringgts/monitoringgtsdetail/monitoringgtsdetail.component';
import { objectinfomaturityComponent } from './contractmaturity/objectinfo/objectinfomaturity/objectinfomaturity.component';
import { ObjectinfomaturitydetaillistComponent } from './contractmaturity/objectinfo/objectinfomaturity/ojectinfomaturitydetail/objectinfomaturitydetaillist.component';

export const Maintenance: Routes = [{
    path: '',
    children: [
        {
            path: 'subassetreplacementmainlist',
            component: AssetreplacemenetmainlistComponent,
            children: [
                {
                    path: 'assetreplacementmaindetail', /*add*/
                    component: AssetreplacementmaindetailComponent,
                },
                {
                    path: 'assetreplacementmaindetail/:id', /*update*/
                    component: AssetreplacementmaindetailComponent,
                },
            ],
            canActivate: [AuthGuard]
        },


        {
            path: 'subreturnassetlist',
            component: ReturnassetlistComponent,
            children: [
                {
                    path: 'returnassetdetail/:id', /*update*/
                    component: ReturnassetdetailComponent,
                },
                {
                    path: 'returnassetdetaildetail/:id/:id2', /*update*/
                    component: ReturnassetdetaildetailComponent,
                },
            ],
            canActivate: [AuthGuard]
        },

        {
            path: 'subreschedulelist',
            component: ReschedulelistComponent,
            children: [
                {
                    path: 'rescheduledetail/:id', /*update*/
                    component: RescheduledetailComponent,
                },
            ],
            canActivate: [AuthGuard]
        },

        {

            path: 'subcontractmaturitylist',
            component: ContractmaturitylistComponent,
            children: [
                {
                    path: 'contractmaturitydetail/:maturityCode', /*update*/
                    component: ContractmaturitydetailComponent,
                },
                {
                    path: 'contractmaturitydetaillist/:maturityCode/:maturityDetailId',
                    component: ContractmaturitydetaillistComponent,
                },
            ],
            canActivate: [AuthGuard]
        },

        {
            path: 'subcontractmaturityrequestlist',
            component: ContractmaturityrequestlistComponent,
            canActivate: [AuthGuard]
        },

        //monitoring gts
        {
            path: 'submonitoringgtslist',
            component: MonitoringgtslistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'monitoringgtsdetail/:id',
                    component: MonitoringgtsdetailComponent,
                },
            ]
        },

        //Object info maturity
        {
            path: 'objectinfomaturity/:maturityCode',
            component: objectinfomaturityComponent,
        },
        {
            path: 'objectinfomaturitydetail/:maturityCode/:maturityDetailId',
            component: ObjectinfomaturitydetaillistComponent,
        },
        //Object info maturity
    ]
}];

