import ChangeTracker from './ChangeTracker';
import { assertDefined } from '../assert';
import Item from '../Item';
import { groupByPage } from '../support/groupingUtils';

/**
 * Compares incomming and outgoing items of a transformer in order to detect changes and to display them in any debug visualization.
 * Note: ItemMerger registers changes as well.
 */
export function detectChanges(tracker: ChangeTracker, inputItems: Item[], outputItems: Item[]): Item[] {
  const oututItemsByPage = groupByPage(outputItems).reduce((map: Map<number, Item[]>, pageItems) => {
    map.set(pageItems[0].page, pageItems);
    return map;
  }, new Map());

  const mergedItems: Item[] = [];
  groupByPage(inputItems).forEach((inputPageItems) => {
    const page = inputPageItems[0].page;
    const outputPageItems = oututItemsByPage.get(page) || [];
    mergedItems.push(...detectPageChanges(tracker, inputPageItems, outputPageItems));
  });

  return mergedItems;
}

function detectPageChanges(tracker: ChangeTracker, inputItems: Item[], outputItems: Item[]): Item[] {
  const mergedItems: Item[] = [];
  const addedItems: Set<string> = new Set();
  let removals = 0;
  let additions = 0;
  let outputIndex = 0;
  for (let inputIdx = 0; inputIdx < inputItems.length; inputIdx++) {
    const inputItem = inputItems[inputIdx];
    if (addedItems.has(_uuid(inputItem))) {
      continue;
    }
    const positionInOutput = outputItems.findIndex((item) => item.uuid === inputItem.uuid);
    if (positionInOutput < 0) {
      tracker.trackRemoval(inputItem);
      mergedItems.push(inputItem);
      addedItems.add(_uuid(inputItem));
      removals++;
    } else if (positionInOutput === inputIdx + additions - removals) {
      mergedItems.push(outputItems[positionInOutput]);
      addedItems.add(_uuid(outputItems[positionInOutput]));
      outputIndex++;
      //TODO check for content change ?
    } else {
      for (let intermediateOutputIdx = outputIndex; intermediateOutputIdx < positionInOutput; intermediateOutputIdx++) {
        const outputItem = outputItems[intermediateOutputIdx];
        const positionInInput = inputItems.findIndex((item) => item.uuid === outputItem.uuid);
        if (positionInInput < 0) {
          tracker.trackAddition(outputItem);
          mergedItems.push(outputItem);
          addedItems.add(_uuid(outputItem));
          additions++;
          outputIndex++;
        } else {
          tracker.trackPositionalChange(outputItem, positionInInput - removals, intermediateOutputIdx - additions);
          mergedItems.push(outputItem);
          addedItems.add(_uuid(outputItem));
          outputIndex++;
        }
      }
      tracker.trackPositionalChange(outputItems[positionInOutput], inputIdx - removals, positionInOutput - additions);
      mergedItems.push(outputItems[positionInOutput]);
      addedItems.add(_uuid(outputItems[positionInOutput]));
      outputIndex++;
      //TODO check for content change ?
    }
  }
  for (let remaingOutputIndex = outputIndex; remaingOutputIndex < outputItems.length; remaingOutputIndex++) {
    tracker.trackAddition(outputItems[remaingOutputIndex]);
    mergedItems.push(outputItems[remaingOutputIndex]);
    additions++;
  }
  return mergedItems;
}

function _uuid(item: Item): string {
  return assertDefined(item.uuid, 'UUID is not set');
}
