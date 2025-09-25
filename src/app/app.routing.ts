import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { IframelayoutComponent } from './layouts/iframe/iframe-layout.component';

export const AppRoutes: Routes = [{
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
}, {
    path: '',
    component: AdminLayoutComponent,
    children: [{
        path: '',
        loadChildren: './dashboard/dashboard.module#DashboardModule'
    },
    {
        path: '',
        loadChildren: './unauthorized/unauthorized.module#UnauthorizedModule'
    },
    {
        path: 'setting',
        loadChildren: './ifinopl/setting/setting.module#SettingModule'
    },
    {
        path: 'generalpolicy',
        loadChildren: './ifinopl/generalpolicy/generalpolicy.module#SettingModule'
    },
    {
        path: 'transaction',
        loadChildren: './ifinopl/transaction/transaction.module#TransactionModule'
    },
    {
        path: 'interface',
        loadChildren: './ifinopl/interface/interface.module#InterfaceModule'
    },
    {
        path: 'inquiry',
        loadChildren: './ifinopl/inquiry/inquiry.module#InquiryModule'
    },
    {
        path: 'upload',
        loadChildren: './ifinopl/upload/upload.module#UploadModule'
    },
    {
        path: 'report',
        loadChildren: './ifinopl/report/report.module#SettingModule'
    },
    {
        path: 'help',
        loadChildren: './ifinopl/help/help.module#SettingModule'
    },
    {
        path: 'controlpanel',
        loadChildren: './ifinopl/controlpanel/controlpanel.module#SettingModule'
    },
    {
        path: 'application',
        loadChildren: './ifinopl/application/application.module#SettingModule'
    },
    {
        path: 'billing',
        loadChildren: './ifinopl/billing/billing.module#SettingModule'
    },
    {
        path: 'maintenance',
        loadChildren: './ifinopl/maintenance/maintenance.module#MaintenanceModule'
    },
    {
        path: 'client',
        loadChildren: './ifinopl/client/client.module#SettingModule'
    },
    {
        path: 'vehicle',
        loadChildren: './ifinopl/vehicle/vehicle.module#VehicleModule'
    },
    {
        path: 'machinery',
        loadChildren: './ifinopl/machinery/machinery.module#MachineryModule'
    },
    {
        path: 'he',
        loadChildren: './ifinopl/he/he.module#SettingModule'
    },
    {
        path: 'electronic',
        loadChildren: './ifinopl/electronic/electronic.module#SettingModule'
    },
    {
        path: 'contract',
        loadChildren: './ifinopl/contract/contract.module#ContractModule'
    },
    {
        path: 'management',
        loadChildren: './ifinopl/management/management.module#ManagementModule'
    },
    {
        path: 'collection',
        loadChildren: './ifinopl/collection/collection.module#CollectionModule'
    },
    {
        path: 'blacklist',
        loadChildren: './ifinopl/blacklist/blacklist.module#BlacklistModule'
    },
    ]
},
{
    path: '',
    component: AuthLayoutComponent,
    children: [
        {
            path: 'main',
            loadChildren: './mainframe/mainframe.module#MainFrameModule'
        },
        {
            path: 'pages',
            loadChildren: './pages/pages.module#PagesModule'
        }
    ]
},
{
    path: '',
    component: IframelayoutComponent,
    children: [
        {
            path: 'objectinfomanagement',
            loadChildren: './ifinopl/management/management.module#ManagementModule'
        },
        {
            path: 'objectinfoapplication',
            loadChildren: './ifinopl/application/application.module#SettingModule'
        },
        {
            path: 'objectinfomaturity',
            loadChildren: './ifinopl/maintenance/maintenance.module#MaintenanceModule'
        },
        {
            path: 'objectinfostopbillingrequest',
            loadChildren: './ifinopl/billing/billing.module#SettingModule'
        },
        {
            path: 'objectinfosettlementpphauditapproval',
            loadChildren: './ifinopl/billing/billing.module#SettingModule'
        },
    ]
}
];
