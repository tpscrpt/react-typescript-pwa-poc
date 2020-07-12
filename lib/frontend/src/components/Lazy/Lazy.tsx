import React, { useEffect, useState } from "react";

async function shouldWork(): Promise<void> {
  return;
}

const Lazy = (): JSX.Element => {
  const [miniState, setMiniState] = useState("");
  useEffect(() => {
    shouldWork().then(() => setMiniState("Done"));
  });

  return (
    <div>
      <span>Lazy abc me {miniState}</span>
    </div>
  );
};

export default Lazy;
