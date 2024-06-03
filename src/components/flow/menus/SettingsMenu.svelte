<script lang="ts">
  import { Toggle } from "flowbite-svelte";
  import { notesFeature } from "../../../stores/appStore";

  let notesToggleValue = $notesFeature;

  const toggleNotesFeature = () => {
    notesFeature.update(() => notesToggleValue);
  };
</script>

<div class="absolute top-20 left-0 border-solid bg-white border-gray-300 shadow-xl border-2 p-2 rounded-lg">
  <Toggle bind:checked={notesToggleValue} on:change={toggleNotesFeature} size="small" class="my-2 font-semibold">Notes</Toggle>
</div>
