<script lang="ts">
  import { Alert, Button, Drawer, CloseButton } from "flowbite-svelte";
  import { formFlowValidation, nodes } from "../../../stores/appStore";
  import { useSvelteFlow } from "@xyflow/svelte";
  import {} from "flowbite-svelte";
  import { InfoCircleSolid } from "flowbite-svelte-icons";
  import { sineIn } from "svelte/easing";
  import PageTitleValidationOverview from "./validation/PageTitleValidationOverview.svelte";
  import SpellCheckValidationOverview from "./validation/SpellcheckValidationOverview.svelte";
  import BackButtonValidationOverview from "./validation/BackButtonValidationOverview.svelte";

  let hiddenBackdropFalse = true;
  let transitionParams = {
    x: 320,
    duration: 200,
    easing: sineIn,
  };

  let unreachablePages = $formFlowValidation!.unreachablePages;
  let invalidSlugs = $formFlowValidation!.invalidPageSlugs;

  formFlowValidation.subscribe((validation) => {
    unreachablePages = validation?.unreachablePages!;
    invalidSlugs = validation?.invalidPageSlugs!;
  });

  const { fitView } = useSvelteFlow();

  const handleSlugClick = (event: any) => {
    console.log(event.target.innerText);
    const invalidNode = $nodes.filter((node) => node.id == event.target!.innerText);
    fitView({ nodes: invalidNode });
  };
</script>

<Button
  class="absolute top-20 right-0 font-bold bg-transparent hover:bg-transparent border-2 border-transparent hover:text-orange-600  text-orange-400"
  pill={true}
  on:click={() => (hiddenBackdropFalse = false)}><InfoCircleSolid class="w-12 h-12" /></Button
>

<Drawer
  backdrop={false}
  transitionType="fly"
  {transitionParams}
  bind:hidden={hiddenBackdropFalse}
  id="validation-sidebar"
  placement="right"
  divClass="bg-amber-600 p-4 z-50 h-screen overflow-y-auto overflow-x-hidden shadow-lg"
>
  <div class="flex items-center">
    <h5 id="drawer-label" class="inline-flex justify-center items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">
      <span class="text-3xl font-bold text-white">Form Errors</span>
    </h5>
    <CloseButton on:click={() => (hiddenBackdropFalse = true)} class="mb-4 dark:text-white" />
  </div>
  {#if unreachablePages.length > 0}
    <div class="flex items-center gap-3 mb-4 bg-amber-400 rounded p-3">
      <div>
        <span class="text-lg font-bold">Unreachable pages</span>
        <ul>
          {#each unreachablePages as page}
            <li class="mt-2 ml-6 mb-2 text-sm">
              <Button color="none" class="p-0 font-bold underline" on:click={handleSlugClick}>{page.PageSlug}</Button>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  {/if}

  {#if invalidSlugs.length > 0}
    <div class="flex items-center gap-3 bg-red-500 rounded p-3 text-white">
      <div>
        <span class="text-lg font-bold">Invalid Slugs</span>
        <ul>
          {#each invalidSlugs as slug}
            <li class="mt-2 ml-6 mb-2 text-sm">
              <span class="p-0 font-bold">{slug}</span>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  {/if}
  <div class="">
    <PageTitleValidationOverview />
    <BackButtonValidationOverview />
    <SpellCheckValidationOverview />
  </div>
</Drawer>
