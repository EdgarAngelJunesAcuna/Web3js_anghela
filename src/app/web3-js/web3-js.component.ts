import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import Web3 from 'web3';

declare global {
  interface Window {
    ethereum: any;
  }
}

@Component({
  selector: 'app-web3-js',
  templateUrl: './web3-js.component.html',
  styleUrls: ['./web3-js.component.css']
})
export class Web3JsComponent implements OnInit {
  account: string | undefined;
  balance: string | undefined;
  web3: Web3 | undefined;
  connectionMessage: string | undefined;
  lastClaimTime: number | undefined;
  senderAccount: string = '';
  recipientAccount: string = '';
  senderName: string = 'Remitente';
  recipientName: string = 'Destinatario';
  transferAmount: string = '0.01'; // Monto inicial por defecto
  isSenderHidden = false;
  isRecipientHidden = false;

  private readonly REWARD_INTERVAL = 86400000; // 24 horas en milisegundos
  private readonly knownWallets: { [key: string]: string } = {
    '0xb0968d0ca3b5b2f52632bb48eba3ca8a4abdda03': 'Remitente Conocido',
    '0x1d7043a2907574c5101134791596cbecfe47d53a': 'Destinatario Conocido'
  };

  constructor(private cd: ChangeDetectorRef) {}

  async ngOnInit(): Promise<void> {
    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask está instalado y listo.');
      this.web3 = new Web3(window.ethereum);
    } else {
      console.error('MetaMask no está instalado. Por favor, instala MetaMask para continuar.');
      this.connectionMessage = 'MetaMask no está instalado. Por favor, instala MetaMask para continuar.';
    }
  }

  onSenderInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.senderAccount = inputElement.value;
    this.senderName = this.knownWallets[this.senderAccount.toLowerCase()] || this.senderAccount;
  }

  onRecipientInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.recipientAccount = inputElement.value;
    this.recipientName = this.knownWallets[this.recipientAccount.toLowerCase()] || this.recipientAccount;
  }

  onAmountInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.transferAmount = inputElement.value;
  }

  async connectMetaMask() {
    if (this.web3) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.account = accounts[0].toLowerCase(); // Convertir a minúsculas
        const senderAccountNormalized = this.senderAccount.toLowerCase();

        console.log(`Cuenta conectada: ${this.account}`);

        if (this.account === senderAccountNormalized && this.senderAccount.toLowerCase() === '0xb0968d0ca3b5b2f52632bb48eba3ca8a4abdda03') {
          const now = Date.now();

          if (!this.lastClaimTime || (now - this.lastClaimTime) > this.REWARD_INTERVAL) {
            const balance = await this.web3.eth.getBalance(this.account);
            this.balance = this.web3.utils.fromWei(balance, 'ether');

            // Enviar la recompensa (ETH)
            const tx = await this.web3.eth.sendTransaction({
              from: this.senderAccount,
              to: this.recipientAccount,
              value: this.web3.utils.toWei(this.transferAmount, 'ether')
            });

            console.log('Hash de la transacción:', tx.transactionHash);

            this.connectionMessage = `¡Éxito! Se ha enviado ${this.transferAmount} ETH a ${this.recipientName}. Regresa en 24 horas para reclamar otra recompensa.`;
            this.lastClaimTime = now;
          } else {
            this.connectionMessage = 'Ya has enviado una recompensa. Inténtalo de nuevo en 24 horas.';
          }
        } else {
          this.connectionMessage = 'Cuenta incorrecta. Debes conectarte con la cuenta de envío específica.';
        }

        this.cd.detectChanges();

      } catch (error) {
        console.error('Error al conectar MetaMask o enviar la transacción:', error);
        this.connectionMessage = 'Ocurrió un error al intentar conectar con MetaMask o enviar la transacción. Por favor, inténtalo de nuevo.';
        this.cd.detectChanges();
      }
    } else {
      alert('MetaMask no detectado. Por favor, instala MetaMask e intenta nuevamente.');
    }
  }
}
