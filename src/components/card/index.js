import { LINE_ID } from "@/consts";
import moment from "moment";

export const Card = (props) => {
  const openWindowWithPost = () => {
    const keys = ["linea", "temporada", "tipo", "sentido"];
    const values = [
      LINE_ID,
      props.season,
      props.type.replace("_", " "),
      props.way,
    ];
    const url = "http://www.etr.gov.ar/includes/chtupV2/verCuadroHorario.php";

    var newWindow = window.open(url, "Ver cuadro horario");
    if (!newWindow) return false;

    var html = "";
    html +=
      "<html><head></head><body><form id='formid' method='post' action='" +
      url +
      "'>";
    if (keys && values && keys.length == values.length)
      for (var i = 0; i < keys.length; i++)
        html +=
          "<input type='hidden' name='" +
          keys[i] +
          "' value='" +
          values[i] +
          "'/>";
    html +=
      "</form><script type='text/javascript'>document.getElementById(\"formid\").submit()</script></body></html>";
    newWindow.document.write(html);
    return newWindow;
  };

  return (
    <div className="toast show mb-2">
      <div className="toast-header">
        <strong className="me-auto">{props.title}</strong>
      </div>
      <div className="toast-body text-center">
        <span className="badge pill text-bg-light mb-3">
          Última actualización: {moment(props.updated).format("DD/MM/YYYY")}
        </span>
        <button
          type="button"
          onClick={openWindowWithPost}
          className="btn btn-sm btn-warning rounded-2 d-block m-auto text-uppercase"
          style={{
            "--bs-btn-padding-y": ".25rem",
            "--bs-btn-padding-x": ".5rem",
            "--bs-btn-font-size": ".65rem",
          }}
        >
          Ver horarios
        </button>
      </div>
    </div>
  );
};
