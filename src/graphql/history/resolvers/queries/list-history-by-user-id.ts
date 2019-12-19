import HistorySvc, { THistoryResponse } from '../../../../clients/history';
import AuthSvc, { TAuthVerifyTokenResponse } from '../../../../clients/auth';

const listHistoryByUserId = async (root, { input }) => {
  // validate if token is present
  const { token } = root;
  if (token === null) {
    const e = 'token is null';
    const res: THistoryResponse = {
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
    const res: THistoryResponse = {
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
    const payload = await HistorySvc.listByUserId(auth.data.userId);
    console.log('[Query][listHistoryByUserId][Payload] ', payload.data.length, 'count');

    return payload;
  } catch (err) {
    if (err.message === 'client[name] is not a function') {
      const e = `fail history-api connection with host=${process.env.HISTORY_HOST} and port=${process.env.HISTORY_PORT}`;

      const res: THistoryResponse = {
        data: null,
        meta: null,
        error: {
          message: e,
          code: 500,
        },
      };

      console.log('[Query][listHistoryByUserId][Error] ', e);
      return res;
    }

    const res: THistoryResponse = {
      data: null,
      meta: null,
      error: {
        message: err.message,
        code: 500,
      },
    };

    console.log('[Query][listHistoryByUserId][Error] ', err.message);
    return res;
  }
};

export default listHistoryByUserId;
