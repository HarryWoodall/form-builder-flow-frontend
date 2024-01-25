<script lang="ts">
  import { P } from "flowbite-svelte";
  import type { IElement } from "../../../models/FormSchema";

  export let element: IElement;
</script>

{#if element.Properties && element.Properties.DisplayCharacterCount && element.Properties.MaxLength}
  <P class="my-1 text-gray-400 font-semibold">{element.Properties.MaxLength} characters</P>
{/if}

<style>
</style>
