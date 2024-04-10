<script lang="ts">
  import { Button, Modal, P } from "flowbite-svelte";
  import { currentModalOpen, activeNote, formNotes, form } from "../../stores/appStore";
  import { EFormNotesDeletionConfirmationModal } from "../../constants/modalConstants";

  let isOpen = false;

  currentModalOpen.subscribe((value: null | string) => {
    isOpen = value == EFormNotesDeletionConfirmationModal;
  });

  const deleteNote = async () => {
    try {
      const rawResponse = await fetch(`http://localhost:3100/clearAllFormNotes?formName=${$form?.BaseURL}`);

      if (rawResponse.ok) {
        formNotes.update((notes) => {
          const updatedNotes = [...notes!.filter((n) => n.formName != $form!.BaseURL)];
          return updatedNotes;
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
  <P size="2xl">Are you sure you want to delete all notes from <span class="font-bold">{$form?.FormName}</span>?</P>
  <svelte:fragment slot="footer">
    <Button on:click={deleteNote} size="lg" class="w-full" color="red">Yes</Button>
    <Button on:click={closeModal} size="lg" class="w-full" color="alternative">No</Button>
  </svelte:fragment>
</Modal>
