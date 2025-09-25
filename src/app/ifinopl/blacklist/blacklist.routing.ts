import { Routes } from '@angular/router';
import { AuthGuard } from '../../../auth.guard';
import { AreablacklistlistComponent } from './areablacklist/areablacklistlist/areablacklistlist.component';
import { AreablacklistdetailComponent } from './areablacklist/areablacklistdetail/areablacklistdetail.component';
import { AreainquirylistComponent } from './areainquiry/areainquirylist/areainquirylist.component';
import { AreainquirydetailComponent } from './areainquiry/areainquirydetail/areainquirydetail.component';


export const Blacklist: Routes = [{
    path: '',
    children: [
        {
            path: 'subareblacklistlist',
            component: AreablacklistlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'areablacklistdetail', //add
                    component: AreablacklistdetailComponent
                },
                {
                    path: 'areablacklistdetail/:id', //update
                    component: AreablacklistdetailComponent
                },
            ]
        },
        {
            path: 'subareainquirylist',
            component: AreainquirylistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'areainquirydetail/:id', //update
                    component: AreainquirydetailComponent,
                },
            ]
        },
    ]

}];