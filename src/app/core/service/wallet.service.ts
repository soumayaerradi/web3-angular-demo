import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { GlobalVariables } from '../helpers/global-variables';
import {ChainId, NETWORK_INFO} from "../helpers/networks";
import {Network} from "./network.service";

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  win: any;

  constructor(
    public _globalVariables: GlobalVariables,
  ) {
    this.win = window as any;
  }

  /***
   * Initialize network info: default network required, initialize Metamask/BinanceChainWallet/WalletConnect provider
   * @param network The main network of the application, default Ethereum mainnet
   */
  public initNetwork(network: Network = NETWORK_INFO[1]) {
    const key: number = ChainId[network.chainName as keyof typeof ChainId];

    this._globalVariables.requiredNetwork = {
      rpc: {
        [key]: network.rpcUrls[0],
      },
      chainId: network.chainId,
      name: network.chainName,
    };

    if (
      this._globalVariables.isWalletConnected &&
      this._globalVariables.wallet.network.name.toLowerCase() !=
      this._globalVariables.requiredNetwork.name.toLowerCase()
    ) {
      console.error(
        'Switch Networks: Please connect your wallet to ' +
        this._globalVariables.requiredNetwork.chainName +
        ' network'
      );
    }

    // this.initWalletConnect();
    if (this._globalVariables.isCordova) {
      this.setConnectLinkForMobile();
    }
    this.initBinanceExt();
    this.initMetaMaskExt();
    this.initCoinBaseExt();
  }

  /***
   * Initialize Wallet connect provider and get wallet info
   * @private
   */
  private async initWalletConnect() {
    this._globalVariables.walletConnectProvider = new WalletConnectProvider({
      infuraId: this._globalVariables.infuraId,
      rpc: this._globalVariables.requiredNetwork.rpc,
    });

    // Subscribe to account change
    this._globalVariables.walletConnectProvider.on(
      'accountsChanged',
      (accounts: string[]) => {
        this._globalVariables.wallet.address = accounts[0];
        const leftSide = this._globalVariables.wallet.address.substring(0, 5);
        const rightSide = this._globalVariables.wallet.address.substring(
          this._globalVariables.wallet.address.length - 4,
          this._globalVariables.wallet.address.length
        );
        this._globalVariables.wallet.addressShort =
          leftSide + '...' + rightSide;
      }
    );

    // Subscribe to chainId change
    this._globalVariables.walletConnectProvider.on(
      'chainChanged',
      async (chainId: number) => {
        if (this._globalVariables.requiredNetwork.chainId != chainId) {
          this._globalVariables.isWalletConnected = false;
          console.error(
            'Switch Networks: Please connect your wallet to ' +
            this._globalVariables.requiredNetwork.name +
            ' network'
          );
        }
      }
    );

    // Subscribe to session disconnection
    this._globalVariables.walletConnectProvider.on(
      'disconnect',
      (code: number, reason: string) => {
        this._globalVariables.isWalletConnected = false;
      }
    );
  }

  /***
   * Set Wallet Connect mobile info
   * @private
   */
  private async setConnectLinkForMobile() {
    // when loaded within cordova shell app.
    // need to wait until the button is available in document and set listener on it
    setTimeout(() => {
      if (
        this.win.document.getElementById(
          'walletconnect-connect-button-Connect'
        ) != null
      ) {
        this.win.document.getElementById(
          'walletconnect-connect-button-Connect'
        ).onclick = (res: any) => {
          const url = (res as any).target.href;
          this.win.cordova.InAppBrowser.open(url, '_system');
        };
      } else {
        this.setConnectLinkForMobile();
      }
    }, 500);
  }

  /***
   * Set wallet info after connected
   * @param ethAddresses The addresses connected from wallet
   * @param type The type of wallet connected: ["metamask", "coinbase", "binance", "walletConnect"]
   * @private
   */
  private async setVariables(ethAddresses: any, type: string) {
    this._globalVariables.type = type;
    this._globalVariables.wallet.signer =
      this._globalVariables.wallet.provider.getSigner();
    this._globalVariables.wallet.network =
      await this._globalVariables.wallet.provider.getNetwork();

    if (Array.isArray(ethAddresses)) {
      this._globalVariables.wallet.address = ethAddresses[0];
    } else if (ethAddresses.result) {
      this._globalVariables.wallet.address = ethAddresses.result[0];
    } else {
      console.error(
        'Error getting address. Please try again or contact us'
      );
      return;
    }

    this._globalVariables.isWalletConnected = true;
    const leftSide = this._globalVariables.wallet.address.substring(0, 5);
    const rightSide = this._globalVariables.wallet.address.substring(
      this._globalVariables.wallet.address.length - 4,
      this._globalVariables.wallet.address.length
    );
    this._globalVariables.wallet.addressShort = leftSide + '...' + rightSide;
    this._globalVariables.setLocalStorage('connected', true);
    this._globalVariables.setLocalStorage('type', type);
  }

  /***
   * Initialize Metamask wallet provider
   * @private
   */
  private initMetaMaskExt() {
    if (this.win.ethereum) {
      this._globalVariables.browserExtSupported = true;

      if (this.win.ethereum.providers?.length) {
        this.win.ethereum.providers.forEach(async (p: any) => {
          if (p.isMetaMask) this._globalVariables.metaMaskExtProvider = p;
        });
      } else {
        if (this.win.ethereum.isMetaMask) {
          this._globalVariables.metaMaskExtProvider = this.win.ethereum;
        }
      }
    }
  }

  /***
   * Initialize CoinBase wallet provider
   * @private
   */
  private initCoinBaseExt() {
    if (this.win.ethereum) {
      this._globalVariables.browserExtSupported = true;

      if (this.win.ethereum.providers?.length) {
        this.win.ethereum.providers.forEach(async (p: any) => {
          if (p.isCoinbaseWallet) this._globalVariables.coinbaseExtProvider = p;
        });
      }
    }
  }

  /***
   * Returns true if Binance Chain Wallet extension is installed
   * @private
   */
  private static isBinanceInstalled(): boolean {
    return !!(
      window && Object.prototype.hasOwnProperty.call(window, 'BinanceChain')
    );
  }

  /***
   * Initialize Binance Chain Wallet provider
   * @private
   */
  private initBinanceExt() {
    if (WalletService.isBinanceInstalled() && (window as any)['BinanceChain']) {
      this._globalVariables.browserExtSupported = true;
      this._globalVariables.binanceExtProvider = this.win.BinanceChain;
    }
  }

  /***
   * Detect wallet already connected and set wallet infos
   */
  public async getWebProvider() {
    const connected = this._globalVariables.getLocalStorage('connected');
    const type = this._globalVariables.getLocalStorage('type');
    if (connected === 'true') {
      let ethAddresses = [];

      if (type === 'metamask') {
        this._globalVariables.wallet.provider =
          new ethers.providers.Web3Provider(
            this._globalVariables.metaMaskExtProvider
          );

        ethAddresses = await this._globalVariables.metaMaskExtProvider.request({
          method: 'eth_requestAccounts',
          params: [],
        });

        this._globalVariables.connectedProvider =
          this._globalVariables.metaMaskExtProvider;

        await this.setVariables(ethAddresses, type);
      } else if (type === 'coinbase') {
        this._globalVariables.wallet.provider =
          new ethers.providers.Web3Provider(
            this._globalVariables.coinbaseExtProvider
          );

        ethAddresses = await this._globalVariables.coinbaseExtProvider.request({
          method: 'eth_requestAccounts',
          params: [],
        });

        this._globalVariables.connectedProvider =
          this._globalVariables.coinbaseExtProvider;

        await this.setVariables(ethAddresses, type);
      } else if (type === 'binance') {
        this._globalVariables.wallet.provider =
          new ethers.providers.Web3Provider(this.win.BinanceChain);

        ethAddresses = await this._globalVariables.binanceExtProvider.enable();

        this._globalVariables.connectedProvider =
          this._globalVariables.binanceExtProvider;

        await this.setVariables(ethAddresses, type);
      }
    }
  }

  /***
   * Returns GlobalVariables
   */
  public getGlobalVariables(): any {
    return this._globalVariables;
  }

  /***
   * Connect wallet
   * @param type The type of wallet you want to connect: ["metamask", "coinbase", "binance", "walletConnect"]
   */
  public async connectWallet(type: string) {
    try {
      let ethAddresses = [];
      if (type == 'walletConnect') {
        ethAddresses =
          await this._globalVariables.walletConnectProvider.enable();
        this._globalVariables.wallet.provider =
          new ethers.providers.Web3Provider(
            this._globalVariables.walletConnectProvider
          );
        this._globalVariables.connectedProvider =
          this._globalVariables.walletConnectProvider;
      } else if (type == 'metamask') {
        this._globalVariables.wallet.provider =
          new ethers.providers.Web3Provider(
            this._globalVariables.metaMaskExtProvider
          );
        ethAddresses = await this._globalVariables.wallet.provider.send(
          'eth_requestAccounts',
          []
        );
        this._globalVariables.connectedProvider =
          this._globalVariables.metaMaskExtProvider;
      } else if (type == 'coinbase') {
        this._globalVariables.wallet.provider =
          new ethers.providers.Web3Provider(
            this._globalVariables.coinbaseExtProvider
          );
        ethAddresses = await this._globalVariables.wallet.provider.send(
          'eth_requestAccounts',
          []
        );
        this._globalVariables.connectedProvider =
          this._globalVariables.coinbaseExtProvider;
      } else if (type === 'binance') {
        this._globalVariables.wallet.provider =
          new ethers.providers.Web3Provider((window as any)['BinanceChain']);
        ethAddresses = await this._globalVariables.binanceExtProvider.enable();
        this._globalVariables.connectedProvider =
          this._globalVariables.binanceExtProvider;
        console.log(
          '» 🚀 Established connection successfully to %cBinance Wallet Provider',
          'color: #FABB51; font-size:14px'
        );
      }

      await this.setVariables(ethAddresses, type);
      return ethAddresses[0];
    } catch (err: any) {
      console.error(err.message);
    }
  }

  /***
   * Disconnect wallet
   */
  public async disconnectWallet() {
    this._globalVariables.setLocalStorage('connected', false);
    await this._globalVariables.connectedProvider.disconnect();
  }

  /***
   * Get wallet balance
   * @param rpc provider
   * @param wallet user
   */
  public async getWalletBalance(rpc: string, wallet: string) {
    return await ethers.getDefaultProvider(rpc).getBalance(wallet);
  }
}
