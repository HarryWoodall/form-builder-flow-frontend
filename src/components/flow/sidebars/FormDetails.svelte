<script lang="ts">
  import { Heading, P, Button, Drawer } from "flowbite-svelte";
  import { CloseButton } from "flowbite-svelte";
  import type { EnvironmentAvailability, FormSchema } from "../../../models/FormSchema";
  import { sineIn } from "svelte/easing";

  let hiddenBackdropFalse = true;
  let transitionParams = {
    x: 320,
    duration: 200,
    easing: sineIn,
  };

  export let form: FormSchema;

  let availibility = form.EnvironmentAvailabilities as EnvironmentAvailability[];

  const getAvailibilityClass = (IsAvailable: boolean | undefined) => {
    return `pl-2 ${IsAvailable ? "font-bold text-green-100" : "text-green-300"}`;
  };
</script>

<Button on:click={() => (hiddenBackdropFalse = false)} class="bg-green-400 hover:bg-green-500 font-bold">Details</Button>

<Drawer
  backdrop={false}
  transitionType="fly"
  {transitionParams}
  bind:hidden={hiddenBackdropFalse}
  id="details-sidebar"
  placement="right"
  divClass="bg-green-400 p-4 z-50"
>
  <div class="flex justify-start items-start">
    <Heading tag="h1" class="mb-4 font-bold pr-3 text-white" customSize="text-3xl">{form.FormName}</Heading>
    <CloseButton on:click={() => (hiddenBackdropFalse = true)} class="mb-4 text-white" />
  </div>

  <P class="font-bold text-white" size="lg">Base Url</P>
  <P class="text-green-200 mb-4" size="base">{form.BaseURL}</P>

  <P class="font-bold text-white" size="lg">Start page url</P>
  <P class="text-green-200 mb-4" size="base">{form.StartPageUrl}</P>

  <P class="font-bold text-white" size="lg">Availibility</P>

  {#each availibility as item}
    <P class={getAvailibilityClass(item.IsAvailable)} size="lg">{item.Environment?.toUpperCase()}</P>
  {/each}
</Drawer>
