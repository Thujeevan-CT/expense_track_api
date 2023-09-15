export const expenseCategoryResponse = (data: any) => {
  return {
    id: data._id,
    name: data.name,
    description: data.description,
    status: data.status,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
};

export const allExpenseCategoriesResponse = (inputData: any) => {
  const responseData: any[] = [];

  inputData.map((data: any) => {
    responseData.push({
      id: data._id,
      name: data.name,
      description: data.description,
      status: data.status,
      created_at: data.created_at,
      updated_at: data.updated_at,
    });
  });

  return responseData;
};
