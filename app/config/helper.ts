export const isEmailFormat = (s: string) =>
  !!s.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
