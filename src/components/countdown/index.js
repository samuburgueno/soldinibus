import { useState, useEffect } from "react";

const Countdown = ({ fechaProximoEvento }) => {
  const [tiempoRestante, setTiempoRestante] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      const tiempoActual = new Date().getTime();
      const tiempoRestante = fechaProximoEvento - tiempoActual;
      setTiempoRestante(tiempoRestante);
    }, 1000);

    return () => {
      clearInterval(intervalo);
    };
  }, [fechaProximoEvento]);

  const minutos = Math.floor((tiempoRestante / 1000 / 60) % 60);

  if (tiempoRestante <= 0)
    return (
      <div>
        <span className="badge rounded-pill text-bg-primary">
          Recarga la página
        </span>
      </div>
    );

  return (
    <div>
      <span className="badge rounded-pill text-bg-primary">
        Proxima revisión en {minutos} minutos
      </span>
    </div>
  );
};

export default Countdown;
