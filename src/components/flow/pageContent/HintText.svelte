<script lang="ts">
  import { P } from "flowbite-svelte";
  import type { BaseProperty, IElement } from "../../../models/FormSchema";

  export let element: IElement;
</script>

{#if element.Properties && element.Properties.Hint}
  <P class="my-1 text-gray-400 italic">{@html element.Properties.Hint}</P>
{/if}
