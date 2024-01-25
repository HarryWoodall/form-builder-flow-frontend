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
  <Heading tag="h2" customSize="font-bold">{element.Properties?.QuestionId}</Heading>
  <P class="mb-1 text-gray-500">{element.Type}</P>
  {#if element.Properties && element.Properties.Options}
    <Listgroup items={options} let:item>
      {item.name} <span class="font-bold text-orange-300">{item.conditionalElement || ""}</span>
    </Listgroup>
  {/if}
</div>

<style>
</style>
