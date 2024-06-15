import type { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SearchComponent } from './pages/search/search.component';
import { CreateProjectComponent } from './pages/project/create-project/create-project.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { NotificationComponent } from './pages/notification/notification.component';

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
    }
];
