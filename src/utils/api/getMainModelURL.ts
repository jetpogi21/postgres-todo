import { ModelConfig } from "@/interfaces/ModelConfig";
import { AppConfig } from "@/lib/app-config";
import { getURLORder } from "@/lib/getURLOrder";
import { addCursorFilterToURL } from "@/utils/api/addCursorFilterToURL";
import { appendFieldsToColumn } from "@/utils/api/appendFieldsToColumn";
import { processSelectJoins } from "@/utils/api/processSelectJoins";
import { processURLFilters } from "@/utils/api/processURLFilters";
import {
  addCursorFilterToQuery,
  appendFieldsToSQL,
  generateFieldsForSQL,
  getSortedValueSimplified,
  processQueryFilters,
  processQueryJoins,
} from "@/utils/api/utils";
import { findModelPrimaryKeyField } from "@/utils/utilities";
import { getSort } from "@/utils/utils";

export function getMainModelURL(
  query: Record<string, string>,
  dontFilter: boolean = false,
  modelConfig: ModelConfig,
  options?: {
    primaryKeyValue?: string | number;
    useSlug?: boolean;
  }
) {
  const simpleOnly = query["simpleOnly"];
  const cursor = query["cursor"];
  const limit = query["limit"] || modelConfig.limit || AppConfig.limit || 10;

  const sort = getSortedValueSimplified(query["sort"], modelConfig);
  const sortField = sort.includes("-") ? sort.substring(1) : sort;

  //Declare the variables
  /* const table = `${AppConfig.sanitizedAppName}_${modelConfig.tableName}`; */
  const table = modelConfig.tableName;
  const primaryKeyField = findModelPrimaryKeyField(modelConfig);
  const fields: ([string, string] | string)[] =
    generateFieldsForSQL(modelConfig);

  //This will be used to store the fields to be used from the joins

  //should produce like this
  //actors!inner()&actors.first_name=eq.Jehanne&actors=not.is.null --> if there's a filter involved
  const joinFields: string[] = [];

  //This will be used to store the replacements needed
  let replacements: Record<string, string> = {};

  const filters: string[] = [];

  if (!simpleOnly || simpleOnly !== "true") {
    if (!dontFilter) {
      processURLFilters(filters, query, modelConfig, replacements, true);
    }
  }

  if (options?.primaryKeyValue) {
    const id = options.primaryKeyValue;
    if (options?.useSlug) {
      filters.push(`slug=eq.${id}`);
    } else {
      filters.push(`${primaryKeyField.databaseFieldName}=eq.${id}`);
    }
  }

  /* processSelectJoins(query, dontFilter, modelConfig, joinFields); */

  const orderBy = getSort(
    sort,
    modelConfig.sortString,
    primaryKeyField.databaseFieldName
  );

  if (cursor) {
    addCursorFilterToURL(
      cursor,
      sort,
      sortField,
      primaryKeyField.databaseFieldName,
      filters,
      table
    );
  }

  const order = getURLORder(orderBy);
  const filterString = filters.length > 0 ? `and=(${filters.join(",")})` : "";

  //build the sql field name and aliases (aliases are used to destructure the object)
  const columns: string[] = [];
  appendFieldsToColumn(fields, columns);

  //TO DO: JOINS (filtering, ordering etc.)
  const joins = "";
  /* sql.fields = sql.fields.concat(joinFields);

  sql.joins = [distinctJoin, ...leftJoins];

  //Insert joins here LEFT joins e.g. cardCardKeywordJoin, distincJoin or
  //new clsJoin("marvelduel_belongsto", "deck_id", "id", null)
  resetSQL(sql); */

  //rowURL should be `tableName`
  //columns --> fieldName:databaseFIeldName to rename
  //append filterString only if it's not null
  const countURL = `/${table}?columns=${columns}${joins}&order=${order}&limit=${limit}${
    filterString ? "&" + filterString : ""
  }`;
  const rowURL = `${countURL}&limit=${limit}`;

  return {
    rowURL,
    countURL,
  };
}
