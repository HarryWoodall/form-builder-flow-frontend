<script lang="ts">
  import { Card, Heading, P, Indicator, Popover } from "flowbite-svelte";
  import type { BaseProperty, IElement } from "../../../models/FormSchema";
  import TextElement from "./TextElement.svelte";
  import RadioElement from "./RadioElement.svelte";
  import { AngleDownSolid } from "flowbite-svelte-icons";
  import AddAnotherElement from "./AddAnotherElement.svelte";
  import ValidationMessages from "../pageContent/ValidationMessages.svelte";
  import HintText from "../pageContent/HintText.svelte";
  import PageHeading from "../pageContent/PageHeading.svelte";
  import TextAreaCharacterCount from "../pageContent/TextAreaCharacterCount.svelte";
  import ElementStatus from "../pageContent/ElementStatus.svelte";
  import FileTypes from "../pageContent/FileUploadDetails.svelte";
  import AddressProperties from "../pageContent/AddressProperties.svelte";
  import ElementNoteForm from "../../notes/ElementNoteForm.svelte";

  export let element: IElement;
  export let index: number;
  export let pageName: string | undefined | null;
  export let type: string;
  export let isAddAnother: boolean | undefined = false;

  const id = `${pageName}-${index}${isAddAnother ? "-addAnother" : ""}`;
  const properties = element.Properties as BaseProperty;
  const propertyKeys = Object.keys(properties) as (keyof BaseProperty)[];
  let color = "bg-stone-100";
  const border = !isAddAnother ? "" : "border-solid border-2 border-green-500";
  const addAnotherElements = (properties.Elements as IElement[]) || [];

  let popoverVisible = false;

  if (properties.IsConditionalElement) {
    color = "bg-orange-100";
  }

  if (element.Type == "AddAnother") {
    color = "bg-green-100";
  }

  const mouseLeaveCard = () => {
    popoverVisible = false;
  };

  const mouseEnterCard = () => {
    popoverVisible = true;
    popoverVisible = true;
  };
</script>

<Card
  class={`border-solid border-1 p-2 my-2 ${color} ${border} relative nodrag`}
  {id}
  on:click={() => console.log(element.Properties?.QuestionId)}
  padding="none"
  on:mouseenter={mouseEnterCard}
  on:mouseleave={mouseLeaveCard}
>
  <ElementStatus {element} />
  {#if type == "radio"}
    <PageHeading {element} />
    <HintText {element} />
    <RadioElement {element} />
  {:else if type == "text"}
    <TextElement {element} />
  {:else}
    <PageHeading {element} />
    <HintText {element} />
    <AddressProperties {element} />
    <FileTypes {element} />
    <TextAreaCharacterCount {element} />
  {/if}

  <ValidationMessages {element} />
  <!-- <ElementNoteForm /> -->
</Card>
<Popover defaultClass="nodrag" triggeredBy={`#${id}`} on:show{popoverVisible} placement="left">
  <Heading tag="h2" customSize="text-xl" class="bg-orange-500 rounded-t p-2 text-white">Properties</Heading>
  {#each propertyKeys as propertyKey}
    {#if typeof properties[propertyKey] != "object"}
      <div class="my-2 p-2 w-64">
        <P class="font-bold">{propertyKey}</P>
        <P class="text-gray-500">{properties[propertyKey]}</P>
      </div>
    {/if}
  {/each}
</Popover>

{#if type == "AddAnother" && !isAddAnother}
  <AngleDownSolid class="justify-center w-full" />
  {#each addAnotherElements as addAnotherElement, addAnotherIndex}
    <AddAnotherElement element={addAnotherElement} index={index + addAnotherIndex} {pageName} {type} />
  {/each}
{/if}

<style>
</style>
