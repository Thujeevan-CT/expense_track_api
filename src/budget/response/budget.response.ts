import * as moment from 'moment';

export const budgetResponse = (data: any) => {
  return {
    id: data._id,
    amount: data.amount,
    budget_type: data.budget_type,
    start_date: moment.unix(data.start_date).local().format('DD/MM/YYYY'),
    end_date: moment.unix(data.end_date).local().format('DD/MM/YYYY'),
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

export const allBudgetResponse = (inputData: any) => {
  const responseData: any[] = [];

  inputData.map((data: any) => {
    responseData.push({
      id: data._id,
      amount: data.amount,
      budget_type: data.budget_type,
      start_date: moment.unix(data.start_date).local().format('DD/MM/YYYY'),
      end_date: moment.unix(data.end_date).local().format('DD/MM/YYYY'),
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
    });
  });

  return responseData;
};
