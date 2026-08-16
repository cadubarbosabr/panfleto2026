import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";

const PORT = 3000;

console.log(`\n======================================================`);
console.log(`🗳️  COLA ELEITORAL 2026 - SERVIDOR WEB INICIADO!`);
console.log(`🌐  Acesse no navegador: http://localhost:${PORT}`);
console.log(`======================================================\n`);

Deno.serve({ port: PORT }, (req) => {
  return serveDir(req, {
    fsRoot: "public",
    showIndex: true,
    enableCors: true,
  });
});
