import WebSocket from 'ws';
export class BinanceWebsocketClient {
  client: WebSocket
  constructor(url?: string) {
    this.client = new WebSocket(url);
  }

  onConnect(cb: any) {
    this.client.onopen = cb;
  }

  onMessage(cb: any) {
    this.client.onmessage = cb;
  }

  sendMessage(msg: {}) {
    this.client.send(JSON.stringify(msg));
  }
}


export default {};