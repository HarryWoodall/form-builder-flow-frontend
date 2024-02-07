<script lang="ts">
  import { Heading, P } from "flowbite-svelte";
  import type { IElement } from "../../../models/FormSchema";

  export let element: IElement;
  export let isReusable: undefined | boolean = undefined;
</script>

{#if element.Properties?.LegendAsH1 || element.Properties?.LabelAsH1}
  <Heading tag="h2" customSize="text-2xl font-bold">{element.Properties?.Label || element.Properties?.QuestionId}</Heading>
{:else}
  <Heading tag="h2" customSize="font-bold">{element.Properties?.Label || element.Properties?.QuestionId}</Heading>
{/if}

<P class="mb-1 text-gray-500 font-semibold">{element.Type}{isReusable ? " (Reusable)" : ""}</P>

<style>
</style>
