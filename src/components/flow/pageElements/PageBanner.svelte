<script lang="ts">
  import { Heading, P } from "flowbite-svelte";
  import type { Page } from "../../../models/FormSchema";

  export let page: Page;
</script>

{#if page.BannerTitle}
  <div class="bg-green-100 border-l-8 border-green-700 my-5 p-3">
    <Heading tag="h2" customSize="text-3xl font-bold">{page.BannerTitle}</Heading>
    <P class="mt-5">Your reference number is <span class="font-bold">####</span></P>
  </div>
{/if}

<style>
</style>
