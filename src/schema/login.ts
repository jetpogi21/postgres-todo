import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  emailOrUsername: Yup.string().required(
    "Please provide your email address or username"
  ),
  password: Yup.string().required("Please provide your password"),
});

export default validationSchema;
