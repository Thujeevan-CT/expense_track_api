export const userResponse = (data: any) => {
  return {
    id: data._id.toString(),
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    role: data.role,
    status: data.status,
  };
};
