
export const getErpUrl = (attempt: number = 0) => {
  const baseUrl = 'http://erp.beryl-solutions.com';
  const patterns = [
    `${baseUrl}/web/login?redirect=false`,
    `${baseUrl}/web?redirect=false`,
    `${baseUrl}?mobile=1&no_redirect=1`,
    `${baseUrl}/web/database/selector`,
    baseUrl
  ];
  return patterns[attempt % patterns.length];
};
