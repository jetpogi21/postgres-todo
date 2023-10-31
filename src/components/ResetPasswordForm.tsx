"use client";
import axiosClient from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import React from "react";
import resetPasswordSchema from "@/schema/reset-password";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2 } from "lucide-react";
interface ResetPasswordFormProps {
  token: string;
}

interface FormValues {
  password: string;
  passwordConfirmation: string;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ token }) => {
  const initialValues: FormValues = {
    password: "Jetpogi_21",
    passwordConfirmation: "Jetpogi_21",
  };

  const resetPassword = async (values: FormValues) => {
    try {
      const { data } = await axiosClient(`/auth/reset-password/${token}`, {
        data: values,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      //router.push("/dashboard");
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    // Use useMutation here from react-query
    mutate(values);
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={resetPasswordSchema}
      onSubmit={handleSubmit}
      validateOnChange={false}
    >
      {({ isSubmitting }) => (
        <Form className="flex flex-col gap-4 w-full px-4 md:w-[400px]">
          <Field
            type="text"
            name="password"
            placeholder="Password"
            as={Input}
            required
          />
          <ErrorMessage
            name="password"
            component="div"
            className="text-sm text-red-500"
          />

          <Field
            type="password"
            name="passwordConfirmation"
            placeholder="Confirm Password"
            as={Input}
            required
          />
          <ErrorMessage
            name="passwordConfirmation"
            component="div"
            className="text-sm text-red-500"
          />

          <Button
            type="submit"
            variant="secondary"
            disabled={isSubmitting || isLoading}
            className="rounded-full"
          >
            Login
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default ResetPasswordForm;
