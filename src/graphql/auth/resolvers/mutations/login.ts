import AuthSvc, { TAuthResponse } from '../../../../clients/auth';

const login = async (_, { input }) => {
  try {
    const { email, password } = input;

    const payload = await AuthSvc.login(email, password);
    console.log('[Mutation][Login][Payload] ', payload);

    return payload;
  } catch (err) {
    if (err.message === 'client[name] is not a function') {
      const e = `fail auth-api connection with host=${process.env.AUTH_HOST} and port=${process.env.AUTH_PORT}`;

      const res: TAuthResponse = {
        data: null,
        meta: null,
        error: {
          message: e,
          code: 500,
        },
      };

      console.log('[Mutation][Login][Error] ', e);
      return res;
    }

    const res: TAuthResponse = {
      data: null,
      meta: null,
      error: {
        message: err.message,
        code: 409,
      },
    };

    console.log('[Mutation][Login][Error] ', err.message);
    return res;
  }
};

export default login;
