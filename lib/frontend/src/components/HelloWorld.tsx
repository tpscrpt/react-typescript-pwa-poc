import React from "react";

const Lazy = React.lazy(() => import("./Lazy" /* webpackChunkName: "Lazy" */));

export const HelloWorld = (): JSX.Element => (
  <div>
    <span>ABC</span>
    <Lazy />
  </div>
);

// Index file = router and firing up services
// When someone hits /...path, fallback to / which loads router and navigates to ...path
