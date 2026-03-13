"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

type FaqAccordionProps = {
  items: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
};

export function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <Accordion.Root type="single" collapsible className="space-y-4">
      {items.map((item) => (
        <Accordion.Item
          key={item.id}
          value={item.id}
          className="soft-card overflow-hidden rounded-[1.8rem]"
        >
          <Accordion.Header>
            <Accordion.Trigger className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-lg font-semibold text-slate-950">
              {item.question}
              <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-300 data-[state=open]:rotate-180" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="px-6 pb-6 text-sm leading-7 text-slate-600 data-[state=open]:animate-[accordion-down_0.3s_ease-out]">
            {item.answer}
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
