import type {
  LinksFunction, LoaderFunctionArgs,
} from "@remix-run/node";
// existing imports

import appStylesHref from "./app.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];

import { json, redirect } from "@remix-run/node";

import {
  Form,
  Links,
  Meta,
  useLoaderData,
  NavLink,
  Outlet,
  useNavigation,

  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import { getContacts, createEmptyContact } from "./data";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const q = url.searchParams.get("q")
  const contacts = await getContacts(q);
  return json({ contacts });
};


export const action = async () => {
  const contact = await createEmptyContact();
  return redirect(`/contacts/${contact.id}/edit`);
}
export default function App() {

  const { contacts } = useLoaderData<typeof loader>();
  const navigate = useNavigation();


  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>Remix Contacts</h1>

          <div>
            <Form id="search-form" role="search">
              <input
                id="q"
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
              />
              <div id="search-spinner" aria-hidden hidden={true} />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            {contacts.length ? (<ul>
              {
                contacts.map((contact) => (<li key={contact.id}>
                  <NavLink
                    className={({ isActive, isPending }) =>
                      isActive
                        ? "active"
                        : isPending
                          ? "pending"
                          : ""
                    }
                    to={`contacts/${contact.id}`}
                  >
                    {contact.first || contact.last ? (<>{contact.first} {contact.last}</>) : (<><i>No Name</i></>)}
                    {contact.favorite ? (
                      <span>★</span>
                    ) : null}
                  </NavLink>
                </li>
                ))
              }
            </ul>) : (<p>
              <i>No contacts</i>
            </p>)}
          </nav>
        </div>
        <div id="detail" className={
          navigate.state === "loading" ? "loading" : ""
        }>
          <Outlet />
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
