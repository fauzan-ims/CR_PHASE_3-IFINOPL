import { Routes } from '@angular/router';
import { ClientpersonallistComponent } from './clientpersonal/clientpersonallist/clientpersonallist.component';
import { ClientpersonaldetailComponent } from './clientpersonal/clientpersonaldetail/clientpersonaldetail.component';
import { ClientmatchingdetailComponent } from './clientpersonal/clientmatching/clientmatchingdetail/clientmatchingdetail.component';
import { AddresslistComponent } from './clientpersonal/clientpersonaldetail/addresswiz/addresslist/addresslist.component';
import { AddressdetailComponent } from './clientpersonal/clientpersonaldetail/addresswiz/addressdetail/addressdetail.component';
import { AssetlistComponent } from './clientpersonal/clientpersonaldetail/assetwiz/assetlist/assetlist.component';
import { AssetdetailComponent } from './clientpersonal/clientpersonaldetail/assetwiz/assetdetail/assetdetail.component';
import { ClientbanklistComponent } from './clientpersonal/clientpersonaldetail/clientbankwiz/clientbanklist/clientbanklist.component';
import { ClientbankdetailComponent } from './clientpersonal/clientpersonaldetail/clientbankwiz/clientbankdetail/clientbankdetail.component';
import { BankbookdetailComponent } from './clientpersonal/clientpersonaldetail/clientbankwiz/clientbankdetail/bankbookdetail/bankbookdetail.component';
import { FamilylistComponent } from './clientpersonal/clientpersonaldetail/familywiz/familylist/familylist.component';
import { FamilydetailComponent } from './clientpersonal/clientpersonaldetail/familywiz/familydetail/familydetail.component';
import { LoglistComponent } from './clientpersonal/clientpersonaldetail/logwiz/loglist/loglist.component';
import { ReferencelistComponent } from './clientpersonal/clientpersonaldetail/referencewiz/referencelist/referencelist.component';
import { ReferencedetailComponent } from './clientpersonal/clientpersonaldetail/referencewiz/referencedetail/referencedetail.component';
import { ShareholderlistComponent } from './clientpersonal/clientpersonaldetail/shareholderwiz/shareholderlist/shareholderlist.component';
import { ShareholderdetailComponent } from './clientpersonal/clientpersonaldetail/shareholderwiz/shareholderdetail/shareholderdetail.component';
import { WorklistComponent } from './clientpersonal/clientpersonaldetail/workwiz/worklist/worklist.component';
import { WorkdetailComponent } from './clientpersonal/clientpersonaldetail/workwiz/workdetail/workdetail.component';
import { DocumentdetailComponent } from './clientpersonal/clientpersonaldetail/documentswiz/documentdetail/documentdetail.component';
import { DoclistComponent } from './clientpersonal/clientpersonaldetail/documentswiz/documentdetail/documentwiz/doclist/doclist.component';
import { DocdetailComponent } from './clientpersonal/clientpersonaldetail/documentswiz/documentdetail/documentwiz/docdetail/docdetail.component';
import { NotariallistComponent } from './clientpersonal/clientpersonaldetail/documentswiz/documentdetail/notarialwiz/notariallist/notariallist.component';
import { NotarialdetailComponent } from './clientpersonal/clientpersonaldetail/documentswiz/documentdetail/notarialwiz/notarialdetail/notarialdetail.component';

import { AuthGuard } from '../../../auth.guard';
import { ClientkycdetailComponent } from './clientpersonal/clientpersonaldetail/clientkyc/clientkycdetail/clientkycdetail.component';
import { ClientkycdetailinfoComponent } from './clientpersonal/clientpersonaldetail/clientkyc/clientkycdetail/clientkycdetailinfo/clientkycdetailinfo.component';

export const Client: Routes = [{
    path: '',
    children: [
        {
            path: 'subclientpersonallist',
            component: ClientpersonallistComponent,
            children: [
                {
                    path: 'clientpersonaldetail/:id2/:type/:from/:page', // add
                    component: ClientpersonaldetailComponent
                },
                {
                    path: 'clientpersonaldetail/:id/:id2/:type/:from/:page', // update
                    component: ClientpersonaldetailComponent,
                    children: [

                        //document
                        {
                            path: 'documentdetail/:id/:type',
                            component: DocumentdetailComponent,
                            children: [
                                {
                                    path: 'doclist/:id',
                                    component: DoclistComponent,
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
                                    path: 'notarialdetail/:id/:id2',
                                    component: NotarialdetailComponent
                                },
                            ]
                        },

                        //address
                        {
                            path: 'addresslist/:id/:id2/:type/:from/:page',
                            component: AddresslistComponent,
                        },
                        {
                            path: 'addressdetail/:id/:id2/:type/:from/:page', // add
                            component: AddressdetailComponent
                        },
                        {
                            path: 'addressdetail/:id/:id2/:type/:from/:page/:id3', // update
                            component: AddressdetailComponent
                        },

                        //asset
                        {
                            path: 'assetlist/:id/:id2/:type/:from/:page',
                            component: AssetlistComponent,
                        },
                        {
                            path: 'assetdetail/:id/:id2/:type/:from/:page', // add
                            component: AssetdetailComponent
                        },
                        {
                            path: 'assetdetail/:id/:id2/:type/:from/:page/:id3', // update
                            component: AssetdetailComponent
                        },

                        //clientbank
                        {
                            path: 'clientbanklist/:id/:id2/:type/:from/:page',
                            component: ClientbanklistComponent,
                        },
                        {
                            path: 'clientbankdetail/:id/:id2/:type/:from/:page', // add
                            component: ClientbankdetailComponent
                        },
                        {
                            path: 'clientbankdetail/:id/:id2/:type/:from/:page/:id3', // update
                            component: ClientbankdetailComponent
                        },
                        {
                            path: 'bankbookdetail/:id/:id2/:type/:from/:page/:id3', // add
                            component: BankbookdetailComponent
                        },
                        {
                            path: 'bankbookdetail/:id/:id2/:type/:from/:page/:id3/:id4', // update
                            component: BankbookdetailComponent
                        },

                        //family
                        {
                            path: 'familylist/:id/:id2/:type/:from/:page',
                            component: FamilylistComponent,
                        },
                        {
                            path: 'familydetail/:id/:id2/:type/:from/:page', // add
                            component: FamilydetailComponent
                        },
                        {
                            path: 'familydetail/:id/:id2/:type/:from/:page/:id3', // update
                            component: FamilydetailComponent
                        },

                        //log
                        {
                            path: 'loglist/:id/:id2/:type/:from/:page',
                            component: LoglistComponent
                        },

                        //reference
                        {
                            path: 'referencelist/:id/:id2/:type/:from/:page',
                            component: ReferencelistComponent,
                        },
                        {
                            path: 'referencedetail/:id/:id2/:type/:from/:page', // add
                            component: ReferencedetailComponent
                        },
                        {
                            path: 'referencedetail/:id/:id2/:type/:from/:page/:id3', // update
                            component: ReferencedetailComponent
                        },

                        //kyc 
                        {
                            path: 'clientkycdetail/:id/:id2/:type/:from/:page', // update
                            component: ClientkycdetailComponent
                        },
                        {
                            path: 'clientkycdetailinfo/:id/:id2/:type/:from/:page/:id3', // update
                            component: ClientkycdetailinfoComponent
                        },

                        //shareholder
                        {
                            path: 'shareholderlist/:id/:id2/:type/:from/:page',
                            component: ShareholderlistComponent,
                        },
                        {
                            path: 'shareholderdetail/:id/:id2/:type/:from/:page',
                            component: ShareholderdetailComponent
                        },
                        {
                            path: 'shareholderdetail/:id/:id2/:type/:from/:page/:id3',
                            component: ShareholderdetailComponent
                        },

                        //work
                        {
                            path: 'worklist/:id/:id2/:type/:from/:page',
                            component: WorklistComponent,
                        },
                        {
                            path: 'workdetail/:id/:id2/:type/:from/:page', // add
                            component: WorkdetailComponent
                        },
                        {
                            path: 'workdetail/:id/:id2/:type/:from/:page/:id3', // update
                            component: WorkdetailComponent
                        },

                    ]
                },
            ],
            canActivate: [AuthGuard],
        },
        {
            path: 'clientmatchingdetail/:from',
            component: ClientmatchingdetailComponent,
            canActivate: [AuthGuard],
        },
        {
            path: 'clientmatchingdetail/:prospectId/:from',
            component: ClientmatchingdetailComponent,
            canActivate: [AuthGuard],
        },
    ]
}];
