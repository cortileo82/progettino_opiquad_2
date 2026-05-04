import * as React from "react"
import { Select } from "antd" // Importiamo Select per gestire le options
import { cn } from "@/lib/utils"

// Estendiamo i props per accettare l'array di opzioni
interface InputProps extends React.ComponentProps<"input"> {
  options?: { label: string; value: any }[];
}

function Input({ className, type, options, ...props }: InputProps) {
  // CLASSI CSS CONDIVISE
   const baseClassName = cn(
    "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    className
  );

  // LOGICA RENDERING: SELECT
  if (options) {
    return (
      <Select
        {...(props as any)} // Cast necessario per compatibilità props tra input e select
        options={options}
        className={cn("ant-custom-select-v2", className)} // Usiamo una classe per gestire l'altezza via CSS o tailwind
        style={{ width: '100%', height: '100%' }} // Fondamentale per riempire l'InputGroup
      />
    )
  }

  // LOGICA RENDERING: INPUT STANDARD
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(baseClassName, "h-9")} // Qui manteniamo h-9 per l'input standard
      {...props}
    />
  )
}

export { Input }