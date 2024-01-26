<script lang="ts">
  import { Listgroup, P } from "flowbite-svelte";
  import type { IElement } from "../../../models/FormSchema";

  export let element: IElement;
</script>

{#if element.Type == "FileUpload" || element.Type == "MultipleFileUpload"}
  <div class="my-2">
    {#if element.Properties && element.Properties.MaxFileSize}
      <P>Max file size: <span class="font-bold">{element.Properties.MaxFileSize}Mb</span></P>
    {/if}
    {#if element.Properties && element.Properties.MaxCombinedFileSize}
      <P>Max combined size: <span class="font-bold">{element.Properties.MaxCombinedFileSize}Mb</span></P>
    {/if}
  </div>

  {#if element.Properties && element.Properties.AllowedFileTypes}
    <Listgroup items={element.Properties.AllowedFileTypes} let:item class="my-2">
      {item}
    </Listgroup>
  {/if}
{/if}

<style>
</style>
