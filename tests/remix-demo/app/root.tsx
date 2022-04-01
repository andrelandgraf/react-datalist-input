import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData, json } from 'remix';
import type { MetaFunction, LoaderFunction } from 'remix';

export const meta: MetaFunction = () => {
  return { title: 'react' };
};

interface LoaderData {
  disableJS?: boolean;
}

export const loader: LoaderFunction = ({ request }) => {
  const url = new URL(request.url);
  const disableJS = url.searchParams.get('disableJS') === 'true';
  return json({ disableJS });
};

export default function App() {
  const { disableJS } = useLoaderData<LoaderData>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        {!disableJS && <Scripts />}
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}
