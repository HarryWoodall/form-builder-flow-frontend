<script lang="ts">
  import { P } from "flowbite-svelte";
  import type { BaseProperty, IElement } from "../../../models/FormSchema";

  export let element: IElement;
</script>

{#if element.Properties && element.Properties.Optional}
  <P class="my-1 text-green-500 font-semibold italic">Optional</P>
{/if}

{#if element.Properties && element.Properties.StockportPostcode}
  <P class="my-1 text-green-500 font-semibold italic">Stockport</P>
{/if}

<style>
</style>
