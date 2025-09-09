import { setAccessToken } from '@/redux/reducers/user/slice';
import store from '@/redux/store';
import { AuthService } from '@/services/auth.service';

function isTokenExpired(token) {
  const LIFE_TIME_TO_UPDATE_MULTIPLIER = 0.5;
  if (!token) {
    return true;
  }

  try {
    const tokenInfo = token.split('.')[1];
    const tokenInfoDecoded = window.atob(tokenInfo);
    const { exp, iat } = JSON.parse(tokenInfoDecoded);
    const tokenLeftTime = exp - Math.round(+new Date() / 1000);
    const minLifeTimeForUpdate = (exp - iat) * LIFE_TIME_TO_UPDATE_MULTIPLIER;
    return tokenLeftTime < minLifeTimeForUpdate;
  } catch (e) {
    return true;
  }
}

let cachedAccessToken = null;
let isRefreshingToken = false;
const tokenRefreshQueue = [];

async function refreshAccessToken() {
  if (isRefreshingToken) {
    return new Promise((resolve, reject) => {
      tokenRefreshQueue.push({ resolve, reject });
    });
  }

  isRefreshingToken = true;

  try {
    const { data } = await AuthService.refreshToken();
    cachedAccessToken = data.accessToken;
    store.dispatch(setAccessToken(data.accessToken));

    while (tokenRefreshQueue.length) {
      const { resolve } = tokenRefreshQueue.shift();
      resolve(cachedAccessToken);
    }
  } catch (error) {
    while (tokenRefreshQueue.length) {
      const { reject } = tokenRefreshQueue.shift();
      reject(error);
    }
  } finally {
    isRefreshingToken = false;
  }

  return cachedAccessToken;
}

export default async function getAccessToken() {
  try {
    const accessToken = store.getState().user.accessToken;
    if (!accessToken || isTokenExpired(accessToken)) {
      return refreshAccessToken();
    }

    return accessToken;
  } catch (e) {
    return null;
  }
}
