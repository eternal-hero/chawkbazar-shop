import { fetchSettings } from "@framework/settings/settings.query";
import { API_ENDPOINTS } from "@framework/utils/endpoints";
import { GetStaticPathsContext, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import { fetchInfiniteProducts } from "@framework/products/products.query";
import { Tag } from "@framework/types";
import { fetchTags } from "@framework/tags/tags.query";

// This function gets called at build time
export async function getStaticPaths({ locales }: GetStaticPathsContext) {
  const tags = await fetchTags({
    queryKey: [API_ENDPOINTS.TAGS, { limit: 100 }],
  });

  const paths = tags?.data?.flatMap((tag: Tag) =>
    locales?.map((locale) => ({ params: { tags: tag.slug }, locale }))
  );

  return {
    paths,
    fallback: "blocking",
  };
}

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const queryClient = new QueryClient();
  const tags = params?.tags as string;

  await queryClient.prefetchQuery(API_ENDPOINTS.SETTINGS, fetchSettings);

  // Fetch all tags name
  await queryClient.prefetchQuery([API_ENDPOINTS.TAGS, {}], fetchTags, {
    staleTime: 60 * 1000,
  });

  await queryClient.prefetchInfiniteQuery(
    [API_ENDPOINTS.PRODUCTS, { tags }],
    fetchInfiniteProducts
  );

  return {
    props: {
      ...(await serverSideTranslations(locale!, [
        "common",
        "menu",
        "forms",
        "footer",
      ])),
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
    revalidate: 120,
  };
};
