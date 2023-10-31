import { transporter } from "@/lib/transporter";
import { PasswordToken } from "@/models/PasswordTokenModel";
import { User } from "@/models/UserModel";
import handleSequelizeError from "@/utils/errorHandling";
import { returnJSONResponse } from "@/utils/utils";
import * as Yup from "yup";

interface ForgotPasswordBody {
  email?: string;
}

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Please enter a valid email address"),
});

export const POST = async (req: Request) => {
  const body = (await req.json()) as ForgotPasswordBody;
  console.log(body);

  // Validate user input using Yup schema
  try {
    await forgotPasswordSchema.validate({ email: body.email });
  } catch (error: any) {
    return returnJSONResponse({
      status: "error",
      error: error.message,
      errorCode: 422,
    });
  }

  const { email } = body;

  try {
    //check if the email is existing as a valid user
    // Check if email is already existing
    const emailExists = await User.findOne({
      where: {
        email,
      },
    });

    if (!emailExists) {
      return returnJSONResponse({
        status: "error",
        targetField: "email",
        error: "Email address does not exist.",
        errorCode: 409,
      });
    }

    //Create the token that will be sent to the email-address of this user
    const token = crypto.randomUUID();
    //Calculate the expiration date as one hour from now
    const expires = new Date(Date.now() + 3600 * 1000);

    // Store the verification code and associated email address
    await PasswordToken.create({
      token,
      email: email!,
      expires,
    });

    const link = `${process.env.NEXTAUTH_URL}/dashboard/reset-password/${token}`;

    // Compose the email message
    const mailOptions = {
      from: '"Jonathan Pradas" <flyffonline_26@yahoo.com>',
      to: email,
      subject: "Password reset link",
      text: `Please click on this link to reset your password before ${expires}: ${link}`,
      html: `Please click on this link to reset your password before ${expires}: <a href="${link}">${link}</a>`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return returnJSONResponse({
          status: "error",
          targetField: "email",
          error: "Failed to send email",
          errorCode: 409,
        });
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });

    return returnJSONResponse({
      status: "success",
      data: {
        message:
          "Password reset link sent successfully. Please check your email to proceed.",
      },
    });
  } catch (err) {
    console.log(err);
    return handleSequelizeError(err);
  }
};
