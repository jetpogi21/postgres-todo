import { createSupabaseRoute } from "@/lib/supabase/supabase";
import { convertDateToYYYYMMDD } from "@/utils/utilities";
import { returnJSONResponse } from "@/utils/utils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function getSemimonthOfYear(date: Date) {
  if (!(date instanceof Date)) {
    throw new Error("Invalid input. Expected a Date object.");
  }

  const month = date.getMonth() + 1;
  const dayOfMonth = date.getDate();
  let semimonthOfYear = month * 2;

  if (dayOfMonth < 15) {
    semimonthOfYear--;
  }

  return semimonthOfYear;
}

function getStartAndEndOfWeek(week: number, year: number) {
  // Calculate the start date of the week
  const startDate = new Date(year, 0, 1 + (week - 1) * 7);

  // Calculate the end date of the week
  const endDate = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000);

  // Return an object containing the start and end dates
  return { startDate, endDate };
}

function getStartAndEndOfMonth(month: number, year: number) {
  // Calculate the start date of the month
  const startDate = new Date(year, month, 1);

  // Calculate the end date of the month
  const endDate = new Date(year, month + 1, 0);

  // Return an object containing the start and end dates
  return { startDate, endDate };
}

function getStartAndEndOfSemimonth(semimonthOfYear: number, year: number) {
  const month = Math.ceil(semimonthOfYear / 2) - 1;

  const isFirstHalf = semimonthOfYear % 2 !== 0;

  const startDate = new Date(year, month, isFirstHalf ? 1 : 16);

  const endDate = new Date(
    year,
    isFirstHalf ? month : month + 1,
    isFirstHalf ? 15 : 0
  );

  return { startDate, endDate };
}

function getDateFilterStatement(date: Date, taskIntervalName: string) {
  if (["Working Day", "Daily"].includes(taskIntervalName)) {
    return `"date" = '${convertDateToYYYYMMDD(date)}'`;
  } else {
    const currentYear = date.getFullYear();
    let dates: { startDate: Date; endDate: Date };
    switch (taskIntervalName) {
      case "Weekly":
        const currentYearStartDate = new Date(currentYear, 0, 1);
        const days = Math.floor(
          (date.getTime() - currentYearStartDate.getTime()) /
            (24 * 60 * 60 * 1000)
        );
        const currentWeek = Math.ceil(days / 7);
        dates = getStartAndEndOfWeek(currentWeek, currentYear);
        break;
      case "Monthly":
        const currentMonth = date.getMonth();
        dates = getStartAndEndOfMonth(currentMonth, currentYear);
        break;
      case "Semi-monthly":
        const currentSemiMonth = getSemimonthOfYear(date);

        dates = getStartAndEndOfSemimonth(currentSemiMonth, currentYear);

        break;
    }
    const { startDate, endDate } = dates!;
    return `"date" >= '${convertDateToYYYYMMDD(
      startDate
    )}' AND "date" <= '${convertDateToYYYYMMDD(endDate)}'`;
  }
}

export const POST = async (req: Request) => {
  //Get the date today
  const date = new Date();
  const weekday = date.getDay();

  const cookieStore = cookies();
  const supabase = createSupabaseRoute(cookieStore);

  const { data, error } = await supabase.rpc("add_from_templates", {
    date_str: convertDateToYYYYMMDD(date),
    filter_clause: {
      Daily: getDateFilterStatement(date, "Daily"),
      "Working Day": getDateFilterStatement(date, "Working Day"),
      Weekly: getDateFilterStatement(date, "Weekly"),
      Monthly: getDateFilterStatement(date, "Monthly"),
      "Semi-monthly": getDateFilterStatement(date, "Semi-monthly"),
    },
  });

  if (error) {
    return returnJSONResponse({
      status: "error",
      error: error.message,
      errorCode: 404,
    });
  }

  return NextResponse.json({ data: "success" });
};
