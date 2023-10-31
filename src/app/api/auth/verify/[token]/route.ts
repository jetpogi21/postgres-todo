import sequelize from "@/config/db";
import { User } from "@/models/UserModel";
import { VerificationToken } from "@/models/VerificationTokenModel";
import handleSequelizeError from "@/utils/errorHandling";
import { returnJSONResponse } from "@/utils/utils";

export const POST = async (
  req: Request,
  { params }: { params: { token: string } }
) => {
  const { token } = params;

  //Start the transaction
  const transaction = await sequelize.transaction();

  try {
    //Find the token in the database
    const verificationToken = await VerificationToken.findOne({
      where: { token },
    });

    // If the token exists and is not expired
    if (
      verificationToken &&
      verificationToken.expires > (Date.now() as unknown as Date)
    ) {
      // Get the related user
      const user = await User.findByPk(verificationToken.userId);

      if (!user) {
        return returnJSONResponse({
          status: "error",
          error: "Page not found",
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
