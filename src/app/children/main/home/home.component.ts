import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {formatFixed} from '@ethersproject/bignumber';

import {ConnectWalletComponent} from '../component/connect-wallet/connect-wallet.component';

import {GlobalVariables} from "../../../core/helpers/global-variables";
import {ChainId, NETWORK_INFO} from "../../../core/helpers/networks";
import {WalletService} from "../../../core/service/wallet.service";
import {ContractService} from "../../../core/service/contract.service";
import {NetworkService} from "../../../core/service/network.service";
import {ethers} from "ethers";

const ERC20abi = require('../../../core/abi/erc20.abi.json');


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
    this.getProvider();
  }

  ngOnInit(): void {
    this.getBalance();
  }

  async approve() {
    const provider = new ethers.providers.Web3Provider(this.win.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    const busdContract = new ethers.Contract('0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee', ERC20abi, signer);

    const amountFormatted = ethers.utils.parseEther(this.amount)

    const tx = await busdContract['approve'](this.spender, amountFormatted);

    const receipt = await tx.wait();
    console.log(receipt)
    this.readAllowance()
  }

  async readAllowance() {
    const provider = new ethers.providers.Web3Provider(this.win.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    let userAddress = await signer.getAddress();

    const busdContract = new ethers.Contract('0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee', ERC20abi, signer);

    let allowance = await busdContract['allowance'](userAddress, userAddress);

    this.allowance = formatFixed(allowance, 18)
    this.checked = +this.allowance >= +this.amount;

    console.log(this.allowance)
  }

  async getBalance() {
    const provider = new ethers.providers.Web3Provider(this.win.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    let userAddress = await signer.getAddress();

    const busd = {
      address: "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee",
      abi: [
        "function balanceOf(address _owner) public view returns (uint256 balance)",
        "function transfer(address _to, uint256 _value) public returns (bool success)",
      ],
    };

    const busdContract = new ethers.Contract(busd.address, busd.abi, signer);

    let busdBalance = await busdContract['balanceOf'](userAddress);

    busdBalance = ethers.utils.formatUnits(busdBalance, 18);

    this.balance = busdBalance
  }

  async transfer() {
    const provider = new ethers.providers.Web3Provider(this.win.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    const busd = {
      address: "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee",
      abi: [
        "function balanceOf(address _owner) public view returns (uint256 balance)",
        "function transfer(address _to, uint256 _value) public returns (bool success)",
      ],
    };

    const busdContract = new ethers.Contract(busd.address, busd.abi, signer);

    const amountFormatted = ethers.utils.parseEther(this.amount)

    const tx = await busdContract['transfer'](this.recipient, amountFormatted);

    const receipt = await tx.wait();
    console.log(receipt)
  }

  async transferFrom() {
    this.readAllowance()
    const provider = new ethers.providers.Web3Provider(this.win.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    const busdContract = new ethers.Contract('0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee', ERC20abi, signer);

    const amountFormatted = ethers.utils.parseEther(this.amount)

    const tx = await busdContract['transferFrom'](this.spender, this.recipient, amountFormatted);

    const receipt = await tx.wait();
    console.log(receipt)
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
