<script lang="ts">
    import CalendarIcon from "lucide-svelte/icons/calendar";
    import type { DateRange } from "bits-ui";
    import {
     CalendarDate,
     DateFormatter,
     type DateValue,
     getLocalTimeZone
    } from "@internationalized/date";
    import { cn } from "$lib/utils.js";
    import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
    import { RangeCalendar } from "$lib/components/ui/range-calendar/index.js";
    import * as Popover from "$lib/components/ui/popover/index.js";
    
    const df = new DateFormatter("en-GB", {
     dateStyle: "medium"
    });
    
    let { value=$bindable(), width="100%" } = $props()
    
    let startValue: DateValue | undefined = undefined;
</script>
    
<div class="grid gap-2">
    <Popover.Root>
        <Popover.Trigger
        class={cn(
            buttonVariants({ variant: "outline" }),
            "justify-start text-left font-normal ",
            !value && "text-muted-foreground"
        )}

        style={`width: ${width};`}
        >
        <CalendarIcon class="mr-2 size-4" />
        {#if value && value.start}
            {#if value.end}
                {df.format(value.start.toDate(getLocalTimeZone()))} - {df.format(
                    value.end.toDate(getLocalTimeZone())
                )}
            {:else}
                {df.format(value.start.toDate(getLocalTimeZone()))}
            {/if}
        <!-- {:else if startValue}
            {df.format(startValue.toDate(getLocalTimeZone()))} -->
        {:else}
            Pick a date
        {/if}
        </Popover.Trigger>
        <Popover.Content class="w-auto p-0" align="start">
        <RangeCalendar
            bind:value
            onStartValueChange={(v) => {
            startValue = v;
            }}
            numberOfMonths={1}
        />
        </Popover.Content>
    </Popover.Root>
</div>