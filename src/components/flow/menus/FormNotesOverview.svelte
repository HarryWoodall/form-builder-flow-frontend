<script lang="ts">
  import { Heading, P, Button, Drawer, A } from "flowbite-svelte";
  import { formNotes, form, currentModalOpen, notesFeature as _notesFeature } from "../../../stores/appStore";
  import type { Note } from "../../../models/Notes";
  import type { FormSchema } from "../../../models/FormSchema";
  import { EFormNotesDeletionConfirmationModal } from "../../../constants/modalConstants";

  type NotePageData = {
    pageTitle: string;
    notes: Note[];
  };

  let currentFormNotes: Note[] | undefined = $formNotes;
  let currentForm: FormSchema | undefined = $form;
  let pagesWithNotes: NotePageData[] = [];
  let notesFeature = $_notesFeature;

  _notesFeature.subscribe((feature) => (notesFeature = feature));

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
  {#if notesFeature && currentFormNotes != undefined && currentFormNotes.length}
    <hr class="h-px my-8 pr-3 bg-gray-200 border-0 dark:bg-gray-700" />
    <div class="flex mt-8 mb-4 justify-between align-middle">
      <Heading tag="h2" class="font-bold text-white w-fit" customSize="text-3xl">Notes</Heading>
      <Button pill={true} class="text-white underline font-bold ml-3 text-sm bg-transparent hover:bg-green-600" on:click={showDeleteModal}>Clear</Button>
    </div>
    <div>
      {#each pagesWithNotes as noteData}
        <div class="bg-green-600 p-2 my-1 rounded">
          <Heading tag="h3" class="pr-3 text-gray-300" customSize=" m-2 font-semibold">{noteData.pageTitle}</Heading>
          {#each noteData.notes as note, index}
            {#if index > 0}
              <hr class="h-px border-gray-700 border-1 border-dashed my-2 mx-8 bg-gray-300" />
            {/if}
            <P class="text-white p-3 ml-3 font-semibold text-xl italic">{note.text}</P>
          {/each}
        </div>
      {/each}
    </div>
  {/if}
</div>
