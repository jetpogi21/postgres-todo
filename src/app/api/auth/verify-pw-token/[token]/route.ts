import sequelize from "@/config/db";
import { User } from "@/models/UserModel";
import { PasswordToken } from "@/models/PasswordTokenModel";
import handleSequelizeError from "@/utils/errorHandling";
import { returnJSONResponse } from "@/utils/utils";
import { Op } from "sequelize";

export const POST = async (
  req: Request,
  { params }: { params: { token: string } }
) => {
  const { token } = params;

  try {
    //Find the token in the database
    const verificationToken = await PasswordToken.findOne({
      where: {
        token,
        expires: {
          [Op.gte]: Date.now(),
        },
      },
    });

    // If the token exists and is not expired
    if (!verificationToken) {
      return returnJSONResponse({
        status: "error",
        error: "Invalid or expired token.",
        errorCode: 404,
      });
    }

    // Get the related user
    const email = verificationToken.email;
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return returnJSONResponse({
        status: "error",
        error: "User not found",
        errorCode: 404,
      });
    }
    return returnJSONResponse({
      status: "success",
      data: {
        email: email,
      },
    });
  } catch (err) {
    return handleSequelizeError(err);
  }
};
