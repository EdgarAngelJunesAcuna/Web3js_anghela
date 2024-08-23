import { Routes } from '@angular/router';
import { Web3JsComponent } from './web3-js/web3-js.component'; // Importa el componente Web3

export const routes: Routes = [
  { path: 'web3', component: Web3JsComponent }, // Ruta para Web3.js
  { path: '', redirectTo: '/web3', pathMatch: 'full' }, // Redirección inicial a 'web3'
  { path: '**', redirectTo: '/web3' } // Redirección para rutas no encontradas
];
