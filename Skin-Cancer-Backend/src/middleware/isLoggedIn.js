import sessionSchema from "../models/sessionSchema.js";

export const isLoggedIn = async (req, res, next) => {
  try {

    let session;
    
    const _id = req.body?._id; 
    
    if (!_id) {

      const userId = req.userId;
       session = await sessionSchema.findOne({ userId });
    }
    else {
        
        session = await sessionSchema.findOne({ userId: _id });
    }
    if (session) next();
    else {
      return res.status(404).send({
        success: false,
        message: "Session not found",
      });
    }
  } catch (err) {
    res.status(500).send({
      success: false,
      error: err.message,
      message: "error in session validation",
    });
  }
};


