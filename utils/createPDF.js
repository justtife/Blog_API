const fs = require("fs");
const NodeMailer = require("nodemailer");
const MailConfig = require("./emailConfig");
const path = require("path");
const puppeteer = require("puppeteer");
const CustomError = require("../errors");
const logger = require("../logger/index");

const receiptPDF = async (discount, real, date, subID, email, paid) => {
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
    .replace("{{payment_date}}", date)
    .replace("{{real_amount}}", real)
    .replace("{{discount}}", discount)
    .replace("{{amount_paid}}", paid)
    .replace("{{final_amount}}", paid);
  await page.setContent(replacedHtml);
  //Generate PDF from HTML content
  const pdfOptions = {
    path: "invoice.pdf",
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
  const fileStream = fs.createReadStream("invoice.pdf");
  //Mail Options
  const mailMessage = `<!DOCTYPE html>

  <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
  <head>
  <title></title>
  <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
  <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
  <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
  <style>
      * {
        box-sizing: border-box;
      }
  
      body {
        margin: 0;
        padding: 0;
      }
  
      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: inherit !important;
      }
  
      #MessageViewBody a {
        color: inherit;
        text-decoration: none;
      }
  
      p {
        line-height: inherit
      }
  
      .desktop_hide,
      .desktop_hide table {
        mso-hide: all;
        display: none;
        max-height: 0px;
        overflow: hidden;
      }
  
      @media (max-width:720px) {
  
        .desktop_hide table.icons-inner,
        .social_block.desktop_hide .social-table {
          display: inline-block !important;
        }
  
        .icons-inner {
          text-align: center;
        }
  
        .icons-inner td {
          margin: 0 auto;
        }
  
        .row-content {
          width: 100% !important;
        }
  
        .mobile_hide {
          display: none;
        }
  
        .stack .column {
          width: 100%;
          display: block;
        }
  
        .mobile_hide {
          min-height: 0;
          max-height: 0;
          max-width: 0;
          overflow: hidden;
          font-size: 0px;
        }
  
        .desktop_hide,
        .desktop_hide table {
          display: table !important;
          max-height: none !important;
        }
      }
    </style>
  </head>
  <body style="background-color: #FFFFFF; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
  <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 700px;" width="700">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
  <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-bottom:5px;padding-left:5px;padding-right:5px;padding-top:15px;">
  <div align="center" class="alignment">
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 0px solid #BBBBBB;"><span> </span></td>
  </tr>
  </table>
  </div>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="0" cellspacing="0" class="image_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-left:15px;padding-right:15px;width:100%;padding-bottom:5px;">
  <div align="left" class="alignment" style="line-height:10px"><a href="http://example.com" style="outline:none" tabindex="-1" target="_blank"><img alt="AltBlog" src="https://i.postimg.cc/CLQ4KdVN/image-removebg-preview-1.png" style="display: block; height: auto; border: 0; width: 70px; max-width: 100%;" title="AltBlog" width="70"/></a></div>
  </td>
  </tr>
  </table>
  </td>
  <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
  <table border="0" cellpadding="15" cellspacing="0" class="button_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad">
  <div align="right" class="alignment">
  <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="http://example.com" style="height:42px;width:94px;v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#6b67f5"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a href="http://example.com" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#6b67f5;border-radius:4px;width:auto;border-top:0px solid #8a3b8f;font-weight:undefined;border-right:0px solid #8a3b8f;border-bottom:0px solid #8a3b8f;border-left:0px solid #8a3b8f;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;" target="_blank"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="word-break: break-word; line-height: 32px;">Sign up</span></span></a>
  <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 700px;" width="700">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-left: 10px; padding-right: 10px; vertical-align: top; padding-top: 10px; padding-bottom: 10px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="10" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad">
  <div align="center" class="alignment">
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 0px solid #BBBBBB;"><span> </span></td>
  </tr>
  </table>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 700px;" width="700">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
  <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-bottom:20px;padding-left:20px;padding-right:20px;padding-top:25px;">
  <div align="center" class="alignment">
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 0px solid #BBBBBB;"><span> </span></td>
  </tr>
  </table>
  </div>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="10" cellspacing="0" class="heading_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad">
  <h1 style="margin: 0; color: #2b2d2d; direction: ltr; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 43px; font-weight: normal; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0;"><strong>Thanks for your subscription</strong></h1>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="10" cellspacing="0" class="text_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="font-family: sans-serif">
  <div class="" style="font-size: 14px; mso-line-height-alt: 21px; color: #6f7077; line-height: 1.5; font-family: Arial, Helvetica Neue, Helvetica, sans-serif;">
  <p style="margin: 0; font-size: 14px; mso-line-height-alt: 21px;">Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis.</p>
  </div>
  </div>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="0" cellspacing="0" class="button_block block-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-bottom:15px;padding-left:15px;padding-right:15px;padding-top:10px;text-align:left;">
  <div align="left" class="alignment">
  <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="http://example.com" style="height:44px;width:173px;v-text-anchor:middle;" arcsize="10%" strokeweight="0.75pt" strokecolor="#2B2D2D" fill="false"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#2b2d2d; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a href="http://example.com" style="text-decoration:none;display:inline-block;color:#2b2d2d;background-color:transparent;border-radius:4px;width:auto;border-top:1px solid #2B2D2D;font-weight:400;border-right:1px solid #2B2D2D;border-bottom:1px solid #2B2D2D;border-left:1px solid #2B2D2D;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;" target="_blank"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;letter-spacing:normal;"><span dir="ltr" style="word-break: break-word; line-height: 32px;"><strong>DISCOUNT : ${discount}%</strong></span></span></a>
  <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
  </div>
  </td>
  </tr>
  </table>
  </td>
  <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="50%">
  <table border="0" cellpadding="0" cellspacing="0" class="image_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;padding-top:5px;padding-bottom:5px;">
  <div align="center" class="alignment" style="line-height:10px"><img alt="Services Company" src="https://i.postimg.cc/s2McMcfP/image-host.png" style="display: block; height: auto; border: 0; width: 350px; max-width: 100%;" title="Services Company" width="350"/></div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 700px;" width="700">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="10" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad">
  <div align="center" class="alignment">
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 0px solid #BBBBBB;"><span> </span></td>
  </tr>
  </table>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #6b67f5; color: #000000; width: 700px;" width="700">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 25px; padding-bottom: 25px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="10" cellspacing="0" class="heading_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad">
  <h2 style="margin: 0; color: #ffffff; direction: ltr; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 30px; font-weight: 400; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;"><strong>Find the perfect subscription package</strong></h2>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="0" cellspacing="0" class="text_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad" style="padding-bottom:10px;padding-left:50px;padding-right:50px;padding-top:10px;">
  <div style="font-family: sans-serif">
  <div class="" style="font-size: 14px; mso-line-height-alt: 21px; color: #393d47; line-height: 1.5; font-family: Arial, Helvetica Neue, Helvetica, sans-serif;">
  <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 21px;"><span style="color:#ffffff;">Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor</span></p>
  </div>
  </div>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="10" cellspacing="0" class="button_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad">
  <div align="center" class="alignment">
  <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="http://example.com" style="height:42px;width:147px;v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#ffffff"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#6b67f5; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a href="http://example.com" style="text-decoration:none;display:inline-block;color:#6b67f5;background-color:#ffffff;border-radius:4px;width:auto;border-top:0px solid #8a3b8f;font-weight:400;border-right:0px solid #8a3b8f;border-bottom:0px solid #8a3b8f;border-left:0px solid #8a3b8f;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;" target="_blank"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;letter-spacing:normal;"><span dir="ltr" style="word-break: break-word; line-height: 32px;">Subscribe Now</span></span></a>
  <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 700px;" width="700">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="10" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad">
  <div align="center" class="alignment">
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 0px solid #BBBBBB;"><span> </span></td>
  </tr>
  </table>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-7" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f7fafe;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 700px;" width="700">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 25px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="10" cellspacing="0" class="heading_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad">
  <h2 style="margin: 0; color: #2b2d2d; direction: ltr; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 30px; font-weight: 400; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;"><strong>Choose your subscription package</strong></h2>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="0" cellspacing="0" class="text_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad" style="padding-bottom:10px;padding-left:50px;padding-right:50px;padding-top:10px;">
  <div style="font-family: sans-serif">
  <div class="" style="font-size: 14px; mso-line-height-alt: 21px; color: #6f7077; line-height: 1.5; font-family: Arial, Helvetica Neue, Helvetica, sans-serif;">
  <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 21px;"><span style="color:#6f7077;">Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor</span></p>
  </div>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-8" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f7fafe;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; background-color: #f7fafe; width: 700px;" width="700">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; border-bottom: 1px solid #6B67F5; border-left: 1px solid #6B67F5; border-right: 1px solid #6B67F5; border-top: 1px solid #6B67F5; vertical-align: top;" width="33.333333333333336%">
  <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-top:25px;text-align:center;width:100%;">
  <h3 style="margin: 0; color: #2b2d2d; direction: ltr; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 19px; font-weight: 400; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;"><strong>Starter Package</strong></h3>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="0" cellspacing="0" class="text_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad" style="padding-bottom:5px;padding-left:15px;padding-right:15px;padding-top:10px;">
  <div style="font-family: sans-serif">
  <div class="" style="font-size: 14px; mso-line-height-alt: 21px; color: #6f7077; line-height: 1.5; font-family: Arial, Helvetica Neue, Helvetica, sans-serif;">
  <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 21px;"><span style="color:#6f7077;">Lorem ipsum dolor sit amet, consectetur adipiscing<br/></span></p>
  </div>
  </div>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="0" cellspacing="0" class="text_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad" style="padding-left:15px;padding-right:15px;">
  <div style="font-family: Arial, sans-serif">
  <div class="" style="font-size: 14px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; mso-line-height-alt: 21px; color: #6f7077; line-height: 1.5;">
  <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 51px;"><span style="font-size:34px;color:#2b2d2d;"><strong><span style="">&#8358;1000/<span style="font-size:24px;">month</span></span></strong></span></p>
  </div>
  </div>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="0" cellspacing="0" class="button_block block-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-bottom:20px;padding-left:15px;padding-right:15px;padding-top:10px;text-align:center;">
  <div align="center" class="alignment">
  <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="http://example.com" style="height:44px;width:168px;v-text-anchor:middle;" arcsize="10%" strokeweight="0.75pt" strokecolor="#2B2D2D" fill="false"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#2b2d2d; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a href="http://example.com" style="text-decoration:none;display:inline-block;color:#2b2d2d;background-color:transparent;border-radius:4px;width:auto;border-top:1px solid #2B2D2D;font-weight:undefined;border-right:1px solid #2B2D2D;border-bottom:1px solid #2B2D2D;border-left:1px solid #2B2D2D;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;" target="_blank"><span style="padding-left:60px;padding-right:60px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="word-break: break-word; line-height: 32px;">Select</span></span></a>
  <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
  </div>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="0" cellspacing="0" class="text_block block-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad" style="padding-bottom:10px;padding-left:30px;padding-right:30px;padding-top:10px;">
  <div style="font-family: sans-serif">
  <div class="" style="font-size: 14px; mso-line-height-alt: 21px; color: #6f7077; line-height: 1.5; font-family: Arial, Helvetica Neue, Helvetica, sans-serif;">
  <p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 21px;"><span style="color:#6f7077;"><span style="color:#2b2d2d;">✓</span> Lorem ipsum dolor </span></p>
  <p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 21px;"><span style="color:#6f7077;"><span style="color:#2b2d2d;">✓</span> sit amet, consectetur<br/></span></p>
  <p style="margin: 0; mso-line-height-alt: 21px;"><span style="color:#2b2d2d;">✓</span> Lorem ipsum dolor</p>
  <p style="margin: 0; mso-line-height-alt: 21px;"><span style="color:#2b2d2d;">✖</span> sit amet, consectetur</p>
  <p style="margin: 0; mso-line-height-alt: 21px;"><span style="color:#2b2d2d;">✖</span> Lorem ipsum dolor</p>
  <p style="margin: 0; mso-line-height-alt: 21px;"> </p>
  </div>
  </div>
  </td>
  </tr>
  </table>
  </td>
  <td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #ffffff; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="33.333333333333336%">
  <table border="0" cellpadding="0" cellspacing="0" class="button_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-left:10px;padding-right:10px;padding-top:15px;text-align:center;">
  <div align="center" class="alignment">
  <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="http://example.com" style="height:42px;width:194px;v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#17d7b5"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a href="http://example.com" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#17d7b5;border-radius:4px;width:auto;border-top:0px solid #8a3b8f;font-weight:undefined;border-right:0px solid #8a3b8f;border-bottom:0px solid #8a3b8f;border-left:0px solid #8a3b8f;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;" target="_blank"><span style="padding-left:50px;padding-right:50px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="word-break: break-word; line-height: 32px;">Most Popular</span></span></a>
  <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
  </div>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-top:20px;text-align:center;width:100%;">
  <h3 style="margin: 0; color: #2b2d2d; direction: ltr; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 19px; font-weight: 400; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;"><strong>Premium Package</strong></h3>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="0" cellspacing="0" class="text_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad" style="padding-bottom:5px;padding-left:15px;padding-right:15px;padding-top:10px;">
  <div style="font-family: sans-serif">
  <div class="" style="font-size: 14px; mso-line-height-alt: 21px; color: #6f7077; line-height: 1.5; font-family: Arial, Helvetica Neue, Helvetica, sans-serif;">
  <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 21px;"><span style="color:#6f7077;">Lorem ipsum dolor sit amet, consectetur adipiscing<br/></span></p>
  </div>
  </div>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="0" cellspacing="0" class="text_block block-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad" style="padding-left:15px;padding-right:15px;">
  <div style="font-family: Arial, sans-serif">
  <div class="" style="font-size: 14px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; mso-line-height-alt: 21px; color: #6f7077; line-height: 1.5;">
  <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 51px;"><span style="font-size:34px;color:#2b2d2d;"><strong><span style="">&#8358;10000/<span style="font-size:24px;">year</span></span></strong></span></p>
  </div>
  </div>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="0" cellspacing="0" class="button_block block-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-bottom:20px;padding-left:15px;padding-right:15px;padding-top:10px;text-align:center;">
  <div align="center" class="alignment">
  <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="http://example.com" style="height:42px;width:164px;v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#6b67f5"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a href="http://example.com" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#6b67f5;border-radius:4px;width:auto;border-top:0px solid #2B2D2D;font-weight:undefined;border-right:0px solid #2B2D2D;border-bottom:0px solid #2B2D2D;border-left:0px solid #2B2D2D;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;" target="_blank"><span style="padding-left:60px;padding-right:60px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="word-break: break-word; line-height: 32px;">Select</span></span></a>
  <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
  </div>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="0" cellspacing="0" class="text_block block-7" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad" style="padding-bottom:10px;padding-left:30px;padding-right:30px;padding-top:10px;">
  <div style="font-family: sans-serif">
  <div class="" style="font-size: 14px; mso-line-height-alt: 21px; color: #6f7077; line-height: 1.5; font-family: Arial, Helvetica Neue, Helvetica, sans-serif;">
  <p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 21px;"><span style="color:#6f7077;"><span style="color:#2b2d2d;">✓</span> Lorem ipsum dolor </span></p>
  <p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 21px;"><span style="color:#6f7077;"><span style="color:#2b2d2d;">✓</span> sit amet, consectetur<br/></span></p>
  <p style="margin: 0; mso-line-height-alt: 21px;"><span style="color:#2b2d2d;">✓</span> Lorem ipsum dolor</p>
  <p style="margin: 0; mso-line-height-alt: 21px;"><span style="color:#2b2d2d;">✓ </span> sit amet, consectetur</p>
  <p style="margin: 0; mso-line-height-alt: 21px;"><span style="color:#2b2d2d;">✖</span> Lorem ipsum dolor</p>
  <p style="margin: 0; mso-line-height-alt: 21px;"> </p>
  </div>
  </div>
  </td>
  </tr>
  </table>
  </td>
  <td class="column column-3" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; border-bottom: 1px solid #6B67F5; border-left: 1px solid #6B67F5; border-right: 1px solid #6B67F5; border-top: 1px solid #6B67F5; vertical-align: top;" width="33.333333333333336%">
  <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-top:25px;text-align:center;width:100%;">
  <h3 style="margin: 0; color: #2b2d2d; direction: ltr; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 19px; font-weight: 400; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;"><strong>Beta Package</strong></h3>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="0" cellspacing="0" class="text_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad" style="padding-bottom:5px;padding-left:15px;padding-right:15px;padding-top:10px;">
  <div style="font-family: sans-serif">
  <div class="" style="font-size: 14px; mso-line-height-alt: 21px; color: #6f7077; line-height: 1.5; font-family: Arial, Helvetica Neue, Helvetica, sans-serif;">
  <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 21px;"><span style="color:#6f7077;">Lorem ipsum dolor sit amet, consectetur adipiscing<br/></span></p>
  </div>
  </div>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="0" cellspacing="0" class="text_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad" style="padding-left:15px;padding-right:15px;">
  <div style="font-family: Arial, sans-serif">
  <div class="" style="font-size: 14px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; mso-line-height-alt: 21px; color: #6f7077; line-height: 1.5;">
  <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 51px;"><span style="font-size:34px;color:#2b2d2d;"><strong><span style="">&#8358;2750/<span style="font-size:24px;">quarter</span></span></strong></span></p>
  </div>
  </div>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="0" cellspacing="0" class="button_block block-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-bottom:20px;padding-left:15px;padding-right:15px;padding-top:10px;text-align:center;">
  <div align="center" class="alignment">
  <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="http://example.com" style="height:44px;width:168px;v-text-anchor:middle;" arcsize="10%" strokeweight="0.75pt" strokecolor="#2B2D2D" fill="false"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#2b2d2d; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a href="http://example.com" style="text-decoration:none;display:inline-block;color:#2b2d2d;background-color:transparent;border-radius:4px;width:auto;border-top:1px solid #2B2D2D;font-weight:undefined;border-right:1px solid #2B2D2D;border-bottom:1px solid #2B2D2D;border-left:1px solid #2B2D2D;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;" target="_blank"><span style="padding-left:60px;padding-right:60px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="word-break: break-word; line-height: 32px;">Select</span></span></a>
  <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
  </div>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="0" cellspacing="0" class="text_block block-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad" style="padding-bottom:10px;padding-left:30px;padding-right:30px;padding-top:10px;">
  <div style="font-family: sans-serif">
  <div class="" style="font-size: 14px; mso-line-height-alt: 21px; color: #6f7077; line-height: 1.5; font-family: Arial, Helvetica Neue, Helvetica, sans-serif;">
  <p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 21px;"><span style="color:#6f7077;"><span style="color:#2b2d2d;">✓</span> Lorem ipsum dolor </span></p>
  <p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 21px;"><span style="color:#6f7077;"><span style="color:#2b2d2d;">✓</span> sit amet, consectetur<br/></span></p>
  <p style="margin: 0; mso-line-height-alt: 21px;"><span style="color:#2b2d2d;">✓</span> Lorem ipsum dolor</p>
  <p style="margin: 0; mso-line-height-alt: 21px;"><span style="color:#2b2d2d;">✓ </span> sit amet, consectetur</p>
  <p style="margin: 0; mso-line-height-alt: 21px;"><span style="color:#2b2d2d;">✓</span> Lorem ipsum dolor</p>
  <p style="margin: 0; mso-line-height-alt: 21px;"> </p>
  </div>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-9" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f7fafe;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 700px;" width="700">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 25px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="10" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad">
  <div align="center" class="alignment">
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 0px solid #BBBBBB;"><span> </span></td>
  </tr>
  </table>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-10" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #090660;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; background-color: #090660; width: 700px;" width="700">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="10" cellspacing="0" class="social_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad">
  <div align="center" class="alignment">
  <table border="0" cellpadding="0" cellspacing="0" class="social-table" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;" width="144px">
  <tr>
  <td style="padding:0 2px 0 2px;"><a href="https://www.linkedin.com/in/farinu-boluwatife-5817b319a/" target="_blank"><img alt="LinkedIn" height="32" src="https://cdn-icons-png.flaticon.com/512/179/179330.png" style="display: block; height: auto; border: 0;" title="linkedin" width="32"/></a></td>
  <td style="padding:0 2px 0 2px;"><a href="https://github.com/justtife/" target="_blank"><img alt="Github" height="32" src="https://cdn-icons-png.flaticon.com/512/25/25231.png" style="display: block; height: auto; border: 0;" title="github" width="32"/></a></td>
  <td style="padding:0 2px 0 2px;"><a href="https://instagram.com/justtife/" target="_blank"><img alt="Instagram" height="32" src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/2048px-Instagram_icon.png" style="display: block; height: auto; border: 0;" title="instagram" width="32"/></a></td>
  </tr>
  </table>
  </div>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="0" cellspacing="0" class="text_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad" style="padding-bottom:10px;padding-left:50px;padding-right:50px;padding-top:10px;">
  <div style="font-family: sans-serif">
  <div class="" style="font-size: 14px; mso-line-height-alt: 21px; color: #6f7077; line-height: 1.5; font-family: Arial, Helvetica Neue, Helvetica, sans-serif;">
  <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 21px;"><span style="color:#ffffff;">Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor</span></p>
  </div>
  </div>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="0" cellspacing="0" class="text_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad" style="padding-bottom:10px;padding-left:50px;padding-right:50px;padding-top:10px;">
  <div style="font-family: sans-serif">
  <div class="" style="font-size: 14px; mso-line-height-alt: 21px; color: #6f7077; line-height: 1.5; font-family: Arial, Helvetica Neue, Helvetica, sans-serif;">
  <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 15px;"><span style="color:#ffffff;font-size:10px;">Click to <a href="http://example.com" rel="noopener" style="text-decoration: none; color: #ffffff;" target="_blank">UNSUBSCRIBE</a></span></p>
  </div>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-11" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table><!-- End -->
  </body>
  </html>`;
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Subscription receipt from AltBlog",
    html: mailMessage,
    attachments: [{ filename: "AltBlog_invoice.pdf", content: fileStream }],
  };
  const transporter = NodeMailer.createTransport(MailConfig);
  //Send Mail
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      throw new CustomError.BadRequestError(err);
    } else {
      logger.info("Email sent: " + info.response);
    }
  });
  return;
};
module.exports = receiptPDF;
