import RestaurantsSvc, { TRestaurantResponse, TCoord } from '../../../../clients/restaurants';
import AuthSvc, { TAuthVerifyTokenResponse } from '../../../../clients/auth';

const listRestaurantsByCoord = async (root, { input }) => {
  // validate if token is present
  const { token } = root;
  if (token === null) {
    const e = 'token is null';
    const res: TRestaurantResponse = {
      data: null,
      meta: null,
      error: {
        message: e,
        code: 401,
      },
    };

    console.log('[Query][listRestaurantsByCoord][Error] ', e);
    return res;
  }

  // verify if token is valid
  let auth: TAuthVerifyTokenResponse;
  try {
    auth = await AuthSvc.verifyToken(token);
    if (auth.valid === false) {
      throw new Error(auth.error.message);
    }
  } catch (err) {
    const res: TRestaurantResponse = {
      data: null,
      meta: null,
      error: {
        message: err.message,
        code: 401,
      },
    };

    console.log('[Query][listRestaurantsByCoord][Error] ', err.message);
    return res;
  }

  try {
    const { latitude, longitude } = input;

    const coord: TCoord = {
      latitude,
      longitude,
    };

    const payload = await RestaurantsSvc.listByCoord(coord, auth.data.userId);
    console.log('[Query][listRestaurantsByCoord][Payload]', payload.data.length, 'restaurants');

    return payload;
  } catch (err) {
    if (err.message === 'client[name] is not a function') {
      const e = `fail restaurants-api connection with host=${process.env.RESTAURANTS_HOST} and port=${process.env.RESTAURANTS_PORT}`;

      const res: TRestaurantResponse = {
        data: null,
        meta: null,
        error: {
          message: e,
          code: 500,
        },
      };

      console.log('[Query][listRestaurantsByCoord][Error] ', e);
      return res;
    }

    const res: TRestaurantResponse = {
      data: null,
      meta: null,
      error: {
        message: err.message,
        code: 500,
      },
    };

    console.log('[Query][listRestaurantsByCoord][Error] ', err.message);
    return res;
  }
};

export default listRestaurantsByCoord;
