import { Routes } from '@angular/router';
import { LoglistComponent } from './loglist/loglist.component';

export const LogWiz: Routes = [{
    path: '',
    children: [
        {
            path: 'loglist/:id',
            component: LoglistComponent
        },
    ]
}];
