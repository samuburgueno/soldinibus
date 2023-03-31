import { parse } from "node-html-parser";
import fs from "fs";
import crypto from "crypto";
import { prisma } from "@/prisma/client";
import { LINE_ID } from "./consts";
import axios from "axios";

export function hashRouteGenerator(input) {
  const parsed = parse(input).removeWhitespace();
  let table = parsed.querySelector("table");

  // Se eliminan las columnas vacias
  table.querySelectorAll(".hidden").map((row) => {
    row.parentNode.remove();
  });

  // Se eliminan las imagenes
  table.querySelectorAll("img").map((row) => {
    row.remove();
  });

  // Se eliminan separadores
  table.querySelectorAll(".separador").map((row) => {
    row.parentNode.parentNode.remove();
  });

  // Se elimina la segunda cabecera-cuadro
  table.querySelectorAll("table tbody").map((body) => {
    body.querySelector(".cabecera-cuadro").remove();
  });

  // Genero el hash unico
  const data = table.rawText.replaceAll("&nbsp;", "");
  const hash = crypto.createHash("sha256").update(data).digest("hex");

  return hash;
}

export function getTemporada() {
  return new Promise((resolve, reject) => {
    const url = "http://www.etr.gov.ar/style/js/cuadroshorarios.js";
    fetch(url)
      .then((response) => response.text())
      .then((fileContent) => {
        const pattern = /var temporada='(.+)';/;
        const match = pattern.exec(fileContent);
        if (match) {
          const temporada = match[1];
          resolve(temporada);
        } else {
          reject(false);
        }
      })
      .catch((error) => {
        reject(false);
      });
  });
}

export function getData(id, type, way, season) {
  let url = "http://www.etr.gov.ar/includes/chtupV2/ajax/verHorariosPaso.php";

  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: {
          idlinea: id,
          tipo: type,
          sentido: way,
          temporada: season,
        },
      })
      .then(async (response) => {
        resolve(hashRouteGenerator(response.data));
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export async function processJobs(write = false) {
  const season = await getTemporada();
  const routes = await prisma.route.findMany();
  const hashes = await Promise.all(
    routes.map(async (route) => {
      const hash = await getData(
        LINE_ID,
        route.type,
        route.way,
        season,
        route.title
      );

      return {
        id: route.id,
        hash,
      };
    })
  );

  let updated = false;

  await Promise.all(
    routes.map(async (route) => {
      const data = hashes.find((h) => h.id === route.id);
      if (route.hash !== data.hash) {
        updated = true;
        await prisma.route.update({
          where: {
            id: route.id,
          },
          data: {
            hash: data.hash,
            updated: new Date(),
          },
        });
      }
    })
  );

  return updated;
}

export async function compareHash() {
  const newHashes = await processJobs();
  const currentHashes = JSON.parse(
    fs.readFileSync("./data/hashes.json", "utf-8")
  );
  let alert = false;

  currentHashes.map((hash) => {
    const newHash = newHashes.find((newHash) => hash.id === newHash.id);
    if (newHash.hash !== hash.hash) {
      alert = true;
      return;
    }
  });

  if (alert) processJobs(true);

  return alert;
}
