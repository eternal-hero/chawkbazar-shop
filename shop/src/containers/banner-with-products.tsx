import BannerCard from "@components/common/banner-card";
import SectionHeader from "@components/common/section-header";
import ProductCard from "@components/product/product-card";
import ProductCardListSmallLoader from "@components/ui/loaders/product-card-small-list-loader";
import { useProductsQuery } from "@framework/products/products.query";
import Alert from "@components/ui/alert";
import { ROUTES } from "@lib/routes";
import { siteSettings } from "@settings/site.settings";
import { useTranslation } from "next-i18next";
import isEmpty from "lodash/isEmpty";
import NotFoundItem from "@components/404/not-found-item";
import {StaticBanner} from "@framework/types";

interface ProductsProps {
  data: StaticBanner[],
	sectionHeading: string;
	categorySlug?: string;
	className?: string;
	variant?: "default" | "reverse";
}

const BannerWithProducts: React.FC<ProductsProps> = ({
	sectionHeading,
	categorySlug,
	variant = "default",
	className = "mb-12 md:mb-14 xl:mb-16",
  data
}) => {
  const { t } = useTranslation();

  const onSellingSettings = siteSettings?.homePageBlocks?.onSaleSettings;
  const {data: products, isLoading: loading, error} = useProductsQuery({
    limit: onSellingSettings?.limit,
    tags: onSellingSettings?.slug
  })

  if (!loading && isEmpty(products?.data)) {
    return (
      <NotFoundItem text={t("text-no-on-selling-products-found")} />
    )
  }

	return (
		<div className={className}>
			<SectionHeader
				sectionHeading={sectionHeading}
				categorySlug={categorySlug}
			/>
			{error ? (
				<Alert message={error?.message} />
			) : (
				<div className="grid grid-cols-4 gap-3 lg:gap-5 xl:gap-7">
					{variant === "reverse" ? (
						<BannerCard
							data={data[1]}
							href={`${ROUTES.COLLECTIONS}/${data[1].slug}`}
							className="hidden 3xl:block"
							effectActive={true}
						/>
					) : (
						<BannerCard
							data={data[0]}
							href={`${ROUTES.COLLECTIONS}/${data[0].slug}`}
							className="hidden 3xl:block"
							effectActive={true}
						/>
					)}
					<div
						className={`col-span-full 3xl:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-5 xl:gap-7 ${
							variant === "reverse" ? "row-span-full" : ""
						}`}
					>
						{loading
							? Array.from({ length: 9 }).map((_, idx) => (
									<ProductCardListSmallLoader
										key={idx}
										uniqueKey={`on-selling-${idx}`}
									/>
							  ))
							: products?.data?.map((product) => (
									<ProductCard
										key={`product--key${product.id}`}
										product={product}
										imgWidth={176}
										imgHeight={176}
										variant="listSmall"
									/>
							  ))}
					</div>
				</div>
			)}
		</div>
	);
};

export default BannerWithProducts;
