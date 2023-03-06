// --- Cash Analysis --- \\
export interface Cash {
  symbol: string;
  capitalization: number;
  date: string[];
  inventory: number[];
  cogs: number[];
  revenue: number[];
  receivables: number[];
  accountsPayable: number[];
  DIO: number[];
  DSO: number[];
  DPO: number[];
  CCC: number[];
}

export const cashData: Cash = {
  symbol: '',
  capitalization: 0,
  date: ['2022', '2021', '2020', '2019'],
  inventory: [0, 0, 0, 0],
  cogs: [0, 0, 0, 0],
  revenue: [0, 0, 0, 0],
  receivables: [0, 0, 0, 0],
  accountsPayable: [0, 0, 0, 0],
  DIO: [0, 0, 0, 0],
  DSO: [0, 0, 0, 0],
  DPO: [0, 0, 0, 0],
  CCC: [0, 0, 0, 0],
};

// --- Liquidity Analysis --- \\
export interface Liquidity {
  symbol: string;
  capitalization: number;
  date: string[];
  inventory: number[];
  receivables: number[];
  prePaidExpenses: number[];
  cashOnHand: number[];
  assets: number[];
  liabilities: number[];
  RLC: number[];
  RLI: number[];
  TR: number[];
  RLE: number[];
}

export const liquidityData: Liquidity = {
  symbol: '',
  capitalization: 0,
  date: ['2022', '2021', '2020', '2019'],
  inventory: [0, 0, 0, 0],
  receivables: [0, 0, 0, 0],
  prePaidExpenses: [0, 0, 0, 0],
  cashOnHand: [0, 0, 0, 0],
  assets: [0, 0, 0, 0],
  liabilities: [0, 0, 0, 0],
  RLC: [0, 0, 0, 0],
  RLI: [0, 0, 0, 0],
  TR: [0, 0, 0, 0],
  RLE: [0, 0, 0, 0],
};

// --- Performance Analysis --- \\
export interface Performance {
  symbol: string;
  capitalization: number;
  date: string[];
  totalAssets: number[];
  netIncome: number[];
  revenue: number[];
  shareHolderEquity: number[];
  ROA: number[];
  ROE: number[];
  ROS: number[];
  VRA: number[];
  AER: number[];
}

export const performanceData: Performance = {
  symbol: '',
  capitalization: 0,
  date: ['2022', '2021', '2020', '2019'],
  totalAssets: [0, 0, 0, 0],
  netIncome: [0, 0, 0, 0],
  revenue: [0, 0, 0, 0],
  shareHolderEquity: [0, 0, 0, 0],
  ROA: [0, 0, 0, 0],
  ROE: [0, 0, 0, 0],
  ROS: [0, 0, 0, 0],
  VRA: [0, 0, 0, 0],
  AER: [0, 0, 0, 0],
};

// --- Position Analysis --- \\
export interface Position {
  symbol: string;
  capitalization: number;
  date: string[];
  totalAssets: number[];
  netCashFlow: number[];
  revenue: number[];
  shareHolderEquity: number[];
  CFROA: number[];
  CFROE: number[];
  CFROS: number[];
}

export const positionData: Position = {
  symbol: '',
  capitalization: 0,
  date: ['2022', '2021', '2020', '2019'],
  totalAssets: [0, 0, 0, 0],
  netCashFlow: [0, 0, 0, 0],
  revenue: [0, 0, 0, 0],
  shareHolderEquity: [0, 0, 0, 0],
  CFROA: [0, 0, 0, 0],
  CFROE: [0, 0, 0, 0],
  CFROS: [0, 0, 0, 0],
};

// --- Risk Analysis --- \\
export interface Risk {
  symbol: string;
  capitalization: number;
  date: string[];
  totalAssets: number[];
  totalLiabilities: number[];
  currentAssets: number[];
  currentLiabilities: number[];
  retainedEarnings: number[];
  shareHolderEquity: number[];
  revenue: number[];
  ebit: number[];
  workingCapital: number[];
  A: number[];
  B: number[];
  C: number[];
  D: number[];
  E: number[];
  ALTMAN: number[];
}

export const riskData: Risk = {
  symbol: '',
  capitalization: 0,
  date: ['2022', '2021', '2020', '2019'],
  totalAssets: [0, 0, 0, 0],
  totalLiabilities: [0, 0, 0, 0],
  currentAssets: [0, 0, 0, 0],
  currentLiabilities: [0, 0, 0, 0],
  retainedEarnings: [0, 0, 0, 0],
  shareHolderEquity: [0, 0, 0, 0],
  revenue: [0, 0, 0, 0],
  ebit: [0, 0, 0, 0],
  workingCapital: [0, 0, 0, 0],
  A: [0, 0, 0, 0],
  B: [0, 0, 0, 0],
  C: [0, 0, 0, 0],
  D: [0, 0, 0, 0],
  E: [0, 0, 0, 0],
  ALTMAN: [0, 0, 0, 0],
};

// --- Solvency Analysis --- \\
export interface Solvency {
  symbol: string;
  capitalization: number;
  date: string[];
  totalAssets: number[];
  totalLiabilities: number[];
  totalCurrLiabilities: number[];
  shareHolderEquity: number[];
  totalLongLiabilities: number[];
  RS: number[];
  DAR: number[];
  DER: number[];
  EAR: number[];
}

export const solvencyData: Solvency = {
  symbol: '',
  capitalization: 0,
  date: ['2022', '2021', '2020', '2019'],
  totalAssets: [0, 0, 0, 0],
  totalLiabilities: [0, 0, 0, 0],
  totalCurrLiabilities: [0, 0, 0, 0],
  shareHolderEquity: [0, 0, 0, 0],
  totalLongLiabilities: [0, 0, 0, 0],
  RS: [0, 0, 0, 0],
  DAR: [0, 0, 0, 0],
  DER: [0, 0, 0, 0],
  EAR: [0, 0, 0, 0],
};

// --- User --- \\
export interface IUser {
  username: string;
  email: string;
}

export const loggedUser: IUser = {
  username: '',
  email: '',
};

// --- volume --- \\
export interface Volume {
  stockName: string[];
  regularVolume: number[];
  volume3Months: number[];
  volume10Days: number[];
  marketVolume: { value: number; name: string }[];
  marketPrice: { value: number; name: string }[];
}

export const volumeData: Volume = {
  stockName: [],
  regularVolume: [],
  volume3Months: [],
  volume10Days: [],
  marketVolume: [],
  marketPrice: [],
};

// --- News --- \\
export interface News {
  title: string;
  image: string;
  date: number;
}

// --- Gainers Fallers --- \\
export interface Gainers {
  symbol: string;
  marketChangePercentage: number;
}

export interface Fallers {
  symbol: string;
  marketChangePercentage: number;
}

// --- Transactions --- \\
export interface Transactions {
  id: number;
  stockId: number;
  price: number;
  stock: string;
  result: string;
  date: string;
}

export interface Stock {
  id: number;
  symbol: string;
  price: string;
}
