const sendMail = require("../sendMail");
const createPassword = async ({ name, email, passwordToken }) => {
  const url = `http://localhost:5050/api/v1/create-password?passwordToken=${passwordToken}`;
  const createPasswordMail = `<!DOCTYPE html>

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
  
		  @media (max-width:620px) {
  
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
  <body style="background-color: #091548; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
  <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #091548;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #e4e5ee; background-image: url(https://i.postimg.cc/3RhpnJs0/background_2.png); background-position: center top; background-repeat: repeat;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-left: 10px; padding-right: 10px; vertical-align: top; padding-top: 5px; padding-bottom: 15px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="image_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;padding-top:8px;">
  <div align="center" class="alignment" style="line-height:10px"><img alt="Main Image" src="https://i.postimg.cc/gkhzkqXd/header3.png" style="display: block; height: auto; border: 0; width: 232px; max-width: 100%;" title="Main Image" width="232"/></div>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="0" cellspacing="0" class="text_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad" style="padding-bottom:15px;padding-top:10px;">
  <div style="font-family: sans-serif">
  <div class="" style="font-size: 14px; mso-line-height-alt: 16.8px; color: #ffffff; line-height: 1.2; font-family: Varela Round, Trebuchet MS, Helvetica, sans-serif;">
  <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;"><span style="font-size:30px;">Create a new Password</span></p>
  </div>
  </div>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="5" cellspacing="0" class="text_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="font-family: sans-serif">
  <div class="" style="font-size: 14px; mso-line-height-alt: 21px; color: #ffffff; line-height: 1.5; font-family: Varela Round, Trebuchet MS, Helvetica, sans-serif;">
  <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 21px;">Dear ${name}, <br>We received a request to create a new password. Don’t worry,</p>
  <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 21px;">we are here to help you.</p>
  </div>
  </div>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="0" cellspacing="0" class="button_block block-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-left:15px;padding-right:15px;padding-top:20px;text-align:center;">
  <div align="center" class="alignment">
  <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${url}" style="height:40px;width:197px;v-text-anchor:middle;" arcsize="60%" stroke="false" fillcolor="#ffffff"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#091548; font-family:sans-serif; font-size:15px"><![endif]--><a href="${url}" style="text-decoration:none;display:inline-block;color:#091548;background-color:#ffffff;border-radius:24px;width:auto;border-top:0px solid transparent;font-weight:undefined;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:5px;padding-bottom:5px;font-family:Varela Round, Trebuchet MS, Helvetica, sans-serif;font-size:15px;text-align:center;mso-border-alt:none;word-break:keep-all;" target="_blank"><span style="padding-left:25px;padding-right:25px;font-size:15px;display:inline-block;letter-spacing:normal;"><span style="word-break: break-word;"><span data-mce-style="" style="line-height: 30px;"><strong>CREATE NEW PASSWORD</strong></span></span></span></a>
  <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
  </div>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-left:10px;padding-right:10px;padding-top:10px;">
  <div align="center" class="alignment">
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="60%">
  <tr>
  <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #5A6BA8;"><span> </span></td>
  </tr>
  </table>
  </div>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="0" cellspacing="0" class="text_block block-7" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad" style="padding-bottom:40px;padding-left:25px;padding-right:25px;padding-top:10px;">
  <div style="font-family: sans-serif">
  <div class="" style="font-size: 14px; mso-line-height-alt: 21px; color: #7f96ef; line-height: 1.5; font-family: Varela Round, Trebuchet MS, Helvetica, sans-serif;">
  <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 21px;"><strong>Don’t need to create a new password?</strong></p>
  <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 21px;">You can safely ignore this message.</p>
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
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-left: 10px; padding-right: 10px; vertical-align: top; padding-top: 15px; padding-bottom: 15px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="5" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad">
  <div align="center" class="alignment" style="line-height:10px"><img alt="Your Logo" src="https://i.postimg.cc/CLQ4KdVN/image-removebg-preview-1.png" style="display: block; height: auto; border: 0; width: 116px; max-width: 100%;" title="Your Logo" width="116"/></div>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="0" cellspacing="0" class="divider_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:15px;">
  <div align="center" class="alignment">
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="60%">
  <tr>
  <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #5A6BA8;"><span> </span></td>
  </tr>
  </table>
  </div>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="10" cellspacing="0" class="social_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad">
  <div align="center" class="alignment">
  <table border="0" cellpadding="0" cellspacing="0" class="social-table" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;" width="156px">
  <tr>
  <td style="padding:0 10px 0 10px;"><a href="https://www.linkedin.com/in/farinu-boluwatife-5817b319a/" target="_blank"><img alt="LinkedIn" height="32" src="https://cdn-icons-png.flaticon.com/512/179/179330.png" style="display: block; height: auto; border: 0;" title="Facebook" width="32"/></a></td>
  <td style="padding:0 10px 0 10px;"><a href="https://instagram.com/justtife/" target="_blank"><img alt="Instagram" height="32" src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/2048px-Instagram_icon.png" style="display: block; height: auto; border: 0;" title="Instagram" width="32"/></a></td>
  <td style="padding:0 10px 0 10px;"><a href="https://github.com/justtife/" target="_blank"><img alt="Github" height="32" src="https://cdn-icons-png.flaticon.com/512/25/25231.png" style="display: block; height: auto; border: 0;" title="Twitter" width="32"/></a></td>
  </tr>
  </table>
  </div>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="15" cellspacing="0" class="text_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="font-family: sans-serif">
  <div class="" style="font-size: 12px; font-family: Varela Round, Trebuchet MS, Helvetica, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #4a60bb; line-height: 1.2;">
  <p style="margin: 0; font-size: 12px; text-align: center; mso-line-height-alt: 14.399999999999999px;"><span style="">Copyright © <span id="date"></span> Alt Blog, All rights reserved.<br/></span></p>
  <p style="margin: 0; font-size: 12px; text-align: center; mso-line-height-alt: 14.399999999999999px;"><span style=""><br/>Changed your mind? You can <a href="${url}" rel="noopener" style="text-decoration: underline; color: #7f96ef;" target="_blank" title="unsubscribe">unsubscribe</a> at any time.</span></p>
  </div>
  </div>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="0" cellspacing="0" class="html_block block-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad">
  <div align="center" style="font-family:Varela Round, Trebuchet MS, Helvetica, sans-serif;text-align:center;"><div style="height-top: 20px;"> </div></div>
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
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px;" width="600">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="icons_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="vertical-align: middle; color: #9d9d9d; font-family: inherit; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
  <table cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="alignment" style="vertical-align: middle; text-align: center;">
  <!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
  <!--[if !vml]><!-->
  
  </td>
  </tr>
  </table>
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
  </td>
  </tr>
  </tbody>
  </table><!-- End -->
  <script>
	  const d = new Date();
	  document.getElementById("date").innerHTML = d.getFullYear();
	  </script>
  </body>
  </html>`;
  return sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: "Create A New Password?",
    html: createPasswordMail,
  });
};
module.exports = createPassword;
