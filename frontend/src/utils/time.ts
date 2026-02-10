const pad2 = (value: number) => String(value).padStart(2, "0");

export const formatAbsoluteTime = (iso?: string | null): string => {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";

  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());

  let hours = date.getHours();
  const minutes = pad2(date.getMinutes());
  const ampm = hours >= 12 ? "PM" : "AM";
  hours %= 12;
  hours = hours === 0 ? 12 : hours;
  const hourStr = pad2(hours);

  return `${year}-${month}-${day} ${hourStr}:${minutes} ${ampm}`;
};
