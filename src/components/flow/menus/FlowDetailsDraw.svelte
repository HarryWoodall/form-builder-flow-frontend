<script lang="ts">
  import { Heading, P, Button, Drawer, A } from "flowbite-svelte";
  import { CloseButton } from "flowbite-svelte";
  import type { EnvironmentAvailability, FormSchema } from "../../../models/FormSchema";
  import { sineIn } from "svelte/easing";
  import { InfoCircleOutline } from "flowbite-svelte-icons";
  import { detailsPanelVisible, form as Form } from "../../../stores/appStore";

  export let form: FormSchema;

  let isHidden = true;
  let transitionParams = {
    x: 320,
    duration: 200,
    easing: sineIn,
  };

  let availibility = form.EnvironmentAvailabilities as EnvironmentAvailability[];

  detailsPanelVisible.subscribe((value) => {
    isHidden = !value;
  });

  const getAvailibilityClass = (IsAvailable: boolean | undefined) => {
    return `pl-2 ${IsAvailable ? "font-bold text-green-100 block" : "text-green-300"}`;
  };

  const handleClose = () => {
    isHidden = true;
    detailsPanelVisible.update(() => false);
  };
</script>

<Drawer
  backdrop={false}
  transitionType="fly"
  activateClickOutside={false}
  {transitionParams}
  bind:hidden={isHidden}
  id="details-sidebar"
  placement="right"
  divClass="bg-green-400 p-4 z-50"
>
  <div class="flex justify-start items-start">
    <Heading tag="h1" class="mb-4 font-bold pr-3 text-white" customSize="text-3xl">{form.FormName}</Heading>
    <CloseButton on:click={handleClose} class="mb-4 text-white" />
  </div>

  <P class="font-bold text-white" size="lg">Base Url</P>
  <P class="text-green-200 mb-4" size="base">{form.BaseURL}</P>

  <P class="font-bold text-white" size="lg">Start page url</P>
  <P class="text-green-200 mb-4" size="base">{form.StartPageUrl}</P>

  <P class="font-bold text-white" size="lg">Availibility</P>

  {#each availibility as item}
    {#if item.IsAvailable}
      <A
        href={"https://" + item.Environment?.toLowerCase() + "-formbuilder-origin.smbcdigital.net/" + form.BaseURL}
        target="_blank"
        class={getAvailibilityClass(item.IsAvailable)}
        size="lg">{item.Environment?.toUpperCase()}</A
      >
    {:else}
      <P class={getAvailibilityClass(item.IsAvailable)} size="lg">{item.Environment?.toUpperCase()}</P>{/if}
  {/each}
</Drawer>
