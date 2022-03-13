const { path } = require('pdfkit');
const APIFeatures = require('../../util/APIfeatures');
const AppError = require('../../util/appError');
const catchAsync = require('../../util/catchAsync');
const sendEmail = require('../../util/email');
const Report = require('../models/reportModel');
const createReportPdf = require('../routes/createPdf');

exports.createReport = catchAsync(async (req, res, next) => {
    const newReport = await Report.create({
        UserID: req.user._id,
        PostID: req.params.id,
        Reason: req.body.reason,
    });
    res.status(201).json({status: "success", newReport});
})
exports.getAllReports = catchAsync(async (req, res, next) => { 
    const query = Report.find({}).populate([
        { path: "UserID", select: "name" },
        {
            path: "PostID", select: "title", populate: {
            path: "createBy", select: "name"
        } },
        { path: "AdminID", select: "name"}
    ]);

    const features = new APIFeatures(query, req.query).filter().sort().limitFields().paginate();
    const reports = await features.query;
    createReportPdf(reports , req.user)

   const subject = 'All reports';
  const   message = ` <p>All reports</p> ${req.user.name} `;
    sendEmail({
        email: req.user.email,
        subject,
        message,
        attachments: {
          filename: 'AllReport.pdf',
          path: 'AllReport.pdf',
          contentType: 'application/pdf'
        }
      });
    res.status(200).json({status: "success", results: reports.length, data: { reports }});
});

exports.checkReport = catchAsync(async (req, res, next) => { 
    const report = await Report.findById( req.params.id );
    if (!report) { 
        return next(new AppError("No report found with that ID", 404));
    }
    report.Action = req.body.Action;
    report.Status = req.body.status;
    report.AdminID = req.user._id;
    await report.save();
    res.status(200).json({status: "success", data: { report }});
});
