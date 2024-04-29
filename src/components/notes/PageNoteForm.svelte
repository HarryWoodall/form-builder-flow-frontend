<script lang="ts">
  import { Button, Dropdown, DropdownItem, DropdownDivider, Textarea } from "flowbite-svelte";
  import { form, formNotes, notesFeature as _notesFeature } from "../../stores/appStore";
  import { AnnotationSolid } from "flowbite-svelte-icons";
  import type { Note } from "../../models/Notes";

  let text: string = "";
  let isOpen: boolean = false;
  export let formPageIndex: number | undefined;

  let notesFeature = $_notesFeature;

  _notesFeature.subscribe((feature) => (notesFeature = feature));

  const addNote = async () => {
    isOpen = false;
    console.log(isOpen);
    if (text == "") return;

    try {
      const note: Note = {
        formName: $form?.BaseURL!,
        formPageIndex: formPageIndex!,
        text: text,
      };
      const rawResponse = await fetch("http://localhost:3100/addNote", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
      });

      if (rawResponse.ok) {
        const newNote = await rawResponse.json();
        formNotes.update((notes) => {
          return [...notes!, newNote];
        });
      }
    } catch (e) {
      console.log(e);
    }

    text = "";
  };
</script>

{#if notesFeature}
  <Button class="bg-red-300 w-1/6 hover:bg-red-400 rounded-none -mt-0.5 rounded-b-lg"><AnnotationSolid class="w-3 h-3 text-white dark:text-white" /></Button>
  <Dropdown class="nodrag w-96" bind:open={isOpen}>
    <DropdownItem><Textarea id="textarea-id" placeholder="Note" rows="4" name="note" bind:value={text} /></DropdownItem>
    <div class="flex">
      <DropdownItem><Button class="m-0 text-sm" on:click={addNote}>Confirm</Button></DropdownItem>
    </div>
  </Dropdown>
{/if}
