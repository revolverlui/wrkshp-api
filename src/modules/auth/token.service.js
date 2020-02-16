import jwt from 'jsonwebtoken';

import {
   SECRET_ACCESS_TOKEN,
   SECRET_ACCESS_TOKEN_EXPIRATION,
   SECRET_REFRESH_TOKEN,
   SECRET_REFRESH_TOKEN_LABEL,
   SECRET_REFRESH_TOKEN_EXPIRATION,
   SECRET_REFRESH_TOKEN_MAXAGE
} from '../../config';

const createAccessToken = user => {
   console.log(
      'createAccessToken',
      user,
      user.password,
      SECRET_ACCESS_TOKEN_EXPIRATION
   );
   const { id, email, role } = user;
   return jwt.sign({ id, email, role }, SECRET_ACCESS_TOKEN, {
      expiresIn: SECRET_ACCESS_TOKEN_EXPIRATION
   });
};

const createRefreshToken = async user => {
   console.log(
      'createRefreshToken',
      user,
      user._id,
      user.id,
      user.password,
      SECRET_REFRESH_TOKEN_EXPIRATION
   );
   const userWithNextTokenVersion = await user.incrementTokenVersion();
   const { id, email, role, tokenVersion } = userWithNextTokenVersion;
   return jwt.sign({ id, email, role, tokenVersion }, SECRET_REFRESH_TOKEN, {
      expiresIn: SECRET_REFRESH_TOKEN_EXPIRATION
   });
};

const verifyRefreshToken = token => {
   try {
      return jwt.verify(token, SECRET_REFRESH_TOKEN);
   } catch (e) {
      console.log('Your session expired. Sign in again.');
      // throw new AuthenticationError(
      //    'Your session expired. Sign in again.',
      // );
   }
};

const getMe = async (req, secret) => {
   //const token = req.headers['x-token'];
   //console.log('getMe', req.headers);

   if (req.headers.authorization) {
      const isBearer = req.headers.authorization.split(' ')[0] === 'Bearer';
      const token = req.headers.authorization.split(' ')[1];
      console.log('bearerToken', isBearer, token);

      if (token) {
         console.log('tokentokentokentokentoken', token);
         try {
            return jwt.verify(token, SECRET_ACCESS_TOKEN);
         } catch (e) {
            console.log('Your session expired. Sign in again.');
            // throw new AuthenticationError(
            //    'Your session expired. Sign in again.',
            // );
         }
      }
   }

   return undefined;
};

const sendRefreshToken = async (res, user) => {
   const refreshToken = await createRefreshToken(user);
   console.log('sendRefreshToken', user);
   res.cookie(SECRET_REFRESH_TOKEN_LABEL, refreshToken, {
      httpOnly: true,
      maxAge: SECRET_REFRESH_TOKEN_MAXAGE
      //path: '/refresh_token'
   });
};

export {
   createAccessToken,
   createRefreshToken,
   sendRefreshToken,
   verifyRefreshToken,
   getMe
};
