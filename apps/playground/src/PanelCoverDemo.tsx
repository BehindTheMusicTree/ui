import { useState } from "react";
import { DetailPanel } from "@behindthemusictree/ui";

export function PanelCoverDemo() {
  const params = new URLSearchParams(window.location.search);
  const [expanded, setExpanded] = useState(params.has("expanded"));
  const [closed, setClosed] = useState(false);
  const coverHeight = params.has("tall") ? 1000 : 256;
  return (
    <main style={{ position: "relative", height: "100vh" }}>
      <input aria-label="Search" style={{ position: "absolute", top: 16, left: 24, zIndex: 40, width: 200, height: 40 }} />
      {closed ? <p>Panel closed</p> : (
        <DetailPanel title="Cover demo" titleInSearch onClose={() => setClosed(true)}
          expanded={expanded} onExpandedChange={setExpanded}
          headerActions={<button onClick={() => setExpanded(!expanded)}>Toggle width</button>}
          aside={<p>Family column</p>}
          cover={params.has("noCover") ? undefined : (
            <img alt="Demo cover" style={{ display: "block", width: "100%", height: coverHeight, objectFit: "cover" }}
              src={'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000"><rect width="800" height="1000" fill="#598278"/></svg>')} />
          )}
        >
          <p>Photo credit</p>
          {Array.from({ length: 25 }, (_, i) => <p key={i}>Panel content {i}</p>)}
          <button>Last action</button>
        </DetailPanel>
      )}
    </main>
  );
}
