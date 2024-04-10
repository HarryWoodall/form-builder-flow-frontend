<script lang="ts">
  import { Card, Button, Textarea } from "flowbite-svelte";
  import { EditOutline, CloseSolid } from "flowbite-svelte-icons";
  import type { Note } from "../../models/Notes";
  import { formNotes, activeNote, currentModalOpen } from "../../stores/appStore";
  import { ENoteDeletionConfirmationModal } from "../../constants/modalConstants";

  export let note: Note;
  let editMode = false;

  const switchToEditMode = () => {
    editMode = true;
  };

  const switchToNormalMode = () => {
    editMode = false;
  };

  const showDeleteModal = () => {
    console.log("confirming deletion");
    activeNote.update(() => note.id);
    currentModalOpen.update(() => ENoteDeletionConfirmationModal);
  };

  const confirmEdit = async () => {
    editMode = false;
    if (note.text == "") return;

    try {
      const rawResponse = await fetch("http://localhost:3100/updateNote", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: note.id,
          note: note,
        }),
      });

      if (rawResponse.ok) {
        const newNote = await rawResponse.json();
        formNotes.update((notes) => {
          if (!notes) return notes;
          const noteIndex = notes!.findIndex((n) => n.id == newNote.id);
          notes[noteIndex] = newNote;
          return notes;
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
</script>

<Card padding="none" class="bg-red-200 p-3 mt-4 w-full h-full border-gray-300 box-border rounded-none border-none shadow-xl">
  {#if !editMode}
    <div class="flex justify-end">
      <Button pill={true} outline={true} class="p-2 m-0 border-none nodrag" on:click={switchToEditMode}><EditOutline size="sm" /></Button>
      <Button pill={true} outline={true} class="p-2 m-0 border-none nodrag" on:click={showDeleteModal}><CloseSolid size="sm" /></Button>
    </div>
    {#if note.questionId}
      <h3 class="font-normal text-gray-700 dark:text-gray-400 leading-tight">{note.questionId}</h3>
    {/if}
    <p class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{note.text}</p>
  {:else}
    <Textarea class="nodrag" rows="4" name="note" bind:value={note.text} />
    <div class="flex justify-between">
      <Button class="mt-3 text-sm w-fit nodrag mr-2" size="sm" on:click={confirmEdit}>Confirm</Button>
      <Button class="mt-3 text-sm w-fit nodrag" color="alternative" size="sm" on:click={switchToNormalMode}>Cancel</Button>
    </div>
  {/if}
</Card>

<style>
</style>
