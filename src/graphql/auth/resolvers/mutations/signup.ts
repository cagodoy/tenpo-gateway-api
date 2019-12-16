import AuthSvc, { TAuthResponse } from '../../../../clients/auth';
import { TUser } from '../../../../clients/users';

const signup = async (_, { input }) => {
  try {
    const { name, email, password } = input;

    const user: TUser = {
      name,
      email,
      password,
    };

    const payload = await AuthSvc.signUp(user);
    console.log('[Mutation][Signup][Payload] ', payload);

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

      console.log('[Mutation][Signup][Error] ', e);
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

    console.log('[Mutation][Signup][Error] ', err.message);
    return res;
  }
};

export default signup;
