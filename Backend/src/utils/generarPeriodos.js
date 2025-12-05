import Periodo from "../models/Periodo.js";

export function generarPeriodosAutomaticos(proceso) {

  const inicio = new Date(proceso.fechaInicio);
  const fin = new Date(proceso.fechaFin);

  const diasAntes = (base, dias) => {
    const d = new Date(base);
    d.setDate(d.getDate() - dias);
    return d;
  };

  const diasDespues = (base, dias) => {
    const d = new Date(base);
    d.setDate(d.getDate() + dias);
    return d;
  };

  return [
    {
      nombre: "Inscripción de Candidatos",
      fechaInicio: diasAntes(inicio, 5),
      fechaFin: diasAntes(inicio, 3),
      proceso: proceso._id
    },
    {
      nombre: "Campaña Electoral",
      fechaInicio: diasAntes(inicio, 2),
      fechaFin: inicio,
      proceso: proceso._id
    },
    {
      nombre: "Elecciones",
      fechaInicio: inicio,
      fechaFin: fin,
      proceso: proceso._id
    },
    {
      nombre: "Resultados",
      fechaInicio: diasDespues(fin, 1),
      fechaFin: diasDespues(fin, 5),
      proceso: proceso._id
    }
  ];
}