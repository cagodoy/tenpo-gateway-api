import RestaurantsSvc, { TRestaurantResponse, TCoord } from '../../../../clients/restaurants';

const listRestaurantsByCoord = async (_, { input }) => {
  try {
    const { latitude, longitude, pageToken } = input;

    const coord: TCoord = {
      latitude,
      longitude,
    };

    const payload = await RestaurantsSvc.listByCoord(coord, pageToken);
    console.log('[Query][listRestaurantsByCoord][Payload] ', payload);

    return payload;
  } catch (err) {
    if (err.message === 'client[name] is not a function') {
      const e = `fail auth-api connection with host=${process.env.AUTH_HOST} and port=${process.env.AUTH_PORT}`;

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
