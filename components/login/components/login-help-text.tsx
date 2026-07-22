import { cn } from "@/lib/utils";

const LoginHelpText = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={cn(
        "text-[12.5px] text-login-help-text text-center hover:underline cursor-pointer",
        className,
      )}
    >
      {children}
    </p>
  );
};

export default LoginHelpText;
