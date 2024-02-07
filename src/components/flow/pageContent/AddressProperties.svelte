<script lang="ts">
  import { Card, Heading, P, Listgroup, type ListGroupItemType, Spinner } from "flowbite-svelte";
  import type { IElement } from "../../../models/FormSchema";
  import { onMount } from "svelte";
  import { transformLookup } from "../../../utils/FormParser";

  export let element: IElement;
</script>

<div>
  {#if element.Properties?.AddressIAG}
    <P class="my-1 p-3 italic text-gray-500 bg-gray-200 border-l-4 border-l-gray-800">{element.Properties?.AddressIAG}</P>
  {/if}

  {#if element.Properties?.StreetIAG}
    <P class="my-1 p-3 italic bg-gray-200 border-l-4 border-l-gray-800">{element.Properties?.StreetIAG}</P>
  {/if}

  {#if element.Properties && element.Properties.AddressManualHint}
    <P class="my-1 text-green-300 italic">{@html element.Properties.AddressManualHint}</P>
  {/if}
</div>

<style>
</style>
