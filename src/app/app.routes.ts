import { Routes } from '@angular/router';
import { DataTableComponent } from './components/data-table/data-table.component';

export const routes: Routes = [
  { path: '', redirectTo: 'data-table', pathMatch: 'full' }, // Redirect to data table by default
  { path: 'data-table', component: DataTableComponent }, // Route for the DataTableComponent
  { path: '**', redirectTo: 'data-table' }, // Redirect invalid routes to data-table
];
