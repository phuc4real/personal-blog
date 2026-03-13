import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: "phuc le's blog",
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent)
  },
  {
    path: 'about',
    title: 'About | phuc le',
    loadComponent: () => import('./pages/about/about.component').then((m) => m.AboutComponent)
  },
  {
    path: 'contact',
    title: 'Contact | phuc le',
    loadComponent: () => import('./pages/contact/contact.component').then((m) => m.ContactComponent)
  },
  {
    path: 'project',
    title: 'Projects | phuc le',
    loadComponent: () => import('./pages/project/project.component').then((m) => m.ProjectComponent)
  },
  {
    path: 'post/:slug',
    title: 'Post | phuc le',
    loadComponent: () => import('./pages/post-detail/post-detail.component').then((m) => m.PostDetailComponent)
  },
  {
    path: '404',
    title: '404 Not Found | phuc le',
    loadComponent: () => import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent)
  },
  {
    path: '**',
    redirectTo: '/404'
  }
];
