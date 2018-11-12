
const params = {
  LAST_POW_BLOCK: 1200, // 345600
  RAMP_TO_BLOCK: 960,
  LAST_SEESAW_BLOCK: 200000
};

const avgBlockTime = 90; // 1.5 minutes (90 seconds)

const blocksPerDay = (24 * 60 * 60) / avgBlockTime; // 960

const blocksPerWeek = blocksPerDay * 7; // 6720

const blocksPerMonth = (blocksPerDay * 365.25) / 12; // 29220

const blocksPerYear = blocksPerDay * 365.25; // 350640

const mncoins = 10000.0;

const getMNBlocksPerDay = (mns) => {
  return blocksPerDay / mns;
};

const getMNBlocksPerWeek = (mns) => {
  return getMNBlocksPerDay(mns) * (365.25 / 52);
};

const getMNBlocksPerMonth = (mns) => {
  return getMNBlocksPerDay(mns) * (365.25 / 12);
};

const getMNBlocksPerYear = (mns) => {
  return getMNBlocksPerDay(mns) * 365.25;
};

const getMNSubsidy = (nHeight = 0, nMasternodeCount = 0, nMoneySupply = 0) => {
  const blockValue = getSubsidy(nHeight);

  if(nHeight < params.LAST_POW_BLOCK)
	  return 0;
  
  return blockValue * 0.75;
};

const getSubsidy = (nHeight = 1) => {
    let nSubsidy = 0.0;
	let nMul = 0;

    if (nHeight == 1) {
        nSubsidy = 300000;  //premine
    } else if(nHeight >=1 && nHeight < params.LAST_POW_BLOCK) { //PoW phase
        nSubsidy = 2;
    } else if(nHeight >=params.LAST_POW_BLOCK && nHeight < 21000) { //PoS phase
        nSubsidy = 22;
    } else if(nHeight >= 21000 && nHeight < 28000) {
        nSubsidy = 45;
    } else if(nHeight >= 28000 && nHeight < 35000) {
        nSubsidy = 55;
    } else if(nHeight >= 35000 && nHeight < 42000) {
        nSubsidy = 65;
    } else if(nHeight >= 42000 && nHeight < 49000) {
        nSubsidy = 55;
    } else if(nHeight >= 49000 && nHeight < 60000) {
        nSubsidy = 52;
    } else if(nHeight >= 60000 && nHeight < 90000) {
        nSubsidy = 40;
    } else if(nHeight >= 90000 && nHeight < 120000) {
        nSubsidy = 45;
    } else if(nHeight >= 120000 && nHeight < 180000) {
        nSubsidy = 35;
    } else if(nHeight >= 180000 && nHeight < 350000) {
        nSubsidy = 20;
    } else if(nHeight >= 350000 && nHeight < 700000) {
        nSubsidy = 15;
    } else if(nHeight >= 700000) {
        nMul = (nHeight-700000)/700000;
        nSubsidy = (10.0 / ((nMul+1)*2)) ;
    } else {
        nSubsidy = 2;
    }

    return nSubsidy;
};

const getSupply = (nHeight = 1) => {
    let nSupply = 0.0;
	let nMul = 0;

    if (nHeight == 1) {
        nSupply += 300000;  //premine
    }

	if(nHeight > 1 && nHeight < params.LAST_POW_BLOCK) { //PoS phase
        nSupply += 3 * (nHeight-1);
    }
	
	if(nHeight >=params.LAST_POW_BLOCK && nHeight < 21000) { //PoS phase
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


const getROI = (subsidy, mns) => {
  return ((getMNBlocksPerYear(mns) * subsidy) / mncoins) * 100.0;
};

const isAddress = (s) => {
  return typeof(s) === 'string' && s.length === 34;
};

const isBlock = (s) => {
  return !isNaN(s) || (typeof(s) === 'string');
};

const isPoS = (b) => {
  return !!b && b.height > params.LAST_POW_BLOCK; // > 182700
};

const isTX = (s) => {
  return typeof(s) === 'string' && s.length === 64;
};

module.exports = {
  avgBlockTime,
  blocksPerDay,
  blocksPerMonth,
  blocksPerWeek,
  blocksPerYear,
  mncoins,
  params,
  getMNBlocksPerDay,
  getMNBlocksPerMonth,
  getMNBlocksPerWeek,
  getMNBlocksPerYear,
  getMNSubsidy,
  getSubsidy,
  getROI,
  isAddress,
  isBlock,
  isPoS,
  isTX
};
