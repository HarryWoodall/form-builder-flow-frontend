<script lang="ts">
  import { Card } from "flowbite-svelte";
  import { slide } from "svelte/transition";
  import type { Note as NoteModel } from "../../models/Notes";
  import Note from "./Note.svelte";
  import { notesFeature as _notesFeature } from "../../stores/appStore";

  export let notes: NoteModel[];

  let notesFeature = $_notesFeature;

  _notesFeature.subscribe((feature) => (notesFeature = feature));
</script>

<div>
  {#if notesFeature}
    {#each notes as note}
      <Note {note} />
    {/each}
  {/if}
</div>

<style>
</style>
