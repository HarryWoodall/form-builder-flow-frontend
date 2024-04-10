<script lang="ts">
  import { Button, Modal, P } from "flowbite-svelte";
  import { currentModalOpen, activeNote, formNotes } from "../../stores/appStore";
  import { ENoteDeletionConfirmationModal } from "../../constants/modalConstants";

  let isOpen = false;

  currentModalOpen.subscribe((value: null | string) => {
    isOpen = value == ENoteDeletionConfirmationModal;
  });

  const deleteNote = async () => {
    try {
      const rawResponse = await fetch(`http://localhost:3100/deleteNote?noteId=${$activeNote}`);

      if (rawResponse.ok) {
        formNotes.update((notes) => {
          const index = notes!.findIndex((n) => n.id == $activeNote);
          notes!.splice(index, 1);
          return notes;
        });
      }
    } catch (e) {
      console.log(e);
    }

    isOpen = false;
    updateCurrentModal();
  };

  const updateCurrentModal = () => {
    currentModalOpen.update(() => null);
  };

  const closeModal = () => {
    isOpen = false;
    updateCurrentModal();
  };
</script>

<Modal bind:open={isOpen} on:close={() => updateCurrentModal()} outsideclose autoclose>
  <P size="2xl">Are you sure you want to delete this note?</P>
  <svelte:fragment slot="footer">
    <Button on:click={deleteNote} size="lg" class="w-full" color="red">Yes</Button>
    <Button on:click={closeModal} size="lg" class="w-full" color="alternative">No</Button>
  </svelte:fragment>
</Modal>
