<script lang="ts">
  import { Button } from "flowbite-svelte";
  import { EFormListModal } from "../../../constants/modalConstants";
  import { currentModalOpen } from "../../../stores/appStore";
  import { slide } from "svelte/transition";

  const openModal = (name: string) => {
    console.log("opening", name);
    currentModalOpen.update(() => name);
  };
</script>

<div class="m-2">
  <Button on:click={() => openModal(EFormListModal)} class="font-bold">Find Form</Button>
</div>
