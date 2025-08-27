import AuthForm from "@/components/Auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="mx-auto mt-12 max-w-md">
      <AuthForm type="login" />
    </div>
  );
}
