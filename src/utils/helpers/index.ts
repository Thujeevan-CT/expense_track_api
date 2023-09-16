import * as moment from 'moment';

export const NameFormat = (text: string) => {
  if (text.length === 0) {
    return text;
  }
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const generateDigitCode = () => {
  const min = 1000;
  const max = 9999;
  const digitCode = Math.floor(Math.random() * (max - min + 1)) + min;

  return digitCode;
};

export const getCurrentDate = (type: any, dataTimestamp?: number) => {
  const currentDate = dataTimestamp
    ? moment
        .unix(dataTimestamp)
        .startOf(type)
        .add(type === 'week' ? 1 : 0, 'day')
    : moment()
        .startOf(type)
        .add(type === 'week' ? 1 : 0, 'day');
  const startDate: number = currentDate.unix() || 0;

  const currentEndDate = dataTimestamp
    ? moment
        .unix(dataTimestamp)
        .endOf(type)
        .add(type === 'week' ? 1 : 0, 'day')
    : moment()
        .endOf(type)
        .add(type === 'week' ? 1 : 0, 'day');
  const endDate: number = currentEndDate.unix() || 0;

  return { startDate, endDate };
};
