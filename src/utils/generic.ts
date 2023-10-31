import { FindAndCountOptions, FindOptions, ModelStatic } from "sequelize";

import handleSequelizeError from "./errorHandling";
import { returnJSONResponse } from "./utils";
import { NextRequest, NextResponse } from "next/server";

export const genericAdd = async (
  req: NextRequest,
  ModelObject: ModelStatic<any>
) => {
  const body: any = req.json();
  try {
    const data = await ModelObject.create(body);
    return returnJSONResponse({ status: "success", data });
  } catch (err) {
    return handleSequelizeError(err);
  }
};

export const genericUpdate = async (
  req: NextRequest,
  ModelObject: ModelStatic<any>,
  id: string
) => {
  const body: any = req.json();
  try {
    const data = await ModelObject.update(body, { where: { id } });
    return returnJSONResponse({ status: "success", data });
  } catch (err) {
    return handleSequelizeError(err);
  }
};

export const genericGetAll = async <T extends ModelStatic<any>>(
  ModelObject: T,
  options?: FindOptions<T["prototype"]>
) => {
  try {
    const data = await ModelObject.findAll(options);
    return NextResponse.json({
      rows: data,
    });
  } catch (err) {
    return handleSequelizeError(err);
  }
};

export const genericGetAndCountAll = async (
  ModelObject: ModelStatic<any>,
  options: FindAndCountOptions<any>,
  sortedBy: string
) => {
  options.distinct = true;
  /* modifiedOptions["subQuery"] = false */

  try {
    const data = await ModelObject.findAndCountAll(options);
    const rows = data.rows;
    const cursor =
      rows && rows.length > 0 ? rows[rows.length - 1][sortedBy] : "";
    return NextResponse.json({
      ...data,
      cursor,
    });
  } catch (err) {
    console.log(err);
    return handleSequelizeError(err);
  }
};

export const genericGetOne = async (
  ModelObject: ModelStatic<any>,
  options: FindOptions<any>,
  id: string
) => {
  try {
    const data = await ModelObject.findByPk(id, options);
    return returnJSONResponse(data);
  } catch (err) {
    return handleSequelizeError(err);
  }
};

export const genericGetOneBySlug = async (
  ModelObject: ModelStatic<any>,
  findOptions: FindOptions,
  id: string
) => {
  try {
    findOptions.where = { slug: id };
    const data = await ModelObject.findOne(findOptions);

    return returnJSONResponse(data);
  } catch (err) {
    return handleSequelizeError(err);
  }
};

export const genericDelete = async (
  ModelObject: ModelStatic<any>,
  id: string
) => {
  try {
    const data = await ModelObject.destroy({ where: { id } });
    return returnJSONResponse({ status: "success", data });
  } catch (err) {
    return handleSequelizeError(err);
  }
};
