// Formata uma data ISO para pt-BR
export const formatDate = (isoDate) => {
  if (!isoDate) return "N/A";
  const date = new Date(isoDate);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Agrupa eventos por mês/ano
export const groupEventsByMonth = (events) => {
  const grouped = {};
  events.forEach((event) => {
    const date = new Date(event.date);
    const year = date.getFullYear();
    const monthName = date.toLocaleDateString("pt-BR", { month: "long" });
    const key = `${
      monthName.charAt(0).toUpperCase() + monthName.slice(1)
    } ${year}`;

    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(event);
  });
  return grouped;
};

// Ordena as chaves do grupo (Mês/Ano) por data
export const sortMonths = (groupedEvents) => {
  return Object.keys(groupedEvents).sort((a, b) => {
    const dateA = new Date(groupedEvents[a][0].date);
    const dateB = new Date(groupedEvents[b][0].date);
    return dateA.getTime() - dateB.getTime();
  });
};
