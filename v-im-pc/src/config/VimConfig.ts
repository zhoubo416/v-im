interface VimConfig {
  clientId: string;
  clientSecret: string;
  host: string;
  httProtocol: string;
  wsProtocol: string;
  scope: string;
  httPort: number;
  wsPort: number;
  client: string;
}

const vimConfig: VimConfig = {
  clientId: "app",
  clientSecret: "app",
  host: "127.0.0.1",
  httProtocol: "http",
  wsProtocol: "ws",
  scope: "server",
  httPort: 8070,
  wsPort: 9326,
  client: "pc",
};
export default vimConfig;
