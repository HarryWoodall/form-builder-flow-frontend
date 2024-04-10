<script lang="ts">
  import { Heading, P, Button, Drawer, A } from "flowbite-svelte";
  import { formNotes, form, currentModalOpen } from "../../../stores/appStore";
  import type { Note } from "../../../models/Notes";
  import type { FormSchema } from "../../../models/FormSchema";
  import { CloseSolid } from "flowbite-svelte-icons";
  import { EFormNotesDeletionConfirmationModal } from "../../../constants/modalConstants";

  type NotePageData = {
    pageTitle: string;
    notes: Note[];
  };

  let currentFormNotes: Note[] | undefined = $formNotes;
  let currentForm: FormSchema | undefined = $form;
  let pagesWithNotes: NotePageData[] = [];

  formNotes.subscribe((notes) => {
    currentFormNotes = notes;

    if (currentForm && currentFormNotes != undefined && currentFormNotes.length) {
      pagesWithNotes = [...new Set((currentFormNotes as Note[]).map((note) => note.formPageIndex))].map((index) => {
        return {
          pageTitle: currentForm!.Pages![index].Title as string,
          notes: currentFormNotes?.filter((note) => note.formPageIndex == index) as Note[],
        };
      });
    }
  });

  form.subscribe((form) => {
    currentForm = form;
  });

  const showDeleteModal = () => {
    currentModalOpen.update(() => EFormNotesDeletionConfirmationModal);
  };
</script>

<div>
  {#if currentFormNotes != undefined && currentFormNotes.length}
    <hr class="h-px my-8 pr-3 bg-gray-200 border-0 dark:bg-gray-700" />
    <div class="flex mt-8 mb-4 justify-between align-middle">
      <Heading tag="h2" class="font-bold text-white w-fit" customSize="text-3xl">Notes</Heading>
      <Button pill={true} class="text-white underline font-bold ml-3 text-sm bg-transparent hover:bg-green-600" on:click={showDeleteModal}>Clear</Button>
    </div>
    <div>
      {#each pagesWithNotes as noteData}
        <div class="bg-green-500 p-2 my-1 rounded">
          <Heading tag="h3" class="font-bold pr-3 text-white" customSize="text-xl">{noteData.pageTitle}</Heading>
          {#each noteData.notes as note}
            <P class="text-white my-3">{note.text}</P>
          {/each}
        </div>
      {/each}
    </div>
  {/if}
</div>
