// allows us to use window server-side for ssr reasonsing
const safeWindow = (typeof window === 'undefined') ? {
  addEventListener() {},
  removeEventListener() {},
} : window;

export default safeWindow;
