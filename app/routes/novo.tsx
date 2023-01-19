// @ts-nocheck
import { redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import AuthForm from "~/components/auth/AuthForm";
import { login, signup } from "~/utils/auth.server";

export default function AuthPage() {
  return (
    <section className="bg-stone-700 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img src="/logo_branco.svg" className=" w-64" alt="Quattor Logo" />
        </div>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            {/* <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Entre com sua conta{" "}
            </h1> */}
            <AuthForm />
          </div>
        </div>
      </div>
    </section>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const credentials = Object.fromEntries(formData);
  return await signup(credentials);
};
