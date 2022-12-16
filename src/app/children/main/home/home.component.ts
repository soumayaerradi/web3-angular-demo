import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BigNumber, formatFixed } from '@ethersproject/bignumber';

import { ConnectWalletComponent } from '../component/connect-wallet/connect-wallet.component';
import { SwitchNetworkComponent } from '../component/switch-network/switch-network.component';

import { GlobalVariables } from "../../../core/helpers/global-variables";
import { ChainId, NETWORK_INFO } from "../../../core/helpers/networks";
import { WalletService } from "../../../core/service/wallet.service";
import { ContractService } from "../../../core/service/contract.service";
import { NetworkService } from "../../../core/service/network.service";

const ERC20abi = require('../../../core/abi/erc20.abi.json');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  win: any;
  primary_network = NETWORK_INFO[ChainId.BSCTestnet];
  supported_network = [
    NETWORK_INFO[ChainId.BSC],
    NETWORK_INFO[ChainId.Avalanche],
    NETWORK_INFO[ChainId.Palm],
    NETWORK_INFO[ChainId.Polygon],
  ];
  balance: string | undefined;
  allowance: string | undefined;
  amount: string = '0';

  constructor(
    public dialog: MatDialog,
    private _walletService: WalletService,
    private _networkService: NetworkService,
    private _contractService: ContractService,
  ) {
    this.win = window as any;

    // init network necessary
    _walletService.initNetwork(this.primary_network);

    // check account
    this.getProvider()
  }

  ngOnInit(): void {}

  handleRead(): void {
    this.readBalance(this.getGlobalVariables().wallet.address)
    this.readAllowance(this.getGlobalVariables().wallet.address, this.getGlobalVariables().wallet.address);
  }

  handleWrite(): void {
    this.approve(this.getGlobalVariables().wallet.address, +this.amount)
  }

  // example of write contract
  async approve(spender: string, amount: number) {
    const decimals = 18;
    const amountBignumber = BigNumber.from(amount).mul(BigNumber.from(10).pow(decimals));

    try {
      const tx = await this._contractService.writeContract(
        '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee', // BUSD testnet
        ERC20abi,
        'approve',
        [spender, amountBignumber]
      );

      console.log('Successfully approved');
      this.amount = '0';
      this.readAllowance(this.getGlobalVariables().wallet.address, this.getGlobalVariables().wallet.address)
    } catch (error: any) {
      console.error(error.message);
    }
  }

  // example of read contract
  async readBalance(account: string) {
    try {
      const balance = await this._contractService.readContract(
        '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee', // BUSD testnet
        NETWORK_INFO[ChainId.BSCTestnet].rpcUrls[0],
        ERC20abi,
        'balanceOf',
        [account]
      );

      console.log('Balance in BigNumber: ', balance);
      console.log('Balance as number: ', Number(balance));
      this.balance = formatFixed(balance, 18);
    } catch (error: any) {
      console.error(error.message);
    }
  }

  // example of read contract
  async readAllowance(owner: string, spender: string) {
    try {
      const allowance = await this._contractService.readContract(
        '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee', // BUSD testnet
        NETWORK_INFO[ChainId.BSCTestnet].rpcUrls[0],
        ERC20abi,
        'allowance',
        [owner, spender]
      );

      this.allowance = formatFixed(allowance, 18)
    } catch (error: any) {
      console.error(error.message);
    }
  }

  getGlobalVariables(): GlobalVariables {
    return this._walletService.getGlobalVariables();
  }

  async getProvider(): Promise<void> {
    await this._walletService.getWebProvider();
  }

  async disconnectWallet(): Promise<void> {
    await this._walletService.disconnectWallet();
  }

  openConnect(): void {
    this.dialog
      .open(ConnectWalletComponent);
  }

  openSwitchNetwork(): void {
    this.dialog.open(SwitchNetworkComponent, {
      data: { supported_networks: this.supported_network },
    });
  }
}
