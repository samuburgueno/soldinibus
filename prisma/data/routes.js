const routes = [
  {
    id: 1,
    title: "Lunes a Viernes (Soldini - Rosario)",
    type: "NORMAL",
    way: "IDA",
  },
  {
    id: 2,
    title: "Lunes a Viernes (Rosario - Soldini)",
    type: "NORMAL",
    way: "VUELTA",
  },
  {
    id: 3,
    title: "Sábados (Soldini - Rosario)",
    type: "MEDIO_FESTIVO",
    way: "IDA",
  },
  {
    id: 4,
    title: "Sábados (Rosario - Soldini)",
    type: "MEDIO_FESTIVO",
    way: "VUELTA",
  },
  {
    id: 5,
    title: "Domingos y feriados (Soldini - Rosario)",
    type: "FESTIVO",
    way: "IDA",
  },
  {
    id: 6,
    title: "Domingos y feriados (Rosario - Soldini)",
    type: "FESTIVO",
    way: "VUELTA",
  },
];

module.exports = routes;
