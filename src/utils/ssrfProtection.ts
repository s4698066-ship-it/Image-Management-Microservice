import dns from 'dns';
import { promisify } from 'util';
import { URL } from 'url';

const lookup = promisify(dns.lookup);

const isPrivateIP = (ip: string): boolean => {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4) return false;

  return (
    parts[0] === 10 ||
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
    (parts[0] === 192 && parts[1] === 168) ||
    parts[0] === 127 ||
    parts[0] === 0 ||
    parts[0] === 169 && parts[1] === 254
  );
};

export const validateUrlForSSRF = async (urlString: string): Promise<boolean> => {
  try {
    const parsedUrl = new URL(urlString);
    
    if (parsedUrl.protocol !== 'https:') {
      return false; // Only allow HTTPS
    }

    const { address } = await lookup(parsedUrl.hostname);
    
    if (isPrivateIP(address)) {
      return false; // Block private IPs
    }

    return true;
  } catch (error) {
    return false;
  }
};
