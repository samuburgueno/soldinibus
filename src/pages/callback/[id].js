import { LINE_ID } from "@/consts";
import { getTemporada } from "@/functions";
import { prisma } from "@/prisma/client";
import { useEffect, useRef } from "react";

export default function Callback({ data, season }) {
  const formRef = useRef(null);

  useEffect(() => {
    formRef.current.submit();
  }, []);

  return (
    <>
      <form
        ref={formRef}
        id="formid"
        method="post"
        action="http://www.etr.gov.ar/includes/chtupV2/verCuadroHorario.php"
      >
        <input type="hidden" name="linea" value={LINE_ID} />
        <input type="hidden" name="temporada" value={season} />
        <input type="hidden" name="tipo" value={data.type.replace("_", " ")} />
        <input type="hidden" name="sentido" value={data.way} />
      </form>
    </>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.query;
  const data = await prisma.route.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  const season = await getTemporada();

  delete data.updated;

  return {
    props: {
      data: data,
      season,
    },
  };
}
