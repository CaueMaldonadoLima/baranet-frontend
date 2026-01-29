import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const LoginCheckbox = ({
  checked,
  setChecked,
  label,
}: {
  checked: boolean;
  setChecked: (checked: boolean) => void;
  label?: string;
}) => {
  const handleClick = () => {
    setChecked(!checked);
  };

  return (
    <div className="flex flex-row gap-1">
      <Checkbox
        checked={checked}
        onCheckedChange={setChecked}
        className={cn(
          "data-[state=checked]:bg-login-checkbox data-[state=checked]:border-login-checkbox",
          "data-[state=checked]:text-white rounded-none hover:cursor-pointer",
        )}
      />
      {label && (
        <label
          onClick={handleClick}
          className="select-none text-[12.5px] text-login-checkbox hover:cursor-pointer"
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default LoginCheckbox;
