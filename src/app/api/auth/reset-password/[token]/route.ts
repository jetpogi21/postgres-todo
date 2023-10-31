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

  //Start the transaction
  const transaction = await sequelize.transaction();

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
    if (verificationToken) {
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

      user.update({ status: "active" });

      // Delete the token from the database
      await verificationToken.destroy();
      await transaction.commit();
    } else {
      return returnJSONResponse({
        status: "error",
        error: "Invalid or expired token.",
        errorCode: 404,
      });
    }

    return returnJSONResponse({
      status: "success",
      data: "Verification successful. You are now signed in.",
    });
  } catch (err) {
    await transaction.rollback();
    return handleSequelizeError(err);
  }
};
