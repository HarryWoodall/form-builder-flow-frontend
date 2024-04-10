<script lang="ts">
  import { Card } from "flowbite-svelte";
  import { slide } from "svelte/transition";
  import type { Note as NoteModel } from "../../models/Notes";
  import Note from "./Note.svelte";

  export let notes: NoteModel[];
</script>

<div>
  {#each notes as note}
    <Note {note} />
  {/each}
</div>

<style>
</style>
