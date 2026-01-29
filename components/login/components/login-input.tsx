import { InputField } from "@/components/primitives/input-field";
import { cn } from "@/lib/utils";

const LoginInput = ({
  placeholder,
  id,
  type = "text",
}: {
  placeholder: string;
  id: string;
  type?: string;
}) => {
  return (
    <InputField
      className={cn(
        "rounded-full h-11.5",
        "border border-login-input-border",
        "focus-visible:border-login-input-ring",
        "focus-visible:ring-login-input-ring/50",
      )}
      id={id}
      placeholder={placeholder}
      type={type}
    />
  );
};

export default LoginInput;
