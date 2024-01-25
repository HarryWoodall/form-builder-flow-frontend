<script lang="ts">
  import { P } from "flowbite-svelte";
  import type { IElement } from "../../../models/FormSchema";

  export let element: IElement;

  const className = "my-1 text-red-500";
</script>

{#if element.Properties}
  {#each Object.keys(element.Properties) as propertyKey}
    {#if propertyKey.toLowerCase().includes("validation") && element.Properties[propertyKey] != ""}
      <P class={className}>{element.Properties[propertyKey]}</P>
    {/if}
  {/each}
{/if}

<style>
</style>
