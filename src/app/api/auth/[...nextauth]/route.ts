//@ts-nocheck
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest } from "next/server";
import { AppRouteRouteHandlerContext } from "next/dist/server/future/route-modules/app-route/module";

const handler = async (req: NextRequest, res: AppRouteRouteHandlerContext) => {
  return NextAuth(req, res, authOptions);
};

export { handler as GET, handler as POST };
