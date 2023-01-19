import Alert from "@components/ui/alert";
import Button from "@components/ui/button";
import Input from "@components/ui/input";
import PasswordInput from "@components/ui/password-input";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ROUTES } from "@utils/routes";
import { useLoginMutation } from "@data/user/use-login.mutation";
import { useTranslation } from "next-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "@components/ui/link";
import { allowedRoles, hasAccess, setAuthCredentials } from "@utils/auth-utils";

type FormValues = {
	email: string;
	password: string;
};
const loginFormSchema = yup.object().shape({
	email: yup
		.string()
		.email("form:error-email-format")
		.required("form:error-email-required"),
	password: yup.string().required("form:error-password-required"),
});
const defaultValues = {
	email: "",
	password: "",
};

const LoginForm = () => {
	const { mutate: login, isLoading: loading } = useLoginMutation();
	const [errorMsg, setErrorMsg] = useState("");
	const { t } = useTranslation();

	const {
		register,
		handleSubmit,

		formState: { errors },
	} = useForm<FormValues>({
		defaultValues,
		resolver: yupResolver(loginFormSchema),
	});
	const router = useRouter();

	function onSubmit({ email, password }: FormValues) {
		login(
			{
				variables: {
					email,
					password,
				},
			},
			{
				onSuccess: ({ data }) => {
					if (data?.token) {
						if (hasAccess(allowedRoles, data?.permissions)) {
							setAuthCredentials(data?.token, data?.permissions);
							router.push(ROUTES.DASHBOARD);
							return;
						}
						setErrorMsg("form:error-enough-permission");
					} else {
						setErrorMsg("form:error-credential-wrong");
					}
				},
				onError: () => {},
			}
		);
	}
	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)} noValidate>
				<Input
					label={t("form:input-label-email")}
					{...register("email")}
					type="email"
					variant="outline"
					className="mb-4"
					error={t(errors?.email?.message!)}
				/>
				<PasswordInput
					label={t("form:input-label-password")}
					forgotPassHelpText={t("form:input-forgot-password-label")}
					{...register("password")}
					error={t(errors?.password?.message!)}
					variant="outline"
					className="mb-4"
					forgotPageLink="/forgot-password"
				/>
				<Button className="w-full" loading={loading} disabled={loading}>
					{t("form:button-label-login")}
				</Button>

				<div className="flex flex-col items-center justify-center relative text-sm text-heading mt-8 sm:mt-11 mb-6 sm:mb-8">
					<hr className="w-full" />
					<span className="absolute start-2/4 -top-2.5 px-2 -ms-4 bg-light">
						{t("common:text-or")}
					</span>
				</div>

				<div className="text-sm sm:text-base text-body text-center">
					{t("form:text-no-account")}{" "}
					<Link
						href="/register"
						className="ms-1 underline text-accent font-semibold transition-colors duration-200 focus:outline-none hover:text-accent-hover focus:text-accent-hover hover:no-underline focus:no-underline"
					>
						{t("form:link-register-shop-owner")}
					</Link>
				</div>

				{errorMsg ? (
					<Alert
						message={t(errorMsg)}
						variant="error"
						closeable={true}
						className="mt-5"
						onClose={() => setErrorMsg("")}
					/>
				) : null}
			</form>
		</>
	);
};

export default LoginForm;
