import TransformContext from 'src/transformer/TransformContext';

export function emptyContext(): TransformContext {
  return new TransformContext(new Map(), []);
}
