import * as moment from 'moment';

export const IncomeResponse = (data: any) => {
  return {
    id: data._id,
    amount: data.amount,
    source: data.source,
    date: moment.unix(data.date).local().format('DD/MM/YYYY'),
    status: data.status,
    user: {
      id: data.user.id,
      email: data.user.email,
      full_name: `${data.user.first_name} ${data.user.last_name}`,
    },
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
};

export const allIncomesResponse = (inputData: any) => {
  const responseData: any[] = [];

  inputData.map((data: any) => {
    responseData.push({
      id: data._id,
      amount: data.amount,
      source: data.source,
      date: moment.unix(data.date).local().format('DD/MM/YYYY'),
      status: data.status,
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: `${data.user.first_name} ${data.user.last_name}`,
      },
      created_at: data.created_at,
      updated_at: data.updated_at,
    });
  });

  return responseData;
};
