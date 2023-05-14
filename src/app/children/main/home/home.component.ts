import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ethers} from "ethers";

import {ConnectWalletComponent} from '../component/connect-wallet/connect-wallet.component';

import {WalletService} from "../../../core/service/wallet.service";
import {ContractService} from "../../../core/service/contract.service";
import {NetworkService} from "../../../core/service/network.service";

import {GlobalVariables} from "../../../core/helpers/global-variables";
import {ChainId, NETWORK_INFO} from "../../../core/helpers/networks";


/***
 * address 1: 0x2060266bA136DC0b2f4D5Cebd147209F0954C756
 * address 2: 0x87028e52304A3d58D6d48DC5a864815Ab70fB6F5
 */

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  win: any;
  primary_network = NETWORK_INFO[ChainId.BSCTestnet];

  BUSD_ADDRESS: string = '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee';
  BUSD_ABI: string[] = [
    "function name() public view returns (string name)",
    "function balanceOf(address _owner) public view returns (uint256 balance)",
    "function transfer(address _to, uint256 _value) public returns (bool success)",
  ];

  allowance: string | undefined;
  checked: boolean = false;
  balance: string | undefined;
  amount: string = '0';
  recipient: string = '';
  spender: string = '';

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
      // check network only if needed
      .then((_) => _networkService.checkNetwork(this.primary_network));
  }

  ngOnInit(): void {
    this.getTokenName();
  }

  async getTokenName() {
    const provider = new ethers.providers.JsonRpcProvider(this.primary_network.rpcUrls[0]);
    const busdContract = new ethers.Contract(this.BUSD_ADDRESS, this.BUSD_ABI, provider);
    const tokenName = await busdContract['name']();

    console.log(tokenName);
  }

  async getBalance() {
    const provider = this.getGlobalVariables().metaMaskExtProvider;
    const web3provider = new ethers.providers.Web3Provider(provider);
    const signer = web3provider.getSigner();
    const userAddress = await signer.getAddress();

    const busdContract = new ethers.Contract(this.BUSD_ADDRESS, this.BUSD_ABI, signer);

    let busdBalance = await busdContract['balanceOf'](userAddress);

    console.log(busdBalance);
    busdBalance = ethers.utils.formatUnits(busdBalance, 18);

    console.log(busdBalance);

    this.balance = busdBalance;
  }

  async transfer() {
    const provider = this.getGlobalVariables().metaMaskExtProvider;
    const web3provider = new ethers.providers.Web3Provider(provider);
    const signer = web3provider.getSigner();

    const busdContract = new ethers.Contract(this.BUSD_ADDRESS, this.BUSD_ABI, signer);

    const amountFormatted = ethers.utils.parseEther(this.amount)

    const tx = await busdContract['transfer'](this.recipient, amountFormatted);
    console.log(tx);

    const receipt = await tx.wait();
    console.log(receipt);
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
    this.dialog.open(ConnectWalletComponent);
  }
}
