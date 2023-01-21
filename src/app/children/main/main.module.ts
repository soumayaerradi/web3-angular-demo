import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {MatDialogModule} from '@angular/material/dialog';

import {MainRoutingModule} from "./main-routing.module";

import {HomeComponent} from "./home/home.component";
import {SwitchNetworkComponent} from "./component/switch-network/switch-network.component";
import {ConnectWalletComponent} from "./component/connect-wallet/connect-wallet.component";
import {FormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [
    HomeComponent,
    SwitchNetworkComponent,
    ConnectWalletComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    MatDialogModule,
    FormsModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: []
})
export class MainModule {
}
