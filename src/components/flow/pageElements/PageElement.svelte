<script lang="ts">
  import { Card, Heading, P } from "flowbite-svelte";
  import type { EElementType, IElement, Reusable } from "../../../models/FormSchema";
  import BaseElement from "./BaseElement.svelte";
  import { areTransformsAvailable } from "../../../stores/appStore";
  import { baseServerUrl } from "../../../constants/serverConstants";
  import ReusableElement from "./ReusableElement.svelte";

  export let element: IElement;
  export let index: number;
  export let pageName: string | undefined | null;

  let type: string | EElementType = element.Type as EElementType;
  let isReusable = element.Type == "Reusable" && $areTransformsAvailable;

  if (element.Type == "Radio" || element.Type == "Checkbox" || element.Type == "Select") type = "radio";
  if (!element.Properties?.QuestionId && (element.Properties?.Text || element.Properties?.ListItems)) type = "text";
</script>

{#if isReusable}
  <ReusableElement {element} {index} {pageName} />
{:else}
  <BaseElement {element} {type} {index} {pageName} />
{/if}

<style>
</style>
