import Layout from "@components/layouts/app";
import ProfileUpdateFrom from "@components/auth/profile-update-form";
import ChangePasswordForm from "@components/auth/change-password-from";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { useMeQuery } from "@data/user/use-me.query";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function ProfilePage() {
  const { t } = useTranslation();
  const { data, isLoading: loading, error } = useMeQuery();
  if (loading) return <Loader text={t("common:text-loading")} />;
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-border-base">
        <h1 className="text-lg font-semibold text-heading">
          {t("form:form-title-profile-settings")}
        </h1>
      </div>

      <ProfileUpdateFrom me={data} />
      <ChangePasswordForm />
    </>
  );
}
ProfilePage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["form", "common"])),
  },
});
