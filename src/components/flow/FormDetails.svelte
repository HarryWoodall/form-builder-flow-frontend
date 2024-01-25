<script lang="ts">
  import { Heading, P, Card, Button } from "flowbite-svelte";
  import { CloseButton } from "flowbite-svelte";
  import type { EnvironmentAvailability, FormSchema, Page } from "../../models/FormSchema";

  export let form: FormSchema;

  let availibility = form.EnvironmentAvailabilities as EnvironmentAvailability[];
  let isVisible = false;

  const getAvailibilityClass = (IsAvailable: boolean | undefined) => {
    return `pl-2 ${IsAvailable ? "font-bold text-green-100" : "text-green-300"}`;
  };
</script>

<div>
  {#if isVisible}
    <Card class="details-card bg-green-400" style="min-width: 400px">
      <CloseButton class="absolute right-0 top-0 m-3" on:click={() => (isVisible = false)} />
      <Heading tag="h1" class="mb-4 font-bold pr-3 text-white" customSize="text-3xl">{form.FormName}</Heading>

      <P class="font-bold text-white" size="lg">Base Url</P>
      <P class="text-green-200 mb-4" size="base">{form.BaseURL}</P>

      <P class="font-bold text-white" size="lg">Start page url</P>
      <P class="text-green-200 mb-4" size="base">{form.StartPageUrl}</P>

      <P class="font-bold text-white" size="lg">Availibility</P>

      {#each availibility as item}
        <P class={getAvailibilityClass(item.IsAvailable)} size="lg">{item.Environment?.toUpperCase()}</P>
      {/each}
    </Card>
  {:else}
    <Button on:click={() => (isVisible = true)} class="bg-green-400 hover:bg-green-500">Details</Button>
  {/if}
</div>

<style>
</style>
