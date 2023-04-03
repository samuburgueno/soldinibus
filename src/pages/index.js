import { Card } from "@/components/card";
import Countdown from "@/components/countdown";
import { getTemporada } from "@/functions";
import { prisma } from "@/prisma/client";
import moment from "moment";
import Link from "next/link";

export default function Home({ data, season, lastJob }) {
  return (
    <div className="d-flex p-2 justify-content-center align-items-center min-vh-100 min-vw-100 mt-2">
      <div className="wrapper">
        <div className="brand text-center mb-3">
          <p>
            ¡Recibí notificaciones con el bot de telegram! <br />
            <a
              className="btn btn-sm btn-light rounded-2 text-uppercase m-2 mb-0 fw-bold"
              style={{
                "--bs-btn-padding-y": ".25rem",
                "--bs-btn-padding-x": ".5rem",
                "--bs-btn-font-size": ".75rem",
              }}
              href="https://t.me/soldinibus_bot"
              target="_blank"
            >
              &#129302; soldinibus_bot &#129302;
            </a>
          </p>
          <hr className="text-white" />
        </div>
        <div className="text-center mb-3">
          <Countdown fechaProximoEvento={moment(lastJob).add(30, "minutes")} />
        </div>
        {data.map((route) => (
          <Card key={route.id} {...route} season={season} />
        ))}
        <div className="text-center p-2">
          <small className="d-block m-2" style={{ fontSize: 11 }}>
            La información publicada es obtenida
            <br /> desde la web oficial del ETR. <br />
            <Link
              style={{ textDecoration: "none", color: "var(--bs-body-color)" }}
              title="samuburgueno@gmail.com"
              href="mailto:samuburgueno@gmail.com"
            >
              Hecho por @samuburgueno
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  let routes = await prisma.route.findMany({});

  const data = (routes = routes.map((route) => {
    const updated = route.updated.toISOString();
    return {
      ...route,
      updated,
    };
  }));

  const season = await getTemporada();
  const lastJob = await prisma.params.findUnique({
    where: {
      id: 1,
    },
    select: {
      lastProcessedJob: true,
    },
  });

  return {
    props: {
      data,
      season,
      lastJob: lastJob.lastProcessedJob.toISOString(),
    },
  };
}
