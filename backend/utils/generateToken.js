/* using the DRY principle (Don't Repeat Yourself) */

import jwt from 'jsonwebtoken'

const generateToken = (res, userId) => {
     // create jwt signature token
     const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      // store jwt in backend cookie
      // NOTE: the following line allows me to call upon this cookie, by name, as req.cookie.jwt
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENVIRONMENT !== "development", // production requires https
        sameSite: true, // more secure
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
      });
}

export default generateToken;