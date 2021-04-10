const params = new URLSearchParams(window.location.search);

export function debugFromParams(defaultValue: boolean): boolean {
    const defined = params.has('debug');
    if (!defined) {
        return defaultValue;
    }
    return params.get('debug') !== 'false';
}

export function debugStageFromParams(defaultValue: number): number {
    const stage = +params.get('stage');
    if (!Number.isInteger(stage)) {
        return defaultValue;
    }
    return stage;
}

export function urlFromParams(): string {
    return getParameterByName('url');
}

function getParameterByName(name: string): string {
    const match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
