import { Button } from "@/components/ui/Button";
import { BasicModel } from "@/interfaces/GeneralInterfaces";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/Popover";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/Command";
import { ChevronsUpDown, Check, Scroll } from "lucide-react";
import React, { forwardRef, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/ScrollArea";

interface Combobox {
  name?: string;
  value: string | number;
  onChange?: (internalValue: string) => void;
  list: BasicModel[];
  caption: string;
}

const Combobox = forwardRef<HTMLButtonElement, Combobox>((props, ref) => {
  const { value, onChange, list, caption, name } = props;
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const filteredOptions = list.filter((item) =>
    item.name.toLowerCase().includes(input.toLowerCase())
  );

  const handeInputChange = (newInput: string) => {
    setInput(newInput);
  };

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size={"sm"}
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between w-full whitespace-nowrap text-ellipsis",
            !value && "text-muted-foreground"
          )}
          name={name || ""}
          ref={ref}
          id={name}
        >
          {/* Display selected internalValues or default text */}
          {value
            ? list.find(
                (item) => item.id.toString().toLowerCase() === value.toString()
              )?.name
            : `Select ${caption}`}
          <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 PopoverContent">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={`Search ${caption}`}
            value={input}
            onValueChange={handeInputChange}
          />
          <CommandEmpty>No {caption} found.</CommandEmpty>
          {filteredOptions.length > 0 && (
            <ScrollArea className="h-[200px]">
              <CommandGroup>
                {filteredOptions.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id.toString()}
                    onSelect={(value) => {
                      onChange && onChange(value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        // Check if current internalValue is in the array
                        value &&
                          value.toString() === item.id.toString().toLowerCase()
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {item.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
});

export default Combobox;

Combobox.displayName = "Combobox";
