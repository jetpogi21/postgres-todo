//Generated by WriteToMultiRoute_ts - multi route.ts
import sequelize from "@/config/db";
import { ModelSchema } from "@/schema/ModelSchema";
import { createModel, updateModel } from "@/utils/api/ModelLibs";
import { TaskConfig } from "@/utils/config/TaskConfig";
import handleSequelizeError from "@/utils/errorHandling";
import { findModelPrimaryKeyField } from "@/utils/utilities";
import { NextResponse } from "next/server";

const modelConfig = TaskConfig;
const primaryKeyField = findModelPrimaryKeyField(modelConfig).fieldName;
//Generated by GetMultiCreateModelPOSTRoute - GetMultiCreateModelPOSTRoute
export const POST = async (req: Request) => {
  const body = await req.json();

  const t = await sequelize.transaction();
  let recordsCreated = 0;

  const rows = body[modelConfig.pluralizedModelName];
  const rowFields = Object.keys(rows).map((item) => item);

  for (const item of rows) {
    try {
      //Validate only the submitted fields
      await ModelSchema(modelConfig, false, rowFields).validate(item);
    } catch (error) {
      return handleSequelizeError(error);
    }
  }

  try {
    for (const item of rows) {
      const primaryKeyValue = item[primaryKeyField];
      if (primaryKeyValue === "") {
        await createModel(modelConfig, item, t);
        recordsCreated++;
      } else {
        await updateModel(modelConfig, item, primaryKeyValue, t);
      }
    }

    await t.commit();

    return NextResponse.json({
      recordsCreated,
    });
  } catch (err) {
    await t.rollback();
    return handleSequelizeError(err);
  }
};
