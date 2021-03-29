import StageResult from '@core/debug/StageResult';
import PageMapping from '../../../core/src/PageMapping';
import { Writable, writable, get, Readable, derived } from 'svelte/store';

export default class PageControl {
    pinnedPageIndex: Writable<number | undefined>;
    pagePinned: Readable<boolean>;
    canPrev: Readable<boolean>;
    canNext: Readable<boolean>;
    pagesWithItems: Set<number> = new Set();
    pageMapping: Writable<PageMapping> = writable(new PageMapping());

    constructor(public totalPages: number) {
        this.pinnedPageIndex = writable(undefined);
        this.pagePinned = derived(this.pinnedPageIndex, (page) => !isNaN(page));
        this.canPrev = derived([this.pinnedPageIndex, this.pagePinned], ([page, pinned]) => pinned && page > 0);
        this.canNext = derived(
            [this.pinnedPageIndex, this.pagePinned],
            ([page, pinned]) => pinned && page < totalPages - 1
        );
        this.next.bind(this);
        this.prev.bind(this);
        this.unpinPage.bind(this);
    }

    updateMapping(pageMapping: PageMapping | undefined) {
        if (pageMapping) {
            this.pageMapping.set(pageMapping);
        }
    }

    selectPages(stageResult: StageResult, relevantChangesOnly: boolean, groupItems: boolean, pinnedPage?: number) {
        const allRelevantPages = stageResult.selectPages(relevantChangesOnly, groupItems);
        this.pagesWithItems = new Set(
            allRelevantPages.filter((page) => page.itemGroups.length > 0).map((page) => page.index)
        );
        if (Number.isInteger(pinnedPage)) {
            return allRelevantPages.filter((page) => page.index === pinnedPage);
        }
        return allRelevantPages;
    }

    pageHasItems(pageIdx: number) {
        return this.pagesWithItems.has(pageIdx);
    }

    next() {
        if (get(this.canNext)) {
            this.pinnedPageIndex.update((page) => page + 1);
        }
    }

    prev() {
        if (get(this.canPrev)) {
            this.pinnedPageIndex.update((page) => page - 1);
        }
    }

    pinPage(pageIdx: number) {
        this.pinnedPageIndex.set(pageIdx);
    }

    unpinPage() {
        this.pinnedPageIndex.set(undefined);
    }

    pinnedPage() {
        return get(this.pinnedPageIndex);
    }

    pageIsPinned() {
        return get(this.pagePinned);
    }
}
