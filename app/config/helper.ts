import moment from 'moment';

export const isEmailFormat = (s: string) =>
  !!s.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);

export const defaultDateFormat = (date: string | number) =>
  moment(date).format('DD-MM-YYYY');
