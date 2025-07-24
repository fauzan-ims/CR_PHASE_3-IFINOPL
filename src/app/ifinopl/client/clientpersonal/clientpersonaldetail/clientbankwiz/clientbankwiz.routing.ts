import { Routes } from '@angular/router';
import { ClientbanklistComponent } from './clientbanklist/clientbanklist.component';
import { ClientbankdetailComponent } from './clientbankdetail/clientbankdetail.component';
import { BankbookdetailComponent } from './clientbankdetail/bankbookdetail/bankbookdetail.component';

export const ClientBankWiz: Routes = [{
    path: '',
    children: [
        {
            path: 'clientbanklist/:id',
            component: ClientbanklistComponent
        },
        {
            path: 'clientbankdetail/:id', // add
            component: ClientbankdetailComponent
        },
        {
            path: 'clientbankdetail/:id/:id2', // update
            component: ClientbankdetailComponent
        },
        {
            path: 'bankbookdetail/:id/:id2', // add
            component: BankbookdetailComponent
        },
        {
            path: 'bankbookdetail/:id/:id2/:id3', // update
            component: BankbookdetailComponent
        }
    ]

}];
