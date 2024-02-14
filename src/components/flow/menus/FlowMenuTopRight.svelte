<script lang="ts">
  import { slide } from "svelte/transition";
  import { currentModalOpen, form, formFlowValidation } from "../../../stores/appStore";
  import FlowValidationAlert from "./FlowValidationAlert.svelte";
  import FormDetails from "./FormDetails.svelte";

  const openModal = (name: string) => {
    console.log("opening", name);
    currentModalOpen.update(() => name);
  };
</script>

<div class="flex mt-2 items-center mr-3">
  {#if $form}
    {#if $formFlowValidation && ($formFlowValidation?.invalidPageSlugs.length > 0 || $formFlowValidation?.unreachablePages.length > 0)}
      <FlowValidationAlert />
    {/if}

    <FormDetails />
  {/if}
</div>
