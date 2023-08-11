"use client";

import { Check } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fetchBlogs } from "@/lib/functions";
import { cn } from "@/lib/utils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export function RelatedBlogsPicker({
  values,
  setValues,
}: {
  values: Blog[];
  setValues: (values: Blog[]) => void;
}) {
  const supabase = createClientComponentClient();

  const [open, setOpen] = React.useState(false);
  const [blogs, setBlogs] = React.useState<Blog[]>([]);

  React.useEffect(() => {
    fetchBlogs(supabase).then((blogs) => {
      setBlogs(blogs as Blog[]);
    });
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full items-center justify-start text-left h-fit flex flex-wrap space-y-3"
        >
          {values.length > 0 ? (
            <>
              {values.map((value) => (
                <div
                  key={value.id}
                  className="bg-muted capitalize mr-2 px-2 py-1 rounded-sm"
                >
                  {value.title}
                </div>
              ))}
            </>
          ) : (
            "Select Blogs..."
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command className="w-full">
          <CommandInput placeholder="Search blogs..." />
          <CommandEmpty>No blogs found.</CommandEmpty>
          <CommandGroup>
            {blogs.map((framework) => (
              <CommandItem
                key={framework.id}
                onSelect={(currentValue) => {
                  // insert the blog where the current value is the blog title
                  const index = values.findIndex(
                    (value) => value.title === currentValue
                  );
                  if (index === -1) {
                    setValues([...values, framework]);
                  }

                  // if the blog is already selected, remove it
                  if (index !== -1) {
                    const newValues = [...values];
                    newValues.splice(index, 1);
                    setValues(newValues);
                  }

                  
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    values.includes(framework)
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {framework.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
