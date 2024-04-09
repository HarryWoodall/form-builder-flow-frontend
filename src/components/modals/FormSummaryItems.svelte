<script lang="ts">
  import { Button, Indicator, Modal, P, Heading } from "flowbite-svelte";
  import { form } from "../../stores/appStore";
  import { getSummaryData, type SummaryItem } from "../../utils/FormParser";
  import { onMount } from "svelte";

  let isOpen = false;
  let summaryItems: SummaryItem[] | undefined;
  const duplidateMap: { label: string; questionIds: string[] }[] = [];

  const getClass = (item: SummaryItem) => {
    let base = "font-semibold";

    return base;
  };

  onMount(async () => {
    summaryItems = await getSummaryData($form!);

    for (let summaryItem of summaryItems) {
      const duplicates = summaryItems.filter(
        (item) => item.questionId != summaryItem.questionId && !duplidateMap.some((d) => d.label == summaryItem.label) && item.label == summaryItem.label
      );

      if (duplicates.length) {
        duplidateMap.push({
          label: summaryItem.label!,
          questionIds: [summaryItem.questionId!, ...duplicates.map((item) => item.questionId!)],
        });
      }
    }
  });
</script>

<Button
  on:click={() => (isOpen = true)}
  class="font-bold bg-transparent hover:bg-transparent border-2 border-transparent hover:border-orange-400  text-orange-400">Summary Items</Button
>

<Modal title="Summary Items" bind:open={isOpen} on:close={() => (isOpen = false)} class="p-1" outsideclose>
  <ul class="max-h-[600px] overflow-x-auto">
    {#if summaryItems}
      <Heading tag="h2" customSize="text-3xl font-bold" class="mb-3">Duplicates</Heading>
      {#each duplidateMap as item}
        <li>
          <P size="lg" class="mt-3 font-bold">{item.label}</P>
          {#each item.questionIds as id}
            <li>
              <P>{id}</P>
            </li>
          {/each}
        </li>
      {/each}

      <Heading tag="h2" customSize="text-3xl font-bold" class="mt-5 mb-3">Labels</Heading>
      {#each summaryItems as item}
        <li>
          <P size="lg" class={getClass(item)}>{item.label}</P>
        </li>
      {/each}
    {/if}
  </ul>
</Modal>
