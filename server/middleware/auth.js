import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.json({ success: false, message: "Not Authorized Login Again" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user by ID from the decoded token and exclude the password
    req.user = await User.findById(decoded.userId).select('-password');
    
    next();
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;