import { createSupabaseRoute } from "@/lib/supabase/supabase";
import { ModelSchema } from "@/schema/ModelSchema";
import { getInsertSQL, getUpdateSQL } from "@/utils/api/ModelLibs";
import { TaskCategoryConfig } from "@/utils/config/TaskCategoryConfig";
import handleSequelizeError from "@/utils/errorHandling";
import { findModelPrimaryKeyField } from "@/utils/utilities";
import { returnJSONResponse } from "@/utils/utils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const modelConfig = TaskCategoryConfig;
const primaryKeyField = findModelPrimaryKeyField(modelConfig).fieldName;
export const POST = async (req: Request) => {
  const cookieStore = cookies();
  const supabase = createSupabaseRoute(cookieStore);

  const body = await req.json();

  let recordsCreated = 0;

  const rows = body[modelConfig.pluralizedModelName];

  const rowFields = Object.keys(rows).map((item) => item);

  const insertStatements: Record<number, string> = {};
  const updateStatements: Record<number, string> = {};

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
        insertStatements[item.index] = getInsertSQL(modelConfig, item);

        recordsCreated++;
      } else {
        updateStatements[item.index] = getUpdateSQL(
          modelConfig,
          item,
          primaryKeyValue
        );
      }
    }

    const pgPayload = {
      insert_statements: insertStatements,
      update_statements: updateStatements,
    };

    const { data, error } = await supabase.rpc("multi_upsert", pgPayload);

    if (error) {
      return returnJSONResponse({
        status: "error",
        error: error.message,
        errorCode: 404,
      });
    }

    return NextResponse.json({
      recordsCreated: Object.keys(data.inserted).length,
      ...data,
    });
  } catch (err) {
    return handleSequelizeError(err);
  }
};
