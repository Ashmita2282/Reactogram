import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import store from "./redux/store.js";
import "./index.css"; // Import Tailwind CSS
import Home from "./pages/Home"; // Home page component
import SignIn from "./pages/Login.jsx"; // SignIn page component
import Register from "./pages/Register.jsx"; // Register page component
// import NotFound from "./pages/NotFound.jsx"; // Not Found page
import VideoList from "./components/VideoList.jsx";
import Loading from "./components/Loading.jsx";

// Lazy load Channel and VideoPlayer components
const Channel = React.lazy(() => import("./pages/Channel.jsx"));
const VideoPlayer = React.lazy(() => import("./components/VideoPlayer.jsx"));
const NotFound = React.lazy(() => import("./pages/NotFound.jsx"));

// Define routes
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Home />, // Home is now the main component
      children: [
        { path: "/", element: <VideoList /> },
        { path: "signin", element: <SignIn /> },
        { path: "register", element: <Register /> },
        {
          path: "channel/:id",
          element: (
            <Suspense fallback={<Loading />}>
              <Channel />
            </Suspense>
          ),
        },
        {
          path: "videoPlayer/:id",
          element: (
            <Suspense fallback={<Loading />}>
              <VideoPlayer />
            </Suspense>
          ),
        },
        {
          path: "*",
          element: (
            <Suspense fallback={<Loading />}>
              <NotFound />
            </Suspense>
          ),
        },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

// import React, { Suspense } from "react";
// import { createRoot } from "react-dom/client";
// import { Provider } from "react-redux";
// import { RouterProvider, createBrowserRouter } from "react-router-dom";
// import store from "./redux/store.js";
// import "./index.css"; // Import Tailwind CSS
// import Home from "./pages/Home"; // Home page component
// import SignIn from "./pages/Login.jsx"; // SignIn page component
// import Register from "./pages/Register.jsx"; // Register page component
// import NotFound from "./pages/NotFound.jsx"; // Not Found page
// import Channel from "./pages/Channel.jsx";
// import VideoPlayer from "./components/VideoPlayer.jsx";
// import VideoList from "./components/VideoList.jsx";

// // Define routes
// const router = createBrowserRouter(
//   [
//     {
//       path: "/",
//       element: <Home />, // Home is now the main component
//       children: [
//         { path: "/", element: <VideoList /> },
//         { path: "signin", element: <SignIn /> },
//         { path: "register", element: <Register /> },
//         { path: "channel/:id", element: <Channel /> },
//         { path: "videoPlayer/:id", element: <VideoPlayer /> },
//         { path: "*", element: <NotFound /> },
//       ],
//     },
//   ],
//   {
//     future: {
//       v7_startTransition: true,
//       v7_relativeSplatPath: true,
//       v7_fetcherPersist: true,
//       v7_normalizeFormMethod: true,
//       v7_partialHydration: true,
//       v7_skipActionErrorRevalidation: true,
//     },
//   }
// );

// createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <RouterProvider router={router} />
//     </Provider>
//   </React.StrictMode>
// );
