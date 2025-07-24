import { Routes } from '@angular/router';
import { ProfilelistComponent } from './profilelist/profilelist.component';

export const ProfileWiz: Routes = [{
    path: '',
    children: [
        {
            path: 'profilelist/:id',
            component: ProfilelistComponent
        },
    ]
}];
