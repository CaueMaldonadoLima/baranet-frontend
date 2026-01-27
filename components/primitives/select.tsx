import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { FC } from "react"

type InputFieldProps = React.ComponentProps<typeof Input> & {
  description?: string
  id: string
  label?: string
  placeholder: string
  type?: string
}

export const InputField: FC<InputFieldProps> = ({ 
  description, 
  id,
  label, 
  placeholder,
  type = "text",
}) => {
  return (
    <Field>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
      />
      {description && 
        <FieldDescription>{description}</FieldDescription>
      }
    </Field>
  )
}
