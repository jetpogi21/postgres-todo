//Generated by WriteToModelsRoutes_tsUsingModelconfig - models routes.ts supabase
import { parseParams, returnJSONResponse } from "@/utils/utils";
import {
  TaskTemplateDeletePayload,
  TaskTemplateSearchParams,
} from "@/interfaces/TaskTemplateInterfaces";
import { NextResponse } from "next/server";
import { getCursorString, getSortedValueSimplified } from "@/utils/api/utils";
import { TaskTemplateConfig } from "@/utils/config/TaskTemplateConfig";
import { findConfigItem, findModelPrimaryKeyField } from "@/utils/utilities";
import { getMainModelURL } from "@/utils/api/getMainModelURL";
import handleSequelizeError from "@/utils/errorHandling";
import { createSupabaseRoute } from "@/lib/supabase/supabase";
import { cookies } from "next/headers";
import { ModelSchema } from "@/schema/ModelSchema";
import { getInsertSQL } from "@/utils/api/ModelLibs";
import { ChildSQL } from "@/interfaces/interface";
import { getRelatedSimpleSQLs } from "@/lib/getRelatedSimpleSQLs";
import { getRelatedSQLs } from "@/lib/getRelatedSQLs";
import { getNewRecordsForSimpleRelationships } from "@/lib/getNewRecordsForSimpleRelationships";
import { getNewRecordsForRelationships } from "@/lib/getNewRecordsForRelationships";
import { AppConfig } from "@/lib/app-config";

const modelConfig = TaskTemplateConfig;
const primaryKey = findModelPrimaryKeyField(modelConfig).databaseFieldName;

export const GET = async (req: Request) => {
  const searchParams = new URL(req.url).searchParams;
  const query = parseParams(searchParams) as Partial<TaskTemplateSearchParams>;

  const cookieStore = cookies();
  const supabase = createSupabaseRoute(cookieStore);

  const fetchCount = query["fetchCount"] === "true";
  const sort = getSortedValueSimplified(query["sort"], modelConfig);
  const sortField = sort.includes("-") ? sort.substring(1) : sort;

  const cursorField = findConfigItem(
    modelConfig.fields,
    "databaseFieldName",
    sortField,
    "fieldName"
  );

  const supQuery = getMainModelURL(query, false, modelConfig, supabase);

  try {
    const { data, error, count } = await supQuery;

    let cursor = "";

    if (data && data.length > 0) {
      cursor = getCursorString(cursorField, primaryKey, data);
    }

    if (error) {
      return NextResponse.json({
        rows: [],
        status: "error",
        error: error.message,
      });
    }

    return NextResponse.json({
      rows: data,
      cursor,
      ...(fetchCount && { count }),
    });
  } catch (e) {
    return handleSequelizeError(e);
  }
};

export const POST = async (req: Request) => {
  const cookieStore = cookies();
  const supabase = createSupabaseRoute(cookieStore);

  const body = await req.json();

  try {
    await ModelSchema(modelConfig).validate(body);
  } catch (error) {
    return handleSequelizeError(error);
  }

  //Create statement here
  const mainSQL = getInsertSQL(modelConfig, body, { returnPKOnly: true });

  let childSQL: ChildSQL = {};

  const simpleSQLs = getRelatedSimpleSQLs(modelConfig, body);

  childSQL = { ...childSQL, ...simpleSQLs };

  const relatedSQLs = await getRelatedSQLs(modelConfig, body);

  childSQL = { ...childSQL, ...relatedSQLs };

  const { data, error } = await supabase.rpc("upsert_with_children", {
    main: mainSQL,
    children: childSQL,
  });

  if (error) {
    return returnJSONResponse({
      status: "error",
      error: error.message,
      errorCode: 404,
    });
  }

  const parentPrimaryKeyField =
    findModelPrimaryKeyField(modelConfig).databaseFieldName;

  let newRecords = {};
  newRecords = {
    newRecords,
    ...getNewRecordsForSimpleRelationships(modelConfig, data),
    ...getNewRecordsForRelationships(modelConfig, data),
  };

  return NextResponse.json({
    status: "success",
    [parentPrimaryKeyField]: data["id"],
    ...newRecords,
  });
};

export const DELETE = async (req: Request) => {
  const cookieStore = cookies();
  const supabase = createSupabaseRoute(cookieStore);

  const body = (await req.json()) as TaskTemplateDeletePayload;
  const { deletedTaskTemplates } = body;

  if (deletedTaskTemplates.length > 0) {
    const { data, error } = await supabase
      .schema(AppConfig.sanitizedAppName)
      .from(modelConfig.tableName)
      .delete()
      .in(primaryKey, deletedTaskTemplates);

    if (error) {
      return NextResponse.json("error");
    }

    return NextResponse.json("success");
  }

  return NextResponse.json("success");
};