const isProduction = process.env.NODE_ENV === 'production';
const API_URL = isProduction ? '' : (process.env.REACT_APP_API_URL || 'http://localhost:8000');
export default API_URL;
