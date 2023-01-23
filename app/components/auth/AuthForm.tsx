// @ts-nocheck
import {
  Form,
  useActionData,
  useTransition as useNavigation,
} from "@remix-run/react";

export default function AuthForm() {
  const navigation = useNavigation();
  const errors = useActionData();
  console.log(errors);

  const isSubmitting = navigation.state !== "idle";
  return (
    <Form method="post" className=" space-y-4 md:space-y-6" id="auth-form">
      <div>
        <label
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          htmlFor="email"
        >
          Email
        </label>

        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          type="email"
          id="email"
          name="email"
          required
        />
      </div>

      <div>
        <label
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          htmlFor="password"
        >
          Senha
        </label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          type="password"
          id="password"
          name="password"
          minLength={7}
        />
      </div>
      {errors && (
        <ul>
          {Object.values(errors).map((error) => (
            <li className="text-red-500" key={error}>
              {error}
            </li>
          ))}
        </ul>
      )}
      <div>
        <button
          className="w-full text-white bg-teal-400 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Authenticating..." : "Entrar"}
        </button>
      </div>
    </Form>
  );
}
