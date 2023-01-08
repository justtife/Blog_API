const fs = require("fs");
const NodeMailer = require("nodemailer");
const MailConfig = require("./emailConfig");
const path = require("path");
const puppeteer = require("puppeteer");

const receiptPDF = async (discount, real, date, subID, email) => {
  console.log("Entered this path");
  //Launch browser and create new page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  //Set HTML content of the invoice template as page content
  const invoiceHtml = fs.readFileSync(
    path.join(__dirname, "invoice.html"),
    "utf8"
  );
  const replacedHtml = invoiceHtml
    .replace("{{customer_name}}", email)
    .replace("{{invoice_number}}", subID)
    .replace("{{payment_amount}}", real)
    .replace("{{payment_date}}", date)
    .replace("{{real_amount}}", real)
    .replace("{{discount}}", discount)
    .replace("{{amount_paid}}", real);
  await page.setContent(replacedHtml);
  console.log("Done here");
  //Generate PDF from HTML content
  const pdfOptions = {
    path: "AltBlog_invoice.pdf",
    format: "A4",
    margin: {
      top: "50px",
      right: "50px",
      bottom: "50px",
      left: "50px",
    },
  };
  await page.pdf(pdfOptions);
  //Close browser
  await browser.close();
  //Read PDF file and attach it to email
  const fileStream = fs.createReadStream("AltBlog_invoice.pdf");
  //Mail Options
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Subscription receipt from AltBlog",
    text: "Please find attached the invoice for your recent subscription",
    attachments: [{ filename: "AltBlog_invoice.pdf", content: fileStream }],
  };
  const transporter = NodeMailer.createTransport(MailConfig);
  //Send Mail
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
module.exports = receiptPDF;
