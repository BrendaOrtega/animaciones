import { User } from "@prisma/client";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  Form,
  Link,
  useFetcher,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { FormEvent, useState } from "react";
import { z } from "zod";
import { db } from "~/.server/db";
import {
  getAdminUserOrRedirect,
  getOrCreateAndUpdate,
  GetOrCreateAndUpdateType,
} from "~/.server/user";
import { cn } from "~/lib/utils";

const COURSE_ID = "645d3dbd668b73b34443789c";

type ModeType = "default" | "new" | "editing";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  if (intent === "new") {
    const email = formData.get("email") as string;
    z.string().email().parse(email);
    const isRole = formData.get("isRole") ? true : undefined;
    const isConfirmed = formData.get("isConfirmed") ? true : undefined;
    const isEnrolled = formData.get("isEnrolled") ? true : undefined;

    const data: GetOrCreateAndUpdateType = {
      email,
      isConfirmed,
      isRole,
      isEnrolled,
    };

    console.log("Received: ", data);

    await getOrCreateAndUpdate(data);
    throw redirect("/admin/users?search=" + email);
  }
  return null;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await getAdminUserOrRedirect(request);
  const url = new URL(request.url);
  const { searchParams } = url;

  const search = searchParams.has("search")
    ? searchParams.get("search")
    : undefined;

  const confirmed = searchParams.has("confirmed") ? true : undefined;

  const users = await db.user.findMany({
    where: {
      confirmed,
      email: search ? { contains: search } : undefined,
    },
    take: search ? undefined : 10,
    orderBy: { createdAt: "desc" },
  });
  return { users, search };
};

export default function Route() {
  const { users, search = "" } = useLoaderData<typeof loader>();
  const [mode, setMode] = useState<ModeType>("default");

  return (
    <article className="bg-gray-950 min-h-screen text-gray-200 p-20">
      <h2 className="text-3xl mb-8">Administrar estudiantes y usuarios</h2>
      <SearchBar defaultValue={search || undefined} />
      <AccessTable mode={mode} setMode={setMode} users={users} />
    </article>
  );
}

const SearchBar = ({ defaultValue }: { defaultValue?: string }) => {
  return (
    <Form className="flex mb-2">
      <input
        defaultValue={defaultValue}
        name="search"
        type="search"
        className="w-3/4 text-black"
        placeholder="Busca un usuario por email"
      />
      <button className="py-2 px-4 border w-1/4">Buscar</button>
    </Form>
  );
};

const AccessTable = ({
  mode = "default",
  users,
  setMode,
}: {
  users: User[];
  mode: ModeType;
  setMode: (arg0: ModeType) => void;
}) => {
  const fetcher = useFetcher();
  const setDefaultMode = () => setMode("default");
  const onAdd = () => setMode("new");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    setMode("default");
    fetcher.submit(
      { intent: "new", email: e.currentTarget.email.value },
      { method: "POST" }
    );
  };

  return (
    <section className="bg-gray-900 text-gray-200 pb-2 pt-2 px-2 group flex flex-col">
      <Headers />
      {mode === "default" && (
        <button
          onClick={onAdd}
          className="bg-indigo-500 invisible group-hover:visible px-4 py-2 font-bold rounded-full ml-auto mb-2"
        >
          Añadir
        </button>
      )}
      {mode === "new" && (
        <>
          <Form method="POST" onSubmit={handleSubmit}>
            <div className="grid grid-cols-5 items-center gap-2">
              <input
                required
                type="email"
                name="email"
                placeholder="escribe el correo"
                className="col-span-2 text-black"
              />
              {/* <textarea
                className="col-span-2 text-black"
                name="email"
                placeholder="Pega los correos, separados."
              /> */}
              <label className="cursor-pointer">
                <span>Encender: </span>
                <input
                  name="isRole"
                  value="CAN_SHARE_50_DISCOUNT"
                  type="checkbox"
                />
              </label>
              <label className="cursor-pointer">
                <span>Encender: </span>
                <input name="isEnrolled" value={COURSE_ID} type="checkbox" />
              </label>
              <label className="cursor-pointer">
                <span>Encender: </span>
                <input name="isConfirmed" type="checkbox" />
              </label>
            </div>
            <div className="flex py-2 gap-1">
              <button
                type="submit"
                className="font-bold text-lg py-2 border w-full active:bg-gray-950 transition-all"
                name="intent"
                value="new"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={setDefaultMode}
                className="w-full border bg-gray-800"
              >
                Cancelar
              </button>
            </div>
          </Form>
        </>
      )}
      {users.map((user, index) => (
        <Row key={index} className="">
          <p className="col-span-2">{user.email}</p>
          <p>
            <label className="cursor-pointer">
              <span> </span>
              {/* @todo: single fetchs */}
              <input
                name="role"
                checked={user.roles.includes("CAN_SHARE_50_DISCOUNT")}
                onChange={() => false}
                className="rounded-full"
                type="checkbox"
              />
            </label>
          </p>
          <p>
            <label className="cursor-pointer">
              <span> </span>
              <input
                name="course"
                checked={user.courses.includes("645d3dbd668b73b34443789c")}
                onChange={() => false}
                className="rounded-full"
                type="checkbox"
              />
            </label>
          </p>
          <p>
            {" "}
            <label className="cursor-pointer">
              <span> </span>
              <input
                name="confirmed"
                checked={user.confirmed}
                onChange={() => false}
                className="rounded-full"
                type="checkbox"
              />
            </label>
          </p>
        </Row>
      ))}
      <button
        // @todo: load all
        className="py-2 px-4 border mt-4 ml-auto disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
        disabled
      >
        Cargar todo
      </button>
    </section>
  );
};

const Headers = () => {
  const [searchParams] = useSearchParams();
  return (
    <header className="grid grid-cols-5">
      <h3 className="col-span-2">Email</h3>
      <h3>Puede compartir descuento</h3>
      <h3>Tiene acceso al curso</h3>
      <Link
        className={cn("flex items-center justify-center", {
          "bg-gray-500 ": searchParams.has("confirmed"),
        })}
        to={
          searchParams.has("confirmed")
            ? `/admin/users`
            : `/admin/users?confirmed=true`
        }
      >
        <h3>Cuenta confirmada</h3>
      </Link>
    </header>
  );
};

export const Row = ({
  className,
  ...props
}: {
  cols?: string;
  className?: string;
  [x: string]: any;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-5 gap-2 py-4 border px-4 bg-gray-800",
        "hover:bg-gray-900",
        className
      )}
      {...props}
    />
  );
};
