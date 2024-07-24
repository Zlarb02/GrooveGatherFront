import type { Routes } from '@angular/router';
import { ProjectDetailComponent } from '../assets/images/icons/project-detail/project-detail.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { BestPracticesComponent } from './pages/best-practices/best-practices.component';
import { HomeComponent } from './pages/home/home.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { NotificationComponent } from './pages/notification/notification.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { CreateProjectComponent } from './pages/project/create-project/create-project.component';
import { EditProjectComponent } from './pages/project/edit-project/edit-project.component';
import { MyProjectsComponent } from './pages/project/my-projects/my-projects.component';
import { SearchComponent } from './pages/search/search.component';
import { ProfileComponent } from './pages/user/profile/profile.component';
import { SettingsComponent } from './pages/user/settings/settings.component';

export const routes: Routes = [
  {
    path: 'home',
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
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: 'project/edit/:id',
    component: EditProjectComponent,
  },
  {
    path: 'project/:id',
    component: ProjectDetailComponent,
  },
  {
    path: 'my-projects',
    component: MyProjectsComponent,
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
    path: 'landing-page',
    component: LandingPageComponent,
  },
  {
    path: '**',
    redirectTo: '',
  }
];
