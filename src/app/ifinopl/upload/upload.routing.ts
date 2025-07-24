import { Routes } from '@angular/router';
import { MasterUploadTablelistComponent } from './masteruploadtable/masteruploadtablelist/masteruploadtablelist.component';
import { MasterUploadTabledetailComponent } from './masteruploadtable/masteruploadtabledetail/masteruploadtabledetail.component';
import { MasterUploadValidationlistComponent } from './masteruploadvalidation/masteruploadvalidationlist/masteruploadvalidationlist.component';
import { MasterUploadValidationdetailComponent } from './masteruploadvalidation/masteruploadvalidationdetail/masteruploadvalidationdetail.component';
import { UploadInterfacelistComponent } from './uploadinterface/uploadinterfacelist/uploadinterfacelist.component';
import { UploadInterfacedetailComponent } from './uploadinterface/uploadinterfacedetail/uploadinterfacedetail.component';
import { MasterUploadTabledetaildetailComponent } from './masteruploadtable/masteruploadtabledetail/masteruploadtabledetaildetail/masteruploadtabledetaildetail.component';
//import { MasterUploadValidationdetaildetailComponent } from './masteruploadvalidation/masteruploadvalidationdetail/masteruploadvalidationdetaildetail/masteruploadvalidationdetaildetail.component';
import { AuthGuard } from '../../../auth.guard';

export const Upload: Routes = [{
    path: '',
    children: [

        /* master upload table*/
        {
            path: 'submasteruploadtablelist',
            component: MasterUploadTablelistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'masteruploadtabledetail', /*add*/
                    component: MasterUploadTabledetailComponent
                },
                {
                    path: 'masteruploadtabledetail/:id', /*add*/
                    component: MasterUploadTabledetailComponent
                },
                {
                    path: 'masteruploadtabledetaildetail/:id/:id', /*add*/
                    component: MasterUploadTabledetaildetailComponent
                },
                {
                    path: 'masteruploadtabledetaildetail/:id/:id2/:id3', /*update*/
                    component: MasterUploadTabledetaildetailComponent
                },
            ]
        },

        /*end  master upload table*/

        /* master upload validation*/
        {
            path: 'submasteruploadvalidationlist',
            component: MasterUploadValidationlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'masteruploadvalidationdetail', /*add*/
                    component: MasterUploadValidationdetailComponent
                },
                {
                    path: 'masteruploadvalidationdetail/:id', /*add*/
                    component: MasterUploadValidationdetailComponent
                },
            ]
        },

        // {
        //     path: 'masteruploadvalidationdetaildetail/:id', /*add*/
        //     component: MasterUploadValidationdetaildetailComponent
        // },
        // {
        //     path: 'masteruploadvalidationdetaildetail/:id/:id2', /*update*/
        //     component: MasterUploadValidationdetaildetailComponent
        // },
        /*end  master upload validation*/

        /* master upload interface*/
        {
            path: 'subuploadinterfacelist',
            component: UploadInterfacelistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'uploadinterfacedetail', /*add*/
                    component: UploadInterfacedetailComponent
                },
                {
                    path: 'uploadinterfacedetail/:id', /*add*/
                    component: UploadInterfacedetailComponent
                },
            ]
        },

        /*end  master upload interface*/

    ]

}];
