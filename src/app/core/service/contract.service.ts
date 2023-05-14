import { Injectable } from '@angular/core';
import { ethers, providers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { GlobalVariables } from "../helpers/global-variables";

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  win: any;

  constructor(public _globalVariables: GlobalVariables) {
    this.win = (window as any);
  }

  /***
   * Returns web3 provider
   * @private
   */
  private async getWebProvider() {
    const type = this._globalVariables.getLocalStorage('type');
    let provider: any;

    if (type === 'metamask' && this.win.ethereum) {
      provider = this._globalVariables.metaMaskExtProvider;
    } else if (type === 'coinbase' && this.win.ethereum) {
      provider = this._globalVariables.coinbaseExtProvider;
    } else if (type === 'binance' && this.win.BinanceChain) {
      provider = this.win.BinanceChain;
    } else {
      const walletConnectProvider = new WalletConnectProvider({
        infuraId: this._globalVariables.infuraId,
        rpc: this._globalVariables.requiredNetwork.rpc,
      });

      await walletConnectProvider.enable();

      provider = walletConnectProvider;
    }

    return new ethers.providers.Web3Provider(provider);
  }

  /***
   * Write smart contract call, returns contract
   * @param contractAddress Smart contract address
   * @param abi
   * @param methodName
   * @param args
   */
  public async writeContract(contractAddress: string, abi: any, methodName: string, args?: any[]): Promise<any> {
    const provider = await this.getWebProvider();
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      contractAddress,
      abi,
      signer ? signer : provider
    );

    if (args?.length) {
      return contract[methodName](...args);
    } else {
      return contract[methodName]();
    }
  }

  /***
   * Read smart contract call, returns value
   * @param contractAddress Smart contract address
   * @param rpcProvider
   * @param abi
   * @param methodName
   * @param bySigner
   * @param args
   */
  public async readContract(contractAddress: string, rpcProvider: string, abi: any, methodName: string, args?: any[], bySigner = false): Promise<any> {
    let provider;
    let signer;

    if (bySigner) {
      provider = await this.getWebProvider();
      signer = provider.getSigner();
    } else {
      provider = new providers.JsonRpcProvider(rpcProvider);
    }

    const contractManager = new ethers.Contract(
      contractAddress,
      abi,
      bySigner ? signer : provider
    );

    if (args?.length) {
      return contractManager[methodName](...args);
    } else {
      return contractManager[methodName]();
    }
  }
}
