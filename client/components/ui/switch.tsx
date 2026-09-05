"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default" | "lg"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-colors duration-200 outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        "data-[size=sm]:h-5 data-[size=sm]:w-9 data-[size=sm]:p-0.5",
        "data-[size=default]:h-6 data-[size=default]:w-11 data-[size=default]:p-0.5",
        "data-[size=lg]:h-8 data-[size=lg]:w-14 data-[size=lg]:p-1",
        "data-checked:bg-primary data-unchecked:bg-slate-200 dark:data-unchecked:bg-slate-700",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full bg-white dark:bg-slate-100 shadow-sm ring-0 transition-transform duration-200",
          "group-data-[size=sm]/switch:size-4 group-data-[size=sm]/switch:data-checked:translate-x-4 group-data-[size=sm]/switch:data-unchecked:translate-x-0",
          "group-data-[size=default]/switch:size-5 group-data-[size=default]/switch:data-checked:translate-x-5 group-data-[size=default]/switch:data-unchecked:translate-x-0",
          "group-data-[size=lg]/switch:size-6 group-data-[size=lg]/switch:data-checked:translate-x-6 group-data-[size=lg]/switch:data-unchecked:translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
