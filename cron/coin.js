
require('babel-polyfill');
const config = require('../config');
const { exit, rpc } = require('../lib/cron');
const fetch = require('../lib/fetch');
const locker = require('../lib/locker');
const moment = require('moment');
// Models.
const Coin = require('../model/coin');

/**
 * Get the coin related information including things
 * like price coinmarketcap.com data.
 */

const getSupply = (nHeight = 1) => {
    let nSupply = 0.0;
	let nMul = 0;

    if (nHeight == 1) {
        nSupply += 300000;  //premine
    }
	
	if(nHeight >1 && nHeight < 1200) { //PoS phase
        nSupply += 3 * (nHeight-1);
    }

	if(nHeight >=1200 && nHeight < 21000) { //PoS phase
        nSupply += 22 * (nHeight-1);
    }
	
	if(nHeight >= 21000 && nHeight < 28000) {
        nSupply += 45 * (nHeight - 21000);
    }
	
	if(nHeight >= 28000 && nHeight < 35000) {
        nSupply += 55 * (nHeight-28000);
    }
	
	if(nHeight >= 35000 && nHeight < 42000) {
        nSupply += 65 * (nHeight - 35000);
    }
	
	if(nHeight >= 42000 && nHeight < 49000) {
        nSupply += 55 * (nHeight - 42000);
    }
	
	if(nHeight >= 49000 && nHeight < 60000) {
        nSupply += 52 * (nHeight - 49000);
    }
	
	if(nHeight >= 60000 && nHeight < 90000) {
        nSupply += 40 * (nHeight - 60000);
    }
	
	if(nHeight >= 90000 && nHeight < 120000) {
        nSupply += 45 * (nHeight - 90000);
    }
	
	if(nHeight >= 120000 && nHeight < 180000) {
        nSupply += 35 * (nHeight - 120000);
    }
	
	if(nHeight >= 180000 && nHeight < 350000) {
        nSupply += 20 * (nHeight - 180000);
    }
	
	if(nHeight >= 350000 && nHeight < 700000) {
        nSupply += 15 * (nHeight = 350000);
    }
	
	if(nHeight >= 700000) {
        nMul = (nHeight-700000)/700000;
        nSupply += (10.0 / ((nMul+1)*2)) *(nHeight - 700000);
    }

    return nSupply;
};
 
function cryptoBridgePrice(token) {

  var url = "https://api.crypto-bridge.org/api/v1/ticker";
   
  var response = UrlFetchApp.fetch(url);
  var json = response.getContentText();
  var data = JSON.parse(json);
    
  for (i = 0; i < data.length; i++) {
    if (data[i].id == token) {
      return data[i].last
    }
  }
}
 
async function syncCoin() {
  const date = moment().utc().startOf('minute').toDate();
  // Setup the coinmarketcap.com api url.
  //const url  = `${ config.coinMarketCap.api }${ config.coinMarketCap.ticker }`;
  const url_cmc  = `${ config.coinMarketCap.api }${ config.coinMarketCap.cmc_btc }`;
  const url_cb = "https://api.crypto-bridge.org/api/v1/ticker";

  const info = await rpc.call('getinfo');
  const masternodes = await rpc.call('getmasternodecount');
  const nethashps = await rpc.call('getnetworkhashps');
  
  market_token={};

  let market_cmc = await fetch(url_cmc);
  
  if(config.coinMarketCap.pricetype == 'fixed') {
	  //fxied price before CB listing
  } else {
  
  let market = await fetch(url_cb);

  if (Array.isArray(market)) {
    console.log('Market is an array!');
    //market = market.length ? market[0] : {};
	
	for (i = 0; i < market.length; i++) {
	console.log(market[i].id);
    if (market[i].id == config.coinMarketCap.cbticker) {
      market_token = market[i];
	  break;
    }
  }
  }
  }

    var price_usd = 0;
	var price_btc = 0;

  
/*  const coin = new Coin({
    cap: market.market_cap_usd,
    createdAt: date,
    blocks: info.blocks,
    btc: market.price_btc,
    diff: info.difficulty,
    mnsOff: masternodes.total - masternodes.stable,
    mnsOn: masternodes.stable,
    netHash: nethashps,
    peers: info.connections,
    status: 'Online',
    supply: market.available_supply, // TODO: change to actual count from db.
    usd: market.price_usd
  });
*/
    if(config.coinMarketCap.pricetype == 'fixed') {
	  //fixed price before CB listing
		price_usd = parseFloat(market_cmc[0].price_usd) * config.coinMarketCap.pricebtc;
		price_btc = config.coinMarketCap.pricebtc;
	} else {
		price_usd = parseFloat(market_cmc[0].price_usd) * parseFloat(market_token.last);
		price_btc = parseFloat(market_token.last);
	}
	
	console.log(price_usd);
	console.log(price_btc);
	
	var coin_cap = 0;
	var coin_supply = getSupply(info.blocks);

  const coin = new Coin({
    cap: coin_cap,
    createdAt: date,
    blocks: info.blocks,
    btc: price_btc,
    diff: info.difficulty,
    mnsOff: masternodes.total - masternodes.stable,
    mnsOn: masternodes.stable,
    netHash: nethashps,
    peers: info.connections,
    status: 'Online',
    supply: coin_supply, // TODO: change to actual count from db.
    usd: price_usd
  });

  await coin.save();
}

/**
 * Handle locking.
 */
async function update() {
  const type = 'coin';
  let code = 0;

  try {
    locker.lock(type);
    await syncCoin();
  } catch(err) {
    console.log(err);
    code = 1;
  } finally {
    try {
      locker.unlock(type);
    } catch(err) {
      console.log(err);
      code = 1;
    }
    exit(code);
  }
}

update();
