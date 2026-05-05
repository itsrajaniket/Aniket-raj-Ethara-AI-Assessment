import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'radial-gradient(circle at top left, #1e1b4b 0%, #0f172a 100%)',
      padding: '1rem'
    }}>
      <SignIn routing="hash" signUpUrl="/signup" forceRedirectUrl="/dashboard" />
    </div>
  );
}
