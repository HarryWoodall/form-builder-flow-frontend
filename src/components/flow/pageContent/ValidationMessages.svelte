<script lang="ts">
  import { P } from "flowbite-svelte";
  import type { BaseProperty, IElement } from "../../../models/FormSchema";

  export let element: IElement;

  const className = "my-1 text-red-500";
  const propertyKeys = Object.keys(element.Properties!) as (keyof BaseProperty)[];
</script>

{#if element.Properties}
  {#each propertyKeys as propertyKey}
    {#if propertyKey.toLowerCase().includes("validation") && element.Properties[propertyKey] != ""}
      <P class={className}>{element.Properties[propertyKey]}</P>
    {/if}
  {/each}
{/if}

<style>
</style>
