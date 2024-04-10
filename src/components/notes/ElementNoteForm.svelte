<script>
  import { Button, Dropdown, DropdownItem, DropdownDivider, Textarea } from "flowbite-svelte";
  import { AnnotationSolid } from "flowbite-svelte-icons";
</script>

<Button class="w-1/6 p-2 bg-green-300 hover:bg-green-400 -mt-0.5 rounded"><AnnotationSolid class="w-3 h-3 text-white dark:text-white" /></Button>
<Dropdown class="nodrag w-96">
  <DropdownItem><Textarea id="textarea-id" placeholder="Note" rows="4" name="note" /></DropdownItem>
  <div class="flex">
    <DropdownItem><Button class="m-0 text-sm">Confirm</Button></DropdownItem>
  </div>
</Dropdown>
