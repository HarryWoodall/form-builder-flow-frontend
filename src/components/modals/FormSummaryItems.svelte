<script lang="ts">
  import { Button, Indicator, Modal, P } from "flowbite-svelte";
  import { form } from "../../stores/appStore";
  import { getSummaryData, type SummaryItem } from "../../utils/FormParser";

  let isOpen = false;

  const summaryItems = getSummaryData($form!);

  const getClass = (item: SummaryItem) => {
    let base = "font-semibold my-2";

    if (item.isOptional) base += " italic";
    if (item.isConditionalElement) base += " text-amber-600";
    if (item.isAddAnotherElement) base += " text-green-400";

    if (!item.isOptional && !item.isConditionalElement && !item.isAddAnotherElement) base += " text-gray-500";

    return base;
  };
</script>

<Button
  on:click={() => (isOpen = true)}
  class="font-bold bg-transparent hover:bg-transparent border-2 border-transparent hover:border-orange-400  text-orange-400">Summary Items</Button
>

<Modal title="Summary Items" bind:open={isOpen} on:close={() => (isOpen = false)} class="p-1" outsideclose>
  <div class="flex gap-5 mt-0">
    <P class="text-white bg-amber-600 p-2 rounded-full font-bold" size="sm">Optional</P>
    <P class="text-white bg-green-400 p-2 rounded-full font-bold" size="sm">Add another</P>
  </div>

  <ul class="max-h-[600px] overflow-x-auto">
    {#each summaryItems as item}
      <li>
        <P size="lg" class={getClass(item)}>{item.label}</P>
      </li>
    {/each}
  </ul>
</Modal>
