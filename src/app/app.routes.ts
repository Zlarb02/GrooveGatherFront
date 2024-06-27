import type { Routes } from '@angular/router';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { BestPracticesComponent } from './pages/best-practices/best-practices.component';
import { HomeComponent } from './pages/home/home.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { NotificationComponent } from './pages/notification/notification.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { CreateProjectComponent } from './pages/project/create-project/create-project.component';
import { ProjectDetailComponent } from './pages/project/project-detail/project-detail.component';
import { SearchComponent } from './pages/search/search.component';
import { ProfileComponent } from './pages/user/profile/profile.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: 'create-project',
    component: CreateProjectComponent,
  },
  {
    path: 'notification',
    component: NotificationComponent,
  },
  {
    path: 'messages',
    component: MessagesComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'logout',
    component: LoginComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'project/:id',
    component: ProjectDetailComponent,
  },
  {
    path: 'best-practices',
    component: BestPracticesComponent,
  },
  {
    path: 'about-us',
    component: AboutUsComponent,
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
  },
  {
    path: '**',
    redirectTo: '',
  }
];
