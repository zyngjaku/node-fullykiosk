import { useEffect, useMemo, useState } from 'react';

import { is_fully } from '../utils/is_fully';

type MotionFunction = (code: string) => void;

type MotionConfig = {
    onMotion?: MotionFunction;
};

export const useMotion = (config?: MotionConfig) => {
    if (!is_fully()) return undefined;

    const vId = useMemo(() => Math.random().toString(36).slice(2, 11), []);

    useEffect(() => {
        window._fullykiosk[vId] = (state: 'scan' | 'cancel', code?: string) => {
            if (state === 'scan' && !!code) {
                config?.onMotion?.(code);
            }
        };

        // Register events
        fully.bind(
            'onMotion',
            `_fullykiosk['${vId}']('scan', '$code');`
        );

        return () => {
            // Unregister events
            window._fullykiosk[vId] = undefined;
        };
    }, [0]);

    return undefined;
};
