import { Injectable } from '@angular/core';

export interface Wallet {
  address: string;
  addressShort: string;
  provider: any;
  network: any;
  signer: any;
}

@Injectable()
export class GlobalVariables {
  public isWalletConnected = false;
  public wallet: any = {};
  public type: string = '';
  public requiredNetwork: any;
  public isCordova: boolean = false;
  public infuraId: string = '';
  public connectedProvider: any = {};
  public walletConnectProvider: any = {};
  public metaMaskExtProvider: any = false;
  public binanceExtProvider: any = false;
  public coinbaseExtProvider: any = false;
  public browserExtSupported: any = false;

  public setLocalStorage = (key: string, obj: any) => {
    window.localStorage.setItem(key, obj);
  };

  public getLocalStorage = (key: string) => {
    return window.localStorage.getItem(key);
  };
}
