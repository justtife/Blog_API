const sendMail = require("../sendMail");
const reminder = async ({
  name,
  email,
  title,
  description,
  image,
  author,
  article,
}) => {
  const url = `http://localhost:5050/api/v1/article/${article}`;
  const reminderMail = `<!DOCTYPE html>

  <html
    lang="en"
    xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:v="urn:schemas-microsoft-com:vml"
  >
    <head>
      <title></title>
      <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      <!--[if mso
        ]><xml
          ><o:OfficeDocumentSettings
            ><o:PixelsPerInch>96</o:PixelsPerInch
            ><o:AllowPNG /></o:OfficeDocumentSettings></xml
      ><![endif]-->
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
          line-height: inherit;
        }
  
        .desktop_hide,
        .desktop_hide table {
          mso-hide: all;
          display: none;
          max-height: 0px;
          overflow: hidden;
        }
  
        @media (max-width: 620px) {
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
  
          .fullMobileWidth,
          .image_block img.big,
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
    <body
      style="
        background-color: #ffffff;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: none;
        text-size-adjust: none;
      "
    >
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="nl-container"
        role="presentation"
        style="
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
          background-color: #ffffff;
        "
        width="100%"
      >
        <tbody>
          <tr>
            <td>
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-1"
                role="presentation"
                style="
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
                  background-color: #132437;
                "
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          background-repeat: no-repeat;
                          background-position: center top;
                          color: #000000;
                          background-image: url('https://i.postimg.cc/G2FWHPw4/blue-glow-3.jpg');
                          width: 600px;
                        "
                        width="600"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                vertical-align: top;
                                padding-top: 0px;
                                padding-bottom: 0px;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="100%"
                            >
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="image_block block-1"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      width: 100%;
                                      padding-right: 0px;
                                      padding-left: 0px;
                                    "
                                  >
                                    <div
                                      align="center"
                                      class="alignment"
                                      style="line-height: 10px"
                                    >
                                      <img
                                        class="fullMobileWidth"
                                        src="https://i.postimg.cc/C1xGqY9b/top-rounded.png"
                                        style="
                                          display: block;
                                          height: auto;
                                          border: 0;
                                          width: 600px;
                                          max-width: 100%;
                                        "
                                        width="600"
                                      />
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
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-2"
                role="presentation"
                style="
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
                  background-color: #132437;
                "
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          background-position: center top;
                          color: #000000;
                          background-color: #ffffff;
                          width: 600px;
                        "
                        width="600"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                vertical-align: top;
                                padding-top: 0px;
                                padding-bottom: 10px;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="100%"
                            >
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="image_block block-1"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      padding-bottom: 5px;
                                      padding-left: 20px;
                                      padding-right: 20px;
                                      padding-top: 5px;
                                      width: 100%;
                                    "
                                  >
                                    <div
                                      align="center"
                                      class="alignment"
                                      style="line-height: 10px"
                                    >
                                      <img
                                        alt="cover image"
                                        class="big"
                                        src="${image}"
                                        style="
                                          display: block;
                                          height: auto;
                                          border: 0;
                                          width: 540px;
                                          max-width: 100%;
                                        "
                                        title="book shelf"
                                        width="540"
                                      />
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
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-3"
                role="presentation"
                style="
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
                  background-color: #ff7d14;
                  background-image: url('https://i.postimg.cc/8knHLJpc/orange-gradient-wide.png');
                  background-repeat: no-repeat;
                "
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          background-color: #ffffff;
                          color: #000000;
                          width: 600px;
                        "
                        width="600"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                vertical-align: top;
                                padding-top: 0px;
                                padding-bottom: 0px;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="100%"
                            >
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="heading_block block-1"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      padding-bottom: 5px;
                                      padding-top: 25px;
                                      text-align: center;
                                      width: 100%;
                                    "
                                  >
                                    <h1
                                      style="
                                        margin: 0;
                                        color: #555555;
                                        direction: ltr;
                                        font-family: Arial, Helvetica Neue,
                                          Helvetica, sans-serif;
                                        font-size: 36px;
                                        font-weight: 400;
                                        letter-spacing: normal;
                                        line-height: 120%;
                                        text-align: center;
                                        margin-top: 0;
                                        margin-bottom: 0;
                                      "
                                    >
                                      <strong>Reminder from AltBlog</strong>
                                    </h1>
                                  </td>
                                </tr>
                              </table>
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="text_block block-2"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  word-break: break-word;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      padding-bottom: 20px;
                                      padding-left: 30px;
                                      padding-right: 30px;
                                      padding-top: 20px;
                                    "
                                  >
                                    <div style="font-family: sans-serif">
                                      <div
                                        class=""
                                        style="
                                          font-size: 14px;
                                          mso-line-height-alt: 25.2px;
                                          color: #737487;
                                          line-height: 1.8;
                                          font-family: Arial, Helvetica Neue,
                                            Helvetica, sans-serif;
                                        "
                                      >
                                        <p
                                          style="
                                            margin: 0;
                                            font-size: 14px;
                                            text-align: left;
                                            mso-line-height-alt: 25.2px;
                                          "
                                        >
                                          <span style="font-size: 14px"
                                            >Hello <em>${name}</em>,</span
                                          >
                                        </p>
                                        <p
                                          style="
                                            margin: 0;
                                            font-size: 14px;
                                            text-align: left;
                                            mso-line-height-alt: 32.4px;
                                          "
                                        >
                                          <span style="font-size: 18px"
                                            >I am here to tell you that
                                            ${author} just published an article
                                            titled; ${title}</span
                                          >
                                        </p>
                                        <p
                                          style="
                                            margin: 0;
                                            font-size: 14px;
                                            text-align: left;
                                            mso-line-height-alt: 27px;
                                          "
                                        >
                                          <span style="font-size: 15px"
                                            ><u
                                              ><span style="">Summary</span></u
                                            ></span
                                          >
                                        </p>
                                        <p
                                          style="
                                            margin: 0;
                                            font-size: 14px;
                                            text-align: justify;
                                            mso-line-height-alt: 32.4px;
                                          "
                                        >
                                          <span style="font-size: 18px"
                                            >${description}</span
                                          >
                                        </p>
                                        <p
                                          style="
                                            margin: 0;
                                            font-size: 14px;
                                            text-align: center;
                                            mso-line-height-alt: 25.2px;
                                          "
                                        >
                                          <em
                                            ><span style="font-size: 12px"
                                              >Click the link below to read
                                              article</span
                                            ></em
                                          >
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="button_block block-3"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      padding-bottom: 30px;
                                      padding-left: 15px;
                                      padding-right: 15px;
                                      padding-top: 20px;
                                      text-align: center;
                                    "
                                  >
                                    <div align="center" class="alignment">
                                      <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://www.example.com" style="height:52px;width:194px;v-text-anchor:middle;" arcsize="8%" stroke="false" fillcolor="#ff7d14"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><!
                                      [endif]--><a
                                        href="${url}"
                                        style="
                                          text-decoration: none;
                                          display: inline-block;
                                          color: #ffffff;
                                          background-color: #ff7d14;
                                          border-radius: 4px;
                                          width: auto;
                                          border-top: 0px solid transparent;
                                          font-weight: 400;
                                          border-right: 0px solid transparent;
                                          border-bottom: 0px solid transparent;
                                          border-left: 0px solid transparent;
                                          padding-top: 10px;
                                          padding-bottom: 10px;
                                          font-family: Arial, Helvetica Neue,
                                            Helvetica, sans-serif;
                                          font-size: 16px;
                                          text-align: center;
                                          mso-border-alt: none;
                                          word-break: keep-all;
                                        "
                                        target="_blank"
                                        ><span
                                          style="
                                            padding-left: 60px;
                                            padding-right: 60px;
                                            font-size: 16px;
                                            display: inline-block;
                                            letter-spacing: normal;
                                          "
                                          ><span
                                            dir="ltr"
                                            style="
                                              word-break: break-word;
                                              line-height: 32px;
                                            "
                                            >Read Now</span
                                          ></span
                                        ></a
                                      >
                                      <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="image_block block-4"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      padding-bottom: 40px;
                                      width: 100%;
                                      padding-right: 0px;
                                      padding-left: 0px;
                                    "
                                  >
                                    <div
                                      align="center"
                                      class="alignment"
                                      style="line-height: 10px"
                                    >
                                      <img
                                        alt="line"
                                        class="big"
                                        src="https://i.postimg.cc/BnFMSSG6/divider.png"
                                        style="
                                          display: block;
                                          height: auto;
                                          border: 0;
                                          width: 541px;
                                          max-width: 100%;
                                        "
                                        title="line"
                                        width="541"
                                      />
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
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-4"
                role="presentation"
                style="
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
                  background-color: #ff7d14;
                "
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          background-color: #ffffff;
                          color: #000000;
                          width: 600px;
                        "
                        width="600"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                vertical-align: top;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="50%"
                            >
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="image_block block-2"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      width: 100%;
                                      padding-right: 0px;
                                      padding-left: 0px;
                                    "
                                  >
                                    <div
                                      align="center"
                                      class="alignment"
                                      style="line-height: 10px"
                                    >
                                      <img
                                        alt="audio book"
                                        src="https://i.postimg.cc/CLQ4KdVN/image-removebg-preview-1.png"
                                        style="
                                          display: block;
                                          height: auto;
                                          border: 0;
                                          width: 195px;
                                          max-width: 100%;
                                        "
                                        title="audio book"
                                        width="195"
                                      />
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                            <td
                              class="column column-2"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                vertical-align: top;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="50%"
                            >
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="image_block block-2"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      padding-bottom: 80px;
                                      padding-left: 40px;
                                      padding-right: 40px;
                                      padding-top: 40px;
                                      width: 100%;
                                    "
                                  >
                                    <div
                                      align="center"
                                      class="alignment"
                                      style="line-height: 10px"
                                    >
                                      <img
                                        alt="book icon"
                                        src="https://i.postimg.cc/W30v0Lrb/book-unlimited.gif"
                                        style="
                                          display: block;
                                          height: auto;
                                          border: 0;
                                          width: 110px;
                                          max-width: 100%;
                                        "
                                        title="book icon"
                                        width="110"
                                      />
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
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-5"
                role="presentation"
                style="
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
                  background-color: #ff7d14;
                "
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          background-color: #ffffff;
                          color: #000000;
                          width: 600px;
                        "
                        width="600"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                vertical-align: top;
                                padding-top: 0px;
                                padding-bottom: 0px;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="100%"
                            >
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="heading_block block-1"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      padding-bottom: 5px;
                                      padding-top: 25px;
                                      text-align: center;
                                      width: 100%;
                                    "
                                  >
                                    <h2
                                      style="
                                        margin: 0;
                                        color: #555555;
                                        direction: ltr;
                                        font-family: Arial, Helvetica Neue,
                                          Helvetica, sans-serif;
                                        font-size: 24px;
                                        font-weight: 400;
                                        letter-spacing: normal;
                                        line-height: 120%;
                                        text-align: center;
                                        margin-top: 0;
                                        margin-bottom: 0;
                                      "
                                    >
                                      <strong>Get access to all articles</strong>
                                    </h2>
                                  </td>
                                </tr>
                              </table>
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="text_block block-2"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  word-break: break-word;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      padding-bottom: 20px;
                                      padding-left: 30px;
                                      padding-right: 30px;
                                      padding-top: 20px;
                                    "
                                  >
                                    <div style="font-family: sans-serif">
                                      <div
                                        class=""
                                        style="
                                          font-size: 14px;
                                          mso-line-height-alt: 25.2px;
                                          color: #737487;
                                          line-height: 1.8;
                                          font-family: Arial, Helvetica Neue,
                                            Helvetica, sans-serif;
                                        "
                                      >
                                        <p
                                          style="
                                            margin: 0;
                                            font-size: 14px;
                                            text-align: center;
                                            mso-line-height-alt: 32.4px;
                                          "
                                        >
                                          <span style="font-size: 18px"
                                            >You can now view and read unlimited
                                            numbers of articles by subscribing
                                            today</span
                                          ><span style="font-size: 18px">.</span>
                                        </p>
                                        <p
                                          style="
                                            margin: 0;
                                            font-size: 14px;
                                            text-align: center;
                                            mso-line-height-alt: 25.2px;
                                          "
                                        >
                                          <span style="font-size: 14px"
                                            >Visit site today to get discount on
                                            all subscriptions</span
                                          >
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="image_block block-3"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      padding-bottom: 35px;
                                      padding-top: 10px;
                                      width: 100%;
                                      padding-right: 0px;
                                      padding-left: 0px;
                                    "
                                  >
                                    <div
                                      align="center"
                                      class="alignment"
                                      style="line-height: 10px"
                                    >
                                      <img
                                        class="big"
                                        src="images/divider.png"
                                        style="
                                          display: block;
                                          height: auto;
                                          border: 0;
                                          width: 541px;
                                          max-width: 100%;
                                        "
                                        width="541"
                                      />
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="text_block block-4"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  word-break: break-word;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td class="pad">
                                    <div style="font-family: sans-serif">
                                      <div
                                        class=""
                                        style="
                                          font-size: 14px;
                                          mso-line-height-alt: 25.2px;
                                          color: #07113e;
                                          line-height: 1.8;
                                          font-family: Arial, Helvetica Neue,
                                            Helvetica, sans-serif;
                                        "
                                      >
                                        <p
                                          style="
                                            margin: 0;
                                            font-size: 14px;
                                            text-align: center;
                                            mso-line-height-alt: 32.4px;
                                          "
                                        >
                                          <span style="font-size: 18px"
                                            >Follow us</span
                                          >
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="social_block block-5"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      padding-bottom: 15px;
                                      padding-left: 15px;
                                      padding-right: 15px;
                                      padding-top: 10px;
                                      text-align: center;
                                    "
                                  >
                                    <div align="center" class="alignment">
                                      <table
                                        border="0"
                                        cellpadding="0"
                                        cellspacing="0"
                                        class="social-table"
                                        role="presentation"
                                        style="
                                          mso-table-lspace: 0pt;
                                          mso-table-rspace: 0pt;
                                          display: inline-block;
                                        "
                                        width="138px"
                                      >
                                        <tr>
                                          <td style="padding: 0 7px 0 7px">
                                            <a
                                              href="https://www.linkedin.com/in/farinu-boluwatife-5817b319a/"
                                              target="_blank"
                                              ><img
                                                alt="LinkedIn"
                                                height="32"
                                                src="https://cdn-icons-png.flaticon.com/512/179/179330.png"
                                                style="
                                                  display: block;
                                                  height: auto;
                                                  border: 0;
                                                "
                                                title="LinkeIn"
                                                width="32"
                                            /></a>
                                          </td>
                                          <td style="padding: 0 7px 0 7px">
                                            <a
                                              href="https://instagram.com/justtife/"
                                              target="_blank"
                                              ><img
                                                alt="Instagram"
                                                height="32"
                                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/2048px-Instagram_icon.png"
                                                style="
                                                  display: block;
                                                  height: auto;
                                                  border: 0;
                                                "
                                                title="Instagram"
                                                width="32"
                                            /></a>
                                          </td>
                                          <td style="padding: 0 7px 0 7px">
                                            <a
                                              href="https://github.com/justtife/"
                                              target="_blank"
                                              ><img
                                                alt="Instagram"
                                                height="32"
                                                src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                                                style="
                                                  display: block;
                                                  height: auto;
                                                  border: 0;
                                                "
                                                title="Github"
                                                width="32"
                                            /></a>
                                          </td>
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
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-6"
                role="presentation"
                style="
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
                  background-color: #ff7d14;
                "
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          background-position: center top;
                          color: #000000;
                          width: 600px;
                        "
                        width="600"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                vertical-align: top;
                                padding-top: 0px;
                                padding-bottom: 0px;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="100%"
                            >
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="image_block block-1"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      width: 100%;
                                      padding-right: 0px;
                                      padding-left: 0px;
                                    "
                                  >
                                    <div
                                      align="center"
                                      class="alignment"
                                      style="line-height: 10px"
                                    >
                                      <img
                                        class="fullMobileWidth"
                                        src="https://i.postimg.cc/pTJS22z8/bottom-rounded.png"
                                        style="
                                          display: block;
                                          height: auto;
                                          border: 0;
                                          width: 600px;
                                          max-width: 100%;
                                        "
                                        width="600"
                                      />
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="text_block block-2"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  word-break: break-word;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      padding-bottom: 5px;
                                      padding-left: 5px;
                                      padding-right: 5px;
                                      padding-top: 30px;
                                    "
                                  >
                                    <div style="font-family: sans-serif">
                                      <div
                                        class=""
                                        style="
                                          font-size: 12px;
                                          font-family: Arial, Helvetica Neue,
                                            Helvetica, sans-serif;
                                          mso-line-height-alt: 14.399999999999999px;
                                          color: #262b30;
                                          line-height: 1.2;
                                        "
                                      >
                                        <p
                                          style="
                                            margin: 0;
                                            font-size: 14px;
                                            text-align: center;
                                            mso-line-height-alt: 16.8px;
                                          "
                                        >
                                          <span style="font-size: 12px"
                                            >© 2020 Blog | Lagos State,
                                            Nigeria</span
                                          >
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="text_block block-3"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  word-break: break-word;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      padding-bottom: 35px;
                                      padding-left: 10px;
                                      padding-right: 10px;
                                      padding-top: 5px;
                                    "
                                  >
                                    <div style="font-family: sans-serif">
                                      <div
                                        class=""
                                        style="
                                          font-size: 12px;
                                          font-family: Arial, Helvetica Neue,
                                            Helvetica, sans-serif;
                                          mso-line-height-alt: 14.399999999999999px;
                                          color: #262b30;
                                          line-height: 1.2;
                                        "
                                      >
                                        <p
                                          style="
                                            margin: 0;
                                            font-size: 14px;
                                            text-align: center;
                                            mso-line-height-alt: 16.8px;
                                          "
                                        >
                                          <span style="font-size: 12px"
                                            >If you prefer not to receive reminder
                                            emails form this list,
                                            <a
                                              href="http://www.example.com"
                                              rel="noopener"
                                              style="
                                                text-decoration: underline;
                                                color: #262b30;
                                              "
                                              target="_blank"
                                              >click here to unsubscribe</a
                                            >.</span
                                          >
                                        </p>
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
              <table
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="row row-7"
                role="presentation"
                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="row-content stack"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          color: #000000;
                          width: 600px;
                        "
                        width="600"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                vertical-align: top;
                                padding-top: 5px;
                                padding-bottom: 5px;
                                border-top: 0px;
                                border-right: 0px;
                                border-bottom: 0px;
                                border-left: 0px;
                              "
                              width="100%"
                            >
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="icons_block block-1"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      vertical-align: middle;
                                      color: #9d9d9d;
                                      font-family: inherit;
                                      font-size: 15px;
                                      padding-bottom: 5px;
                                      padding-top: 5px;
                                      text-align: center;
                                    "
                                  >
                                    <table
                                      cellpadding="0"
                                      cellspacing="0"
                                      role="presentation"
                                      style="
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                      "
                                      width="100%"
                                    >
                                      <tr>
                                        <td
                                          class="alignment"
                                          style="
                                            vertical-align: middle;
                                            text-align: center;
                                          "
                                        ></td>
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
      </table>
      <!-- End -->
    </body>
  </html>
  `;
  return sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: `${author} just published an article`,
    html: reminderMail,
  });
};
module.exports = reminder;
