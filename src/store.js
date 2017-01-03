// Holds the state of the application
export default {

    state: {
        uploaded: false,
        pages: []
    },

    upload: function(pages) {
        console.debug("Store: upload");
        this.state.uploaded = true;
        this.state.pages = pages;
    },
}