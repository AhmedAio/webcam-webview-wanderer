
// ERP URL patterns for different deployment scenarios
export interface ErpConfig {
  name: string;
  baseUrl: string;
  patterns: string[];
  description: string;
  fallbackPatterns?: string[]; // Additional patterns for network errors
}

export const erpConfigurations: ErpConfig[] = [
  {
    name: 'Beryl Solutions',
    baseUrl: 'http://erp.beryl-solutions.com',
    patterns: [
      '/web/login?redirect=false',
      '/web?redirect=false',
      '?mobile=1&no_redirect=1',
      '/web/database/selector',
      '/web?db=demo&redirect=false',
      '/web?db=demo',
      ''
    ],
    fallbackPatterns: [
      '/web/login?db=demo&redirect=false&mobile=1',
      '/web?db=demo&mobile=1&no_redirect=1',
      '/login?db=demo',
      '/web/database/manager',
      '?db=demo'
    ],
    description: 'Primary Beryl Solutions ERP'
  },
  {
    name: 'Localhost Development',
    baseUrl: 'http://localhost:8069',
    patterns: [
      '/web/login?db=demo&redirect=false',
      '/web?db=demo&redirect=false',
      '/web?db=demo',
      '/web/database/selector',
      ''
    ],
    fallbackPatterns: [
      '/web/login?db=demo&mobile=1',
      '/login?db=demo',
      '/web/database/manager'
    ],
    description: 'Local development server'
  },
  {
    name: 'Generic Odoo',
    baseUrl: 'https://demo.odoo.com',
    patterns: [
      '/web/login?redirect=false&mobile=1',
      '/web?redirect=false&mobile=1',
      '/web/database/selector',
      '/login',
      ''
    ],
    fallbackPatterns: [
      '/web/login?db=demo&redirect=false',
      '/web?db=demo&mobile=1',
      '/web/database/manager',
      '?mobile=1'
    ],
    description: 'Generic Odoo deployment'
  }
];

let currentConfigIndex = 0;
let useFallbackPatterns = false;

export const getErpUrl = (attempt: number = 0, configIndex?: number) => {
  if (configIndex !== undefined) {
    currentConfigIndex = configIndex;
    useFallbackPatterns = false; // Reset fallback when switching configs
  }
  
  const config = erpConfigurations[currentConfigIndex];
  const patterns = useFallbackPatterns && config.fallbackPatterns 
    ? config.fallbackPatterns 
    : config.patterns;
  
  const pattern = patterns[attempt % patterns.length];
  return `${config.baseUrl}${pattern}`;
};

export const getCurrentConfig = () => erpConfigurations[currentConfigIndex];

export const setCurrentConfig = (index: number) => {
  if (index >= 0 && index < erpConfigurations.length) {
    currentConfigIndex = index;
    useFallbackPatterns = false;
  }
};

export const getNextConfig = () => {
  const nextIndex = (currentConfigIndex + 1) % erpConfigurations.length;
  setCurrentConfig(nextIndex);
  return erpConfigurations[nextIndex];
};

export const switchToFallbackPatterns = () => {
  const config = getCurrentConfig();
  if (config.fallbackPatterns && !useFallbackPatterns) {
    useFallbackPatterns = true;
    return true;
  }
  return false;
};

export const isUsingFallbackPatterns = () => useFallbackPatterns;

export const getCurrentPatternCount = () => {
  const config = getCurrentConfig();
  const patterns = useFallbackPatterns && config.fallbackPatterns 
    ? config.fallbackPatterns 
    : config.patterns;
  return patterns.length;
};

export const addCustomConfig = (config: ErpConfig) => {
  erpConfigurations.push(config);
};

export const getNetworkErrorSolution = (errorType: string) => {
  switch (errorType) {
    case 'ERR_BLOCKED_BY_RESPONSE':
      return 'Server blocking mobile access - trying alternative patterns';
    case 'ERR_TOO_MANY_REDIRECTS':
      return 'Redirect loop detected - switching to fallback patterns';
    case 'ERR_NAME_NOT_RESOLVED':
      return 'Server unreachable - checking connection';
    case 'ERR_NETWORK_CHANGED':
      return 'Network changed - retrying connection';
    default:
      return 'Connection issue - trying alternative approach';
  }
};
