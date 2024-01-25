<script lang="ts">
  import { Card, Heading, P, Listgroup, type ListGroupItemType } from "flowbite-svelte";
  import type { IElement } from "../../../models/FormSchema";

  export let element: IElement;

  const options = element.Properties?.Options?.map((option) => {
    const listItem: ListGroupItemType = {
      name: option.Value,
      conditionalElement: option.ConditionalElementId,
    };

    return listItem;
  });
</script>

<div>
  {#if element.Properties && element.Properties.Options}
    <Listgroup items={options} let:item class="my-2">
      {item.name} <span class="font-bold text-orange-300">{item.conditionalElement || ""}</span>
    </Listgroup>
  {/if}
</div>

<style>
</style>
