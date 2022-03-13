const fs = require('fs');
const PDFDocument = require('pdfkit');
function createReportPdf(Report , user) {
    console.log(user);
	let doc = new PDFDocument({ margin: 50 });
	 generateHeader(doc);
	 generateCustomerInformation(doc, Report, user);
	generateReportTable(doc, Report);
    doc.end();
    doc.pipe(fs.createWriteStream('AllReport.pdf'));

}


let data = new Date

function generateHeader(doc) {
    doc.text('All Report .', 70, 57)
    .text(data.toISOString() , 150, 57)
    .fillColor('#444444')
    .fontSize(20)
        .moveDown();

}


function generateCustomerInformation(doc, Report ,user) {

	doc.text(`ADMIN NAME: ${user.name}`, 50, 100).fillColor('#444444')
    .fontSize(20)
    .moveDown();
}
function generateFooter(doc) {
	doc.fontSize(
		10,
	).text(
		'Payment is due within 15 days. Thank you for your business.',
		50,
		780,
		{ align: 'center', width: 500 },
	);
}


function generateTableRow(doc, y, c1, c2) {
	doc.fontSize(10)
		.text(c1, 50, y)
		.text(c2, 220, y)
		
}


function generateReportTable(doc, Report) {
	let i,
		ReportTableTop = 120;
	for (i = 0; i < Report.length; i++) {
		const item = Report[i];
		const position = ReportTableTop + (i + 1) * 30;
		generateTableRow(
			doc,
			position,
			item._id,
			item.Status
		);
	}
}
module.exports=createReportPdf