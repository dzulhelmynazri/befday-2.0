const longDateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export const formatDate = (date: Date | string): string => {
  const value = date instanceof Date ? date : new Date(date);

  return longDateFormatter.format(value);
};

export const formatShortDate = (date: Date | string): string => {
  const value = date instanceof Date ? date : new Date(date);

  return shortDateFormatter.format(value);
};
