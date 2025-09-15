import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

const schema = z
  .object({
    email: z
      .string()
      .email("Invalid email")
      .endsWith("@illinois.edu", "Must use @illinois.edu"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

interface SignupProps {
  onSwitchToLogin: () => void;
}


export default function Signup({ onSwitchToLogin }: SignupProps) {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: ({ email, password }: FormData) =>
      api.register({ email, password }),
    onSuccess: async (_, variables) => {
      // After successful registration, automatically log in
      try {
        const loginResponse = await api.login({
          email: variables.email,
          password: variables.password,
        });
        // Backend returns userId instead of token
        login(loginResponse.userId.toString());
      } catch (error) {
        console.error("Auto-login failed:", error);
      }
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="container">
      <header className="appHeader">
        <h1>UniPoker</h1>
      </header>
      <form
        className="form auth-form"
        style={{ marginTop: "24px" }}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <h2>Sign Up</h2>

        <label className="field">
          <span>Email</span>
          <input type="email" {...register("email")} />
          {errors.email && <em className="error">{errors.email.message}</em>}
        </label>

        <label className="field">
          <span>Password</span>
          <input type="password" {...register("password")} />
          {errors.password && (
            <em className="error">{errors.password.message}</em>
          )}
        </label>

        <label className="field">
          <span>Confirm Password</span>
          <input type="password" {...register("confirmPassword")} />
          {errors.confirmPassword && (
            <em className="error">{errors.confirmPassword.message}</em>
          )}
        </label>

        <div className="actions">
          <button
            className="btn primary"
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Creating Account..." : "Sign Up"}
          </button>
          <button
            className="btn"
            type="button"
            onClick={onSwitchToLogin}
            disabled={mutation.isPending}
          >
            Login
          </button>
        </div>

        {mutation.isError && (
          <em className="error">
            {(mutation.error as any)?.response?.data?.error ||
              "Sign up failed. Please try again."}
          </em>
        )}

        {mutation.isSuccess && (
          <em className="success-message">
            Account created successfully! You are now logged in.
          </em>
        )}
      </form>
    </div>
  );
}
