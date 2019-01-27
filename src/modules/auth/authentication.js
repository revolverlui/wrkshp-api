import { ForbiddenError, AuthenticationError } from 'apollo-server';

const createToken = async (user, secret, expiresIn) => {
   const { id, email } = user;
   return await jwt.sign({ id, email }, secret, {
      expiresIn,
   });
};

const getMe = async (req, secret) => {
   const token = req.headers['x-token'];
   console.log('getMe', req.headers);

   if (token) {
      try {
         return await jwt.verify(token, secret);
      } catch (e) {
         throw new AuthenticationError(
            'Your session expired. Sign in again.',
         );
      }
   }
};


export {
   createToken,
   getMe
}