"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required"),
});

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        setError(null);
        const success = await login(values.email, values.password);
        if (!success) {
          setError("Invalid email or password");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred. Please try again.";
        setError(errorMessage);
        console.error("Login error:", err);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.loginCard}>
          <h1 className={styles.title}>Login</h1>
          <p className={styles.subtitle}>Enter your credentials to access the application</p>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <form onSubmit={formik.handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={styles.input}
                placeholder="Enter your email"
                autoComplete="email"
              />
              {formik.touched.email && formik.errors.email && (
                <div className={styles.fieldError}>{formik.errors.email}</div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={styles.input}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              {formik.touched.password && formik.errors.password && (
                <div className={styles.fieldError}>{formik.errors.password}</div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submitButton}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


