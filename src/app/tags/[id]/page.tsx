//Generated by WriteToDetailPageNext13 - Detail Page Sidebar supabase
import RouterRefresh from "@/components/RouterRefresh";
import TagForm from "@/components/tags/TagForm";
import { createSupabaseServer } from "@/lib/supabase/supabase";
import { getMainModelURL } from "@/utils/api/getMainModelURL";
import { TagConfig } from "@/utils/config/TagConfig";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

const modelConfig = TagConfig;

export const metadata = {
  title: modelConfig.verboseModelName + " Form",
};

async function getData(id: string) {
  const res = await fetch(
    process.env.NEXT_PUBLIC_DOMAIN + "/api/" + modelConfig.modelPath + "/" + id,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw notFound();
  }

  return res.json();
}

const TagFormPage = async ({ params }: { params: { id: string } }) => {
  let data = null;

  const cookieStore = cookies();

  if (params.id !== "new") {
    const supabase = createSupabaseServer(cookieStore);

    const supQuery = getMainModelURL({}, true, modelConfig, supabase, {
      primaryKeyValue: params.id,
      useSlug: !!modelConfig.slugField,
    });

    try {
      const { data: result, error } = await supQuery.single();

      console.log({ result, error });

      if (error) {
        console.log(error);
        throw notFound();
      }

      data = result;
    } catch (e) {
      console.log(e);
      throw notFound();
    }
  }

  return (
    <div className="flex flex-col flex-1 w-full mx-auto text-sm lg:px-0 main-height-less-footer">
      <div className="flex flex-col w-full h-full gap-4 pl-4">
        <div className="flex flex-col h-full">
          <TagForm
            id={params.id}
            data={data}
          />
          <RouterRefresh />
        </div>
      </div>
    </div>
  );
};

export default TagFormPage;
