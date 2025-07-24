import { Routes } from '@angular/router';
import { AuditTraildetailComponent } from './audittrail/audittraildetail/audittraildetail.component';
import { AuditTraillistComponent } from './audittrail/audittraillist/audittraillist.component';
import { EoddetailComponent } from './eod/eoddetail/eoddetail.component';
import { EodlistComponent } from './eod/eodlist/eodlist.component';
import { EodloglistComponent } from './eodlog/eodloglist/eodloglist.component';
import { GlobalParamdetailComponent } from './globalparam/globalparamdetail/globalparamdetail.component';
import { GlobalParamlistComponent } from './globalparam/globalparamlist/globalparamlist.component';
import { MasterjobdetailComponent } from './masterjob/masterjobdetail/masterjobdetail.component';
import { MasterjoblistComponent } from './masterjob/masterjoblist/masterjoblist.component';
import { SysErrorLoglistComponent } from './syserrorlog/syserrorloglist/syserrorloglist.component';

import { AuthGuard } from '../../../auth.guard';
import { Component } from '@angular/core';
import { MasterfaqlistComponent } from './masterfaq/masterfaqlist/masterfaqlist.component';
import { MasterfaqdetailComponent } from './masterfaq/masterfaqdetail/masterfaqdetail.component';
import { LockinglistComponent } from './locking/lockinglist/lockinglist.component';
import { LockingdetailComponent } from './locking/lockingdetail/lockingdetail.component';
import { ReportLogComponent } from './sysreportlog/reportlog/reportlog.component';

export const ControlPanel: Routes = [{
    path: '',
    children: [
        {
            path: 'subglobalparamlist',
            component: GlobalParamlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'globalparamdetail', /*add*/
                    component: GlobalParamdetailComponent
                },
                {
                    path: 'globalparamdetail/:id', /*update*/
                    component: GlobalParamdetailComponent
                },
            ]
        },
        {
            path: 'subjobtasklist',
            component: MasterjoblistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'masterjobdetail', /*add*/
                    component: MasterjobdetailComponent
                },
                {
                    path: 'masterjobdetail/:id', /*update*/
                    component: MasterjobdetailComponent
                },
            ]
        },
        {
            path: 'subauditlist',
            component: AuditTraillistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'audittraildetail/:id', /*update*/
                    component: AuditTraildetailComponent
                },
            ]
        },

        {
            path: 'subeodlist',
            component: EodlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'eoddetail', /*add*/
                    component: EoddetailComponent
                },
                {
                    path: 'eoddetail/:id', /*update*/
                    component: EoddetailComponent
                },
            ]
        },
        {
            path: 'subeodloglist',
            component: EodloglistComponent,
            canActivate: [AuthGuard],
            children: []
        },
        {
            path: 'subsyserrorloglist',
            component: SysErrorLoglistComponent,
            canActivate: [AuthGuard],
        },
        {
            path: 'subfaqlist',
            component: MasterfaqlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'faqdetail', /*add */
                    component: MasterfaqdetailComponent
                },
                {
                    path: 'faqdetail/:id', /*update */
                    component: MasterfaqdetailComponent
                }, 
            ]
        },
        {
            path: 'sublockinglist',
            component: LockinglistComponent,
            canActivate: [AuthGuard],
            children : [
                {
                    path: 'lockingdetail',
                    component: LockingdetailComponent
                },
                {
                    path: 'lockingdetail/:id',
                    component: LockingdetailComponent

                }
            ]
        },
        {
            path: 'subreportloglist',
            component: ReportLogComponent,
            canActivate: [AuthGuard],
        },
    ]
}];
