
// ERP URL patterns for different deployment scenarios
export interface ErpConfig {
  name: string;
  baseUrl: string;
  patterns: string[];
  description: string;
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
      ''
    ],
    description: 'Primary Beryl Solutions ERP'
  },
  {
    name: 'Localhost Development',
    baseUrl: 'http://localhost:8069',
    patterns: [
      '/web/login?db=demo&redirect=false',
      '/web?db=demo',
      '/web/database/selector',
      ''
    ],
    description: 'Local development server'
  },
  {
    name: 'Generic Odoo',
    baseUrl: 'https://demo.odoo.com',
    patterns: [
      '/web/login?redirect=false',
      '/web?redirect=false',
      '/web/database/selector',
      ''
    ],
    description: 'Generic Odoo deployment'
  }
];

let currentConfigIndex = 0;

export const getErpUrl = (attempt: number = 0, configIndex?: number) => {
  if (configIndex !== undefined) {
    currentConfigIndex = configIndex;
  }
  
  const config = erpConfigurations[currentConfigIndex];
  const pattern = config.patterns[attempt % config.patterns.length];
  return `${config.baseUrl}${pattern}`;
};

export const getCurrentConfig = () => erpConfigurations[currentConfigIndex];

export const setCurrentConfig = (index: number) => {
  if (index >= 0 && index < erpConfigurations.length) {
    currentConfigIndex = index;
  }
};

export const getNextConfig = () => {
  const nextIndex = (currentConfigIndex + 1) % erpConfigurations.length;
  setCurrentConfig(nextIndex);
  return erpConfigurations[nextIndex];
};

export const addCustomConfig = (config: ErpConfig) => {
  erpConfigurations.push(config);
};
