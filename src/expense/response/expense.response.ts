import * as moment from 'moment';

export const expenseResponse = (data: any) => {
  return {
    id: data._id,
    amount: data.amount,
    description: data.description,
    location: data.location,
    date: moment.unix(data.date).local().format('DD/MM/YYYY'),
    status: data.status,
    user: {
      id: data.user.id,
      email: data.user.email,
      full_name: `${data.user.first_name} ${data.user.last_name}`,
    },
    category: {
      id: data.category._id,
      name: data.category.name,
      description: data.category.description,
    },
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
};

export const allExpensesResponse = (inputData: any) => {
  const responseData: any[] = [];

  inputData.map((data: any) => {
    responseData.push({
      id: data._id,
      amount: data.amount,
      description: data.description,
      location: data.location,
      date: moment.unix(data.date).local().format('DD/MM/YYYY'),
      status: data.status,
      user: data.user._id,
      category: {
        id: data.category._id,
        name: data.category.name,
        description: data.category.description,
      },
      created_at: data.created_at,
      updated_at: data.updated_at,
    });
  });

  return responseData;
};
