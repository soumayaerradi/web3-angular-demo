import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { CHAIN_NAMES, ChainId, ChainIdModel, NETWORK_ICON } from "../../../../core/helpers/networks";
import { WalletService } from "../../../../core/service/wallet.service";
import { NetworkService } from "../../../../core/service/network.service";


@Component({
  selector: 'app-switch-network',
  templateUrl: './switch-network.component.html',
  styleUrls: ['./switch-network.component.scss']
})
export class SwitchNetworkComponent implements OnInit {
  current_network: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { supported_networks: any },
              private _dialogRef: MatDialogRef<SwitchNetworkComponent>,
              private _walletService: WalletService,
              private _networkService: NetworkService
  ) {
    const chain = _walletService.getGlobalVariables().wallet.network.chainId;
    this.current_network = CHAIN_NAMES[chain as keyof ChainIdModel];
  }

  ngOnInit(): void {
  }

  getIconNetwork(network: any): any {
    const chainId = ChainId[network.chainName];
    return NETWORK_ICON[chainId as unknown as keyof ChainIdModel];
  }

  switchNetwork(network: any): void {
    this._networkService.changeNetwork(network).then((_) => {
      this._dialogRef.close()
    });
  }
}
