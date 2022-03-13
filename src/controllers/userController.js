const APIFeatures = require("../../util/APIfeatures");
const User = require("../models/userModel");
const catchAsync = require("../../util/catchAsync");
const AppError = require("../../util/appError");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const users = await features.query;
  res.status(200).json({ status: "success", count: users.length, data: users });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError(`No user with the id of ${req.params.id}`, 404));
  }
  res.status(200).json({ status: "success", data: user });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password) {
    return next(
      new AppError(
        "This route is not for password update. Please use /updateMyPassword",
        400
      )
    );
  }
  const filteredBody = filterObj(req.body, "name", "phone" ,  "photo" , "age" );
  await User.findByIdAndUpdate(req.user.id, filteredBody);
  res.status(200).json({ status: "success" });
});

exports.deleteMe = catchAsync(async (req, res, next) => {

   await User.findByIdAndUpdate(req.user.id, { isDeleted: false });

  res.status(200).json({ status: 'success' });

});



exports.deleteUser = catchAsync(async (req, res,next) => {
   const user = await User.findByIdAndUpdate(req.params.id, { isDeleted: false });
  if (!user) {
    return next(new AppError(`No user with the id of ${req.params.id}`, 404));
  }
   res.status(200).json({ status: "success" });

});



exports.restoreUser = catchAsync(async (req, res , next) => { 
  const user = await User.findByIdAndUpdate(req.params.id, { isDeleted: true });
  if (!user) { 
    return next(new AppError(`No user with the id of ${req.params.id}`, 404));
  }
  res.status(200).json({ status: "success", data: user });
});


exports.deactivate = catchAsync(async (req, res, next) => {
   timeToDelete = Date.now() + 1000 * 60 * 60 * 24 * 30;
 req.user.deactivate =true
 req.user.deactivateTime = Date.now()
  await req.user.save()
  const deleteTimeOut = setTimeout( async () => {
    const user = await User.findById(req.user._id)
    if (user.deactivate) {
      user.user.isDeleted = true
      user.user.save()
    }
    clearTimeout(deleteTimeOut)
  }, timeToDelete);
  
  res.status(200).json({ status: "user deactivate if Not login with 30 Day we will delete Acc" });
})
exports.blockUser = catchAsync(async (req, res, next) => {

  const user = await User.findByIdAndUpdate(req.params.id, { block: true });
  if (!user) {
    return next(new AppError(`No user with the id of ${req.params.id}`, 404));
  }
  res.status(200).json({ status: "success" });



})
exports.activate = catchAsync(async (req, res, next) => {


  req.user.deactivate =undefined
  req.user.deactivateTime = undefined
  await req.user.save()
  res.status(200).json({ status: "success" });
  

})

exports.getAllAdmin = catchAsync(async (req, res, next) => {  
  console.log('success')
  const features = new APIFeatures(User.find({role:'admin'}), req.query).filter()
  .sort()
  .limitFields()
  .paginate();
  const users = await features.query;

  res.status(200).json({ status: "success",count :users.length , data: users });




});
exports.AddAdmin = catchAsync(async (req, res, next) => {

  const user = await User.findByIdAndUpdate(req.params.id, { role: 'admin' });
  if (!user) {
    return next(new AppError(`No user with the id of ${req.params.id}`, 404));
  }
  res.status(200).json({ status: "success" });
})

exports.deleteAdmin = catchAsync(async (req, res, next) => { 

  const user = await User.findByIdAndUpdate(req.params.id, { role: 'user' });
  if (!user) {
    return next(new AppError(`No user with the id of ${req.params.id}`, 404));

  }
  res.status(200).json({ status: "success" });
});