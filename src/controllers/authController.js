const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../../util/catchAsync");
const AppError = require("../../util/appError");
const { promisify } = require("util");
const sendEmail = require("../../util/email");
const crypto = require("crypto");
const req = require("express/lib/request");

const signToken = (data) => {
  return jwt.sign({ data }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user);
  const { password, ...rest } = user.toObject();
  res.status(statusCode).json({ status: "success", token, data: rest });
};

exports.signup = catchAsync(async (req, res, next) => {
  const chechEmail = await User.findOne({ email: req.body.email }); 
  if (chechEmail) return next(new AppError("Email is ready  exist", 400));
  const user = await User.create({ 
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    age: req.body.age,
    photo: req.body.photo,
  });

  const url = `${req.protocol}://${req.get("host")}/api/v1/users/verify/${user._id}`;
  await sendEmail({
    email:user.email,
    subject:"Email Verification",
    message:`<p>Please click the link to verify your email</p><a href="${url}">${url}</a>`
  })
  createSendToken(user, 200, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new AppError("Please provide email and password!", 400));
  }
  const user = await User.findOne({ email });
  if (!user) {
    next(new AppError("Incorrect email !", 401));
  }
  if(user.checkDeleted()) 
  {
    next(new AppError("User is deleted!", 401));
  }
  if (user.deactivate)
  {
    user.deactivate = false;
    console.log('user.deactivate');
    await user.save();
  }
  if (!(await user.correctPassword(password, user.password))) {
    next(new AppError("Incorrect password !", 401));
  }
  createSendToken(user, 200, req, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token)
    return next(
      new AppError(" You are Not logged in ! please log in to get access", 401)
    );
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.data);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token does no longer", 401)
    );
  }

  if (await currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "You changed your password after this token was issued. Please log in again",
        401
      )
    );
  }
  req.user = currentUser;
  next();
});
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

exports.EmailVerification = catchAsync(async (req,res,next)=>{
  const user = await User.findOne({_id:req.params.id});
  if(!user){
    return next(new AppError("User with this email does not exist",400));
  } 
  user.verify = true;
  await user.save();
  res.status(200).json({status:"success",message:"Email verified"});
})

exports.forGetPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("No user with this email", 404));
  }
  const resetToken = await user.createPasswordResetToken();
  await user.save();
  subject = "Your password reset token";
  message = ` use this token to reset password token Expire after 10 minutes    ${resetToken}`;
  try {
    sendEmail({
      email: user.email,
      subject,
      message,
      
    });
    res.status(200).json({ status: "success", message: "Token sent to email" });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return next(
      new AppError("There was an error sending the email. Try again later", 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({ passwordResetToken: hashedToken });

  if (!user) {
    return next(new AppError("This token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  createSendToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!(await user.correctPassword(req.body.password, user.password))) {
    next(new AppError("Incorrect password !", 401));
  }
  user.password = req.body.newPassword;
  user.passwordChangedAt = Date.now().toString();
  await user.save();
  createSendToken(user, 200, req, res);
});
