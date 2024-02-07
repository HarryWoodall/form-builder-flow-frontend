<script lang="ts">
  import { Card, Heading, P, type ListGroupItemType, Listgroup, List } from "flowbite-svelte";
  import type { IElement } from "../../../models/FormSchema";

  export let element: IElement;
</script>

<div>
  {#if element.Properties?.ListItems}
    <List>
      {#each element.Properties.ListItems as item}
        <P class="font-semibold list-item my-2">{item}</P>
      {/each}
    </List>
  {:else}
    <P class="font-bold">{@html element.Properties?.Text}</P>
  {/if}

  <P class="mb-1 text-gray-500">{element.Type}</P>
</div>

<style>
</style>
