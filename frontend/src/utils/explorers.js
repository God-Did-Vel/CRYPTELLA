// Block explorers for "View transaction" links, by network id
export const EXPLORERS = {
  BTC: 'https://mempool.space/tx/', ERC20: 'https://etherscan.io/tx/', BEP20: 'https://bscscan.com/tx/',
  ARBITRUM: 'https://arbiscan.io/tx/', BASE: 'https://basescan.org/tx/', TRC20: 'https://tronscan.org/#/transaction/',
  SOL: 'https://solscan.io/tx/', XRP: 'https://xrpscan.com/tx/', ADA: 'https://cardanoscan.io/transaction/',
  XLM: 'https://stellar.expert/explorer/public/tx/', BCH: 'https://blockchair.com/bitcoin-cash/transaction/',
  NEAR: 'https://nearblocks.io/txns/', LTC: 'https://blockchair.com/litecoin/transaction/',
  AVAXC: 'https://snowtrace.io/tx/', HBAR: 'https://hashscan.io/mainnet/transaction/', SUI: 'https://suiscan.xyz/mainnet/tx/',
}

export const explorerTxUrl = (networkId, txHash) => (EXPLORERS[networkId] && txHash ? EXPLORERS[networkId] + txHash : null)
