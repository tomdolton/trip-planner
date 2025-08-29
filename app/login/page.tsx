import AuthForm from "@/components/Auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="container mt-12 max-w-md">
      <AuthForm type="login" />
    </div>
  );
}
