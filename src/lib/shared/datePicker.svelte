<script lang="ts">
    import CalendarIcon from "lucide-svelte/icons/calendar";
    import {
     DateFormatter,
     type DateValue,
     getLocalTimeZone
    } from "@internationalized/date";
    import { cn } from "$lib/utils.js";
    import { buttonVariants } from "$lib/components/ui/button/index.js";
    import { Calendar } from "$lib/components/ui/calendar/index.js";
    import * as Popover from "$lib/components/ui/popover/index.js";
    
    let { value=$bindable(), width="100%" }: { value: DateValue | undefined, width: String } = $props()

    const df = new DateFormatter("en-US", {
     dateStyle: "long"
    });
    
    let contentRef = $state<HTMLElement | null>(null);
</script>

<Popover.Root>
    <Popover.Trigger
        class={cn(
        buttonVariants({
        variant: "outline",
        class: "justify-start text-left font-normal"
        }),
        !value && "text-muted-foreground"
        )}
        style={`width: ${width};`}
    >
        <CalendarIcon />
        {value ? df.format(value.toDate(getLocalTimeZone())) : "Pick a date"}
    </Popover.Trigger>
    <Popover.Content bind:ref={contentRef} class="w-auto p-0">
        <Calendar type="single" bind:value />
    </Popover.Content>
</Popover.Root>