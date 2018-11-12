
/**
 * Global configuration object.
 */
const config = {
  'api': {
    'host': 'http://144.217.167.175',
    'port': '8080',
    'prefix': '/api',
    'timeout': '5s'
  },
  'coinMarketCap': {
    'api': 'http://api.coinmarketcap.com/v1/ticker/',
	'cmc_btc':'bitcoin',
    'ticker': 'bulwark',
	'cbticker':'TRTT_BTC',
	'pricetype':'exchange', /* or 'fixed' for the fixed price below */
	'pricebtc':'0.00004'
  },
  'db': {
    'host': '127.0.0.1',
    'port': '27017',
    'name': 'blockex',
    'user': 'blockexuser',
    'pass': 'Explorer!1'
  },
  'freegeoip': {
    'api': 'https://extreme-ip-lookup.com/json/'
  },
  'ipapi': {
    'api': 'http://ip-api.com/json/'
  },
  'rpc': {
    'host': '127.0.0.1',
    'port': '11334',
    'user': 'enceladusrpc',
    'pass': 'rpcpassword',
    'timeout': 8000, // 8 seconds
  }
};

module.exports = config;
