import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

// axios.defaults.headers = {
//     'authorization': sessionStorage.getItem('token'),
// };
// axios.defaults.headers.authorization = axios.defaults.headers.authorization
//  ? axios.defaults.headers.authorization : 'bearer ' + sessionStorage.getItem('token');
axios.interceptors.request.use(async function(config) {
  const token = await AsyncStorage.getItem('token');
  config.headers.Authorization = `bearer ${token}`;

  return config;
});
axios.defaults.headers.get.Pragma = 'no-cache';
axios.defaults.headers.get['Cache-Control'] = 'no-cache, no-store';

export default axios;
