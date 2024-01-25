<script lang="ts">
  import { Card, Heading, P, type ListGroupItemType, Listgroup, List } from "flowbite-svelte";
  import type { IElement } from "../../../models/FormSchema";

  export let element: IElement;
</script>

<div>
  {#if element.Properties?.ListItems}
    <List>
      {#each element.Properties.ListItems as item}
        <Heading tag="h2" customSize="font-semibold list-item" class="my-2">{item}</Heading>
      {/each}
    </List>
  {:else}
    <Heading tag="h2" customSize="font-bold">{element.Properties?.Text}</Heading>
  {/if}

  <P class="mb-1 text-gray-500">{element.Type}</P>
</div>

<style>
</style>
