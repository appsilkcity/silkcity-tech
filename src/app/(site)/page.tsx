import { HomePage } from "@/components/home-page";
import { getPublicSiteData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await getPublicSiteData();
  return <HomePage data={data} />;
}
