import type { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SearchComponent } from './pages/search/search.component';
import { CreateProjectComponent } from './pages/project/create-project/create-project.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { NotificationComponent } from './pages/notification/notification.component';
import { ProjectDetailComponent } from './pages/project/project-detail/project-detail.component';
import { AuthComponent } from './pages/auth/auth.component';
import { ProfileComponent } from './pages/user/profile/profile.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'search',
        component: SearchComponent
    },
    {
        path: 'create-project',
        component: CreateProjectComponent
    },
    {
        path: 'notification',
        component: NotificationComponent
    },
    {
        path: 'messages',
        component: MessagesComponent
    },
    {
        path: 'log-in',
        component: AuthComponent
    },
    {
        path: 'sign-in',
        component: AuthComponent
    },
    {
        path: 'profile',
        component: ProfileComponent
    },
    {
        path: 'project/:id',
        component: ProjectDetailComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];
