import { serve } from "https://deno.land/std@0.176.0/http/server.ts";
import { createServer } from "ultra/server.ts";
import App from "./src/app.tsx";

const server = await createServer({
  importMapPath: Deno.env.get("ULTRA_MODE") === "development"
    ? import.meta.resolve("./importMap.dev.json")
    : import.meta.resolve("./importMap.json"),
  compilerOptions: {
    jsxImportSource: "preact",
  },
});

server.get("*", async (context) => {
  /**
   * Render the request
   */
  const result = await server.render(<App />);

  return context.body(result, 200, {
    "content-type": "text/html",
  });
});

serve(server.fetch);
