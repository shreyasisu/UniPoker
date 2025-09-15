import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

const schema = z.object({
  email: z
    .string()
    .email("Invalid email")
    .endsWith("@illinois.edu", "Must use @illinois.edu"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

interface LoginProps {
  onSwitchToSignup: () => void;
}

export default function Login({ onSwitchToSignup }: LoginProps) {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => api.login(data),
    onSuccess: (res) => {
      // Backend returns userId instead of token
      login(res.userId.toString()); // store userId as token in context
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
        className="form"
        style={{ marginTop: "24px" }}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <h2>Login</h2>

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

        <div className="actions">
          <button
            className="btn primary"
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Logging in..." : "Login"}
          </button>
          <button
            className="btn"
            type="button"
            onClick={onSwitchToSignup}
            disabled={mutation.isPending}
          >
            Sign Up
          </button>
        </div>

        {mutation.isError && (
          <em className="error">
            {(mutation.error as any)?.response?.data?.error ||
              "Login failed. Check credentials."}
          </em>
        )}
      </form>
    </div>
  );
}
