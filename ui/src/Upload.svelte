<script>
    import Dropzone from 'svelte-file-dropzone';
    import { Download } from 'svelte-hero-icons';
    import { processUpload } from './store';

    let specifiedFile: File;
    let dragover = false;
    let upload: Promise<any>;
    let rejectionError;

    function handleFilesSelect(e) {
        rejectionError = undefined;
        const { acceptedFiles, fileRejections } = e.detail;
        console.log(e.detail);
        if (acceptedFiles.length === 1) {
            specifiedFile = acceptedFiles[0];
            upload = processUpload(specifiedFile);
        }
        if (fileRejections.length > 1) {
            const fileNames = fileRejections.map((r) => r.file.name);
            rejectionError = `Only one file at a time allowed! Rejected ${fileRejections.length} files: '${fileNames}'.`;
        }
    }
</script>

<div class="border-2 border-dashed border-gray-400 hover:border-blue-800" class:dragover>
    <Dropzone
        on:drop={handleFilesSelect}
        on:dragenter={() => (dragover = true)}
        on:dragleave={() => (dragover = false)}
        multiple={false}
        noClick={false}
        disableDefaultStyles={true}>
        <div class="grid grid-cols-1 md:grid-cols-2 justify-items-center">
            <Download size="21x" />
            <div class="mt-4">
                <div class="text-5xl font-bold my-4">Drop your PDF file here...</div>
                <div class="text-2xl font-bold">Or click the box to select one...</div>
                <div class="mt-14"><strong>Note:</strong> Your data stays locally in your browser.</div>
                <div class="mt-5 text-sm italic font-serif">
                    This tool converts a PDF file into a Markdown text format! Simply drag & drop your PDF file on the
                    upload area and go from there. Don't expect wonders, there are a lot of variances in generated PDF's
                    from different tools and different ages. No matter how good the parser works for your PDF, you will
                    have to invest a good amount of manuell work to complete it.
                </div>
            </div>
        </div>
    </Dropzone>
</div>

<div class="mt-5 text-center font-bold">
    {#await upload}
        <div>Parsing {specifiedFile.name}...</div>
    {:catch error}
        <div class="text-red-700">Failed to parse '{specifiedFile.name}': {error.message}</div>
    {/await}
    {#if rejectionError}
        <div class="text-red-700">{rejectionError}</div>
    {/if}
</div>

<style>
    .dragover {
        @apply border-purple-600;
    }
</style>
