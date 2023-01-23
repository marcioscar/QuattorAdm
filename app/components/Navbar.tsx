import { Form, NavLink } from "@remix-run/react";

export function Navbar() {
  const activeClassName = "text-orange-500";
  return (
    <nav className="bg-stone-900 text-white border-gray-200 px-2 mb-4 sm:px-4 py-2.5 ">
      <div className="container flex flex-wrap justify-between items-center mx-auto">
        <NavLink to="/" className="flex items-center">
          <img
            src="/logo_branco.svg"
            className="mr-3 h-10 sm:h-9"
            alt="Quattor Logo"
          />
        </NavLink>
        <div className="flex space-x-8 font-light">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? activeClassName : undefined
            }
          >
            HOME
          </NavLink>
          <NavLink
            to="/despesas"
            className={({ isActive }) =>
              isActive ? activeClassName : undefined
            }
          >
            DESPESAS
          </NavLink>
          <NavLink
            to="/receitas"
            className={({ isActive }) =>
              isActive ? activeClassName : undefined
            }
          >
            RECEITAS
          </NavLink>
          <NavLink
            to="/folha"
            className={({ isActive }) =>
              isActive ? activeClassName : undefined
            }
          >
            FOLHA
          </NavLink>
        </div>
        <div className="flex space-x-4 ">
          <div className=" text-white bg-emerald-600 hover:bg-emerald-800   rounded-lg text-sm px-5 py-2.5 ">
            <NavLink
              to="/novo"
              className={({ isActive }) =>
                isActive ? activeClassName : undefined
              }
            >
              NOVO USUÁRIO
            </NavLink>
          </div>
          <Form method="post" action="/logout" id="logout-form">
            <button className=" text-white bg-amber-600 hover:bg-amber-800   rounded-lg text-sm px-5 py-2.5 ">
              Sair
            </button>
          </Form>
        </div>
      </div>
    </nav>
  );
}
