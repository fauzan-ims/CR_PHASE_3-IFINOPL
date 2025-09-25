import { Routes } from '@angular/router';
import { ManualswitchdetailComponent } from '../transaction/manualswitch/manualswitchdetail/manualswitchdetail.component';
import { ManualswitchlistComponent } from '../transaction/manualswitch/manualswitchlist/manualswitchlist.component';
import { LeadsdetailComponent } from './leads/leadsdetail/leadsdetail.component';
import { OfferdetailComponent } from './leads/leadsdetail/offerwiz/offerdetail/offerdetail.component';
import { LeadslistComponent } from './leads/leadslist/leadslist.component';
import { CheckingdetailComponent } from './prospect/prospectdetail/checkingwiz/checkingdetail/checkingdetail.component';
import { CheckinglistComponent } from './prospect/prospectdetail/checkingwiz/checkinglist/checkinglist.component';
import { FollowupdetailComponent } from './prospect/prospectdetail/followupwiz/followupdetail/followupdetail.component';
import { FollowuplistComponent } from './prospect/prospectdetail/followupwiz/followuplist/followuplist.component';
import { LoglistComponent } from './prospect/prospectdetail/logwiz/loglist/loglist.component';
import { ProspectdetailComponent } from './prospect/prospectdetail/prospectdetail.component';

// wizard
import { ScoringdetailComponent } from './prospect/prospectdetail/scoringwiz/scoringdetail/scoringdetail.component';
import { ScoringlistComponent } from './prospect/prospectdetail/scoringwiz/scoringlist/scoringlist.component';
import { SimmulationdetailComponent } from './prospect/prospectdetail/simmulationwiz/simmulationdetail/simmulationdetail.component';
import { SimmulationlistComponent } from './prospect/prospectdetail/simmulationwiz/simmulationlist/simmulationlist.component';
import { ProspectlistComponent } from './prospect/prospectlist/prospectlist.component';
import { RequestlistComponent } from './request/requestlist/requestlist.component';
import { AuthGuard } from '../../../auth.guard';

export const Transaction: Routes = [{
    path: '',
    children: [
        {
            path: 'subprospectlist',
            component: ProspectlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'prospectdetail', /*add*/
                    component: ProspectdetailComponent
                },
                {
                    path: 'prospectdetail/:id', // update
                    component: ProspectdetailComponent,
                    children: [
                        //checking
                        {
                            path: 'checkinglist/:id',
                            component: CheckinglistComponent,
                            children: [
                                {
                                    path: 'checkingdetail/:id', // add
                                    component: CheckingdetailComponent
                                },
                                {
                                    path: 'checkingdetail/:id/:id2', // update
                                    component: CheckingdetailComponent
                                },
                            ]
                        },

                        //followup
                        {
                            path: 'followuplist/:id',
                            component: FollowuplistComponent,
                            children: [
                                {
                                    path: 'followupdetail/:id', // add
                                    component: FollowupdetailComponent
                                },
                                {
                                    path: 'followupdetail/:id/:id2', // update
                                    component: FollowupdetailComponent
                                },
                            ]
                        },

                        //log
                        {
                            path: 'loglist/:id',
                            component: LoglistComponent
                        },

                        //scoring
                        {
                            path: 'scoringlist/:id',
                            component: ScoringlistComponent,
                            children: [
                                {
                                    path: 'scoringdetail/:id', // add
                                    component: ScoringdetailComponent
                                },
                                {
                                    path: 'scoringdetail/:id/:id2', // update
                                    component: ScoringdetailComponent
                                },
                            ]
                        },

                        //simmulation
                        {
                            path: 'simmulationlist/:id',
                            component: SimmulationlistComponent,
                            children: [
                                {
                                    path: 'simmulationdetail/:id', // add
                                    component: SimmulationdetailComponent
                                },
                                {
                                    path: 'simmulationdetail/:id/:id2', // update
                                    component: SimmulationdetailComponent
                                }
                            ]
                        },

                    ]
                },
            ]
        },

        {
            path: 'subrequestlist',
            component: RequestlistComponent,
            canActivate: [AuthGuard],
            children: [

            ]
        },

        {
            path: 'subleadslist',
            component: LeadslistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'leadsdetail', // add
                    component: LeadsdetailComponent
                },
                {
                    path: 'leadsdetail/:id', // update
                    component: LeadsdetailComponent,
                    children: [
                        //offer
                        {
                            path: 'offerdetail/:id',
                            component: OfferdetailComponent
                        },
                        {
                            path: 'offerdetail/:id/:id2', // update
                            component: OfferdetailComponent
                        },

                        //log
                        {
                            path: 'loglist/:id',
                            component: LoglistComponent
                        },
                    ]
                },
            ]
        },

        {
            path: 'submanualswitchlist',
            component: ManualswitchlistComponent,
            canActivate: [AuthGuard],
            children: [
                {
                    path: 'manualswitchdetail', // add
                    component: ManualswitchdetailComponent
                },
                {
                    path: 'manualswitchdetail/:id', // update
                    component: ManualswitchdetailComponent
                },
            ]
        },

    ]
}];
