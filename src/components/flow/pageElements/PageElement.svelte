<script lang="ts">
  import { Card, Heading, P } from "flowbite-svelte";
  import type { EElementType, IElement } from "../../../models/FormSchema";
  import BaseElement from "./BaseElement.svelte";

  export let element: IElement;
  export let index: number;
  export let pageName: string | undefined | null;

  let type: string | EElementType = element.Type as EElementType;

  if (element.Type == "Radio" || element.Type == "Checkbox") type = "radio";
  if (!element.Properties?.QuestionId && (element.Properties?.Text || element.Properties?.ListItems)) type = "text";
</script>

<BaseElement {element} {type} {index} {pageName} />

<style>
</style>
