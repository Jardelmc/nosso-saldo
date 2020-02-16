import * as Yup from 'yup';

const userCreateValidator = Yup.object().shape({
  name: Yup.string()
    .min(2)
    .required(),
  email: Yup.string()
    .email()
    .required(),
  password: Yup.string()
    .min(5)
    .required(),
});

async function validateUser(user) {
  const valid = await userCreateValidator.isValid(user);
  return valid;
}

export default validateUser;
