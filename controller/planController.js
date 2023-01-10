const Subscription = require("../models/Subscription");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const paystack = require("paystack")(process.env.PAYSTACK_TEST_SECRET_KEY);
const cron = require("node-cron");
const refreshTokenOnRequest = require("../utils/refreshToken");
const receiptPDF = require("../utils/createPDF");
const logger = require("../logger/index");
const { subExpiredMail, subReminderMail } = require("../utils/Emails");
const User = require("../models/User");
module.exports = class SubscriptionAPI {
  static async initializePayment(req, res) {
    await refreshTokenOnRequest({ req, res });
    const { plan: subPlan } = req.params;
    let email = req.user.email;
    let amount;
    switch (subPlan) {
      case "monthly":
        amount = 100000;
        break;
      case "quarterly":
        amount = 275000;
        break;
      case "yearly":
        amount = 1000000;
        break;
      default:
        throw new CustomError.BadRequestError("Invalid Request");
    }
    const metadata = { userID: req.user._id, plan: subPlan };
    paystack.transaction.initialize(
      {
        amount,
        email,
        callback_url: "http://localhost:5050/api/v1/subscription/verify",
        metadata,
      },
      (error, body) => {
        if (error) {
          throw new CustomError.BadRequestError("An Error Occured");
        } else {
          res.status(302).redirect(body.data.authorization_url);
        }
      }
    );
  }
  static async verifyPayment(req, res) {
    await refreshTokenOnRequest({ req, res });
    const ref = req.query.reference;
    paystack.transaction.verify(ref, async (error, body) => {
      if (error) {
        throw new CustomError.BadRequestError("An error Occured");
      } else {
        let subDay;
        let discount;
        let fullDate = new Date(`${body.data.paid_at}`);
        let real_amount;
        //Set subscription days
        if (body.data.metadata.plan === "monthly") {
          subDay = 30;
          discount = 0.001;
          real_amount = 1000.01;
        } else if (body.data.metadata.plan === "quarterly") {
          subDay = 90;
          discount = 8.33;
          real_amount = 3000;
        } else {
          subDay = 365;
          discount = 16.67;
          real_amount = 12000;
        }
        const date = new Date();
        //Check if user has made subscription before
        const subscription = await Subscription.findOne({
          user: body.data.metadata.userID,
        });
        if (subscription) {
          //Check if the subscription is still valid
          if (subscription.valid === true) {
            const formerDate = new Date(Date.parse(`${subscription.endDate}`));
            formerDate.setDate(formerDate.getDate() + subDay);
            subscription.endDate = formerDate;
          } else {
            subscription.valid = true;
            subscription.endDate = new Date(
              date.setDate(date.getDate() + subDay)
            );
          }
          subscription.plan = body.data.metadata.plan;
          subscription.startDate = body.data.paid_at;
          subscription.paymentMethod.push(body.data.channel);
          subscription.paymentToken.push(ref);
          subscription.reminderMail = "not_sent";
          await subscription.save();
          //Send receipt
          await receiptPDF(
            discount,
            real_amount,
            fullDate.toString(),
            body.data.id,
            body.data.customer.email,
            body.data.amount / 100
          );
          return res.status(StatusCodes.OK).json({
            message: {
              detail: "Payment Successful",
              plan: body.data.metadata.plan,
              status: "Success",
            },
          });
        }
        //If user has not subscribed before
        //Create a new subscription storage for the user
        let data = new Subscription();
        data.user = body.data.metadata.userID;
        data.plan = body.data.metadata.plan;
        data.startDate = body.data.paid_at;
        data.paymentMethod = body.data.channel;
        data.paymentToken = ref;
        data.endDate = new Date(date.setDate(date.getDate() + subDay));
        await data.save();
        //Send pdf receipt via mail
        await receiptPDF(
          discount,
          real_amount,
          fullDate.toString(),
          body.data.id,
          body.data.customer.email,
          body.data.amount / 100
        );
        res.status(StatusCodes.OK).json({
          message: {
            detail: "Payment Successful",
            plan: body.data.metadata.plan,
            status: "Success",
          },
        });
      }
    });
  }
};
//Schedule Plan Expiry Mail
cron.schedule("* * * * *", async () => {
  const recentTime = new Date(Date.now());
  const parseRecentTime = new Date(Date.parse(recentTime));
  const subscription = await Subscription.find({});
  subscription.forEach(async (subscription) => {
    const weekBeforeEndDate = new Date(Date.parse(`${subscription.endDate}`));
    weekBeforeEndDate.setDate(weekBeforeEndDate.getDate() - 7);
    //Send reminder mail a week before subscription expires
    if (
      parseRecentTime.getTime() > weekBeforeEndDate.getTime() &&
      subscription.reminderMail !== "sent"
    ) {
      const user = await User.findById({ _id: subscription.user });
      //Send notification mail
      logger.info("Reminder Email sent");
      subscription.reminderMail = "sent";
      let firstName = user.name.first;
      let email = user.email;
      await subReminderMail(firstName, email);
    }
    //Conditions to turn subscription valid option to false
    if (
      parseRecentTime.getTime() > subscription.endDate &&
      subscription.valid === true
    ) {
      logger.info("Subscription Expired");
      subscription.valid = false;
      const user = await User.findById({ _id: subscription.user });
      //Send your subscription has expired mail
      let firstName = user.name.first;
      let email = user.email;
      await subExpiredMail(firstName, email);
    }
    await subscription.save();
  });
});
