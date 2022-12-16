import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { WalletService } from "../../../../core/service/wallet.service";
import { ChainId, NETWORK_INFO } from "../../../../core/helpers/networks";
import { GlobalVariables } from "../../../../core/helpers/global-variables";

@Component({
  selector: 'app-connect-wallet',
  templateUrl: './connect-wallet.component.html',
  styleUrls: ['./connect-wallet.component.scss']
})
export class ConnectWalletComponent implements OnInit {
  win: any;
  primary_network = NETWORK_INFO[ChainId.BSC];

  constructor(
    private _walletService: WalletService,
    private _dialogRef: MatDialogRef<ConnectWalletComponent>
  ) {
    this.win = (window as any);
  }

  ngOnInit(): void {
  }

  getGlobalVariables(): GlobalVariables {
    return this._walletService.getGlobalVariables()
  }

  connectWallet(type: string) {
    this._walletService.connectWallet(type).then((_) => {
      this._dialogRef.close()
    })
  }
}
