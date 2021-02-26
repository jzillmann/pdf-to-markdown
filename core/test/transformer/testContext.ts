import type TransformContext from "src/transformer/TransformContext";

export function emptyContext():TransformContext{
    return {
        fontMap:new Map(),
        pageViewports:[]
    };
}