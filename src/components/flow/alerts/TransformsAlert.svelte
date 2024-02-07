<script lang="ts">
  import { onMount } from "svelte";
  import { Tooltip } from "flowbite-svelte";
  import { baseServerUrl } from "../../../constants/serverConstants";
  import { ExclamationCircleOutline } from "flowbite-svelte-icons";
  import { areTransformsAvailable } from "../../../stores/appStore";

  let hasError = false;

  onMount(async () => {
    try {
      const res = await fetch(`http://${baseServerUrl}/transformsAvailable`);
      const data = await res.json();
      hasError = !data;
      areTransformsAvailable.update(() => data);
    } catch (err) {
      hasError = true;
    }
  });
</script>

{#if hasError}
  <div class="inline-block align-middle mx-3">
    <ExclamationCircleOutline size="lg" class="text-amber-500 w-8 h-8" />
    <Tooltip class="w-48">Unable to transform elements</Tooltip>
  </div>
{/if}
