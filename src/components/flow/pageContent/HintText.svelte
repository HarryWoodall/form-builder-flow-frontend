<script lang="ts">
  import { P } from "flowbite-svelte";
  import type { BaseProperty, IElement } from "../../../models/FormSchema";

  export let element: IElement;
</script>

{#if element.Properties && element.Properties.IAG}
  <P class="my-1 p-3 italic bg-gray-200 border-l-4 border-solid !border-l-gray-800">{@html element.Properties.IAG}</P>
{/if}

{#if element.Properties && element.Properties.Hint}
  <P class="my-1 text-gray-400 italic hint-text">{@html element.Properties.Hint}</P>
{/if}
