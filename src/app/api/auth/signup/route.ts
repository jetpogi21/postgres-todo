import handleSequelizeError from "@/utils/errorHandling";
import { returnJSONResponse } from "@/utils/utils";
import registrationSchema from "@/schema/registration";
import { hash } from "bcryptjs";
import { User } from "@/models/UserModel";
import { Op } from "sequelize";
import { Account } from "@/models/AccountModel";
import { VerificationToken } from "@/models/VerificationTokenModel";
import { transporter } from "@/lib/transporter";
import sequelize from "@/config/db";

interface RegistrationBody {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export const POST = async (req: Request) => {
  const body = (await req.json()) as Partial<RegistrationBody>;

  // Validate user input using Yup schema
  try {
    await registrationSchema.validate(body);
  } catch (error: any) {
    return returnJSONResponse({
      status: "error",
      error: error.message,
      errorCode: 422,
    });
  }

  const { username, email, password } = body;

  //Start the transaction
  const transaction = await sequelize.transaction();

  try {
    // Check if profile is already existing
    const profileExists = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
      transaction,
    });

    if (profileExists) {
      if (profileExists.email === email) {
        return returnJSONResponse({
          status: "error",
          targetField: "email",
          error: "Email address not available.",
          errorCode: 409,
        });
      }

      if (profileExists.username === username) {
        return returnJSONResponse({
          status: "error",
          targetField: "username",
          error: "Username not available.",
          errorCode: 409,
        });
      }
    }

    // Hash the password using bcryptjs
    const hashedPassword = await hash(password!, 10);

    // Create the user record in the database using Sequelize
    const user = await User.create(
      {
        name: username!,
        username: username!,
        email: email!,
        password: hashedPassword,
        status: "pending",
      },
      { transaction }
    );

    if (!user) {
      return returnJSONResponse({
        status: "error",
        error: "Unable to create user account",
        errorCode: 500,
      });
    }

    const account = await Account.create(
      {
        userId: user.id,
        type: "credentials",
        provider: "credentials",
        providerAccountId: user.id,
      },
      { transaction }
    );

    if (!(user && account)) {
      return returnJSONResponse({
        status: "error",
        error: "Unable to link account to created user profile",
        errorCode: 422,
      });
    }

    //Create the token that will be sent to the email-address of this user
    const token = crypto.randomUUID();
    //Calculate the expiration date as one hour from now
    const expires = new Date(Date.now() + 3600 * 1000);

    await VerificationToken.create(
      { token, userId: user.id, expires },
      { transaction }
    );

    // Construct the verification link using your domain name and the token
    const link = `${process.env.NEXTAUTH_URL}/verify/${token}`;

    transporter.sendMail({
      from: '"Jonathan Pradas" <flyffonline_26@yahoo.com>',
      to: email,
      subject: "Verify your email address",
      text: `Please click on this link to verify your email address before ${expires}: ${link}`,
      html: `Please click on this link to verify your email address before ${expires}: <a href="${link}">${link}</a>`,
    });

    // Commit the transaction
    await transaction.commit();

    // Return success response
    return returnJSONResponse({
      status: "success",
      data: {
        message: "Signup successful. Please check your email for verification.",
      },
    });
  } catch (err) {
    await transaction.rollback();
    // Handle Sequelize error
    return handleSequelizeError(err);
  }
};
