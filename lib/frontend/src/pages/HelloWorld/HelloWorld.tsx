import React from "react";
import { Lazy } from "../../components/Lazy";

async function abc(): Promise<void> {
  return;
}

abc();

const HelloWorld = (): JSX.Element => (
  <div className="page">
    <span>asdf</span>
    <Lazy />
  </div>
);

export default HelloWorld;
