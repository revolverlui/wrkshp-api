import jwt from 'jsonwebtoken';

const createToken = async (user, secret, expiresIn) => {
  console.log('createToken', user, user.password);
  const { id, email, role } = user;
  return await jwt.sign({ id, email, role }, secret, {
    expiresIn,
  });
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
        return await jwt.verify(token, secret);
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




export {
  createToken,
  getMe
}

