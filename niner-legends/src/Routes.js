import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Analytics from "./pages/Analytics";
import Delete from "./pages/Delete";
import NotFound from "./pages/NotFound";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/analytics">
        <Analytics />
      </Route>
      <Route exact path="/delete">
        <Delete />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}
